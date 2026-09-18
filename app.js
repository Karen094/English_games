/* ============================================================
   English Song Quiz — app logic
   ------------------------------------------------------------
   Pure JavaScript: no build step, no dependencies.
   To add songs, edit songs.js — NOT this file.
   Full guide: README.md
   ============================================================ */
(function () {
  "use strict";

  var SONGS = window.SONGS || [];
  var PARSED = SONGS.map(parseSong);

  /* ---------------- pure helpers ---------------- */

  // Compare answers: trim, ignore case, ignore accents, squeeze spaces.
  function normalize(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  // Split a lyric line into segments:
  //   { type: "text", text }     — normal words
  //   { type: "blank", answer }  — a word in [ ] the student must fill
  function parseLine(line) {
    var segments = [];
    var parts = String(line).split(/(\[[^\]]*\])/g);
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part === "") continue;
      if (part.length > 2 && part.charAt(0) === "[" && part.charAt(part.length - 1) === "]") {
        var answer = part.slice(1, -1);
        if (normalize(answer)) {
          segments.push({ type: "blank", answer: answer });
          continue;
        }
      }
      segments.push({ type: "text", text: part });
    }
    return segments;
  }

  function parseSong(song) {
    var lines = (song.lines || []).map(parseLine);
    var totalBlanks = 0;
    lines.forEach(function (line) {
      line.forEach(function (seg) {
        if (seg.type === "blank") totalBlanks++;
      });
    });
    return {
      id: song.id,
      title: song.title,
      artist: song.artist || "",
      level: song.level || "",
      wordBank: !!song.wordBank,
      lines: lines,
      totalBlanks: totalBlanks
    };
  }

  /* ---------------- per-phone best scores (localStorage) ---------------- */

  function getBest(id) {
    try {
      var raw = localStorage.getItem("songQuizBest." + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveBest(id, correct, total) {
    try {
      var prev = getBest(id);
      if (!prev || correct > prev.correct) {
        localStorage.setItem("songQuizBest." + id, JSON.stringify({ correct: correct, total: total }));
      }
    } catch (e) {
      /* storage unavailable (e.g. private mode) — ignore */
    }
  }

  /* ---------------- tiny DOM helpers ---------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function appRoot() {
    return document.getElementById("app");
  }

  function allBlanks() {
    return Array.prototype.slice.call(document.querySelectorAll("input.blank"));
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /* ---------------- home view (song list) ---------------- */

  function renderHome() {
    window.scrollTo(0, 0);
    var app = appRoot();
    app.innerHTML = "";
    app.style.paddingBottom = "";

    var header = el("header", "screen-header");
    header.appendChild(el("h1", "app-title", "🎵 Song Word Quiz"));
    header.appendChild(el("p", "subtitle", "Tap a song and fill in the missing words."));
    app.appendChild(header);

    if (PARSED.length === 0) {
      app.appendChild(el("p", "empty", "No songs found. Add songs to songs.js, then refresh the page."));
      return;
    }

    var list = el("ul", "song-list");
    PARSED.forEach(function (song, index) {
      var card = el("button", "song-card");
      card.appendChild(el("h2", "card-title", song.title));
      if (song.artist) card.appendChild(el("p", "card-artist", song.artist));
      var meta = el("div", "card-meta");
      if (song.level) meta.appendChild(el("span", "badge", song.level));
      meta.appendChild(el("span", "badge", song.totalBlanks + " missing words"));
      var best = getBest(song.id);
      if (best) meta.appendChild(el("span", "badge best", "Best: " + best.correct + "/" + best.total));
      card.appendChild(meta);
      card.addEventListener("click", function () {
        renderQuiz(index);
      });
      list.appendChild(card);
    });
    app.appendChild(list);
  }

  /* ---------------- quiz view ---------------- */

  var quizState = { songIndex: 0, checked: false };

  function renderQuiz(songIndex) {
    quizState.songIndex = songIndex;
    quizState.checked = false;
    var song = PARSED[songIndex];
    var app = appRoot();
    app.innerHTML = "";
    window.scrollTo(0, 0);

    var topbar = el("nav", "topbar");
    var back = el("button", "back-btn", "← All songs");
    back.addEventListener("click", renderHome);
    topbar.appendChild(back);
    app.appendChild(topbar);

    var header = el("header", "song-header");
    header.appendChild(el("h1", "song-title", song.title));
    if (song.artist) header.appendChild(el("p", "song-artist", song.artist));
    var badges = el("div", "badges");
    if (song.level) badges.appendChild(el("span", "badge", song.level));
    badges.appendChild(el("span", "badge", song.totalBlanks + " missing words"));
    header.appendChild(badges);
    app.appendChild(header);

    var banner = el("div", "score-banner hidden");
    banner.id = "scoreBanner";
    app.appendChild(banner);

    var lyrics = el("div", "lyrics");
    var blankCount = 0;
    song.lines.forEach(function (segments) {
      var line = el("p", "line");
      segments.forEach(function (seg) {
        if (seg.type === "text") {
          line.appendChild(document.createTextNode(seg.text));
          return;
        }
        blankCount++;
        line.appendChild(createBlank(seg.answer, blankCount, song.totalBlanks));
      });
      lyrics.appendChild(line);
    });
    app.appendChild(lyrics);

    var stack = el("div", "bottom-stack");
    stack.id = "bottomStack";
    if (song.wordBank && song.totalBlanks > 0) {
      stack.appendChild(createWordBank(song));
    }

    var bar = el("div", "bottom-bar");
    var progress = el("span", "progress");
    progress.id = "progress";
    bar.appendChild(progress);
    var reset = el("button", "btn ghost", "Reset");
    reset.addEventListener("click", resetQuiz);
    var check = el("button", "btn primary", "Check answers");
    check.addEventListener("click", checkAnswers);
    bar.appendChild(reset);
    bar.appendChild(check);
    stack.appendChild(bar);
    app.appendChild(stack);

    updateProgress();
    updateStackPadding();
  }

  function createBlank(answer, index, total) {
    var wrap = el("span", "blank-wrap");

    var input = document.createElement("input");
    input.type = "text";
    input.className = "blank";
    input.dataset.answer = answer;
    input.placeholder = "•";
    input.autocomplete = "off";
    input.autocapitalize = "off";
    input.autocorrect = "off";
    input.spellcheck = false;
    input.style.width = Math.max(4, Math.min(answer.length + 2, 26)) + "ch";
    input.setAttribute("aria-label", "Missing word " + index + " of " + total);

    var hint = el("span", "hint", answer);
    hint.setAttribute("aria-hidden", "true");

    input.addEventListener("input", function () {
      updateProgress();
      if (quizState.checked) {
        gradeInput(input);
        refreshBanner();
      }
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        var blanks = allBlanks();
        var next = blanks[blanks.indexOf(input) + 1];
        if (next) next.focus();
      }
    });

    wrap.appendChild(input);
    wrap.appendChild(hint);
    return wrap;
  }

  function createWordBank(song) {
    var panel = el("section", "word-bank");

    var head = el("div", "bank-head");
    head.appendChild(el("h2", "bank-title", "Word bank — tap a word to fill a gap"));
    var toggle = el("button", "bank-toggle", "▾");
    head.appendChild(toggle);
    panel.appendChild(head);

    var chips = el("div", "chips");
    panel.appendChild(chips);

    head.addEventListener("click", function () {
      var collapsed = panel.classList.toggle("collapsed");
      toggle.textContent = collapsed ? "▴" : "▾";
      updateStackPadding();
    });

    var seen = {};
    var words = [];
    song.lines.forEach(function (segments) {
      segments.forEach(function (seg) {
        if (seg.type === "blank") {
          var key = seg.answer.toLowerCase();
          if (!seen[key]) {
            seen[key] = true;
            words.push(seg.answer);
          }
        }
      });
    });

    shuffle(words).forEach(function (word) {
      var chip = el("button", "chip", word);
      chip.addEventListener("click", function () {
        var blanks = allBlanks();
        if (blanks.length === 0) return;
        var target = null;
        var focused = document.activeElement;
        if (focused && focused.classList && focused.classList.contains("blank")) {
          target = focused;
        } else {
          for (var i = 0; i < blanks.length; i++) {
            if (blanks[i].value.trim() === "") {
              target = blanks[i];
              break;
            }
          }
          if (!target) target = blanks[0];
        }
        target.value = word;
        // Deliberately no focus() here: tapping a word must not pop the keyboard.
        updateProgress();
        if (quizState.checked) {
          gradeInput(target);
          refreshBanner();
        }
        revealIfHidden(target);
      });
      chips.appendChild(chip);
    });

    return panel;
  }

  /* ---------------- checking & scoring ---------------- */

  function gradeInput(input) {
    var isCorrect = normalize(input.value) === normalize(input.dataset.answer);
    input.classList.toggle("correct", isCorrect);
    input.classList.toggle("incorrect", !isCorrect);
  }

  function countCorrect() {
    return allBlanks().filter(function (i) {
      return i.classList.contains("correct");
    }).length;
  }

  function checkAnswers() {
    quizState.checked = true;
    allBlanks().forEach(function (input) {
      gradeInput(input);
    });
    refreshBanner();
    var song = PARSED[quizState.songIndex];
    saveBest(song.id, countCorrect(), allBlanks().length);
  }

  function refreshBanner() {
    if (!quizState.checked) return;
    showBanner(countCorrect(), allBlanks().length);
  }

  function showBanner(correct, total) {
    var banner = document.getElementById("scoreBanner");
    if (!banner) return;
    banner.classList.remove("hidden");
    var perfect = total > 0 && correct === total;
    banner.classList.toggle("good", perfect);
    banner.classList.toggle("ok", !perfect);
    var msg;
    if (total === 0) {
      msg = "This song has no blanks to fill.";
    } else if (perfect) {
      msg = "🎉 Perfect! All " + total + " words correct!";
    } else if (correct >= total * 0.7) {
      msg = "👍 Great job! " + correct + " of " + total + " correct.";
    } else {
      msg = correct + " of " + total + " correct. Fix the red words and check again!";
    }
    banner.textContent = msg;
  }

  function resetQuiz() {
    quizState.checked = false;
    allBlanks().forEach(function (input) {
      input.value = "";
      input.classList.remove("correct", "incorrect");
    });
    var banner = document.getElementById("scoreBanner");
    if (banner) banner.classList.add("hidden");
    updateProgress();
  }

  function updateProgress() {
    var progress = document.getElementById("progress");
    if (!progress) return;
    var blanks = allBlanks();
    var filled = blanks.filter(function (i) {
      return i.value.trim() !== "";
    }).length;
    progress.textContent = filled + " / " + blanks.length + " filled";
  }

  /* ---------------- fixed bottom stack helpers ---------------- */

  // How many px the fixed stack is lifted right now (the phone keyboard).
  var kbOffset = 0;

  // Keep the lyrics clear of the fixed word bank + action bar.
  function updateStackPadding() {
    var stack = document.getElementById("bottomStack");
    if (!stack) return;
    var app = appRoot();
    var h = stack.offsetHeight;
    if (typeof h === "number") {
      app.style.paddingBottom = (h + 12) + "px";
    }
  }

  // On phones the soft keyboard covers the bottom of the screen. While it is
  // open, lift the fixed stack above it so the word bank stays tappable.
  function adjustStackForKeyboard() {
    var vv = window.visualViewport;
    if (!vv || typeof vv.addEventListener !== "function") return;
    var adjust = function () {
      var stack = document.getElementById("bottomStack");
      if (!stack) return;
      var hidden = (window.innerHeight || 0) - vv.height - vv.offsetTop;
      kbOffset = hidden > 0 ? hidden : 0;
      stack.style.bottom = kbOffset > 0 ? kbOffset + "px" : "0px";
    };
    vv.addEventListener("resize", adjust);
    vv.addEventListener("scroll", adjust);
  }

  // If a chip fills a gap that is currently out of view, bring it into view.
  function revealIfHidden(input) {
    try {
      var rect = input.getBoundingClientRect();
      var stack = document.getElementById("bottomStack");
      var chrome = stack && typeof stack.offsetHeight === "number" ? stack.offsetHeight : 80;
      var bottomSafe = (window.innerHeight || 800) - kbOffset - chrome;
      if (rect.top < 0 || rect.bottom > bottomSafe) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (e) {
      /* very old browser — ignore */
    }
  }

  /* ---------------- init ---------------- */

  // Exposed only for automated tests; harmless in the browser.
  window.__songQuiz = {
    parseLine: parseLine,
    parseSong: parseSong,
    normalize: normalize
  };

  function init() {
    window.addEventListener("resize", updateStackPadding);
    adjustStackForKeyboard();
    // Direct link support: ?song=<id> opens that song straight away.
    var search = (typeof window.location !== "undefined" && window.location && window.location.search) || "";
    var match = /[?&]song=([^&]+)/.exec(search);
    if (match) {
      var wanted = decodeURIComponent(match[1]);
      var idx = -1;
      for (var i = 0; i < PARSED.length; i++) {
        if (PARSED[i].id === wanted) { idx = i; break; }
      }
      if (idx >= 0) {
        renderQuiz(idx);
        return;
      }
    }
    renderHome();
  }

  if (typeof document !== "undefined" && document.getElementById) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
