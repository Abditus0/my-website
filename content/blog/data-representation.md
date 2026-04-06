---
title: "Data Representation — TryHackMe Pre Security Path"
date: 2026-03-27
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Data Representation room - Learn about how computers represent numbers and colors."
image: "/images/blog/42.png"
readtime: "15 min read"
draft: false
---

# Data Representation

This room sounds like it is going to be a math lecture and honestly, parts of it are. But it is also one of those rooms where things suddenly click and you go "oh THAT is why hex colors look like that." Worth pushing through even if the number conversions make your brain hurt at first.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Representing Colors](#task-2)
- [Task 3 — Numbers: From Decimal to Hexadecimal](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The room opens with a simple observation. Humans use the decimal system without thinking about it. You jog for 23 minutes. Something costs 17 euros. You have 9 tabs open (or 47, no judgment). Digits go from 0 to 9 and that is just normal life.

Computers do not get that luxury. They only understand two states: 0 and 1. Everything a computer does, every color on your screen, every number it calculates, every file it stores, all of it gets broken down into combinations of 0 and 1. That is the whole premise of this room. How does that actually work?

By the end you will understand how colors are stored, how binary numbers work, what hexadecimal is and why it exists, and as a bonus there is a section on octal numbers too which is less common but good to know about.

---

## Task 2 — Representing Colors {#task-2}

**Starting with 8 colors**

Colors on a screen are made by mixing red, green, and blue light. Think of three switches, one for red, one for green, one for blue. Each switch is either on or off.

If each color has 2 states (on or off) and there are 3 colors, you get 2 × 2 × 2 = 8 possible combinations. So with just 3 bits you can represent 8 colors.

The bit is the smallest unit of data in computing. It is short for binary digit and it can only ever be 0 or 1.

The 8 colors look like this: `000` is black (everything off), `111` is white (everything on), `100` is just red, `010` is just green, `001` is just blue, and so on. Three bits, eight colors, simple enough.

**Scaling up to 16 million colors**

Eight colors is obviously not enough for anything real. So instead of each color being just on or off, what if each color had 256 levels of intensity? That means 256 × 256 × 256 = 16,777,216 colors. Over 16 million. That covers basically everything you would ever need on a screen.

To represent 256 levels you need 8 bits, because 8 bits can hold 2⁸ = 256 different values. A group of 8 bits is called a byte (also called an octet).

So a color is now 3 bytes, one byte for red, one for green, one for blue. That is 24 bits total per color. In raw binary a color looks something like `10100011 11101010 00101010`. Nobody wants to type that.

**Hexadecimal to the rescue**

Hexadecimal groups every 4 bits into a single character. A hex digit goes from 0 to 9 and then A to F, covering 16 possible values (0 through 15). The letters A through F replace the numbers 10 through 15 so that each value stays a single character.

So instead of writing `10100011 11101010 00101010` you write `A3EA2A`. That is the same information, just way more readable. This is why hex color codes exist in graphic design tools and CSS. `#A3EA2A` is a real color code and it is just a compact way of writing 24 bits.

Each byte becomes two hex digits. So three bytes become six hex digits. That is the `#RRGGBB` format you have probably seen before without knowing what it actually meant.

**Question: Preview the color #3BC81E. In one word, what does this color appear to be?** `green`

**Question: What is the binary representation of the color #EB0037?** `11101011 00000000 00110111`

**Question: What is the decimal representation of the color #D4D8DF?** `212 216 223`

That last one is three separate decimal values, one for each of the red, green, and blue bytes. So red is 212, green is 216, blue is 223. That particular color is a light grey by the way.

---

## Task 3 — Numbers: From Decimal to Hexadecimal {#task-3}

**Why computers use binary**

The room explains this nicely. On the physical level a transistor either passes current or blocks it. A hard drive stores data using magnetic polarity. Fiber optic cables use whether light is present or not. In every case there are only two states. High or low. North or south. Light or no light. That maps directly to 1 and 0.

Everything else, every number, every color, every letter, every emoji, is built on top of that.

**How decimal actually works**

Before jumping into binary it helps to actually think about how decimal works, not just use it on autopilot. Take the number 213. You can write it as 2 × 100 + 1 × 10 + 3 × 1. Or more formally: 2 × 10² + 1 × 10¹ + 3 × 10⁰.

Each position in the number is a power of 10, starting from the right at 10⁰ (which equals 1), then 10¹ (which is 10), then 10² (which is 100), and so on. The digit in each position tells you how many of that power you have.

**Binary works the same way, but with powers of 2**

Take the binary number `1001`. You work it out like this:

1 × 2³ + 0 × 2² + 0 × 2¹ + 1 × 2⁰ = 1 × 8 + 0 × 4 + 0 × 2 + 1 × 1 = 9

So `1001` in binary is 9 in decimal. The positions are powers of 2 instead of powers of 10, and the digits can only be 0 or 1 instead of 0 through 9.

Going through the four bit combinations from 0 to 3:

`0000` = 0, `0001` = 1, `0010` = 2, `0011` = 3.

And the ones from 12 to 15:

`1100` = 12, `1101` = 13, `1110` = 14, `1111` = 15.

The pattern makes sense once you sit with it for a minute. The rightmost bit is worth 1. The next one left is worth 2. Then 4. Then 8. Then 16. Each position doubles.

**Hexadecimal numbers**

This is the part that ties it all together. A hex digit represents exactly 4 bits. Since 4 bits can hold values from 0 to 15, and hex digits go from 0 to F (where A=10, B=11, C=12, D=13, E=14, F=15), one hex character perfectly captures one group of 4 bits. No waste, no overlap.

This is why hex is so common in computing. It is a compact human readable shorthand for binary. Two hex digits cover 8 bits, which is one byte. Six hex digits cover 24 bits, which is a full RGB color.

**Optional: Converting hex to decimal**

The conversion works just like binary, but with powers of 16 instead of powers of 2. For the hex number `9BDF`:

9 × 16³ + 11 × 16² + 13 × 16¹ + 15 × 16⁰ = 9 × 4096 + 11 × 256 + 13 × 16 + 15 × 1 = 39,903

Remember B = 11, D = 13, F = 15.

**Optional: Octal numbers**

Octal is base 8, so it uses digits 0 through 7. Instead of grouping 4 bits like hex does, octal groups 3 bits. You do not see it as often in modern computing but it does show up in Linux file permissions, which is worth knowing.

Converting octal `357` to decimal:

3 × 8² + 5 × 8¹ + 7 × 8⁰ = 3 × 64 + 5 × 8 + 7 × 1 = 192 + 40 + 7 = 239

**Questions from the interactive site**

**Question: What is the hexadecimal `FF` in binary?** `11111111`

Both hex digits are F, and F in binary is `1111`, so FF is `1111 1111`. All eight bits flipped on. Maximum value for one byte.

**Question: What is the hexadecimal `AB` in decimal?** `171`

A is 10, B is 11. So: 10 × 16 + 11 × 1 = 160 + 11 = 171.

**Question: Convert the hexadecimal `FF FF FF` to decimal. After you round up the decimal value to the nearest million, how many millions is that?** `17`

FF FF FF is 255, 255, 255 in decimal. The full value is 255 × 256² + 255 × 256 + 255 = 16,777,215. Round that to the nearest million and you get 17 million.

This is also the maximum number of colors in a 24 bit color system. Makes sense that the max hex color `#FFFFFF` (white) works out to that number.

---

## Task 4 — Conclusion {#task-4}

Quick recap of what the room covered:

Decimal is base 10. The system we use every day where digits go from 0 to 9.

Binary is base 2. Computers use this at the hardware level because everything is either on or off. Digits are only 0 and 1.

Hexadecimal is base 16. Every 4 bits can be written as one hex digit. Digits go from 0 to F. This is what makes hex color codes work and why you will see hex everywhere in cyber security tools.

Octal is base 8. Groups of 3 bits, digits 0 to 7. Less common but shows up in Linux permissions.

A bit is a single binary digit, 0 or 1. A byte is 8 bits. A color in modern computing is 3 bytes, one each for red, green, and blue, giving over 16 million possible colors.

---