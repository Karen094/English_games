# 🎵 English Song Quiz — a web app for ESL students

A small, mobile-friendly web quiz for English as a Second Language (ESL) students.
It shows the text of a song with some words missing; students open it on their
phones, type (or tap) the missing words into the gaps, and check their answers.

- **No app to install** — students open a link in their phone browser.
- **No accounts, no data collection** — best scores are stored only on the student's own phone.
- **Free to host** — it runs on GitHub Pages, GitHub's free static-website hosting.
- **One file to edit** — every song lives in `songs.js`. That is the only file
  you will ever need to change to add or update a quiz.

---

## 1. What the student sees

1. **Song list** — one card per song: title, artist, CEFR level (A1, B1, …),
   the number of missing words, and the student's best score on *that phone*.
2. **The quiz** — the song text with dashed boxes where words are missing.
   - Tap a box → type the word with the phone keyboard.
   - Press **Enter** to jump to the next box.
   - Songs with a **word bank** (set `wordBank: true`) show the missing words
     as tappable pills below the lyrics — tapping a pill fills the active box,
     so weaker students don't have to spell everything themselves.
3. **Check answers** — correct words turn **green**, wrong ones turn **red**
   and the correct word is printed underneath. A score banner appears at the
   top (🎉 *Perfect!* when everything is right). The student can fix mistakes
   and press *Check answers* again — the score updates live.
   **Reset** clears the whole song to start over.

A small progress counter ("7 / 18 filled") sits in the bottom bar.

## 2. How it is built (no programming needed)

The whole app is plain HTML + CSS + JavaScript — no framework, no build step,
no server, no dependencies. The files:

```
English_quizzes/
├── index.html    ← page skeleton; loads the other files
├── styles.css    ← colours, sizes, mobile layout (colours in :root at the top)
├── app.js        ← the quiz engine: gaps, checking, word bank, scores
├── songs.js      ← ★ ALL THE SONGS — the only file you edit
├── 404.html      ← friendly “page not found” page
├── serve.js      ← tiny local dev server (used by “npm run dev”)
├── package.json  ← declares the “dev” script (no dependencies, no install)
├── .nojekyll     ← tells GitHub Pages to serve the site as-is
└── README.md     ← this guide
```

**How the quiz engine works, in one paragraph:** when the page loads, `app.js`
reads the song list from `songs.js`. For every lyric line it looks for words
inside square brackets `[...]` and turns each one into a dashed input box
(ordinary words are shown as normal text). When the student presses
*Check answers*, the app compares what they typed with the bracketed word —
ignoring upper/lower case, extra spaces and accents — and colours the box
green or red. The best score per song is kept in the phone's own storage
(`localStorage`), so it reappears the next time the same phone opens the site.

## 3. Adding a song (the only editing you will ever do)

Open **`songs.js`**. Every song is one `{ ... }` entry in the list. To add a
song, copy the ready-made example block at the bottom of the file and fill it in:

```js
{
  id: "hello",              // unique, lowercase, no spaces
  title: "Hello",           // what the students see
  artist: "Lionel Richie",
  level: "B1",              // A1, A2, B1, B2, C1 …
  wordBank: true,           // true = tappable word bank, false = typing only
  lines: [
    "Well [hello] and [goodbye]",
    "I think I will [miss] this time",
    "[Hello] it's me",
    "I was [wondering] where the time went"
  ]
}
```

In `lines` there is **one string per line of the song**, and words the student
must fill in go inside square brackets: `[word]`.

### Bracket rules

| You write in `songs.js` | The student sees |
|---|---|
| `Well [hello] and [goodbye]` | Well `[box]` and `[box]` — two gaps |
| `Up [above the world] so high` | one wider gap for the whole phrase |
| `[goodbye],` | a gap, then the comma stays visible |
| `Twinkle, twinkle` | plain text, no gap |
| `[]` or `[ ]` | treated as plain text (no gap) — check your brackets! |

### Checklist before you commit

- [ ] `id` is unique across the whole file (it is used to store best scores).
- [ ] Every `[` has a matching `]`.
- [ ] The entry **above** your new one ends with a comma: `},`
- [ ] Each lyric line is one string ending with `",`

### Teacher tips

- **A1:** 5–8 very common words, `wordBank: true`.
- **A2 / B1:** 8–15 words, word bank optional.
- **B1+:** 15+ words, `wordBank: false` — full spelling practice.
- Keep songs short: one or two verses (6–12 lines) fit a phone screen nicely.
- The order of entries in `songs.js` is the order on the screen.
- To **remove** a song, delete its whole `{ ... }` entry.
- Note: the two demo songs are traditional public-domain nursery rhymes so you
  can see both modes (word bank on/off). Replace them with your own songs —
  for classroom use of commercial songs, keep your use to the teaching context
  your school allows.

## 4. Publishing on GitHub Pages (one-time, ~10 minutes)

1. **Create a repository**
   - Go to [github.com/new](https://github.com/new) while logged in.
   - Repository name: e.g. `english-song-quiz` (lowercase, dashes are fine).
   - Choose **Public** so students can open the link without a GitHub account.
2. **Upload the files**
   - In the new repo click **Add file → Upload files**.
   - Drag in **every file from this folder**: `index.html`, `styles.css`,
     `app.js`, `songs.js`, `404.html` and `.nojekyll`.
   - ⚠️ `.nojekyll` starts with a dot, so phones and Windows often hide it —
     enable “show hidden files” to find it. (If you truly can't upload it,
     the site still works; it only stops GitHub from ignoring some folders.)
   - Press **Commit changes**.
3. **Enable GitHub Pages**
   - In the repo: **Settings → Pages** (left menu).
   - *Build and deployment* → *Source*: **Deploy from a branch**.
   - Branch: **main**, folder: **/ (root)** → **Save**.
4. **Wait 1–3 minutes** — your quiz is then live at:

   ```
   https://YOUR-USERNAME.github.io/english-song-quiz/
   ```

   (your GitHub username + your repository name). Test it on your phone, then
   share the link with your students — a QR code on the classroom board works
   great.

**Direct link to one song** (optional): add `?song=` + the song's `id`, e.g.
`https://YOUR-USERNAME.github.io/english-song-quiz/?song=hello` — handy when
you only want students to do one song.

### Updating the quiz later

1. In the repo, open **`songs.js`**, click the ✏️ pencil icon
   (or edit the file on your computer and push).
2. Make your changes → **Commit changes**.
3. GitHub Pages refreshes within about a minute; students just refresh their
   browser. No other file ever needs to change.

### Updating from your computer (recommended — one command)

Your local `English_quizzes` folder is a git clone of the repository, so
after any change (e.g. adding a song in `songs.js`) just run:

```bash
npm run push
```

It stages your changes, commits them and pushes to GitHub — the live site
then refreshes within about a minute. If you *also* edited the repository on
the web in the meantime, run this instead so the web changes are pulled
first:

```bash
npm run sync
```

Under the hood, `npm run push` is simply:
`git add -A && git commit -m "Update quiz" && git push`.

## 5. Trying it on your own computer (optional)

**Option A — dev server (recommended):**

```bash
npm run dev
```

Then open **http://localhost:3000/** in your browser (a phone on the same
Wi-Fi can open `http://YOUR-PC-ADDRESS:3000/`). No `npm install` is needed —
the server is a tiny built-in script with zero dependencies. After editing
`songs.js` just **refresh the browser** (there is no build step). Stop with
Ctrl+C. A different port: `npm run dev -- 8080`.

**Option B — no tools at all:** double-click `index.html` — the quiz opens in
your browser and works fully offline.

## 6. Troubleshooting

| Symptom | Cause & fix |
|---|---|
| GitHub shows a 404 after enabling Pages | Pages takes 1–3 minutes; check **Settings → Pages** says “Your site is live at…”, and that you selected branch **main**, folder **/ (root)**. |
| A gap shows the brackets as plain text | A bracket pair is incomplete, e.g. `[word` or `word]`. Every gap needs both `[` and `]`. |
| No songs appear at all | A syntax error in `songs.js` — usually a missing comma or `}` between two songs. Check the entry just above the new one. |
| Page looks unchanged after editing | GitHub Pages lag (up to ~1 min) or phone cache — close the tab and reopen it, or pull to refresh. |
| A student's best score disappeared | They changed browser / cleared data, or you changed the song's `id` (scores are keyed by `id`). |
| I want a different look | Tweak `styles.css` — the main colours are in the `:root` block at the top. |

## 7. Privacy note

The app has no backend: GitHub Pages only serves these static files. No names,
answers or scores are ever uploaded anywhere — the only data kept is each
song's best score, stored locally in the student's own browser.
