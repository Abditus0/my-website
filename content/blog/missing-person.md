---
title: "Missing Person"
date: 2026-04-08
category: "ctf"
excerpt: "Walkthrough of a TryHackMe Missing Person challenge - Use your OSINT skills to help the police track down a missing person."
image: "/images/blog/66.png"
readtime: "10 min read"
draft: false
---

# Missing Person

This one is a pure OSINT challenge. The goal is to track down a missing person using only the clues we can dig up. Download the files from the room and lets see what we are working with.

Two photos. `food.jpg` and `MotoGP.jpg`. Okay, lets get to work.

---

## Starting with Metadata

My favorite tool for metadata is `exiftool`. Lets run it on both photos:

```bash
exiftool food.jpg
exiftool MotoGP.jpg
```

![](/images/blog/missing-person/1.png)

Not a ton of info but we get dates and times which is already something. From the food photo I can pull the time it was taken and that answers one of the questions right away.

**At what time was this photo taken?** `19:55:30`

---

## The MotoGP Photo

Looking at the MotoGP photo, there is a name visible: `PERTAMINA`. Lets search that online and see where it leads.

![](/images/blog/missing-person/2.png)

After a quick search I found the full name of the circuit. It is located in the Mandalika resort area of Central Lombok, West Nusa Tenggara, Indonesia. The metadata dates matched up for the recent event too, October 5th 2025. Everything is starting to line up.

**What is the commercial name of this circuit?** `Pertamina Mandalika International Street Circuit`

Now I need the exact dates of the event. I searched for `The 2025 Grand Prix Pertamina Mandalika International Street Circuit` and got the answer immediately.

![](/images/blog/missing-person/3.png)

**When did the event take place?** `03-05/10/2025`

---

## Finding the Restaurant

The next question is about Mexican food. He apparently ate at a Mexican restaurant near the circuit. I searched for `The 2025 Grand Prix Pertamina Mandalika International Street Circuit mexican food` and got a result pretty fast.

![](/images/blog/missing-person/4.png)

**What is the name of the restaurant?** `Cantina Mexicana`

Now I need the address of this place. Simple Google search gives me the full address but TryHackMe is picky about the format. I tried the long version and it kept failing. After a couple of attempts I figured out the right format:

**What is the address of the restaurant?** `Jl. Raya Kuta, Kuta, Kec. Pujut, Kabupaten Lombok Tengah, Nusa Tenggara Bar`

---

## Finding the DJ

The last message from the missing person says:

*"Went to this cool MotoGP after party, and became friends with one of the local DJs who played that night. We're going to visit a cave tomorrow."*

So we need to find a DJ who played at a MotoGP after party on October 5th 2025. I was initially going down the Cantina Mexicana rabbit hole, checking their website and gallery for any events from that date. Spent a while on that and found nothing useful. Then I re-read the message more carefully. It says MotoGP after party, not necessarily the restaurant. Those are probably two different things.

I searched for `The 2025 Grand Prix Pertamina Mandalika International Street Circuit after party` and the DJ name came up right away.

![](/images/blog/missing-person/6.png)

**What is the DJ's stage name?** `Bong Leleh`

---

## The Cave

Now we know the DJ is friends with the missing person and they planned to visit a cave together. TryHackMe hints that he posts about a cave where he takes tourists. Lets look at his social media.

I searched his name on Google and the cave name came up almost immediately. There is actually a pretty interesting story behind it if you take a minute to read through the results.

![](/images/blog/missing-person/7.png)

**After digging into the DJ's other online accounts, what cave does he take tourists to?** `Gua Sumur`

---

## The Phone Number

Last question is his phone number for the cave tours. I checked his Instagram first and found nothing about tours or contact info. Then I went to Facebook and could not find a personal account for him either.

I changed my approach and searched for the cave name directly: `Gua Sumur Bong Leleh`. That combination pulled up a Facebook page called `Gua Sumur Lombok (@bongleleh)` and right there on the page was the number.

![](/images/blog/missing-person/8.png)

**What number did the DJ list for his tour business?** `085333137345`

---

This was actually a really fun room. No tools needed beyond exiftool and Google. Pure OSINT the whole way through. The trickiest part was not getting distracted by the Cantina Mexicana website when the DJ lead was somewhere else entirely. Once I stepped back and re-read the message properly it clicked pretty fast. Solid and fun challenge.

---
