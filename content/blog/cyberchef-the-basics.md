---
title: "CyberChef: The Basics — TryHackMe Cyber Security 101"
date: 2026-06-03
category: "writeup"
excerpt: "Walkthrough of TryHackMe's CyberChef: The Basics room — This room is an introduction to CyberChef, the Swiss Army knife for cyber security professionals."
image: "/images/blog/135.png"
readtime: "30 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Accessing the Tool](#task-2)
- [Task 3 — Navigating the Interface](#task-3)
- [Task 4 — Before Anything Else](#task-4)
- [Task 5 — Practice, Practice, Practice](#task-5)
- [Task 6 — Your First Official Cook](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction {#task-1}

CyberChef. If you've spent any time around cyber security people you've seen this tool. It runs in your browser, looks kind of like a recipe builder, and does a million different data transformations. Base64, hex, URL encoding, XOR, AES, RSA, you name it. It's the thing you reach for when you have some gibberish string and you don't know what to do with it.

The way it works is built around the cooking metaphor. You pick "ingredients" which are the operations, you stack them in a "recipe", you throw in your input, and out comes the result. It's a really intuitive way to do stuff that would otherwise be a bunch of separate command line tools.

Goals of this room are simple. Learn what CyberChef is, learn the interface, learn the common operations, learn how to build a recipe. That's it. No flag hunting, no boxes to root. Just learning the tool.

---

## Task 2 — Accessing the Tool {#task-2}

Two ways to use CyberChef and honestly both are fine.

**Online**, just go to https://gchq.github.io/CyberChef and you're done. Web browser, internet connection, that's it. This is what most people use.

**Offline**, grab the latest release from https://github.com/gchq/CyberChef/releases and run it locally. Works on Windows and Linux. The reason you'd want this is if you're working with sensitive data and don't want to be pasting it into a website, even if the site claims it runs everything client side (which CyberChef does, but still, security people are paranoid for a reason).

Pick whichever fits your situation. For learning, online is fine.

No questions to answer on this one.

---

## Task 3 — Navigating the Interface {#task-3}

CyberChef has four main areas and once you see them it'll click immediately. Open the tool in a tab and follow along, it makes way more sense visually.

### Operations

Left side of the screen. This is the giant list of every operation CyberChef can do, grouped by category. There's a search bar at the top because nobody is scrolling through all of them. If you want to do Base64, just type "base64" and it filters down.

Some common ones you'll bump into:

- **From Morse Code** turns dots and dashes into letters. `- .... .-. . .- - ...` becomes `THREATS`.
- **URL Encode** turns special characters into the percent encoded versions. `https://tryhackme.com/r/room/cyberchefbasics` becomes `https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Froom%2Fcyberchefbasics` with the "Encode all special chars" option on.
- **To Base64** turns text into the encoded version. `This is fun!` becomes `VGhpcyBpcyBmdW4h`.
- **To Hex** turns text into hex bytes. `This Hex conversion is awesome!` becomes `54 68 69 73 20 48 65 78 ...` and so on.
- **To Decimal** does the same thing but in decimal. `This Decimal conversion is awesome!` becomes `84 104 105 115 32 68 ...`.
- **ROT13** does the classic Caesar shift. `Digital Forensics and Incident Response` becomes `Qvtvgny Sberafvpf naq Vapvqrag Erfcbafr`.

Pro tip, if you hover over any operation in the list it shows you a quick description and a Wikipedia link. Use this. Way faster than googling each one.

### Recipe

Middle of the screen. This is the heart of the whole tool. You drag operations from the left into here, set their arguments, and the order they go in is the order CyberChef applies them. So if you have a string that's been Base64'd and then URL encoded, your recipe is URL Decode first, then From Base64. Order matters.

A few buttons up top of this area you should know:

- **Save recipe** keeps your current recipe so you can use it later.
- **Load recipe** loads one you saved.
- **Clear Recipe** wipes the recipe so you can start over.

And at the bottom there's the big juicy **BAKE!** button that runs the recipe. If you don't want to click it every time, tick **Auto Bake** and CyberChef runs the recipe automatically every time you change the input or recipe.

### Input

Top right. This is where your data goes. You can paste text, type stuff, drag a file in, or use the file open buttons. There's also:

- **Add a new input tab** for when you want to test different inputs without losing your current one.
- **Open folder as input** to feed in an entire folder.
- **Open file as input** for a single file.
- **Clear input and output** to wipe everything.
- **Reset pane layout** if you've dragged the panels around and want them back to default.

### Output

Bottom right. The result of running the recipe shows up here. Features:

- **Save output to file** to save it as a `.dat` file.
- **Copy raw output to the clipboard** which is what you'll use most of the time.
- **Replace input with output** which is super handy when you're chaining operations and want the result of step 1 to be the input for step 2.
- **Maximise output pane** to make this area bigger.

That's the whole interface. Four boxes. Operations, Recipe, Input, Output. You'll be looking at this thing constantly.

**In which area can you find "From Base64"?** `operations`

**Which area is considered the heart of the tool?** `Recipe`

---

## Task 4 — Before Anything Else {#task-4}

Before just smashing operations into the recipe and hoping something works, the room wants you to slow down and think. Which, honestly, is good advice that nobody follows the first ten times they use CyberChef. You see a gibberish string and you immediately try every Base whatever decode in the list. Done it. We've all done it.

The thinking process is four steps:

**1. Set an objective.** What are you trying to do? "I found a weird string in a log and I want to know if it's hiding something readable." That's an objective. "Let me just try stuff" is not an objective.

**2. Put your data in the input area.** Paste it, drag it, upload it, whatever.

**3. Pick your operations.** This is where the thinking pays off. If you know it's Base64, use From Base64. If you have no idea, you might try a few different decoders, but having a guess based on what the string looks like helps a lot. Things like length, character set (only letters and numbers? has slashes and equals signs?), where you found it.

**4. Check the output.** Did you get what you wanted? If yes, done. If no, back to step 3, try something else.

The whole point of this task is to stop you from spraying random operations at a problem. Have a plan, even a rough one.

**At which step would you determine, "What do I want to accomplish?"** `1`

---

## Task 5 — Practice, Practice, Practice {#task-5}

Now we use it. The room introduces a bunch of operation categories and then gives you a file to play with.

### Extractors

These pull specific stuff out of a big blob of text. Super useful when you have a log file or a memory dump and you want to find all the IPs or emails inside.

- **Extract IP addresses** grabs every IPv4 and IPv6 address.
- **Extract URLs** grabs URLs. The room notes that the protocol (http, ftp, etc.) is required, otherwise you get a million false positives.
- **Extract email addresses** grabs anything matching `something@domain.com`.

### Date and Time

- **From UNIX Timestamp** converts a UNIX timestamp into a normal human readable datetime.
- **To UNIX Timestamp** does the opposite.

Quick refresher. A UNIX timestamp is just the number of seconds since January 1, 1970 UTC. That's the UNIX "epoch". So `1725654622` is `Fri Sep 6 20:30:22 +04 2024`.

### Data Format

This is the big one. The room lists a bunch of base encodings and URL decoding.

- **From Base64** decodes Base64 strings. `V2VsY29tZSB0byB0cnloYWNrbWUh` becomes `Welcome to tryhackme!`.
- **URL Decode** turns percent encoded characters back into normal ones. `https%3A%2F%2Fgchq%2Egithub%2Eio%2FCyberChef%2F` becomes `https://gchq.github.io/CyberChef/`.
- **From Base85** is another base encoding, usually more efficient than Base64. `BOu!rD]j7BEbo7` becomes `hello world`.
- **From Base58** is a base encoding that drops easily confused characters like `l`, `I`, `0`, and `O`. `AXLU7qR` becomes `Thm58`.
- **To Base62** uses 62 characters which makes for shorter strings. `Thm62` becomes `6NiRkOY`.

### How Base64 works

The room walks through encoding "THM" by hand and honestly it's worth following because once you've done it once you understand WHY Base64 strings look the way they do.

**Step 1, convert each letter to binary.**

Using the ASCII table, T is `01010100`, H is `01001000`, M is `01001101`. Stick them together and you get `010101000100100001001101`. That's 24 bits.

**Step 2, regroup into 6 bit chunks.**

Base64 works on 6 bit groups (because 2^6 = 64, which is where the name comes from). So you take your 24 bit string and chop it into groups of 6:

`010101 000100 100001 001101`

Then convert each chunk back to decimal:

- `010101` is 21
- `000100` is 4
- `100001` is 33
- `001101` is 13

**Step 3, look up the Base64 character.**

Base64 has its own alphabet, 64 characters total. Index 0 is `A`, index 25 is `Z`, index 26 is `a`, index 51 is `z`, index 52 is `0`, index 61 is `9`, then `+` is 62 and `/` is 63.

So:

- 21 is `V`
- 4 is `E`
- 33 is `h`
- 13 is `N`

Stick them together and "THM" in Base64 is `VEhN`. Which you can verify by going to CyberChef, throwing "THM" in the input, adding the To Base64 operation, and watching it spit out `VEhN`. Nice.

You don't have to do this by hand ever again, that's what CyberChef is for, but knowing how it works under the hood means you can recognize a Base64 string by sight. Letters, numbers, sometimes plus and slash, often ending in one or two equals signs as padding. Once you've seen it a few times your brain just goes "oh that's Base64" and you save yourself time.

### URL Decoding

URLs can't have certain characters in them so the browser replaces them with percent codes. Some common ones:

- `:` is `%3A`
- `/` is `%2F`
- `.` is `%2E`
- `=` is `%3D`
- `#` is `%23`

URL Decode just reverses this. Easy stuff.

### Practical Exercise

Download the file from the task. Open it and paste the contents into the CyberChef input, or use Open file as input to upload it directly. Both work, the upload is a little less clunky if the file is big.

The first time I did this I forgot to clear the recipe between questions and got confused why my Extract Email output suddenly had IPs in it. Clear the recipe (or use Clear input and output) between each question or you'll waste time wondering what went wrong.

**Question 1: hidden email address**

Add the **Extract email addresses** operation to the recipe. Bake. The output shows the email addresses found in the file. There's the one you're looking for.

`hidden@hotmail.com`

**Question 2: hidden IP that ends in .232**

Clear the recipe. Add **Extract IP addresses**. Bake. You get a list of IPs from the file. Scan through and find the one ending in `.232`.

`102.20.11.232`

**Question 3: domain starting with T**

Clear the recipe. Add **Extract URLs**. Bake. Look for the URL that has a domain starting with T.

`TryHackMe.com`

**Question 4: binary value of decimal 78**

You don't even need the file for this one. Throw `78` into the input. Use the **From Decimal** operation, then **To Binary**, or you can just look it up in the table the room provides. 78 is `01001110`. Done.

`01001110`

**Question 5: URL encode `https://tryhackme.com/r/careers`**

Paste the URL into the input. Add **URL Encode** to the recipe. Important note, you have to tick the "Encode all special chars" option in the operation parameters, otherwise it won't encode the dots and slashes and your answer will be wrong. This tripped me up the first time. Default settings only encode the "problematic" characters, not stuff like `/` and `.`.

With the option ticked:

`https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Fcareers`

---

## Task 6 — Your First Official Cook {#task-6}

More practice. Same file from Task 5 plus some new stuff.

**Question 1: IP that starts AND ends with 10**

Same file. Add **Extract IP addresses**. Bake. Look through the output for an IP that has `10` on both ends.

`10.10.2.10`

**Question 2: Base64 encode "Nice Room!"**

Clear everything. Throw `Nice Room!` into the input. Add **To Base64**. Bake.

`TmljZSBSb29tIQ==`

The two equals at the end are padding. Base64 always pads to a multiple of 4 characters. If you ever see a Base64 string with one or two equals at the end, that's why.

**Question 3: URL decode the long string**

Input is `https%3A%2F%2Ftryhackme%2Ecom%2Fr%2Froom%2Fcyberchefbasics`. Add **URL Decode**. Bake.

`https://tryhackme.com/r/room/cyberchefbasics`

**Question 4: datetime for UNIX timestamp 1725151258**

Input is `1725151258`. Add **From UNIX Timestamp**. Bake.

`Sun 1 September 2024 00:40:58 UTC`

**Question 5: Base85 decode `<+oue+DGm>Ap%u7`**

Input is the funky looking string. Add **From Base85**. Bake.

`This is fun!`

If you've gotten this far you've used most of the categories the room cares about. The pattern is always the same. Pick the right operation, throw in the input, bake, read the output.

---

## Task 7 — Conclusion {#task-7}

That's CyberChef. Honestly one of the most useful tools you'll have in your bookmarks forever. Decoding stuff that would take ten minutes of scripting in Python becomes a 5 second drag and drop.

A few things from doing this room.

One, **clear the recipe between unrelated tasks**. The number of times I've sat there confused at weird output because I forgot to remove the last operation from the recipe is embarrassing. Use the Clear Recipe button.

Two, **Auto Bake is nice but turn it off for slow operations**. If you're doing something computationally heavy or processing a big file, Auto Bake will lag your browser every time you tweak the input. Untick it and click BAKE manually.

Three, **read the operation arguments**. The URL Encode question in Task 5 is a perfect example. Default settings don't always do what you think. Every operation has parameters and they change the output. Hover over them, click the little info icon, figure out what they do.

Four, **base encodings have telltale signs**. Base64 has letters, numbers, plus, slash, and often equals padding. Base58 drops the easy to confuse characters. Hex is only `0-9` and `a-f`. If you train your eye to recognize these you'll save a lot of time guessing.

Five, **the Extractors are underrated**. When you have a big log file or a memory dump or a paste of random text and you need to find all the IPs or emails or URLs, these things are gold. Way faster than writing a regex.

Six, **Replace input with output is your friend** when chaining stuff. Sometimes you want to run an operation, look at the result, and then run another operation on that result without rebuilding the input. That button is right there for exactly that.

Short room, useful tool. Onto the next one.

---