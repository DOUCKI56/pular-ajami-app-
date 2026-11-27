/* Persistance locale (localStorage) — fonctionne hors ligne. */
const Store = (() => {
  const PREFIX = "pular-ajami.";


  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : on ignore silencieusement */
    }
  }

  function remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch {}
  }

  function reset() {
    ["profile", "progress", "quizStats", "questions", "homeworks", "trainerMode", "content"].forEach(remove);
  }

  /* Profil */
  function profile() {
    return get("profile", { name: "", joined: new Date().toISOString().slice(0, 10) });
  }

  /* Progression des séances : { s1: {done: true, date: "..."} } */
  function progress() { return get("progress", {}); }
  function setProgress(sessionId, entry) {
    const p = progress();
    p[sessionId] = Object.assign({}, p[sessionId], entry);
    set("progress", p);
  }

  /* Statistiques quiz par banque : { alphabet: {seen: 12, right: 10} } */
  function quizStats() { return get("quizStats", {}); }
  function addQuizResult(bank, seen, right) {
    const s = quizStats();
    if (!s[bank]) s[bank] = { seen: 0, right: 0, best: 0 };
    s[bank].seen += seen;
    s[bank].right += right;
    s[bank].best = Math.max(s[bank].best, seen ? Math.round(100 * right / seen) : 0);
    set("quizStats", s);
  }

  /* Questions aux formateurs : [{id, name, lesson, text, date, replies: [{name, text, date}]}] */
  function questions() { return get("questions", []); }
  function saveQuestions(list) { set("questions", list); }

  /* Devoirs déposés : [{id, homeworkId, name, text, date, status, correction}] */
  function homeworks() { return get("homeworks", []); }
  function saveHomeworks(list) { set("homeworks", list); }

  /* Mode formateur (démo locale, sans serveur) */
  function trainerMode() { return get("trainerMode", false); }
  function setTrainerMode(v) { set("trainerMode", v); }

  /* Contenus ajoutés par l'administrateur : {vocabulary: [], sessions: [],
     homeworks: [], corrections: {}, deletedVocab: [], deletedSessions: [],
     deletedHomeworks: []} */
  function content() {
    const defaults = {
      vocabulary: [], sessions: [], homeworks: [], courses: [], corrections: {},
      deletedVocab: [], deletedSessions: [], deletedHomeworks: []
    };
    const c = get("content", defaults);
    for (const k of Object.keys(defaults)) if (!(k in c)) c[k] = defaults[k];
    return c;
  }
  function saveContent(c) { set("content", c); }

  return { get, set, remove, reset, profile, progress, setProgress, quizStats,
           addQuizResult, questions, saveQuestions, homeworks, saveHomeworks,
           trainerMode, setTrainerMode, content, saveContent };
})();
