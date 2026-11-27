/* Stockage des fichiers de cours (IndexedDB) — grande capacité, hors ligne.
   Les données binaires (base64) ne restent PAS dans localStorage : on y garde
   seulement les métadonnées. Repli sur mémoire si IndexedDB indisponible. */
const Files = (() => {
  "use strict";

  const NAME = "pular-ajami-files";
  const STORE = "files";
  let memory = {};
  let broken = (typeof indexedDB === "undefined");
  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, 1);
      req.onupgradeneeded = () => {
        try { req.result.createObjectStore(STORE, { keyPath: "id" }); } catch (e) {}
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || "idb");
    });
    return dbp;
  }

  async function put(id, data) {
    if (broken) { memory[id] = data; return; }
    try {
      const db = await open();
      await new Promise((resolve, reject) => {
        const t = db.transaction(STORE, "readwrite");
        t.objectStore(STORE).put({ id: id, data: data });
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
      });
      db.close();
    } catch (e) {
      broken = true;
      memory[id] = data;
    }
  }

  async function get(id) {
    if (broken) return memory[id] || "";
    try {
      const db = await open();
      const v = await new Promise((resolve, reject) => {
        const r = db.transaction(STORE).objectStore(STORE).get(id);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
      db.close();
      return (v && v.data) || "";
    } catch (e) {
      return memory[id] || "";
    }
  }

  async function del(id) {
    delete memory[id];
    if (broken) return;
    try {
      const db = await open();
      await new Promise((resolve, reject) => {
        const t = db.transaction(STORE, "readwrite");
        t.objectStore(STORE).delete(id);
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
      });
      db.close();
    } catch (e) {}
  }

  async function clear() {
    memory = {};
    if (broken) return;
    try {
      const db = await open();
      await new Promise((resolve, reject) => {
        const t = db.transaction(STORE, "readwrite");
        t.objectStore(STORE).clear();
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
      });
      db.close();
    } catch (e) {}
  }

  /* Range les data URLs d'un contenu dans IndexedDB et les retire de l'objet
     (pour ne pas saturer localStorage). Retourne l'objet allégé. */
  async function detach(content) {
    if (!content || !content.courses) return content;
    for (const f of content.courses) {
      if (f.data) { await put(f.id, f.data); delete f.data; }
    }
    return content;
  }

  /* Réattache les data URLs (depuis IndexedDB) pour l'envoi/sync/export. */
  async function attach(content) {
    if (!content || !content.courses) return content;
    const courses = [];
    for (const f of content.courses) {
      if (f.data) { courses.push(f); continue; }
      const d = await get(f.id);
      courses.push(d ? Object.assign({}, f, { data: d }) : f);
    }
    return Object.assign({}, content, { courses: courses });
  }

  return { put: put, get: get, del: del, clear: clear, attach: attach, detach: detach };
})();
