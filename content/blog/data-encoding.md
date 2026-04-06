---
title: "Data Encoding — TryHackMe Pre Security Path"
date: 2026-03-28
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Data Encoding room - Learn how computer encodes characters, from ASCII to Unicode's UTF."
image: "/images/blog/43.png"
readtime: "15 min read"
draft: false
---

# Data Encoding

So the last room was all about how numbers are stored in binary, how hex works, and how colors are just three numbers hanging out together. Cool stuff. But then this room asks the obvious next question: okay but what about letters? What about punctuation? What about the crying laughing emoji you send every time something mildly inconveniences you?

Turns out characters are just numbers too. There is just an agreement somewhere that says "this number means this letter." That agreement is called an encoding. And when two systems use different agreements? You get gibberish. You have definitely seen this before, you open a file and instead of normal text you get something like `Ø±Ø³Ø§Ù„Ø©`. Yeah. That is what happens.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — ASCII](#task-2)
- [Task 3 — Unicode](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The room starts by connecting things back to the previous one. Everything in a computer is stored as bits and numbers. We covered that. But now the question is: how do those numbers turn into the text you are reading right now?

The answer is encoding. Encoding is just a mapping. A dictionary that says number 65 means the letter A, number 66 means B, and so on. As long as the person saving the file and the person opening the file are using the same dictionary, everything looks fine. When they are not using the same one, you get the gibberish situation.

The room also makes a small distinction that is actually useful. Representation is about how data lives as bits in memory. Encoding is the specific agreement about what those bits mean. Both matter, they are just different layers of the same idea.

By the end of this room you will understand ASCII, Unicode, UTF-8, UTF-16, UTF-32, how emoji fits into all of this, and why files sometimes explode into nonsense characters.

---

## Task 2 — ASCII {#task-2}

**The original agreement**

So computers only understand 0 and 1. Fine. But how do you get from that to saving the word "TryHackMe" in a file?

Someone has to decide. If we all agree that `01010100` means the letter T, then every computer stores T the same way, and every computer reading that value knows it is a T. Do that for every letter, digit, and punctuation mark and you have yourself an encoding standard.

That standard, at least for English, was ASCII. American Standard Code for Information Interchange. The American part is important, keep that in mind because it comes up later.

ASCII was created in 1963 and it uses numbers from 0 to 127 to represent English letters, digits, punctuation, and some control characters. That is 7 bits worth of values, so the original ASCII is a 7-bit standard.

**What the ASCII table looks like**

The table maps every character to a decimal number, a hex number, and a binary number. A few things to notice:

Letters are in order. If you know that `a` is hex `61`, then `b` is `62`, `c` is `63`, and so on. Same goes for uppercase letters A through Z and digits 0 through 9. This makes it easy to do math with characters, which comes in handy sometimes.

Every character has its own code. The opening bracket `[` is hex `5B`. The backslash `\` is hex `5C`. Even the delete key has a code, decimal 127, hex `7F`.

**"TryHackMe" in actual bits**

Say you open a text file, type "TryHackMe", and hit save. What does that file actually look like at the bit level?

`01010100 01110010 01111001 01001000 01100001 01100011 01101011 01001101 01100101 00001010`

That last chunk `00001010` is a newline, the `\n` you get when you press Enter. Your text editor reads all those bits and shows you `T r y H a c k M e` followed by a new line. Nobody would want to read raw binary though, so in hex it looks like this: `54 72 79 48 61 63 6b 4d 65 0a`. Much easier to look at.

**The problem with ASCII**

Here is where things start getting annoying. ASCII only covers English. It was literally called American Standard Code. So what happens when you want to type something in Spanish, German, Polish, or Romanian?

People tried to fix this by using the eighth bit that ASCII left unused. With 8 bits you get 256 values instead of 128, so there are 128 extra slots available. The ISO/IEC 8859 series tried to fill those slots with extra characters:

ISO-8859-1 covered Western European languages like German, French, Spanish, Italian, and the Nordic languages. ISO-8859-2 covered Central and Eastern European languages like Polish, Czech, Hungarian, and Romanian.

Sounds fine on paper. But here is the problem. If someone saves a file using ISO-8859-1 and you open it using ISO-8859-2, the characters in those extra 128 slots will be mapped to completely different things. So the `Ø` the sender wrote might show up as `Ř` on your screen. Cool system, totally not a disaster.

**Question: What is the ASCII code in decimal for the character `@`?** `64`

**Question: What is the character that has the ASCII code of 35 in decimal?** `#`

**Question: What is the name of the character that has the ASCII code of 7?** `BEL`

That last one is a control character. BEL literally stands for Bell, as in it was originally meant to ring a physical bell on a teletype machine. Computers in 1963 were wild.

---

## Task 3 — Unicode {#task-3}

**Why the old system fell apart**

So extended ASCII with its regional variants was already a mess for European languages. But then consider Arabic. Arabic needs more than 250 characters just to cover its various ligatures and diacritics. Japanese has 2,136 Kanji characters considered standard daily-use, and the JIS X 0208 standard defines 6,879 characters total. Chinese educated natives recognize around 8,000 characters, and the GB 18030-2022 standard defines more than 87,887 of them. And none of that even touches emoji.

There is no way to fit all of that into 128 extra slots. The whole regional encoding approach was just not going to scale. You would need everyone to agree on which regional encoding to use before sharing any file, and that obviously was not happening reliably.

The solution was Unicode. One universal character encoding standard that assigns a unique code point to every character from every modern and historical writing system on the planet. No more picking a regional variant. No more hoping the person you are sending a file to uses the same encoding. Everyone uses Unicode, everyone sees the same characters.

Unicode 17.0 is the current version and it defines close to 157 thousand characters, including almost 4,000 emoji sequences.

**How Unicode code points work**

Each character gets a unique number written in a format like `U+0041`. That code point is stable and universal. A few examples:

`U+0041` is the Latin letter A. `U+03A9` is the Greek letter Omega. `U+3042` is the Japanese Hiragana character "あ". The smiley face 😊 is `U+0001F60A`. The chess black knight ♞ is `U+265E`. The Chinese character for dragon 龍 is `U+9F8D`.

The computer reads `0010 0110 0101 1110` and shows you a chess knight. That still kind of blows my mind.

**UTF-8, UTF-16, and UTF-32**

Okay so Unicode gives every character a number. But how do you actually store that number in a file? This is where UTF-8, UTF-16, and UTF-32 come in. They are different ways of encoding those Unicode code points into actual bytes.

UTF-8 is the most common one on the modern web. It is smart about byte usage. Simple ASCII characters like `A` use exactly 1 byte, same as original ASCII, so UTF-8 is fully backwards compatible with old ASCII files. Characters like `Ω` use 2 bytes. Complex scripts or emoji like 🔥 use 4 bytes. It adjusts based on what the character needs, so you are not wasting space on simple text just because the encoding has to support emoji too.

UTF-16 uses either 2 or 4 bytes per character. Most common characters like Latin letters, Cyrillic, and Chinese Hanzi fit in 2 bytes. Rarer characters like emoji or ancient scripts need 4 bytes, represented as two 16-bit units. The letter `A` is stored as `U+0041` and the fire emoji 🔥 needs two units and becomes `U+D83D U+DD25`.

UTF-32 is the simple one but also the wasteful one. Every single character always uses exactly 4 bytes, no exceptions. `A` is `U+00000041`. The fire emoji is `U+0001F525`. Easy to work with programmatically but burns through memory fast if you are storing a lot of plain English text.

**Some fun examples from the room**

The Japanese letter `ツ` (tsu) which a lot of people outside Japan use as a smiley face is `U+30C4` in UTF-16 or `U+000030C4` in UTF-32.

The Arabic letter `ت` (taa) that people sometimes use as a smiley because it kind of looks like one is `U+062A`.

And 😊 is just `U+0001F60A` or in binary `0000 0000 0000 0001 1111 0110 0000 1010`. Your computer reads that string of bits and renders a smiley face. Encoding is genuinely cool when you stop and think about what is actually happening.

**Question: What is the UTF-32 encoding of `😌`?** `U+0001F60C`

**Question: What is the UTF-16 encoding of `シ`? Note that `ツ` and `シ` are two different characters.** `U+30B7`

**Question: What is the character that has the following UTF-32 encoding `U+0001F60E`?** `😎`

**Question: What is the character that has the following UTF-16 encoding `U+2658`?** `♘`

That last one is the white knight in chess. The black knight we saw earlier was `U+265E`. One bit of difference and you swap from one color to the other.

---

## Task 4 — Conclusion {#task-4}

Quick summary of everything the room covered:

ASCII is the original English character encoding from 1963. It uses numbers 0 to 127 and covers English letters, digits, punctuation, and control characters. It is 7 bits and it works great as long as you only need English.

Extended ASCII and the ISO-8859 series tried to cover other languages using the eighth bit, giving 128 more slots. The problem is that different regions used those extra slots differently, so files saved with one regional encoding would look broken when opened with another.

Unicode is the universal fix. It assigns a unique code point to every character from every writing system in the world. One standard, everyone uses it, no more encoding mismatch chaos.

UTF-8, UTF-16, and UTF-32 are three ways of storing Unicode code points as actual bytes. UTF-8 is the most efficient for Western text and is the dominant encoding on the web today. UTF-16 is common in operating systems and programming environments. UTF-32 is simple but uses memory generously.

---