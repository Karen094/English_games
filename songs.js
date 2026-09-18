/* ============================================================
   🎵 SONGS — THE ONLY FILE YOU NEED TO EDIT
   ============================================================

   To add a quiz, copy one of the song entries below, paste your
   lyrics, and put square brackets around the words that students
   must fill in:

       "Well [hello] and [goodbye]"

   Fields:
     id        - unique short name, no spaces (e.g. "hello")
     title     - song title (shown to students)
     artist    - artist name (shown to students)
     level     - CEFR level: "A1", "A2", "B1", "B2", "C1"
     wordBank  - true  = show tappable word bank under the lyrics
                 false = students must type every word
     lines     - the song, one string per line; missing words in [ ]

   Full guide: README.md
   ============================================================ */

window.SONGS = [
  {
    id: "twinkle-twinkle-little-star",
    title: "Twinkle, Twinkle, Little Star",
    artist: "Traditional",
    level: "A1",
    wordBank: true,
    lines: [
      "[Twinkle], [twinkle], little [star],",
      "How I [wonder] what you [are].",
      "Up [above] the [world] so [high],",
      "Like a [diamond] in the [sky].",
      "Twinkle, twinkle, little star,",
      "How I [wonder] what you [are].",
      "When the [blazing] sun is [gone],",
      "When he nothing shines upon,",
      "Then you show your little [light],",
      "[Twinkle], [twinkle] through the [night]."
    ]
  },

  {
    id: "mary-had-a-little-lamb",
    title: "Mary Had a Little Lamb",
    artist: "Traditional",
    level: "A1",
    wordBank: false,
    lines: [
      "[Mary] had a little [lamb],",
      "Little [lamb], little lamb,",
      "Mary had a little [lamb],",
      "Whose [fleece] was white as [snow].",
      "And [everywhere] that Mary [went],",
      "The [lamb] was sure to [go]"
    ]
  },

    {
      id: "Somewhere over the rainbow",
      title: "Somewhere over the rainbow",
      artist: "Israel Kamakawiwi'ole",
      level: "B1",
      wordBank: true,
      lines: [
          "Somewhere over the [rainbow]",
        "Way up high",
        "And the [dreams] that you dream of",
        "Once in a [lullaby], oh",
        "Somewhere over the rainbow",
        "[Bluebirds] fly",
        "And the dreams that you dream of",
        "Dreams really do come true-ooh-ooh",
        "Someday I'll wish upon a [star]",
        "Wake up where the [clouds] are far behind me",
        "Where trouble melts like [lemon] drops",
        "High above the [chimney] tops that's where",
        "You'll find me, oh",
        "Somewhere over the rainbow",
        "Bluebirds fly",
        "And the dream that you [dare] to",
        "Oh why, oh why can't I? I",
        "[Someday] I'll wish upon a star",
        "Wake up where the clouds are far behind me",
        "Where [trouble] melts like lemon drops",
        "High above the chimney top that's where you'll find me",
        "Oh, somewhere over the rainbow way up [high]",
        "And the dream that you dare to",
        "Why, oh why can't I? I"
      ]
    }
];
