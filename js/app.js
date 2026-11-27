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
      vocabulary: DATA.vocabulary.filter((w) => !c.deletedVocab.includes(w.latin)).concat(c.vocabulary),
      sessions: DATA.sessions.filter((s) => !c.deletedSessions.includes(s.id)).concat(c.sessions),
      homeworks: DATA.homeworks.filter((h) => !c.deletedHomeworks.includes(h.id))
        .map(applyCorrection)
        .concat(c.homeworks.map(applyCorrection))
    };
  }
  buildData();

  /* ---------- Navigation ---------- */
  const routes = {};
  const binders = {};

  function nav() {
    const hash = location.hash.replace(/^#\/?/, "") || "accueil";
    const view = routes[hash] ? hash : "accueil";
    $$(".sidebar a, .tabbar a").forEach((a) =>
      a.classList.toggle("active", a.dataset.nav === view));
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
      $("#hearLetter").addEventListener("click", () => speak("Lettre " + L.latin + ", exemple : " + L.ex.latin));
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
      '<button class="btn small gold" data-speak="' + esc(w.latin) + '">🔊 Écouter</button></div>').join("");
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
      b.addEventListener("click", () => speak(b.dataset.speak)));
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
    return (
      '<h1>🏫 Salle de cours</h1>' +
      '<p class="lead">Votre programme complet : ' + D.sessions.length + ' séances guidées, chacune avec objectifs, leçon, quiz et devoir associé.</p>' + sessions
    );
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
    const tMode = Store.trainerMode();
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
      '<p class="lead">Vos questions sont enregistrées sur cet appareil. <span class="muted">En mode formateur (voir Paramètres), vous pouvez y répondre localement ; pour une classe connectée, prévoir une synchronisation (voir README).</span></p>' +
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
        nav();
      });
    });
  };

  routes.devoirs = function () {
    const tMode = Store.trainerMode();
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
        nav();
      });
    });
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
    const tMode = Store.trainerMode();
    return (
      '<h1>⚙️ Paramètres</h1>' +
      '<div class="card">' +
      '<label for="setName">Votre nom d\'apprenant</label>' +
      '<input type="text" id="setName" value="' + esc(p.name) + '" placeholder="Ex : Mamadou B.">' +
      '<p style="margin-top:10px"><button class="btn" id="saveName">Enregistrer</button></p></div>' +
      '<div class="card"><h3>Mode formateur</h3>' +
      '<p class="muted">Permet de répondre aux questions et corriger les devoirs sur cet appareil.</p>' +
      '<p><button class="btn ' + (tMode ? "danger" : "gold") + '" id="toggleTrainer">' + (tMode ? "Désactiver le mode formateur" : "Activer le mode formateur") + "</button></p></div>" +
      '<div class="card"><h3>Réinitialiser</h3>' +
      '<p class="muted">Efface progression, questions et devoirs stockés sur cet appareil.</p>' +
      '<p><button class="btn danger" id="resetAll">Tout réinitialiser</button></p></div>' +
      '<div class="card"><h3>À propos</h3>' +
      "<p>Application PWA d'apprentissage du pular en écriture ajami harmonisée (JCMWA/MICCAO, Ngaoundéré 1998 — 33 lettres).</p>" +
      "<p class='muted'>Fonctionne hors ligne après la première visite. Installez-la depuis votre navigateur (menu → « Installer » / « Ajouter à l'écran d'accueil ») sur Android, iOS, Windows, macOS ou Linux.</p></div>"
    );
  };

  binders.parametres = function () {
    $("#saveName").addEventListener("click", () => {
      Store.set("profile", { name: $("#setName").value.trim(), joined: Store.profile().joined });
      nav();
    });
    $("#toggleTrainer").addEventListener("click", () => {
      Store.setTrainerMode(!Store.trainerMode());
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

  function persistContent(c) {
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
    if (!Store.trainerMode()) {
      return '<h1>🔐 Administration</h1>' +
        '<div class="notice">🛡️ Le mode formateur est désactivé. Activez-le pour administrer les contenus (vocabulaire, séances, devoirs, corrections).</div>' +
        '<button class="btn" id="adminEnable">Activer le mode formateur</button>';
    }
    const vocabList = D.vocabulary.map((w) =>
      '<div class="card list-item"><strong>' + aj(w.aj) + '</strong> — ' + esc(w.latin) +
      ' <span class="muted">(' + esc(w.fr) + ' · ' + esc(w.cat) + ')</span>' +
      '<button class="btn small danger" data-del-vocab="' + esc(w.id || w.latin) + '" style="float:right">🗑️</button></div>').join("") ||
      '<p class="muted">Aucun mot.</p>';
    const sessionList = D.sessions.map((s) =>
      '<div class="card list-item"><strong>' + esc(s.title) + '</strong> <span class="badge">' + esc(s.level) + '</span>' +
      '<span class="meta"> ⏱ ' + esc(s.duration) + (c.sessions.some((x) => x.id === s.id) ? ' · <span class="badge gold">ajoutée par vous</span>' : '') + '</span>' +
      '<button class="btn small danger" data-del-session="' + esc(s.id) + '" style="float:right">🗑️</button></div>').join("");
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

      '<h2>➕ Vocabulaire (' + D.vocabulary.length + ')</h2>' +
      '<div class="card"><label for="vAj">Mot en ajami (écrit de droite à gauche)</label>' +
      '<input type="text" id="vAj" lang="ar" dir="rtl" placeholder="جَمْ" style="text-align:right;font-size:1.4rem">' +
      '<label for="vLatin">Transcription latine</label><input type="text" id="vLatin" placeholder="jam">' +
      '<label for="vFr">Traduction française</label><input type="text" id="vFr" placeholder="la paix / ça va">' +
      '<label for="vCat">Catégorie</label><select id="vCat">' + cats + '</select>' +
      '<p style="margin-top:10px"><button class="btn" id="addVocab">Ajouter au vocabulaire</button></p></div>' +
      vocabList +

      '<h2>🏫 Séances de la salle de cours (' + D.sessions.length + ')</h2>' +
      '<div class="card"><label for="sTitle">Titre de la séance</label><input type="text" id="sTitle" placeholder="Lecture de phrases courtes">' +
      '<label for="sLevel">Niveau</label><select id="sLevel">' + levels + '</select>' +
      '<label for="sDuration">Durée</label><input type="text" id="sDuration" placeholder="45 min">' +
      '<label for="sObjectives">Objectifs (un par ligne)</label><textarea id="sObjectives" placeholder="Lire des phrases simples\nReconnaître les voyelles longues"></textarea>' +
      '<label for="sContent">Contenu de la leçon</label><textarea id="sContent" placeholder="Texte de la leçon…"></textarea>' +
      '<label for="sQuiz">Quiz associé</label><select id="sQuiz">' + quizOptions + '</select>' +
      '<p style="margin-top:10px"><button class="btn" id="addSession">Ajouter la séance</button></p></div>' +
      sessionList +

      '<h2>📤 Devoirs (' + D.homeworks.length + ')</h2>' +
      '<div class="card"><label for="hTitle">Titre du devoir</label><input type="text" id="hTitle" placeholder="Dictée de 10 mots">' +
      '<label for="hSession">Séance associée</label><select id="hSession">' + sessionOptions + '</select>' +
      '<label for="hDue">Échéance</label><input type="text" id="hDue" placeholder="Pour la séance 9">' +
      '<label for="hInstructions">Consignes</label><textarea id="hInstructions" placeholder="Ce que les apprenants doivent faire…"></textarea>' +
      '<label for="hCorrection">Correction (facultative — publiez-la plus tard via le bouton « Corriger »)</label>' +
      '<textarea id="hCorrection" placeholder="Réponse attendue, points de vigilance…"></textarea>' +
      '<p style="margin-top:10px"><button class="btn" id="addHomework">Ajouter le devoir</button></p></div>' +
      homeworkList +

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
    const enable = $("#adminEnable");
    if (enable) {
      enable.addEventListener("click", () => {
        Store.setTrainerMode(true);
        nav();
      });
      return;
    }
    $("#addVocab").addEventListener("click", () => {
      const w = { id: uid(), aj: $("#vAj").value.trim(), latin: $("#vLatin").value.trim(),
                  fr: $("#vFr").value.trim(), cat: $("#vCat").value };
      if (!w.aj || !w.latin || !w.fr) { alert("Renseignez au moins l\'ajami, la transcription et la traduction."); return; }
      const c = Store.content();
      c.vocabulary.push(w);
      persistContent(c);
    });
    $("#addSession").addEventListener("click", () => {
      const title = $("#sTitle").value.trim();
      const contentText = $("#sContent").value.trim();
      if (!title || !contentText) { alert("Renseignez au moins le titre et le contenu de la leçon."); return; }
      const s = {
        id: uid(), title,
        level: $("#sLevel").value,
        duration: $("#sDuration").value.trim() || "45 min",
        objectives: $("#sObjectives").value.split("\n").map((x) => x.trim()).filter(Boolean),
        content: contentText,
        quiz: $("#sQuiz").value
      };
      const c = Store.content();
      c.sessions.push(s);
      persistContent(c);
    });
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
    $("#exportContent").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(Store.content(), null, 2)], { type: "application/json" });
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
      if (!confirm("Effacer tous les contenus ajoutés (vocabulaire, séances, devoirs, corrections) ?")) return;
      persistContent({
        vocabulary: [], sessions: [], homeworks: [], corrections: {},
        deletedVocab: [], deletedSessions: [], deletedHomeworks: []
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

  route();
})();
