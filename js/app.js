/* Pular Ajami — application de apprentissage (PWA, sans backend). */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const main = $("#main");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const aj = (s) => '<span class="ajami">' + esc(s) + "</span>";
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const ROLE_LABEL = { learner: "Apprenant", teacher: "Enseignant", admin: "Administrateur" };
  const genCode = () => {
    const cs = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 6; i++) out += cs[Math.floor(Math.random() * cs.length)];
    return out;
  };
  function applyAccessCode(code) {
    code = String(code || "").trim().toUpperCase();
    if (!code) return "empty";
    const a = Store.auth();
    if (code === a.adminCode) {
      const first = a.adminCode === Store.DEFAULT_ADMIN_CODE;
      Store.setRole("admin");
      if (first) alert("Bienvenue, administrateur ! Changez le code par défaut dans « Gestion des enseignants et administrateurs ».");
      return "admin";
    }
    const entry = a.codes.find((x) => x.code === code && !x.used);
    if (!entry) return "bad";
    entry.used = today();
    entry.by = Store.profile().name || "enseignant";
    Store.saveAuth(a);
    Store.setRole("teacher");
    return "teacher";
  }

  /* ---------- Données fusionnées (base + contenus de l'administrateur) ---------- */
  let D = {};

  function buildData() {
    const c = Store.content();
    const applyCorrection = (h) => (c.corrections[h.id] ? Object.assign({}, h, { correction: c.corrections[h.id] }) : h);
    D = {
      alphabet: DATA.alphabet,
      vowels: DATA.vowels,
      digraphs: DATA.digraphs,
      rules: DATA.rules,
      meta: DATA.meta,
      numbers: DATA.numbers,
      docs: DATA.docs,
      trainers: DATA.trainers,
      vocabulary: DATA.vocabulary.filter((w) => !c.deletedVocab.includes(w.latin))
        .map((w) => c.vocabulary.find((x) => x.replaces === w.latin || (x.id || x.latin) === (w.id || w.latin)) || w)
        .concat(c.vocabulary.filter((x) => !x.replaces)),
      sessions: DATA.sessions.filter((s) => !c.deletedSessions.includes(s.id))
        .map((s) => c.sessions.find((x) => x.id === s.id) || s)
        .concat(c.sessions.filter((x) => !DATA.sessions.some((d) => d.id === x.id))),
      homeworks: DATA.homeworks.filter((h) => !c.deletedHomeworks.includes(h.id))
        .map(applyCorrection)
        .concat(c.homeworks.map(applyCorrection))
    };
  }
  buildData();

  /* États d'édition (boutons ✏️ Modifier de l'administration) */
  let editSessionId = null, editVocabId = null;

  /* ---------- Navigation ---------- */
  const routes = {};
  const binders = {};

  function nav() {
    const hash = location.hash.replace(/^#\/?/, "") || "accueil";
    const view = routes[hash] ? hash : "accueil";
    $$(".sidebar a, .tabbar a").forEach((a) =>
      a.classList.toggle("active", a.dataset.nav === view));
    $$(".sidebar a[data-nav='admin'], .tabbar a[data-nav='admin']").forEach((a) => {
      if (a.parentElement) a.parentElement.style.display = Store.role() === "learner" ? "none" : "";
    });
    main.innerHTML = routes[view]();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (innerWidth < 900) closeSidebar();
    if (binders[view]) binders[view]();
    document.title = "Pular Ajami — " + view.charAt(0).toUpperCase() + view.slice(1);
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#backdrop").hidden = true;
  }

  /* ---------- Synthèse vocale (approximation via la voix française) ---------- */
  function speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("La synthèse vocale n'est pas disponible sur cet appareil.");
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.8;
    speechSynthesis.speak(u);
  }

  /* ---------- Écriture (canvas) ---------- */
  let drawing = false;
  function initBoard(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0e7c66";
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return [((e.touches ? e.touches[0].clientX : e.clientX) - r.left) * (canvas.width / r.width),
              ((e.touches ? e.touches[0].clientY : e.clientY) - r.top) * (canvas.height / r.height)];
    };
    const start = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(...pos(e)); e.preventDefault(); };
    const move = (e) => { if (!drawing) return; ctx.lineTo(...pos(e)); ctx.stroke(); e.preventDefault(); };
    const stop = () => { drawing = false; };
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", stop);
    const clear = $("#clearBoard");
    if (clear) clear.addEventListener("click", () => ctx.clearRect(0, 0, canvas.width, canvas.height));
    const save = $("#saveBoard");
    if (save) save.addEventListener("click", () => {
      const a = document.createElement("a");
      a.download = "ecriture-pular-ajami.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  }

  /* ---------- Enregistrement audio ---------- */
  let mediaRecorder = null, chunks = [], recordUrl = null;
  async function toggleRecord() {
    const btn = $("#recordBtn"), player = $("#recordPlayer");
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("L'enregistrement n'est pas disponible sur cet appareil.");
      return;
    }
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordUrl) URL.revokeObjectURL(recordUrl);
        recordUrl = URL.createObjectURL(new Blob(chunks, { type: "audio/webm" }));
        player.src = recordUrl;
        player.hidden = false;
        btn.textContent = "🎤 Enregistrer à nouveau";
        btn.classList.remove("recording");
      };
      mediaRecorder.start();
      btn.textContent = "⏹ Arrêter l'enregistrement";
      btn.classList.add("recording");
    } catch {
      alert("Impossible d'accéder au micro. Vérifiez les autorisations.");
    }
  }

  /* ---------- Quiz ---------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const QUIZ_BANKS = {
    alphabet: {
      title: "Quiz — Alphabet harmonisé",
      make() {
        return DATA.alphabet.map((L) => {
          if (Math.random() < 0.5) {
            return {
              q: "Quelle lettre correspond au son « " + L.latin + " » ?",
              display: esc(L.latin), opts: shuffle(DATA.alphabet).filter((o) => o.aj !== L.aj).slice(0, 3).map((o) => o.aj).concat([L.aj]),
              answer: L.aj, isAjami: true, explain: L.latin + " = " + L.aj + " (" + L.name + ")"
            };
          }
          return {
            q: "Quel est le son de cette lettre ?",
            display: esc(L.aj), isAjami: true, answer: L.latin,
            opts: shuffle(DATA.alphabet).filter((o) => o.latin !== L.latin).slice(0, 3).map((o) => o.latin).concat([L.latin]),
            explain: L.aj + " se prononce « " + L.latin + " » (" + L.name + ")"
          };
        });
      }
    },
    voyelles: {
      title: "Quiz — Voyelles et diacritiques",
      make() {
        const qs = D.vowels.list.map((v) => ({
          q: "Quelle voyelle représente ce diacritique ?",
          display: esc(v.aj), isAjami: true, answer: v.sound,
          opts: shuffle(["a", "i", "u", "e (Tèral)", "e (Nèènè)", "o (Toral)", "o (Potthal)"]).filter((o) => o !== v.sound).slice(0, 3).concat([v.sound]),
          explain: v.name + " = " + v.sound
        }));
        D.vowels.lengthening.rows.forEach((r) => {
          qs.push({
            q: "Quelle voyelle longue représente ce signe ?",
            display: esc(r.aj), isAjami: true, answer: r.latin,
            opts: shuffle(["aa", "ee", "ii", "oo", "uu", "èè"]).filter((o) => o !== r.latin).slice(0, 3).concat([r.latin]),
            explain: esc(r.aj) + " = " + r.latin
          });
        });
        return qs;
      }
    },
    vocabulaire: {
      title: "Quiz — Vocabulaire",
      make() {
        return D.vocabulary.map((w) => {
          if (Math.random() < 0.5) {
            return {
              q: "Que signifie ce mot ?",
              display: esc(w.aj), isAjami: true, answer: w.fr + " (" + w.latin + ")",
              opts: shuffle(D.vocabulary).filter((o) => o.fr !== w.fr).slice(0, 3).map((o) => o.fr + " (" + o.latin + ")").concat([w.fr + " (" + w.latin + ")"]),
              explain: esc(w.aj) + " = " + w.fr + " (" + w.latin + ")"
            };
          }
          return {
            q: "Comment écrit-on « " + w.fr + " » (" + w.latin + ") en ajami ?",
            display: esc(w.latin) + " — " + esc(w.fr), isAjami: false, answer: w.aj,
            opts: shuffle(D.vocabulary).filter((o) => o.aj !== w.aj).slice(0, 3).map((o) => o.aj).concat([w.aj]),
            explain: w.latin + " = " + esc(w.aj)
          };
        });
      }
    },
    mots: {
      title: "Quiz — Révision générale (mots)",
      make() {
        const qs = QUIZ_BANKS.vocabulaire.make();
        return qs.concat(QUIZ_BANKS.alphabet.make().slice(0, 8));
      }
    }
  };

  let quiz = null;
  function startQuiz(bankId) {
    const bank = QUIZ_BANKS[bankId];
    const items = shuffle(bank.make()).slice(0, 12);
    quiz = { bankId, items, index: 0, right: 0, answered: false, log: [] };
    renderQuiz();
  }

  function renderQuiz() {
    const total = quiz.items.length;
    if (quiz.index >= total) {
      Store.addQuizResult(quiz.bankId, total, quiz.right);
      const pct = Math.round(100 * quiz.right / total);
      main.innerHTML =
        '<h1>Résultat</h1>' +
        '<div class="card" style="text-align:center">' +
        '<div style="font-size:3rem;font-weight:800;color:var(--green-dark)">' + pct + " %</div>" +
        "<p>" + quiz.right + " bonnes réponses sur " + total + "</p>" +
        '<p class="muted">' + (pct >= 80 ? "Excellent ! Vous maîtrisez." : pct >= 50 ? "Continuez, revenez réviser." : "Relisez la leçon puis réessayez.") + "</p>" +
        '<div style="margin-top:14px"><button class="btn" id="retryQuiz">Recommencer</button> ' +
        '<a class="btn ghost" href="#/reviser">Choisir un autre quiz</a></div></div>' +
        (quiz.log.length ? '<h2>Détail des réponses</h2>' +
          quiz.log.map((l) =>
            '<div class="card list-item"><strong>' + l.q + "</strong><br>" +
            '<span class="' + (l.ok ? "badge ok" : "badge warn") + '">' + (l.ok ? "Correct" : "Incorrect") + "</span> " +
            "<span>" + (l.isAjami ? aj(l.given) : esc(l.given)) + "</span><br>" +
            '<span class="muted">' + l.explain + "</span></div>").join("") : "");
      $("#retryQuiz").addEventListener("click", () => startQuiz(quiz.bankId));
      return;
    }
    const item = quiz.items[quiz.index];
    main.innerHTML =
      '<h1>' + QUIZ_BANKS[quiz.bankId].title + "</h1>" +
      '<div class="progressbar"><div style="width:' + (100 * quiz.index / total) + '%"></div></div>' +
      '<p class="muted" style="margin:8px 0">' + (quiz.index + 1) + " / " + total + " — score : " + quiz.right + "</p>" +
      '<div class="card"><p>' + esc(item.q) + "</p>" +
      '<div class="' + (item.isAjami ? "quiz-ajami ajami" : "quiz-ajami") + '">' + item.display + "</div>" +
      '<div class="quiz-choices">' + item.opts.map((o, i) =>
        '<button data-i="' + i + '" class="' + (item.isAjami ? "ajami" : "") + '">' + esc(o) + "</button>").join("") +
      "</div></div>";
    $$(".quiz-choices button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (quiz.answered) return;
        quiz.answered = true;
        const given = item.opts[+btn.dataset.i];
        const ok = given === item.answer;
        if (ok) quiz.right++;
        quiz.log.push({ q: item.q, given, ok, isAjami: item.isAjami, explain: item.explain });
        $$(".quiz-choices button").forEach((b) => {
          b.disabled = true;
          if (b.textContent === item.answer) b.classList.add("correct");
          else if (b === btn) b.classList.add("wrong");
        });
        setTimeout(() => { quiz.index++; quiz.answered = false; renderQuiz(); }, ok ? 600 : 1500);
      });
    });
  }

  /* ---------- Vues ---------- */

  routes.accueil = function () {
    const p = Store.profile();
    const prog = Store.progress();
    const done = Object.keys(prog).filter((k) => prog[k].done).length;
    const stats = Store.quizStats();
    const quizzes = Object.keys(stats).length;
    const nbQ = Store.questions().length;
    const nbH = Store.homeworks().length;
    return (
      '<h1>Iskaaka na, ' + esc(p.name || "apprenant") + ' !</h1>' +
      '<p class="lead">Bienvenue dans votre application d\'apprentissage du <strong>pular</strong> écrit en <strong>ajami harmonisé</strong> (norme JCMWA 1998).</p>' +
      '<div class="stats">' +
      '<div class="stat"><div class="num">' + done + " / " + D.sessions.length + '</div><div class="lbl">séances terminées</div></div>' +
      '<div class="stat"><div class="num">' + DATA.alphabet.length + '</div><div class="lbl">lettres harmonisées</div></div>' +
      '<div class="stat"><div class="num">' + quizzes + '</div><div class="lbl">quiz tentés</div></div>' +
      '<div class="stat"><div class="num">' + nbH + '</div><div class="lbl">devoirs déposés</div></div>' +
      "</div>" +
      '<div class="section grid cols2">' +
      '<div class="card"><h3>📖 Lire</h3><p class="muted">Découvrez les 33 lettres de l\'alphabet ajami harmonisé, leurs formes et leurs sons.</p><a class="btn small" href="#/lire">Commencer</a></div>' +
      '<div class="card"><h3>✍️ Écrire</h3><p class="muted">Atelier d\'écriture : entraînez-vous à tracer les lettres et les mots.</p><a class="btn small" href="#/ecrire">Ouvrir</a></div>' +
      '<div class="card"><h3>🗣️ Parler</h3><p class="muted">Écoutez la prononciation et enregistrez-vous.</p><a class="btn small" href="#/parler">Ouvrir</a></div>' +
      '<div class="card"><h3>🎯 Réviser</h3><p class="muted">Quiz de révision : alphabet, voyelles, vocabulaire.</p><a class="btn small" href="#/reviser">Se tester</a></div>' +
      '<div class="card"><h3>🏫 Salle de cours</h3><p class="muted">' + D.sessions.length + ' séances guidées, du débutant à l\'avancé.</p><a class="btn small" href="#/cours">Entrer</a></div>' +
      '<div class="card"><h3>💬 Formateurs</h3><p class="muted">' + (nbQ ? nbQ + " question(s) posée(s)." : "Posez vos questions aux formateurs.") + '</p><a class="btn small" href="#/formateurs">Poser une question</a></div>' +
      '<div class="card"><h3>📤 Devoirs</h3><p class="muted">Déposez vos devoirs et consultez les corrections.</p><a class="btn small" href="#/devoirs">Ouvrir</a></div>' +
      '<div class="card"><h3>📥 Documents</h3><p class="muted">PDF et fichiers légers à télécharger.</p><a class="btn small" href="#/documents">Télécharger</a></div>' +
      "</div>" +
      (!p.name ? '<div class="notice">💡 <a href="#/parametres">Indiquez votre nom</a> dans les paramètres pour personnaliser votre expérience.</div>' : "")
    );
  };

  routes.lire = function () {
    const cards = D.alphabet.map((L, i) =>
      '<div class="card letter-card" data-i="' + i + '">' +
      '<span class="aj">' + esc(L.aj) + "</span>" +
      '<div class="lt">' + esc(L.latin) + "</div>" +
      '<div class="tag">' +
      (L.unique ? '<span class="badge gold">sp\u00e9cifique pulaar</span>' : '<span class="badge">standard</span>') +
      "</div></div>").join("");
    const digraphs = D.digraphs.map((d) =>
      '<div class="card"><h3>' + aj(d.aj) + " = " + esc(d.latin) + "</h3>" +
      '<p>' + aj(d.ex.aj) + " \u2794 " + esc(d.ex.latin) + "</p></div>").join("");
    const vowels = D.vowels.list.map((v) =>
      '<tr><td>' + aj(v.aj) + "</td><td>" + aj(v.init) + "</td><td><strong>" + esc(v.sound) + "</strong></td><td>" + esc(v.name) + " \u2014 " + esc(v.desc) + "</td></tr>").join("");
    const rules = D.rules.map((r) =>
      '<div class="card list-item"><h3>' + esc(r.title) + "</h3><p>" + esc(r.text) + "</p></div>").join("");
    return (
      '<h1>\ud83d\udcd6 Lire \u2014 l\'alphabet ajami pulaar harmonis\u00e9</h1>' +
      '<p class="lead">15 consonnes standard et 7 consonnes sp\u00e9cifiques, avec les voyelles et les r\u00e8gles valid\u00e9es. <span class="muted">R\u00e9f\u00e9rence : ' + esc(DATA.meta.reference) + '.</span> Touchez une lettre pour l\'\u00e9couter et voir son exemple.</p>' +
      '<div class="grid cols3">' + cards + "</div>" +
      '<div id="letterDetail" class="section"></div>' +
      '<h2>Les voyelles</h2>' +
      '<p class="muted">' + esc(D.vowels.intro) + "</p>" +
      '<div class="card"><table class="simple"><tr><th>Signe</th><th>Sur Hamza (d\u00e9but)</th><th>Son</th><th>Nom</th></tr>' + vowels + "</table></div>" +
      '<div class="grid cols2">' +
      '<div class="card"><h3>' + esc(D.vowels.initial.title) + "</h3>" +
      '<p>Voyelles arri\u00e8re (hamza au-dessus \u0623) : ' + D.vowels.initial.back.map((r) => aj(r.aj) + " = " + esc(r.latin)).join(" \u00b7 ") + "</p>" +
      '<p>Voyelles avant (hamza en dessous \u0625) : ' + D.vowels.initial.front.map((r) => aj(r.aj) + " = " + esc(r.latin)).join(" \u00b7 ") + "</p></div>" +
      '<div class="card"><h3>' + esc(D.vowels.lengthening.title) + "</h3>" +
      '<p>' + D.vowels.lengthening.rows.map((r) => aj(r.aj) + " = " + esc(r.latin)).join(" \u00b7 ") + "</p></div>" +
      "</div>" +
      '<h2>Consonnes pr\u00e9nasalis\u00e9es (toujours avec Noun)</h2>' + digraphs +
      '<h2>R\u00e8gles orthographiques majeures</h2>' + rules +
      '<p><a class="btn gold" href="' + esc(DATA.meta.rulesDoc) + '">\ud83d\udce5 T\u00e9l\u00e9charger le manuel complet</a></p>'
    );
  };

  binders.lire = function () {
    function showDetail(L) {
      $("#letterDetail").innerHTML =
        '<div class="card letter-detail">' +
        '<div class="big ajami">' + esc(L.aj) + "</div>" +
        '<h3 style="text-align:center">' + esc(L.name) + " \u2014 \u00ab " + esc(L.latin) + " \u00bb</h3>" +
        (L.desc ? '<p style="text-align:center" class="muted">' + esc(L.desc) + "</p>" : "") +
        '<div class="forms"><div class="form-box"><span class="faj ajami">' + esc(L.ex.aj) + '</span><span class="flbl">' + esc(L.ex.latin) + "</span></div></div>" +
        (L.note ? '<p class="muted">' + esc(L.note) + "</p>" : "") +
        '<div style="text-align:center;margin-top:10px">' +
        '<button class="btn small" id="hearLetter">\ud83d\udd0a \u00c9couter \u00ab ' + esc(L.ex.latin) + ' \u00bb</button></div></div>';
      $("#hearLetter").addEventListener("click", () => { if (!playAudioKey("L:" + L.latin)) speak("Lettre " + L.latin + ", exemple : " + L.ex.latin); });
      $("#letterDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    $$(".letter-card").forEach((card) =>
      card.addEventListener("click", () => showDetail(D.alphabet[+card.dataset.i])));
  };

  routes.ecrire = function () {
    const options = DATA.alphabet.map((L) =>
      '<option value="' + esc(L.aj) + '">' + esc(L.name) + " (" + esc(L.latin) + ")</option>").join("");
    const words = D.vocabulary.map((w) =>
      '<option value="' + esc(w.aj) + '">' + esc(w.latin) + " — " + esc(w.fr) + "</option>").join("");
    return (
      '<h1>✍️ Écrire — atelier</h1>' +
      '<p class="lead">Choisissez une lettre ou un mot, observez le modèle à droite, puis tracez-le sur le tableau. <span class="muted">(Sens d\'écriture : de droite à gauche.)</span></p>' +
      '<div class="card">' +
      '<label for="pickLetter">Lettre</label><select id="pickLetter">' + options + "</select>" +
      '<label for="pickWord">… ou mot complet</label><select id="pickWord"><option value="">— choisir un mot —</option>' + words + "</select>" +
      '<div class="write-ref ajami" id="writeRef">' + esc(DATA.alphabet[0].aj) + "</div>" +
      '<canvas id="board" width="560" height="260"></canvas>' +
      '<div style="text-align:center">' +
      '<button class="btn small ghost" id="clearBoard">🧽 Effacer</button> ' +
      '<button class="btn small ghost" id="saveBoard">💾 Enregistrer en PNG</button></div>' +
      "</div>" +
      '<div class="notice">💡 Astuce : les lettres ' + DATA.alphabet.filter((L) => !L.joins).map((L) => aj(L.aj)).join(" ") +
      " ne se relient pas à la lettre suivante. Les 4 lettres propres au fulfulde sont " +
      DATA.alphabet.filter((L) => L.unique).map((L) => aj(L.aj)).join(" ") + ".</div>"
    );
  };

  binders.ecrire = function () {
    initBoard($("#board"));
    const ref = $("#writeRef");
    $("#pickLetter").addEventListener("change", (e) => {
      ref.textContent = e.target.value;
      $("#pickWord").value = "";
    });
    $("#pickWord").addEventListener("change", (e) => {
      if (e.target.value) ref.textContent = e.target.value;
    });
  };

  routes.parler = function () {
    const phrases = D.vocabulary.filter((w) => w.cat === "Salutations").concat(D.vocabulary.slice(4)).map((w, i) =>
      '<div class="card list-item"><h3>' + aj(w.aj) + '</h3>' +
      '<p><strong>' + esc(w.latin) + '</strong> — ' + esc(w.fr) + '</p>' +
      '<button class="btn small gold" data-speak="' + esc(w.latin) + '" data-vkey="V:' + esc(w.id || w.latin) + '">🔊 Écouter</button></div>').join("");
    return (
      '<h1>🗣️ Parler — prononciation</h1>' +
      '<p class="lead">Écoutez la prononciation, puis enregistrez-vous et comparez. <span class="muted">La voix de synthèse lit la transcription latine : elle est une approximation pour s\'entraîner.</span></p>' +
      '<div class="card"><h3>🎤 Enregistrement</h3>' +
      '<p class="muted">Enregistrez-vous en lisant : <strong>' + esc("a jaraama · jam wa? · jam tan · ndiyam · hendu") + '</strong></p>' +
      '<button class="btn" id="recordBtn">🎤 Enregistrer</button>' +
      '<audio id="recordPlayer" controls hidden style="width:100%;margin-top:10px"></audio></div>' +
      '<h2>Phrases et mots à répéter</h2>' + phrases
    );
  };

  binders.parler = function () {
    $("#recordBtn").addEventListener("click", toggleRecord);
    $$("[data-speak]").forEach((b) =>
      b.addEventListener("click", () => { if (!playAudioKey(b.dataset.vkey)) speak(b.dataset.speak); }));
  };

  routes.reviser = function () {
    const stats = Store.quizStats();
    const banks = Object.keys(QUIZ_BANKS).map((id) => {
      const s = stats[id];
      return '<div class="card"><h3>' + esc(QUIZ_BANKS[id].title) + "</h3>" +
        (s ? '<p class="muted">Meilleur score : <strong>' + s.best + " %</strong> — " + s.right + " / " + s.seen + " réponses justes au total.</p>" : '<p class="muted">Pas encore tenté.</p>') +
        '<button class="btn small" data-bank="' + id + '">Commencer</button></div>';
    }).join("");
    return (
      '<h1>🎯 Réviser — quiz</h1>' +
      '<p class="lead">12 questions tirées au hasard à chaque partie. Objectif : 80 % partout !</p>' +
      '<div id="quizArea"><div class="grid cols2">' + banks + "</div></div>"
    );
  };

  binders.reviser = function () {
    $$("[data-bank]").forEach((b) =>
      b.addEventListener("click", () => startQuiz(b.dataset.bank)));
  };

  /* ---------- Prononciations audio enregistrées (voix du formateur) ---------- */

  function playAudioKey(key) {
    const a = (Store.content().audio || {})[key];
    if (!a) return false;
    try { new Audio(a.data).play(); return true; } catch { return false; }
  }

  function audioLabel(key) {
    if (key.startsWith("V:")) {
      const k = key.slice(2);
      const w = D.vocabulary.find((x) => (x.id || x.latin) === k);
      return w ? w.latin + " (" + w.fr + ")" : k;
    }
    if (key.startsWith("L:")) {
      const l = D.alphabet.find((x) => x.latin === key.slice(2));
      return l ? "lettre " + l.latin + " (" + l.name + ")" : key.slice(2);
    }
    return key;
  }

  /* ---------- Cours en fichiers (PDF / Word) ---------- */

  function dataURLtoBlob(dataURL) {
    const parts = String(dataURL).split(",");
    const mime = (parts[0].match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
    const bin = atob(parts[1] || "");
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  const MAX_FILE = 20 * 1024 * 1024;

  function compressImage(file) {
    return new Promise((resolve) => {
      if (!/^image\//.test(file.type) || /gif|svg/.test(file.type)) { resolve(file); return; }
      if (typeof document === "undefined") { resolve(file); return; }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width || 1, img.height || 1));
        if (scale === 1 && file.size < 400 * 1024) { resolve(file); return; }
        const cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(img.width * scale));
        cv.height = Math.max(1, Math.round(img.height * scale));
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob((b) => {
          if (b && b.size < file.size) {
            resolve(new File([b], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
          } else resolve(file);
        }, "image/jpeg", 0.72);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  function mo(size) {
    return (Math.round(size / 1024 / 1024 * 10) / 10) + " Mo";
  }

  async function migrateCourseFiles() {
    if (typeof Files === "undefined" || !Files.detach) return;
    try { await Files.detach(Store.content()); Store.saveContent(Store.content()); } catch (e) {}
  }

  async function openStoredCourse(id, download) {
    const f = (Store.content().courses || []).find((x) => x.id === id);
    if (!f) { alert("Fichier introuvable sur cet appareil."); return; }
    const data = f.data || (typeof Files !== "undefined" && Files.get ? await Files.get(id) : "");
    if (!data) { alert("Fichier introuvable sur cet appareil."); return; }
    const url = URL.createObjectURL(dataURLtoBlob(data));
    const isPdf = /pdf/.test(f.type || "") || /\.pdf$/i.test(f.fileName || "");
    const a = document.createElement("a");
    a.href = url;
    if (download || !isPdf) { a.download = f.fileName || "cours"; a.click(); }
    else { window.open(url, "_blank"); }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  routes.cours = function () {
    const prog = Store.progress();
    const levels = ["Débutant", "Intermédiaire", "Avancé"];
    const sessions = levels.map((lv) => {
      const list = D.sessions.filter((s) => s.level === lv);
      if (!list.length) return "";
      return "<h2>" + esc(lv) + "</h2>" + list.map((s) => {
        const st = prog[s.id];
        return '<div class="card list-item"><div class="session-head">' +
          "<h3>" + esc(s.title) + "</h3>" +
          (st && st.done ? '<span class="badge ok">✓ terminée le ' + esc(st.date) + "</span>" : '<span class="badge gold">à faire</span>') +
          "</div>" +
          '<p class="meta">⏱ ' + esc(s.duration) + " — " + esc(s.level) + "</p>" +
          '<a class="btn small" href="#/seance-' + s.id + '">Ouvrir la séance</a></div>';
      }).join("");
    }).join("");
    const files = (Store.content().courses || []).map((f) =>
      '<div class="card list-item"><strong>' + esc(f.title) + '</strong>' +
      '<span class="meta"> 📎 ' + esc(f.fileName) + ' · ' + Math.max(1, Math.round(f.size / 1024)) + ' Ko</span>' +
      '<div style="margin-top:6px">' +
      (/pdf/.test(f.type || "") || /\.pdf$/i.test(f.fileName || "") ? '<button class="btn small" data-open-course="' + esc(f.id) + '">📖 Ouvrir le PDF</button> ' : "") +
      '<button class="btn small gold" data-dl-course="' + esc(f.id) + '">⬇️ Télécharger</button></div></div>').join("");
    return (
      '<h1>🏫 Salle de cours</h1>' +
      '<p class="lead">Votre programme complet : ' + D.sessions.length + ' séances guidées, chacune avec objectifs, leçon, quiz et devoir associé.</p>' + sessions +
      (files ? '<h2>📄 Cours en fichiers (PDF / Word)</h2>' + files : "")
    );
  };

  binders.cours = function () {
    $$('[data-open-course]').forEach((b) =>
      b.addEventListener("click", () => openStoredCourse(b.dataset.openCourse)));
    $$('[data-dl-course]').forEach((b) =>
      b.addEventListener("click", () => openStoredCourse(b.dataset.dlCourse, true)));
  };

  routes["seance"] = function (id) {
    const s = D.sessions.find((x) => x.id === id);
    if (!s) return routes.cours();
    const prog = Store.progress();
    const hw = D.homeworks.find((h) => h.session === s.id);
    const st = prog[s.id];
    const next = D.sessions[D.sessions.indexOf(s) + 1];
    return (
      '<a href="#/cours" class="muted">← Salle de cours</a>' +
      '<h1>' + esc(s.title) + "</h1>" +
      '<p class="meta">⏱ ' + esc(s.duration) + " — " + esc(s.level) + "</p>" +
      '<div class="card"><h3>Objectifs</h3><ul class="objectives">' +
      s.objectives.map((o) => "<li>" + esc(o) + "</li>").join("") + "</ul></div>" +
      '<div class="card"><h3>Leçon</h3>' + s.content.split("\n").map((p) => "<p>" + esc(p) + "</p>").join("") + "</div>" +
      '<div class="card"><h3>Entraînement</h3>' +
      '<a class="btn small" href="#/reviser">🎯 Quiz « ' + esc(QUIZ_BANKS[s.quiz].title) + ' »</a> ' +
      '<a class="btn small ghost" href="#/ecrire">✍️ Atelier d\'écriture</a></div>' +
      (hw ? '<div class="card"><h3>📤 Devoir associé : ' + esc(hw.title) + "</h3><p class='muted'>" + esc(hw.due) + "</p><a class=\"btn small gold\" href=\"#/devoirs\">Voir le devoir</a></div>" : "") +
      '<div style="margin-top:14px">' +
      (st && st.done
        ? '<button class="btn ghost" id="markDone">✓ Séance terminée le ' + esc(st.date) + "</button>"
        : '<button class="btn" id="markDone">Marquer la séance comme terminée</button>') +
      (next ? ' <a class="btn gold" href="#/seance-' + next.id + '">Séance suivante →</a>' : "") +
      "</div>"
    );
  };

  binders["seance"] = function () {
    const btn = $("#markDone");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const id = location.hash.replace(/^#\/seance-/, "");
      const p = Store.progress();
      if (p[id] && p[id].done) {
        Store.setProgress(id, { done: false, date: null });
      } else {
        Store.setProgress(id, { done: true, date: today() });
      }
      nav();
    });
  };

  routes.formateurs = function () {
    const tMode = Store.role() !== "learner";
    const qs = Store.questions().slice().reverse();
    const list = qs.length ? qs.map((q) => {
      const replies = (q.replies || []).map((r) =>
        '<div class="answer-box qa-item reply"><strong>💬 ' + esc(r.name) + "</strong> <span class='muted'>" + esc(r.date) + "</span><p>" + esc(r.text) + "</p></div>").join("");
      return '<div class="card list-item qa-item"><strong>' + esc(q.name) + "</strong> <span class='muted'>le " + esc(q.date) +
        (q.lesson ? " — " + esc(q.lesson) : "") + "</span><p>" + esc(q.text) + "</p>" + replies +
        (tMode ? '<div style="margin-top:8px"><button class="btn small gold" data-reply="' + q.id + '">↩️ Répondre (mode formateur)</button></div>' : "") +
        "</div>";
    }).join("") : '<p class="muted">Aucune question pour le moment. Posez la première !</p>';
    return (
      '<h1>💬 Poser une question aux formateurs</h1>' +
      '<p class="lead">Vos questions partent vers les formateurs : si la salle de cours connectée est configurée (⚙️ Paramètres), elles sont envoyées automatiquement ; sinon elles restent sur cet appareil.</p>' +
      '<div class="card">' +
      '<label for="qName">Votre nom</label><input type="text" id="qName" value="' + esc(Store.profile().name) + '" placeholder="Ex : Mariama D.">' +
      '<label for="qLesson">Séance concernée (facultatif)</label><select id="qLesson"><option value="">— aucune —</option>' +
      D.sessions.map((s) => '<option value="' + esc(s.title) + '">' + esc(s.title) + "</option>").join("") + "</select>" +
      '<label for="qText">Votre question</label><textarea id="qText" placeholder="Ex : Pourquoi le mot « a jaraama » commence-t-il par ع et non par ا ?"></textarea>' +
      '<p style="margin-top:10px"><button class="btn" id="qSend">Envoyer la question</button></p></div>' +
      '<h2>Questions et réponses (' + qs.length + ")</h2>" + list
    );
  };

  binders.formateurs = function () {
    $("#qSend").addEventListener("click", () => {
      const text = $("#qText").value.trim();
      const name = $("#qName").value.trim() || "Anonyme";
      if (!text) { alert("Écrivez votre question d'abord."); return; }
      const list = Store.questions();
      list.push({ id: uid(), name, lesson: $("#qLesson").value, text, date: today(), replies: [] });
      Store.saveQuestions(list);
      syncSilent(["questions", "submissions"]);
      nav();
    });
    $$("[data-reply]").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.reply;
        const text = prompt("Votre réponse :");
        if (!text) return;
        const list = Store.questions();
        const q = list.find((x) => x.id === id);
        q.replies.push({ name: "Formateur", text, date: today() });
        Store.saveQuestions(list);
        syncSilent(["questions", "submissions"]);
        nav();
      });
    });
  };

  routes.devoirs = function () {
    const tMode = Store.role() !== "learner";
    const subs = Store.homeworks();
    const cards = D.homeworks.map((h) => {
      const mine = subs.filter((s) => s.homeworkId === h.id);
      const corr = h.correction;
      const corrHtml = (corr && corr.published) || tMode
        ? '<div class="answer-box"><strong>📝 Correction</strong><p>' + esc(corr.text) + "</p></div>"
        : '<p class="muted">Correction non encore publiée.</p>';
      const mineHtml = mine.length
        ? mine.map((m) => '<div class="answer-box"><strong>' + esc(m.name) + "</strong> <span class='muted'>le " + esc(m.date) +
            (tMode ? ' — <span class="badge gold">' + esc(m.status || "déposé") + "</span>" : "") + "</span><p>" + esc(m.text) + "</p>" +
            (tMode ? '<button class="btn small gold" data-grade="' + m.id + '">✅ Corriger / noter</button>' : "") + "</div>").join("")
        : '<p class="muted">Aucun dépôt sur cet appareil.</p>';
      return '<div class="card list-item hw-item"><div class="session-head"><h3>' + esc(h.title) + "</h3>" +
        '<span class="badge">' + esc(h.due) + "</span></div>" +
        "<p>" + esc(h.instructions) + "</p>" +
        '<button class="btn small" data-hw="' + h.id + '">📤 Déposer mon travail</button>' +
        corrHtml +
        "<h4>Dépôts</h4>" + mineHtml + "</div>";
    }).join("");
    return (
      '<h1>📤 Déposer un devoir</h1>' +
      '<p class="lead">Déposez votre travail (texte, description ou dictée des lettres) puis consultez la correction et les dépôts.</p>' + cards
    );
  };

  binders.devoirs = function () {
    $$("[data-hw]").forEach((b) => {
      b.addEventListener("click", () => {
        const text = prompt("Collez ou décrivez votre travail :");
        if (!text) return;
        const subs = Store.homeworks();
        subs.push({
          id: uid(), homeworkId: b.dataset.hw,
          name: Store.profile().name || "Apprenant", text, date: today(), status: "déposé"
        });
        Store.saveHomeworks(subs);
        syncSilent(["submissions"]);
        nav();
      });
    });
    $$("[data-grade]").forEach((b) => {
      b.addEventListener("click", () => {
        const status = prompt("Correction / note (ex : « Bien, 8/10 — attention au sukun ») :");
        if (!status) return;
        const subs = Store.homeworks();
        const s = subs.find((x) => x.id === b.dataset.grade);
        s.status = status;
        s.corrected = today();
        Store.saveHomeworks(subs);
        syncSilent(["submissions"]);
        nav();
      });
    });
  };

  routes.fiches = function () {
    const F = DATA.fiches;
    const card = (f) =>
      '<div class="card"><h3>Fiche ' + f.n + " \u2014 " + esc(f.title) + "</h3>" +
      (f.lead ? "<p class='muted'>" + esc(f.lead) + "</p>" : "") +
      '<div class="grid cols3">' +
      f.items.map((it) =>
        '<div class="letter-card">' +
        (it.aj ? '<span class="aj ajami">' + esc(it.aj) + "</span>" : "") +
        '<div class="lt">' + esc(it.latin) + "</div>" +
        (it.note ? '<div class="nm">' + esc(it.note) + "</div>" : "") +
        "</div>").join("") +
      "</div></div>";
    return (
      '<h1>\ud83d\udcd7 Fiches p\u00e9dagogiques (support compl\u00e9mentaire)</h1>' +
      '<div class="notice">' + esc(F.notice) + "</div>" +
      '<p class="lead">' + esc(F.header) + "</p>" +
      '<p style="text-align:center;font-size:1.6rem"><span class="ajami">' + esc(F.motto) + "</span></p>" +
      F.list.map(card).join("") +
      '<div class="card"><h3>Cr\u00e9dits</h3>' +
      '<p>Support con\u00e7u par <strong>Baba Ibrahim Barry (Ayouba Barry)</strong> \u2014 concepteur du clavier CaramBolfubhe \u00b7 cr\u00e9ateur du Labo4.</p>' +
      '<p>Clavier pulaar ajami : <a href="https://keyman.com/keyboards/carambolfulbhe" target="_blank" rel="noopener">keyman.com/keyboards/carambolfulbhe</a></p></div>'
    );
  };

  routes.documents = function () {
    const docs = DATA.docs.map((d) =>
      '<div class="card list-item"><h3>' + esc(d.label) + "</h3><p class='muted'>" + esc(d.note) + "</p>" +
      '<a class="btn small" href="' + esc(d.file) + '" download>⬇️ Télécharger</a></div>').join("");
    return (
      '<h1>📥 Documents téléchargeables</h1>' +
      '<p class="lead">Fichiers légers (quelques Ko) consultables hors ligne. Les PDF sont aussi imprimables.</p>' + docs
    );
  };

  routes.parametres = function () {
    const p = Store.profile();
    const role = Store.role();
    return (
      '<h1>⚙️ Paramètres</h1>' +
      '<div class="card">' +
      '<label for="setName">Votre nom d\'apprenant</label>' +
      '<input type="text" id="setName" value="' + esc(p.name) + '" placeholder="Ex : Mamadou B.">' +
      '<p style="margin-top:10px"><button class="btn" id="saveName">Enregistrer</button></p></div>' +
      '<div class="card"><h3>Mon rôle</h3>' +
      '<p>Vous êtes : <strong>' + ROLE_LABEL[role] + '</strong>' +
      (role !== "learner" ? ' <span class="badge ok">accès formateur</span>' : '') + '</p>' +
      (role === "learner"
        ? '<label for="roleCode">Code enseignant ou administrateur</label><input type="text" id="roleCode" placeholder="Ex : ABC123">' +
          '<p style="margin-top:10px"><button class="btn gold" id="useTeacherCode">👤 Devenir enseignant</button> ' +
          '<button class="btn" id="useAdminCode">🔐 Devenir administrateur</button></p>' +
          '<p class="muted">Les codes sont délivrés par l\'administrateur de l\'application.</p>'
        : '<p><button class="btn danger" id="leaveRole">Revenir en simple apprenant</button></p>') +
      '</div>' +
      syncCardHtml() +
      '<div class="card"><h3>Réinitialiser</h3>' +
      '<p class="muted">Efface progression, questions et devoirs stockés sur cet appareil.</p>' +
      '<p><button class="btn danger" id="resetAll">Tout réinitialiser</button></p></div>' +
      '<div class="card"><h3>À propos</h3>' +
      "<p>Application PWA d'apprentissage du pular en écriture ajami harmonisée (JCMWA/MICCAO, Ngaoundéré 1998 — 33 lettres).</p>" +
      "<p class='muted'>Fonctionne hors ligne après la première visite. Installez-la depuis votre navigateur (menu → « Installer » / « Ajouter à l'écran d'accueil ») sur Android, iOS, Windows, macOS ou Linux.</p></div>"
    );
  };

  /* ---------- Salle de cours connectée ---------- */

  function syncStateText() {
    if (typeof Sync === "undefined") return "";
    const s = Sync.state();
    const parts = [];
    if (s.lastPull) parts.push("reçu le " + esc(s.lastPull));
    if (s.lastPush) parts.push("envoyé le " + esc(s.lastPush));
    if (s.lastError) parts.push('dernière erreur : ' + esc(s.lastError));
    return parts.length ? '<p class="muted">' + parts.join(" · ") + "</p>" : "";
  }

  function syncCardHtml() {
    if (typeof Sync === "undefined") return "";
    const c = Sync.cfg();
    return '<div class="card"><h3>🏫 Salle de cours connectée</h3>' +
      '<p class="muted">Collez l\'adresse et la clé de classe données par l\'administrateur pour recevoir les contenus, questions et devoirs de la classe.</p>' +
      '<label for="syncUrl">Adresse de la classe (URL)</label>' +
      '<input type="text" id="syncUrl" value="' + esc(c.url) + '" placeholder="https://script.google.com/…/exec">' +
      '<label for="syncKey">Clé de classe</label>' +
      '<input type="text" id="syncKey" value="' + esc(c.key) + '" placeholder="Ex : MA-CLASSE-2026">' +
      '<p style="margin-top:10px"><button class="btn" id="syncSave">💾 Enregistrer la connexion</button> ' +
      '<button class="btn gold" id="syncPull">⬇️ Recevoir les contenus de la classe</button></p>' +
      (Sync.ready() ? '' : '<p class="muted">Non connecté : les boutons ⬇️ resteront sans effet tant que l\'adresse et la clé ne sont pas enregistrées.</p>') +
      syncStateText() + '</div>';
  }

  function syncSilent(what) {
    if (typeof Sync !== "undefined" && Sync.ready()) Sync.push(what).catch(() => {});
  }

  binders.parametres = function () {
    $("#saveName").addEventListener("click", () => {
      Store.set("profile", { name: $("#setName").value.trim(), joined: Store.profile().joined });
      nav();
    });
    const useTeacher = $("#useTeacherCode");
    if (useTeacher) {
      const submitCode = () => {
        const res = applyAccessCode($("#roleCode").value);
        if (res === "empty") { alert("Entrez un code."); return; }
        if (res === "bad") { alert("Code inconnu ou déjà utilisé. Demandez le code à l\'administrateur."); return; }
        nav();
      };
      useTeacher.addEventListener("click", submitCode);
      $("#useAdminCode").addEventListener("click", submitCode);
    } else {
      $("#leaveRole").addEventListener("click", () => { Store.setRole("learner"); nav(); });
    }
    if ($("#syncSave")) $("#syncSave").addEventListener("click", () => {
      Sync.save($("#syncUrl").value, $("#syncKey").value);
      if (!Sync.ready()) { alert("Renseignez l'adresse ET la clé de classe."); return; }
      alert("Connexion enregistrée. Utilisez « Recevoir » pour récupérer les contenus de la classe.");
      nav();
    });
    if ($("#syncPull")) $("#syncPull").addEventListener("click", async () => {
      const btn = $("#syncPull");
      btn.disabled = true;
      btn.textContent = "⏳ Récupération…";
      const res = await Sync.pull();
      if (!res.ok) {
        alert("Récupération impossible : " + (res.error === "config"
          ? "enregistrez d'abord l'adresse et la clé de classe."
          : res.error) + "");
        nav();
        return;
      }
      const s = res.summary || {};
      const bits = [];
      if (s.content) bits.push("contenus de la classe");
      if (s.questions) bits.push(s.questions + " nouvelle(s) question(s)");
      if (s.submissions) bits.push(s.submissions + " nouveau(x) dépôt(s)");
      alert(bits.length ? "Reçu : " + bits.join(", ") + "."
        : "Vous êtes déjà à jour.");
      buildData();
      nav();
    });
    $("#resetAll").addEventListener("click", () => {
      if (confirm("Tout réinitialiser ? Cette action est définitive.")) {
        Store.reset();
        nav();
      }
    });
  };

  /* ---------- Administration ---------- */

  async function persistContent(c) {
    if (typeof Files !== "undefined" && Files.detach) await Files.detach(c);
    Store.saveContent(c);
    buildData();
    nav();
  }

  function removeContentItem(kind, key) {
    const c = Store.content();
    if (kind === "vocabulary") {
      if (c.vocabulary.some((w) => (w.id || w.latin) === key)) {
        c.vocabulary = c.vocabulary.filter((w) => (w.id || w.latin) !== key);
      } else {
        const w = D.vocabulary.find((x) => (x.id || x.latin) === key);
        if (w && !c.deletedVocab.includes(w.latin)) c.deletedVocab.push(w.latin);
      }
    } else if (kind === "sessions") {
      if (c.sessions.some((s) => s.id === key)) {
        c.sessions = c.sessions.filter((s) => s.id !== key);
        if (DATA.sessions.some((s) => s.id === key) && !c.deletedSessions.includes(key)) c.deletedSessions.push(key);
      } else if (!c.deletedSessions.includes(key)) {
        c.deletedSessions.push(key);
      }
    } else if (kind === "homeworks") {
      if (c.homeworks.some((h) => h.id === key)) {
        c.homeworks = c.homeworks.filter((h) => h.id !== key);
      } else if (!c.deletedHomeworks.includes(key)) {
        c.deletedHomeworks.push(key);
      }
    }
    persistContent(c);
  }

  routes.admin = function () {
    const c = Store.content();
    const a = Store.auth();
    if (Store.role() === "learner") {
      return '<h1>🔐 Administration</h1>' +
        '<div class="notice">🛡️ Accès réservé aux enseignants et administrateurs. Entrez votre code d\'accès.</div>' +
        '<div class="card"><label for="gateCode">Code enseignant ou administrateur</label>' +
        '<input type="text" id="gateCode" placeholder="Ex : ABC123">' +
        '<p style="margin-top:10px"><button class="btn gold" id="gateTeacher">👤 Entrer comme enseignant</button> ' +
        '<button class="btn" id="gateAdmin">🔐 Entrer comme administrateur</button></p>' +
        '<p class="muted">Pas de code ? Demandez-le à l\'administrateur de l\'application.</p></div>';
    }
    const isAdmin = Store.role() === "admin";
    const vocabList = D.vocabulary.map((w) =>
      '<div class="card list-item"><strong>' + aj(w.aj) + '</strong> — ' + esc(w.latin) +
      ' <span class="muted">(' + esc(w.fr) + ' · ' + esc(w.cat) + ')</span>' +
      (c.vocabulary.some((x) => x.replaces === w.latin) ? ' <span class="badge gold">✏️ modifié</span>' : '') +
      '<span style="float:right">' +
      '<button class="btn small gold" data-edit-vocab="' + esc(w.id || w.latin) + '">✏️</button> ' +
      '<button class="btn small danger" data-del-vocab="' + esc(w.id || w.latin) + '">🗑️</button></span></div>').join("") ||
      '<p class="muted">Aucun mot.</p>';
    const sessionList = D.sessions.map((s) => {
      const isCustom = c.sessions.some((x) => x.id === s.id);
      const isStatic = DATA.sessions.some((d) => d.id === s.id);
      return '<div class="card list-item"><strong>' + esc(s.title) + '</strong> <span class="badge">' + esc(s.level) + '</span>' +
        '<span class="meta"> ⏱ ' + esc(s.duration) +
        (isCustom ? (isStatic ? ' · <span class="badge gold">✏️ modifiée</span>' : ' · <span class="badge gold">ajoutée par vous</span>') : '') + '</span>' +
        '<span style="float:right">' +
        (isCustom && isStatic ? '<button class="btn small" data-restore-session="' + esc(s.id) + '">↺ Restaurer</button> ' : '') +
        '<button class="btn small gold" data-edit-session="' + esc(s.id) + '">✏️</button> ' +
        '<button class="btn small danger" data-del-session="' + esc(s.id) + '">🗑️</button></span></div>';
    }).join("");
    const homeworkList = D.homeworks.map((h) => {
      const pub = h.correction && h.correction.published;
      return '<div class="card list-item"><strong>' + esc(h.title) + '</strong>' +
        (pub ? ' <span class="badge ok">correction publiée</span>' : ' <span class="badge warn">sans correction</span>') +
        '<span class="meta"> ' + esc(h.due) + '</span>' +
        '<div style="margin-top:6px"><button class="btn small gold" data-corr="' + esc(h.id) + '">📝 Corriger / publier la correction</button> ' +
        '<button class="btn small danger" data-del-hw="' + esc(h.id) + '">🗑️ Supprimer</button></div></div>';
    }).join("");
    const sessionOptions = D.sessions.map((s) =>
      '<option value="' + esc(s.id) + '">' + esc(s.title) + '</option>').join("");
    const quizOptions = Object.keys(QUIZ_BANKS).map((id) =>
      '<option value="' + id + '">' + esc(QUIZ_BANKS[id].title) + '</option>').join("");
    const levels = ["Débutant", "Intermédiaire", "Avancé"].map((lv) =>
      '<option value="' + lv + '">' + lv + '</option>').join("");
    const cats = ["Salutations", "Famille", "Nature", "Actions", "Base", "Vie quotidienne", "Autre"].map((cat) =>
      '<option value="' + cat + '">' + cat + '</option>').join("");
    return (
      '<h1>🔐 Administration</h1>' +
      '<p class="lead">Ajoutez et gérez les contenus de l\'application : vocabulaire, séances de la salle de cours, devoirs et corrections. <span class="muted">Les contenus sont enregistrés sur cet appareil ; exportez-les pour les sauvegarder ou les partager.</span></p>' +
      (isAdmin
        ? '<h2>👥 Gestion des enseignants et administrateurs</h2>' +
          (a.adminCode === Store.DEFAULT_ADMIN_CODE
            ? '<div class="notice">⚠️ Le code administrateur est encore celui par défaut. Changez-le ci-dessous, puis ne le partagez qu\'avec les personnes de confiance.</div>'
            : '') +
          '<div class="card"><h3>Code administrateur</h3>' +
          '<label for="newAdminCode">Nouveau code administrateur (à garder secret)</label>' +
          '<input type="text" id="newAdminCode" placeholder="8 caractères minimum conseillés">' +
          '<p style="margin-top:10px"><button class="btn" id="saveAdminCode">Enregistrer le code</button></p></div>' +
          '<div class="card"><h3>Codes enseignants</h3>' +
          '<p class="muted">Générez un code et donnez-le à un enseignant : il l\'entre dans Paramètres (ou ici) pour être accepté comme formateur. Chaque code ne sert qu\'une fois.</p>' +
          '<p><button class="btn gold" id="genTeacherCode">➕ Générer un code enseignant</button></p>' +
          (a.codes.length
            ? a.codes.slice().reverse().map((e) =>
                '<div class="card list-item"><strong>' + esc(e.code) + '</strong>' +
                (e.used ? ' <span class="badge ok">utilisé le ' + esc(e.used) + '</span>' : ' <span class="badge gold">disponible</span>') +
                '<button class="btn small danger" data-del-code="' + esc(e.code) + '" style="float:right">🗑️</button></div>').join("")
            : '<p class="muted">Aucun code enseignant généré.</p>') +
          '</div>'
        : '') +

      '<h2>➕ Vocabulaire (' + D.vocabulary.length + ')</h2>' +
      '<div class="card"><label for="vAj">Mot en ajami (écrit de droite à gauche)</label>' +
      '<input type="text" id="vAj" lang="ar" dir="rtl" placeholder="جَمْ" style="text-align:right;font-size:1.4rem">' +
      '<label for="vLatin">Transcription latine</label><input type="text" id="vLatin" placeholder="jam">' +
      '<label for="vFr">Traduction française</label><input type="text" id="vFr" placeholder="la paix / ça va">' +
      '<label for="vCat">Catégorie</label><select id="vCat">' + cats + '</select>' +
      '<p style="margin-top:10px"><button class="btn" id="addVocab">' + (editVocabId ? '💾 Enregistrer les modifications' : 'Ajouter au vocabulaire') + '</button>' +
      ' <button class="btn small ghost" id="cancelEditVocab"' + (editVocabId ? '' : ' hidden') + '>✖️ Annuler</button></p></div>' +
      vocabList +

      '<h2>🎙️ Prononciations audio — votre voix (' + Object.keys(c.audio || {}).length + ')</h2>' +
      '<div class="card"><label for="aTarget">Mot ou lettre à prononcer</label><select id="aTarget">' +
      D.vocabulary.map((w) => '<option value="V:' + esc(w.id || w.latin) + '">mot : ' + esc(w.latin) + ' — ' + esc(w.fr) + '</option>').join("") +
      D.alphabet.map((L) => '<option value="L:' + esc(L.latin) + '">lettre : ' + esc(L.latin) + ' (' + esc(L.name) + ')</option>').join("") +
      '</select>' +
      '<p style="margin-top:10px"><button class="btn" id="recordAudioBtn">🎙️ Enregistrer ma voix</button> ' +
      '<button class="btn gold" id="saveAudio" disabled>💾 Sauvegarder la prononciation</button></p>' +
      '<audio id="audioPreview" controls hidden style="width:100%;margin-top:10px"></audio>' +
      '<p class="muted">Votre voix remplace la voix automatique pour ce mot dans « Lire » et « Parler ». Enregistrez 1 à 2 mots (15 s max). Réenregistrez pour corriger.</p></div>' +
      (Object.keys(c.audio || {}).map((k) =>
        '<div class="card list-item"><strong>🔊 ' + esc(audioLabel(k)) + '</strong>' +
        '<span class="meta"> enregistré le ' + esc((c.audio[k] || {}).date || "") + '</span>' +
        '<button class="btn small gold" data-play-audio="' + esc(k) + '" style="float:right">▶️</button>' +
        '<button class="btn small danger" data-del-audio="' + esc(k) + '" style="float:right">🗑️</button></div>').join("") ||
        '<p class="muted">Aucun audio enregistré. La voix de synthèse est utilisée en attendant.</p>') +

      '<h2>🏫 Séances de la salle de cours (' + D.sessions.length + ')</h2>' +
      '<div class="card"><label for="sTitle">Titre de la séance</label><input type="text" id="sTitle" placeholder="Lecture de phrases courtes">' +
      '<label for="sLevel">Niveau</label><select id="sLevel">' + levels + '</select>' +
      '<label for="sDuration">Durée</label><input type="text" id="sDuration" placeholder="45 min">' +
      '<label for="sObjectives">Objectifs (un par ligne)</label><textarea id="sObjectives" placeholder="Lire des phrases simples\nReconnaître les voyelles longues"></textarea>' +
      '<label for="sContent">Contenu de la leçon</label><textarea id="sContent" placeholder="Texte de la leçon…"></textarea>' +
      '<label for="sQuiz">Quiz associé</label><select id="sQuiz">' + quizOptions + '</select>' +
      '<p style="margin-top:10px"><button class="btn" id="addSession">' + (editSessionId ? '💾 Enregistrer les modifications' : 'Ajouter la séance') + '</button>' +
      ' <button class="btn small ghost" id="cancelEditSession"' + (editSessionId ? '' : ' hidden') + '>✖️ Annuler</button></p></div>' +
      sessionList +

      '<h2>📄 Cours en fichier (PDF / Word) (' + (c.courses || []).length + ') · total : ' +
      mo((c.courses || []).reduce((s, f) => s + (f.size || 0), 0)) + '</h2>' +
      '<div class="card"><label for="cTitle">Titre du cours</label><input type="text" id="cTitle" placeholder="Leçon 9 — Les consonnes spécifiques">' +
      '<label for="cFile">Fichier (PDF, Word, image, TXT ou HTML — 20 Mo max ; les images sont compressées automatiquement)</label>' +
      '<input type="file" id="cFile" accept=".pdf,.doc,.docx,.txt,.html,.jpg,.jpeg,.png,.webp">' +
      '<p style="margin-top:10px"><button class="btn" id="addCourseFile">📎 Ajouter le fichier comme cours</button></p>' +
      '<p class="muted">Le fichier est enregistré dans l\'application sur cet appareil (grande capacité) et partagé à la classe connectée. Les images sont compressées automatiquement ; PDF et Word sont gardés tels quels.</p></div>' +
      ((c.courses || []).map((f) =>
        '<div class="card list-item"><strong>' + esc(f.title) + '</strong>' +
        '<span class="meta"> 📎 ' + esc(f.fileName) + ' · ' + Math.max(1, Math.round(f.size / 1024)) + ' Ko · ' + esc(f.date) + '</span>' +
        '<span style="float:right"><button class="btn small gold" data-edit-course="' + esc(f.id) + '">✏️ Renommer</button> ' +
        '<button class="btn small danger" data-del-course="' + esc(f.id) + '">🗑️</button></span></div>').join("") ||
        '<p class="muted">Aucun cours en fichier.</p>') +

      '<h2>📤 Devoirs (' + D.homeworks.length + ')</h2>' +
      '<div class="card"><label for="hTitle">Titre du devoir</label><input type="text" id="hTitle" placeholder="Dictée de 10 mots">' +
      '<label for="hSession">Séance associée</label><select id="hSession">' + sessionOptions + '</select>' +
      '<label for="hDue">Échéance</label><input type="text" id="hDue" placeholder="Pour la séance 9">' +
      '<label for="hInstructions">Consignes</label><textarea id="hInstructions" placeholder="Ce que les apprenants doivent faire…"></textarea>' +
      '<label for="hCorrection">Correction (facultative — publiez-la plus tard via le bouton « Corriger »)</label>' +
      '<textarea id="hCorrection" placeholder="Réponse attendue, points de vigilance…"></textarea>' +
      '<p style="margin-top:10px"><button class="btn" id="addHomework">Ajouter le devoir</button></p></div>' +
      homeworkList +

      '<h2>☁️ Salle de cours connectée</h2>' +
      '<div class="card"><p class="muted">Envoyez vos contenus (vocabulaire, séances, cours en fichier, devoirs, corrections, audios) vers le serveur de la classe. Les apprenants les reçoivent avec « Recevoir » dans ⚙️ Paramètres. Leurs questions et leurs dépôts de devoirs arrivent automatiquement sur le serveur ; récupérez-les ici.</p>' +
      '<p style="margin-top:8px"><button class="btn gold" id="syncPush">⬆️ Envoyer mes contenus vers la classe</button> ' +
      '<button class="btn" id="syncPullAdmin">⬇️ Recevoir</button></p>' +
      syncStateText() + '</div>' +
      '<h2>💾 Sauvegarde des contenus</h2>' +
      '<div class="card"><p class="muted">Exportez vos contenus personnalisés en JSON (sauvegarde ou transfert vers un autre appareil), ou importez un fichier exporté.</p>' +
      '<p style="margin-top:8px"><button class="btn small" id="exportContent">⬇️ Exporter les contenus (JSON)</button> ' +
      '<button class="btn small ghost" id="clearContentBtn">🧹 Effacer les contenus ajoutés</button></p>' +
      '<label for="importArea">Import : collez ici le contenu JSON exporté</label>' +
      '<textarea id="importArea" placeholder="{ \"vocabulary\": … }"></textarea>' +
      '<p style="margin-top:8px"><button class="btn small gold" id="importContent">⬆️ Importer</button></p></div>'
    );
  };

  binders.admin = function () {
    const gate = $("#gateCode");
    if (gate) {
      const submit = () => {
        const res = applyAccessCode(gate.value);
        if (res === "empty") { alert("Entrez votre code."); return; }
        if (res === "bad") { alert("Code inconnu ou déjà utilisé. Demandez le code à l\'administrateur."); return; }
        nav();
      };
      $("#gateTeacher").addEventListener("click", submit);
      $("#gateAdmin").addEventListener("click", submit);
      return;
    }
    const mgmt = $("#saveAdminCode");
    if (mgmt) {
      mgmt.addEventListener("click", () => {
        const v = $("#newAdminCode").value.trim().toUpperCase();
        if (v.length < 4) { alert("Choisissez un code d'au moins 4 caractères."); return; }
        const a = Store.auth();
        a.adminCode = v;
        Store.saveAuth(a);
        alert("Code administrateur mis à jour. Gardez-le secret.");
        nav();
      });
      $("#genTeacherCode").addEventListener("click", () => {
        const a = Store.auth();
        const code = genCode();
        a.codes.push({ code, created: today() });
        Store.saveAuth(a);
        prompt("Nouveau code enseignant — copiez-le et donnez-le à l'enseignant :", code);
        nav();
      });
      $$('[data-del-code]').forEach((b) =>
        b.addEventListener("click", () => {
          if (!confirm("Révoquer ce code enseignant ?")) return;
          const a = Store.auth();
          a.codes = a.codes.filter((x) => x.code !== b.dataset.delCode);
          Store.saveAuth(a);
          nav();
        }));
    }
    if ($("#syncPush")) $("#syncPush").addEventListener("click", async () => {
        const btn = $("#syncPush");
        btn.disabled = true;
        btn.textContent = "⏳ Envoi…";
        const res = await Sync.push(["content", "questions", "submissions"]);
        if (!res.ok) {
          alert("Envoi impossible : " + (res.error === "config"
            ? "enregistrez d'abord l'adresse et la clé de classe dans ⚙️ Paramètres."
            : res.error));
          nav();
          return;
        }
        alert("Contenus envoyés vers la classe. Les apprenants les reçoivent avec « Recevoir ».");
        nav();
      });
      if ($("#syncPullAdmin")) $("#syncPullAdmin").addEventListener("click", async () => {
        const btn = $("#syncPullAdmin");
        btn.disabled = true;
        btn.textContent = "⏳…";
        const res = await Sync.pull();
        if (!res.ok) { alert("Récupération impossible : " + res.error); nav(); return; }
        const s = res.summary || {};
        alert("Reçu : " + (s.questions || 0) + " question(s), " + (s.submissions || 0) + " dépôt(s).");
        buildData();
        nav();
      });
    $("#addVocab").addEventListener("click", () => {
      const w = { aj: $("#vAj").value.trim(), latin: $("#vLatin").value.trim(),
                  fr: $("#vFr").value.trim(), cat: $("#vCat").value };
      if (!w.aj || !w.latin || !w.fr) { alert("Renseignez au moins l\'ajami, la transcription et la traduction."); return; }
      const c = Store.content();
      if (editVocabId) {
        const idx = c.vocabulary.findIndex((x) => (x.id || x.latin) === editVocabId);
        if (idx !== -1) c.vocabulary[idx] = Object.assign({}, c.vocabulary[idx], w);
        else c.vocabulary.push(Object.assign({ id: uid(), replaces: editVocabId }, w));
        editVocabId = null;
      } else {
        c.vocabulary.push(Object.assign({ id: uid() }, w));
      }
      persistContent(c);
    });
    const cancelVocab = $("#cancelEditVocab");
    if (cancelVocab) cancelVocab.addEventListener("click", () => {
      editVocabId = null;
      nav();
    });
    $$('[data-edit-vocab]').forEach((b) =>
      b.addEventListener("click", () => {
        const w = D.vocabulary.find((x) => (x.id || x.latin) === b.dataset.editVocab);
        if (!w) return;
        editSessionId = null;
        editVocabId = w.id || w.latin;
        $("#vAj").value = w.aj; $("#vLatin").value = w.latin;
        $("#vFr").value = w.fr; $("#vCat").value = w.cat || "Autre";
        const btn = $("#addVocab");
        if (btn) btn.textContent = "💾 Enregistrer les modifications";
        const cancel = $("#cancelEditVocab");
        if (cancel) cancel.hidden = false;
        if ($("#vAj").scrollIntoView) $("#vAj").scrollIntoView();
      }));
    $("#addSession").addEventListener("click", () => {
      const title = $("#sTitle").value.trim();
      const contentText = $("#sContent").value.trim();
      if (!title || !contentText) { alert("Renseignez au moins le titre et le contenu de la leçon."); return; }
      const fields = {
        title,
        level: $("#sLevel").value,
        duration: $("#sDuration").value.trim() || "45 min",
        objectives: $("#sObjectives").value.split("\n").map((x) => x.trim()).filter(Boolean),
        content: contentText,
        quiz: QUIZ_BANKS[$("#sQuiz").value] ? $("#sQuiz").value : "vocabulaire"
      };
      const c = Store.content();
      if (editSessionId) {
        const idx = c.sessions.findIndex((x) => x.id === editSessionId);
        if (idx !== -1) c.sessions[idx] = Object.assign({}, c.sessions[idx], fields);
        else c.sessions.push(Object.assign({ id: editSessionId }, fields));
        editSessionId = null;
      } else {
        c.sessions.push(Object.assign({ id: uid() }, fields));
      }
      persistContent(c);
    });
    const cancelSession = $("#cancelEditSession");
    if (cancelSession) cancelSession.addEventListener("click", () => {
      editSessionId = null;
      nav();
    });
    $$('[data-edit-session]').forEach((b) =>
      b.addEventListener("click", () => {
        const s = D.sessions.find((x) => x.id === b.dataset.editSession);
        if (!s) return;
        editVocabId = null;
        editSessionId = s.id;
        $("#sTitle").value = s.title;
        $("#sLevel").value = s.level || "Débutant";
        $("#sDuration").value = s.duration || "45 min";
        $("#sObjectives").value = (s.objectives || []).join("\n");
        $("#sContent").value = s.content || "";
        $("#sQuiz").value = QUIZ_BANKS[s.quiz] ? s.quiz : "vocabulaire";
        const btn = $("#addSession");
        if (btn) btn.textContent = "💾 Enregistrer les modifications";
        const cancel = $("#cancelEditSession");
        if (cancel) cancel.hidden = false;
        if ($("#sTitle").scrollIntoView) $("#sTitle").scrollIntoView();
      }));
    $$('[data-restore-session]').forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("Rétablir la séance d'origine (vos modifications seront perdues) ?")) return;
        const c = Store.content();
        c.sessions = c.sessions.filter((x) => x.id !== b.dataset.restoreSession);
        persistContent(c);
      }));
    $("#addHomework").addEventListener("click", () => {
      const title = $("#hTitle").value.trim();
      if (!title) { alert("Renseignez le titre du devoir."); return; }
      const h = {
        id: uid(), session: $("#hSession").value, title,
        due: $("#hDue").value.trim() || "Dès que possible",
        instructions: $("#hInstructions").value.trim() || "Voir les consignes en classe.",
        correction: { published: false, text: $("#hCorrection").value.trim() }
      };
      const c = Store.content();
      c.homeworks.push(h);
      persistContent(c);
    });
    $("#addCourseFile").addEventListener("click", async () => {
      const input = $("#cFile");
      const file = input.files && input.files[0];
      if (!file) { alert("Choisissez d'abord un fichier (PDF, Word ou image)."); return; }
      if (file.size > MAX_FILE) { alert("Fichier trop lourd (" + mo(file.size) + "). Limite : 20 Mo par fichier."); return; }
      const title = $("#cTitle").value.trim() || file.name.replace(/\.[^.]+$/, "");
      const src = await compressImage(file);
      if (src.size > MAX_FILE) { alert("Fichier trop lourd même après compression (" + mo(src.size) + "). Limite : 20 Mo par fichier."); return; }
      const reader = new FileReader();
      reader.onload = async () => {
        const c = Store.content();
        if (!c.courses) c.courses = [];
        c.courses.push({ id: uid(), title, fileName: src.name, type: src.type, size: src.size, date: today(), data: reader.result });
        await persistContent(c);
      };
      reader.readAsDataURL(src);
    });
    $$('[data-del-course]').forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("Supprimer ce fichier de cours ?")) return;
        const c = Store.content();
        c.courses = (c.courses || []).filter((x) => x.id !== b.dataset.delCourse);
        if (typeof Files !== "undefined" && Files.del) Files.del(b.dataset.delCourse);
        persistContent(c);
      }));
    $$('[data-edit-course]').forEach((b) =>
      b.addEventListener("click", () => {
        const c = Store.content();
        const f = (c.courses || []).find((x) => x.id === b.dataset.editCourse);
        if (!f) return;
        const t = prompt("Nouveau titre du cours :", f.title);
        if (t === null) return;
        const nt = t.trim();
        if (!nt) return;
        f.title = nt;
        persistContent(c);
      }));
    let recChunks = [], recRec = null, recData = null, recUrl = null;
    const rbtn = $("#recordAudioBtn"), sbtn = $("#saveAudio"), prev = $("#audioPreview");
    rbtn.addEventListener("click", async () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) { alert("L'enregistrement n'est pas disponible sur cet appareil."); return; }
      if (recRec && recRec.state === "recording") { recRec.stop(); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recChunks = [];
        recRec = new MediaRecorder(stream);
        recRec.ondataavailable = (e) => recChunks.push(e.data);
        recRec.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(recChunks, { type: "audio/webm" });
          if (blob.size > 300 * 1024) { alert("Enregistrement trop long (300 Ko max). Enregistrez plus court."); return; }
          const fr = new FileReader();
          fr.onload = () => {
            recData = fr.result;
            if (recUrl) URL.revokeObjectURL(recUrl);
            recUrl = URL.createObjectURL(blob);
            prev.src = recUrl;
            prev.hidden = false;
            sbtn.disabled = false;
            rbtn.textContent = "🎙️ Enregistrer à nouveau";
            rbtn.classList.remove("recording");
          };
          fr.readAsDataURL(blob);
        };
        recRec.start();
        rbtn.textContent = "⏹ Arrêter";
        rbtn.classList.add("recording");
      } catch { alert("Impossible d'accéder au micro. Vérifiez les autorisations."); }
    });
    sbtn.addEventListener("click", () => {
      if (!recData) { alert("Enregistrez d'abord votre voix."); return; }
      const c = Store.content();
      if (!c.audio) c.audio = {};
      c.audio[$("#aTarget").value] = { data: recData, date: today() };
      persistContent(c);
    });
    $$('[data-play-audio]').forEach((b) =>
      b.addEventListener("click", () => playAudioKey(b.dataset.playAudio)));
    $$('[data-del-audio]').forEach((b) =>
      b.addEventListener("click", () => {
        if (!confirm("Supprimer cet audio ?")) return;
        const c = Store.content();
        if (c.audio) { delete c.audio[b.dataset.delAudio]; persistContent(c); }
      }));
    $$('[data-del-vocab]').forEach((b) =>
      b.addEventListener("click", () => { if (confirm("Supprimer ce mot ?")) removeContentItem("vocabulary", b.dataset.delVocab); }));
    $$('[data-del-session]').forEach((b) =>
      b.addEventListener("click", () => { if (confirm("Supprimer cette séance ?")) removeContentItem("sessions", b.dataset.delSession); }));
    $$('[data-del-hw]').forEach((b) =>
      b.addEventListener("click", () => { if (confirm("Supprimer ce devoir ?")) removeContentItem("homeworks", b.dataset.delHw); }));
    $$('[data-corr]').forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.corr;
        const h = D.homeworks.find((x) => x.id === id);
        const current = h && h.correction ? h.correction.text : "";
        const text = prompt("Rédigez la correction (elle sera publiée pour les apprenants) :", current);
        if (text === null) return;
        const c = Store.content();
        c.corrections[id] = { published: true, text };
        persistContent(c);
      }));
    $("#exportContent").addEventListener("click", async () => {
      const full = (typeof Files !== "undefined" && Files.attach) ? await Files.attach(Store.content()) : Store.content();
      const blob = new Blob([JSON.stringify(full, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "contenu-pular-ajami.json";
      a.click();
    });
    $("#importContent").addEventListener("click", () => {
      try {
        const data = JSON.parse($("#importArea").value);
        if (typeof data !== "object" || data === null) throw new Error();
        persistContent(Object.assign(Store.content(), data));
      } catch {
        alert("JSON invalide.");
      }
    });
    $("#clearContentBtn").addEventListener("click", () => {
      if (!confirm("Effacer tous les contenus ajoutés (vocabulaire, séances, devoirs, corrections, fichiers) ?")) return;
      if (typeof Files !== "undefined" && Files.clear) Files.clear();
      persistContent({
        vocabulary: [], sessions: [], homeworks: [], courses: [], corrections: {},
        deletedVocab: [], deletedSessions: [], deletedHomeworks: [], audio: {}
      });
    });
  };

  /* ---------- Routing ---------- */
  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("seance-")) {
      main.innerHTML = routes["seance"](hash.replace("seance-", ""));
      $$(".sidebar a, .tabbar a").forEach((a) => a.classList.toggle("active", a.dataset.nav === "cours"));
      if (binders["seance"]) binders["seance"]();
      window.scrollTo(0, 0);
      return;
    }
    nav();
  }

  window.addEventListener("hashchange", route);

  $("#menuBtn").addEventListener("click", () => {
    $("#sidebar").classList.toggle("open");
    $("#backdrop").hidden = !$("#sidebar").classList.contains("open");
  });
  $("#backdrop").addEventListener("click", closeSidebar);

  /* Installation PWA */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $("#installBtn").hidden = false;
  });
  $("#installBtn").addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $("#installBtn").hidden = true;
  });

  if ("serviceWorker" in navigator) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  migrateCourseFiles();
  route();
})();
