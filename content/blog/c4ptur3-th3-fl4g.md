---
title: "c4ptur3-th3-fl4g"
date: 2026-05-04
category: "ctf"
excerpt: "Walkthrough of the TryHackMe c4ptur3-th3-fl4g challenge - A beginner level CTF challenge"
image: "/images/blog/111.png"
readtime: "25 min read"
draft: false
---

# c4ptur3-th3-fl4g

This one is pretty different from the usual CTF rooms. No nmap, no exploitation, no shells. Just a bunch of encoded strings I need to decode. One after another. The idea is to recognise what type of encoding you are looking at and then find the right tool to decode it. Honestly with everything available online today this is not that hard, you just need to know what you are looking at.

Let's go through it.

---

## Task 1 - Translation and Shifting

### Level 1

First string:

```
c4n y0u c4p7u23 7h3 f149?
```

This one took me about one second. It is leet speak. Numbers replace letters. 4 is A, 0 is O, 7 is T, 3 is E, 1 is I.

![](/images/blog/c4ptur3-th3-fl4g/1.png)

`can you capture the flag?`

### Level 2

```
01101100 01100101 01110100 01110011 00100000 01110100 01110010 01111001 00100000 01110011 01101111 01101101 01100101 00100000 01100010 01101001 01101110 01100001 01110010 01111001 00100000 01101111 01110101 01110100 00100001
```

Binary. Groups of 8 zeros and ones separated by spaces. There are hundreds of tools online that convert binary to text, just paste it in.

`lets try some binary out!`

### Level 3

```
MJQXGZJTGIQGS4ZAON2XAZLSEBRW63LNN5XCA2LOEBBVIRRHOM======
```

My first thought was base64. Tried it. Wrong. The equals signs at the end and the all-caps letters should have tipped me off earlier but I missed it. Tried base32 and it worked.

`base32 is super common in CTF's`

Good to know for future rooms.

### Level 4

```
RWFjaCBCYXNlNjQgZGlnaXQgcmVwcmVzZW50cyBleGFjdGx5IDYgYml0cyBvZiBkYXRhLg==
```

This one actually looks like base64. Mix of uppercase, lowercase, numbers, and ends with `==`. Tried it and yes.

![](/images/blog/c4ptur3-th3-fl4g/2.png)

`Each Base64 digit represents exactly 6 bits of data.`

### Level 5

```
68 65 78 61 64 65 63 69 6d 61 6c 20 6f 72 20 62 61 73 65 31 36 3f
```

Short values, letters `a` through `f` mixed in, numbers up to 9 but nothing above `f`. That screams hexadecimal. Threw it into a hex to text converter.

![](/images/blog/c4ptur3-th3-fl4g/3.png)

`hexadecimal or base16?`

Yep.

### Level 6

```
Ebgngr zr 13 cynprf!
```

This looks weird but there is a pattern. Each letter is shifted. The number 13 is right there in the string which is a pretty big hint. This is ROT13. Every letter in the alphabet gets rotated 13 positions forward. Since the alphabet has 26 letters, rotating 13 twice gets you back to the start. Lots of tools for this online, or you can just use CyberChef.

![](/images/blog/c4ptur3-th3-fl4g/4.png)

`Rotate me 13 places!`

### Level 7

```
*@F DA:? >6 C:89E C@F?5 323J C:89E C@F?5 Wcf E:>6DX
```

Similar idea to ROT13 but a bit more advanced. Not just letters this time, special characters are shifting too. That pointed me towards ROT47, which works on a wider range of ASCII characters. Tried it and it worked straight away.

![](/images/blog/c4ptur3-th3-fl4g/5.png)

`You spin me right round baby right round (47 times)`

### Level 8

```
- . .-.. . -.-. --- -- -- ..- -. .. -.-. .- - .. --- -.
. -. -.-. --- -.. .. -. --.
```

Dots and dashes. Come on. Morse code. Easy.

![](/images/blog/c4ptur3-th3-fl4g/6.png)

`telecommunication encoding`

### Level 9

```
85 110 112 97 99 107 32 116 104 105 115 32 66 67 68
```

Numbers. But not hex this time, these go above the F range. Had to think for a second. Every character on a computer has a numeric value assigned to it, that is ASCII. 65 is A, 66 is B, 72 is H, and so on. Tried ASCII to text.

`Unpack this BCD`

### Level 10

The last one in task 1 is a massive long string. It is `LS0t` repeated over and over and over. I could not even tell where it ended.

I had no idea where to start so I just tried a few things. Eventually I noticed the string ends with `=` which usually means base64. Threw it into CyberChef and decoded the base64.

![](/images/blog/c4ptur3-th3-fl4g/7.png)

The output looked like morse code so I added a morse code decode step.

![](/images/blog/c4ptur3-th3-fl4g/8.png)

That gave me something that looked like binary so I added binary decode.

![](/images/blog/c4ptur3-th3-fl4g/9.png)

Then I got some weird string that I could not immediately read. At that point I figured since the room had already gone through ROT13 and ROT47 and basically everything else, maybe this is ROT47. Added it and got decimal numbers.

![](/images/blog/c4ptur3-th3-fl4g/10.png)

Added decimal to text and finally got the answer.

![](/images/blog/c4ptur3-th3-fl4g/11.png)

So the full chain in CyberChef was: base64, then morse code, then binary, then ROT47, then decimal.

`Let's make this a bit trickier...`

Yeah no kidding.

---

## Task 2 - Spectrograms

This one has an audio file. A spectrogram is a visual way of representing the frequencies in a sound file over time. Sometimes you can hide text in the visual pattern of the frequencies which is not visible to the ear at all.

There are online tools that let you upload audio and view it as a spectrogram. Uploaded the file and the answer was there visually in the image.

![](/images/blog/c4ptur3-th3-fl4g/12.png)

`Super Secret Message`

---

## Task 3 - Steganography

Steganography means hiding a secret inside another file. Images are a common one. The data is embedded in the file itself, invisible if you just open and view the image normally.

Download the image first. Then run steghide to extract whatever is hidden inside it.

```bash
steghide extract -sf stegosteg_1559008553457.jpg
```

That extracts a file called `steganopayload2248.txt`. Read it.

```bash
cat steganopayload2248.txt
```

![](/images/blog/c4ptur3-th3-fl4g/13.png)

`SpaghettiSteg`

---

## Task 4 - Security Through Obscurity

Last task. Another image to download. The task is hinting that there is an archive hidden inside the file. The right tool for this is binwalk, which scans files for embedded data and can extract it.

```bash
binwalk -e meme_1559010886025.jpg
```

That extracts a folder called `_meme_1559010886025.jpg.extracted`. Go inside it.

```bash
cd _meme_1559010886025.jpg.extracted
ls
```

![](/images/blog/c4ptur3-th3-fl4g/14.png)

There is a file called `hackerchat.png`. I ran strings on it to check for any readable text embedded in the file.

```bash
strings hackerchat.png
```

Scrolled all the way down through the output and at the bottom was the final flag.

![](/images/blog/c4ptur3-th3-fl4g/15.png)

`AHH_YOU_FOUND_ME!`

And that is the whole challenge done.

---

## Answers

**Task 1**

c4n y0u c4p7u23 7h3 f149? `can you capture the flag?`

Binary `lets try some binary out!`

Base32 `base32 is super common in CTF's`

Base64 `Each Base64 digit represents exactly 6 bits of data.`

Hex `hexadecimal or base16?`

ROT13 `Rotate me 13 places!`

ROT47 `You spin me right round baby right round (47 times)`

Morse `telecommunication encoding`

ASCII `Unpack this BCD`

Multi-layer `Let's make this a bit trickier...`

**Task 2** `Super Secret Message`

**Task 3** `SpaghettiSteg`

**Task 4** `hackerchat.png`, `AHH_YOU_FOUND_ME!`

---

## Takeaway

Short room. I liked it. Task 1 is the bulk of it and it just runs you through basically every common encoding format you will run into in CTFs. The multi-layer one at the end of task 1 was the only one that actually made me think a bit. The rest were pretty quick once you recognised the format.

The steganography and binwalk tasks are worth knowing for future rooms because hiding stuff inside images comes up a lot. Good room to do early on.

---
