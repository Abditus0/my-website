---
title: "Letter"
date: 2026-04-19
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Letter challenge - Can you help us find out more about this letter?"
image: "/images/blog/85.png"
readtime: "12 min read"
draft: false
---

# Letter

You find a beat up envelope on your mail. Holes in it, address not readable, your coworkers want nothing to do with it. But something about it pulls you in, so you open it. Inside is a faded newspaper clipping and a handwritten note that was clearly not meant for you.

The objective is simple: figure out the full name and age of the person mentioned in the note.

---

## Unzipping and Looking Around

First thing, unzip the file and see what we are working with. Inside the folder there is another folder, 2 photos, and a `note.txt`.

![](/images/blog/letter/1.png)

Let me start with the note:

![](/images/blog/letter/2.png)

It is in French, so I had to translate it.

```
My dear Édouard,

Today, while tidying the attic at my grandparents' house, I came across this old newspaper clipping. Your great-grandfather wasn't even old enough to get his driver's license when he distinguished himself that day. The youngest of the team, and certainly not the least courageous.

He would be so proud to see you on the water too.

With all my love,
Audette
```

Okay so here is what I am working with: someone young, not old enough to drive, the youngest on some kind of team, did something brave, and there is a newspaper clipping about it. Got it.

Now that nested folder (__MACOSX) looked empty at first glance but I ran `ls -la` to check for hidden files and there were 3 of them with the same names as the original files.

![](/images/blog/letter/3.png)

Turns out it is just a macOS thing, nothing useful there, moving on.

---

## The Envelope Photo

Looking at the envelope photo I could see a few things.

![](/images/blog/letter/4.png)

The postal service is `LA POSTE`, and then there was this: `SNSM` thing.

I had no idea what SNSM was so I looked it up and found this on Wikipedia:

> The Société Nationale de Sauvetage en Mer (SNSM) is a French voluntary organisation founded in 1967. Its task is saving lives at sea around the French coast.

A sea rescue organisation. Now go back to the note. Someone young, heroic, on a team, on the water. That is a young SNSM volunteer who did something brave at sea. He was below 17 since the note says he was not old enough to get his driver's license yet.

Things are starting to connect.

---

## The Newspaper Photo

I tried translating everything readable on the newspaper clipping but the image was damaged and I could not get much. The clipping was torn and water damaged so key parts were missing.

![](/images/blog/letter/5.png)

My next idea was to find the original newspaper online. If I could get enough of the text to search for it I might be able to read the whole thing. The newspaper name was visible and I had a couple of headlines to work with, so I started searching.

This is where I hit a wall for a while. I found a great archive of historical French newspapers on a site called Gallica but I had no idea what date to look for. I was searching every word I could make out and everything felt like a dead end. Really frustrating stretch.

---

## The Postal Code

I went back to the envelope and started looking more carefully. There are orange lines at the bottom and I was wondering if those mean something. I searched online and it turns out that those lines are actually a barcode system that French post uses and you can find the pattern to decode them online.

I decoded the lines and got `29760`. That is the first answer for the challenge.

I searched the postal code and it came back as `Penmarch`, a small commune in Finistere, France.

---

## Finding the Date

Back to the newspaper. I kept staring at the image trying to make out any word I could. After a lot of squinting and a lot of Google searches I finally pulled out the phrase `Une catastrophe du Finistere`.

![](/images/blog/letter/6.png)

I searched `L'Ouest-Éclair catastrophe du Finistère` and found a website that matched the newspaper and had a date on it: `23 May 1925`.

Back to Gallica. I searched for that date but 23 May was not quite right. I went back a day, then forward a couple of days, and eventually landed on `24 May 1925`. There it was.

![](/images/blog/letter/7.png)

After all that searching I finally had the original newspaper in front of me.

---

## Reading the Story

I translated and read through the whole article. Then I went back to that website I found earlier and read through their version of the story too. And that is where I found the detail I was looking for.

![](/images/blog/letter/8.png)

A 15 year old named `Gourlaouen Yves Marie`.

That has to be it.

---

## Getting the Flag

The flag format TryHackMe wants is `THM{Name_Surname_age}` with only the first letter of the name and surname capitalised.

I tried a couple of variations and failed a couple of times. Eventually the correct format turned out to be:

`THM{Yves-Marie_Gourlaouen_15}`

---

## Takeaway

This one was a OSINT challenge. No tools, no exploits, just research and pattern recognition. The most frustrating part was not having the newspaper date and feeling like every search was going nowhere. The postal barcode was the thing that unlocked everything because it gave me the region, which gave me the right search terms to finally find the article.

Good challenge. The kind where you feel genuinely stuck for a bit and then one small thing clicks and suddenly it all falls into place.

---
