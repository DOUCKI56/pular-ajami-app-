/* Salle de cours connectée — synchronisation via un petit serveur (Google Apps Script). */
const Sync = (function () {
  "use strict";

  const KEY = "pular-ajami.sync";
  const STATE = "pular-ajami.syncState";

  function get(k, d) {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  }
  function set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function cfg() {
    const c = get(KEY, {});
    return { url: String(c.url || "").trim(), key: String(c.key || "").trim() };
  }
  function state() {
    return get(STATE, { lastPull: "", lastPush: "", lastError: "" });
  }
  function saveState(patch) { set(STATE, Object.assign(state(), patch)); }
  function ready() { const c = cfg(); return !!(c.url && c.key); }
  function save(url, key) { set(KEY, { url: String(url || "").trim(), key: String(key || "").trim() }); }
  function disconnect() { localStorage.removeItem(KEY); localStorage.removeItem(STATE); }

  /* ---------- Fusion ---------- */

  function mergeContent(local, remote) {
    const out = local;
    const mergeList = (key, idOf) => {
      const ids = {};
      out[key].forEach((x) => { ids[idOf(x)] = true; });
      (remote[key] || []).forEach((x) => {
        const k = idOf(x);
        if (k && !ids[k]) { out[key].push(x); ids[k] = true; }
      });
    };
    mergeList("vocabulary", (w) => w.id || w.latin);
    mergeList("sessions", (s) => s.id);
    mergeList("homeworks", (h) => h.id);
    mergeList("courses", (f) => f.id);
    ["deletedVocab", "deletedSessions", "deletedHomeworks"].forEach((k) => {
      const seen = {};
      out[k].concat(remote[k] || []).forEach((x) => { seen[x] = true; });
      out[k] = Object.keys(seen);
    });
    const corr = remote.corrections || {};
    Object.keys(corr).forEach((k) => {
      if (!out.corrections[k] || corr[k].published) out.corrections[k] = corr[k];
    });
    const aud = remote.audio || {};
    Object.keys(aud).forEach((k) => { if (!out.audio[k]) out.audio[k] = aud[k]; });
    return out;
  }

  function replyKey(r) { return [r.name, r.date, r.text].join("|"); }

  function mergeQuestions(local, remote) {
    const map = {};
    local.forEach((q) => { map[q.id] = q; });
    let added = 0;
    remote.forEach((q) => {
      if (!map[q.id]) { map[q.id] = q; added++; return; }
      const cur = map[q.id];
      cur.replies = cur.replies || [];
      const seen = {};
      cur.replies.forEach((r) => { seen[replyKey(r)] = true; });
      (q.replies || []).forEach((r) => { if (!seen[replyKey(r)]) cur.replies.push(r); });
    });
    return { list: Object.keys(map).map((k) => map[k]), added: added };
  }

  function mergeSubmissions(local, remote) {
    const map = {};
    local.forEach((s) => { map[s.id] = s; });
    let added = 0;
    remote.forEach((s) => {
      const cur = map[s.id];
      if (!cur) { map[s.id] = s; added++; }
      else if (s.corrected && !cur.corrected) map[s.id] = s;
    });
    return { list: Object.keys(map).map((k) => map[k]), added: added };
  }

  function applyRemote(d) {
    const summary = { content: 0, questions: 0, submissions: 0 };
    if (d.content) {
      if (typeof Files !== "undefined" && Files.detach) {
        return Files.detach(d.content).then((light) => {
          Store.saveContent(mergeContent(Store.content(), light));
          summary.content = 1;
          return restRemote(d, summary);
        });
      }
      Store.saveContent(mergeContent(Store.content(), d.content));
      summary.content = 1;
      return restRemote(d, summary);
    }
    return Promise.resolve(restRemote(d, summary));
  }

  function restRemote(d, summary) {
    if (d.questions && d.questions.length) {
      const m = mergeQuestions(Store.questions(), d.questions);
      Store.saveQuestions(m.list);
      summary.questions = m.added;
    }
    if (d.submissions && d.submissions.length) {
      const m = mergeSubmissions(Store.homeworks(), d.submissions);
      Store.saveHomeworks(m.list);
      summary.submissions = m.added;
    }
    return summary;
  }

  /* ---------- Réseau ---------- */

  async function pull() {
    const c = cfg();
    if (!c.url || !c.key) return { ok: false, error: "config" };
    const u = c.url + (c.url.indexOf("?") === -1 ? "?" : "&") +
      "action=get&key=" + encodeURIComponent(c.key);
    try {
      const r = await fetch(u);
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "serveur");
      const summary = await applyRemote(d);
      saveState({ lastPull: now(), lastError: "" });
      return { ok: true, summary: summary, updatedAt: d.updatedAt || "" };
    } catch (e) {
      saveState({ lastError: String(e.message || e) });
      return { ok: false, error: String(e.message || e) };
    }
  }

  async function push(what) {
    const c = cfg();
    if (!c.url || !c.key) return { ok: false, error: "config" };
    const w = what || ["content", "questions", "submissions"];
    const body = { key: c.key };
    if (w.indexOf("content") !== -1) {
      body.content = (typeof Files !== "undefined" && Files.attach)
        ? await Files.attach(Store.content())
        : Store.content();
    }
    if (w.indexOf("questions") !== -1) body.questions = Store.questions();
    if (w.indexOf("submissions") !== -1) body.submissions = Store.homeworks();
    try {
      const r = await fetch(c.url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body)
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error || "serveur");
      saveState({ lastPush: now(), lastError: "" });
      return { ok: true, updatedAt: d.updatedAt || "" };
    } catch (e) {
      saveState({ lastError: String(e.message || e) });
      return { ok: false, error: String(e.message || e) };
    }
  }

  function now() {
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  return { cfg: cfg, state: state, save: save, disconnect: disconnect, ready: ready,
           pull: pull, push: push, applyRemote: applyRemote,
           mergeContent: mergeContent, mergeQuestions: mergeQuestions, mergeSubmissions: mergeSubmissions };
})();
