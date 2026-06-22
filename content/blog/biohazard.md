---
title: "Biohazard"
date: 2026-06-07
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Biohazard room - A CTF room based on the old-time survival horror game, Resident Evil. Can you survive until the end?"
image: "/images/blog/137.png"
readtime: "45 min read"
draft: false
---

# Biohazard

This challenge looks a bit longer than usual, but that's expected since I'm pushing into the harder rooms now. There are a LOT of questions in this one, so instead of answering them as I go I'm gonna dump every answer at the bottom of the blog.

It's also very clearly Resident Evil themed (Jill, the STARS team, a guy named Weasker, the whole thing), which is a fun touch. Let's start the machine and get into it.

---

## Recon

Usual full port scan.

```bash
nmap -sCV -p- 10.80.183.214
```

![](/images/blog/biohazard/1.png)

Three open ports came back, 21 (FTP), 22 (SSH), and 80 (HTTP). Let's start with port 80 and see what that's all about.

---

## Web - Port 80 (the path maze)

Right away I can tell what kind of room this is.

![](/images/blog/biohazard/2.png)

It's gonna make me follow a bunch of links while telling me a story, and each step gets a little harder than the last. Classic.

Clicking the first link takes me to another page.

![](/images/blog/biohazard/3.png)

So now the game is finding the next path to keep going. Checking the page source reveals where to go next, and that leads to another page.

![](/images/blog/biohazard/4.png)

Clicking "yes" on that one drops me onto a `.php` path that hands me a flag, then asks me to refresh, and then asks me for some input (something about the emblem on the wall).

![](/images/blog/biohazard/5.png)

![](/images/blog/biohazard/6.png)

Opened the source again and there's a comment that looks like a base64 string, so I decode it, because that's almost certainly the key to the next path.

![](/images/blog/biohazard/7.png)

And yep, another path.

![](/images/blog/biohazard/8.png)

On this new one, clicking the link gives me the **lockpick** flag, then sends me onward. That next path gave me even more paths to dig into.


![](/images/blog/biohazard/9.png)

![](/images/blog/biohazard/10.png)

I went to the bar path and it asked me for the lockpick flag from earlier, so I handed it over. That bumped me to another path that wants a flag to play the piano, except I don't have that flag yet. There's a "read" link that spits out a long string that looks like a music note of some kind.

![](/images/blog/biohazard/11.png)

Tried to decode it, turns out it was base32, and it decodes into the music flag the piano path wants. Fed it in, got another path.

This new path gave me yet another flag and told me to refresh the page to use it. Nothing happens when I use it though. So I'm parking that one and checking the other paths instead, since this is a dead end for now.

Next I went into the `/diningRoom2F/` path. The source code there has a string that looks like a cipher with some key rotation going on. Decoded it and it tells me to visit `http://10.80.183.214/diningRoom/sapphire.html` for the next flag.

![](/images/blog/biohazard/12.png)

![](/images/blog/biohazard/13.png)

Problem is, I still didn't have the flag for the golden shield path. So I started feeding it every flag I'd collected so far, and the one that worked was the very first flag. It handed me the string `rebecca`. Cool, except I had no idea where I was supposed to use that.

Then I submitted the gold emblem flag into the dining room and got this:

```
klfvg ks r wimgnd biz mpuiui ulg fiemok tqod. Xii jvmc tbkg ks tempgf tyi_hvgct_jljinf_kvc
```

Another cipher. And there's where `rebecca` finally makes sense, it's the key. Decoded with that and it points me to `http://10.80.183.214/diningRoom/the_great_shield_key.html`, which gives me another flag.

![](/images/blog/biohazard/14.png)

That flag goes into the `http://10.80.183.214//tigerStatusRoom/` path, and that's where the next big section kicks off.

---

## The Crests

The tiger status room gives me this:

```
crest 1:  
S0pXRkVVS0pKQkxIVVdTWUpFM0VTUlk9  
Hint 1: Crest 1 has been encoded twice  
Hint 2: Crest 1 contanis 14 letters  
Note: You need to collect all 4 crests, combine and decode to reavel another path  
The combination should be crest 1 + crest 2 + crest 3 + crest 4. Also, the combination is a type of encoded base and you need to decode it
```

So now I need four crests total, and I also have to decode each one. This first one is encoded twice. I worked it as base64 first, then base32, and the final string comes out as `RlRQIHVzZXI6IG`. The hint says 14 letters and that checks out.

The second crest is in `http://10.80.183.214/galleryRoom/`:

```
crest 2:
GVFWK5KHK5WTGTCILE4DKY3DNN4GQQRTM5AVCTKE
Hint 1: Crest 2 has been encoded twice
Hint 2: Crest 2 contanis 18 letters
Note: You need to collect all 4 crests, combine and decode to reavel another path
The combination should be crest 1 + crest 2 + crest 3 + crest 4. Also, the combination is a type of encoded base and you need to decode it
```

This one is base32 first, then base58, and the final string is `h1bnRlciwgRlRQIHBh`, which is 18 letters. Correct.

The third crest is in `http://10.80.183.214/armorRoom/` (I had to grab this one before the fourth):

```
crest 3:
MDAxMTAxMTAgMDAxMTAwMTEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMTEgMDAxMDAwMDAgMDAxMTAxMDAgMDExMDAxMDAgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAxMTAgMDAxMDAwMDAgMDAxMTAxMDAgMDAxMTEwMDEgMDAxMDAwMDAgMDAxMTAxMDAgMDAxMTEwMDAgMDAxMDAwMDAgMDAxMTAxMTAgMDExMDAwMTEgMDAxMDAwMDAgMDAxMTAxMTEgMDAxMTAxMTAgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTAxMDAgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTAxMTAgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTEwMDEgMDAxMDAwMDAgMDAxMTAxMTAgMDExMDAwMDEgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTEwMDEgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTAxMTEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAxMDEgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMDAgMDAxMDAwMDAgMDAxMTAxMDEgMDAxMTEwMDAgMDAxMDAwMDAgMDAxMTAwMTEgMDAxMTAwMTAgMDAxMDAwMDAgMDAxMTAxMTAgMDAxMTEwMDA=
Hint 1: Crest 3 has been encoded three times
Hint 2: Crest 3 contanis 19 letters
Note: You need to collect all 4 crests, combine and decode to reavel another path
The combination should be crest 1 + crest 2 + crest 3 + crest 4. Also, the combination is a type of encoded base and you need to decode it
```

This one's encoded three times. It ends with `=` so I started with base64, which was right. Second layer was binary to text, third layer was hex to text, and the final string is `c3M6IHlvdV9jYW50X2h`. One more to go.

The fourth crest is in `http://10.80.183.214/attic/`:

```
crest 4:
gSUERauVpvKzRpyPpuYz66JDmRTbJubaoArM6CAQsnVwte6zF9J4GGYyun3k5qM9ma4s
Hint 1: Crest 2 has been encoded twice
Hint 2: Crest 2 contanis 17 characters
Note: You need to collect all 4 crests, combine and decode to reavel another path
The combination should be crest 1 + crest 2 + crest 3 + crest 4. Also, the combination is a type of encoded base and you need to decode it
```

(The hints say "Crest 2" again but that's just a room typo, this is crest 4.) Encoded twice, base58 first, then hexadecimal, and the final value is `pZGVfZm9yZXZlcg==`.

Now I combine all four pieces in order:

```
RlRQIHVzZXI6IGh1bnRlciwgRlRQIHBhc3M6IHlvdV9jYW50X2hpZGVfZm9yZXZlcg==
```

That whole thing is base64, and it decodes into:

```
FTP user: hunter, FTP pass: you_cant_hide_forever
```

Finally out of this encoding and decoding and path-hopping misery. That was a lot.

---

## FTP - Port 21

Now I can use those creds. Let's get into the FTP server.

```bash
ftp 10.80.183.214
```

![](/images/blog/biohazard/15.png)

Logged in and poked around. There were two files in there, so I pulled them down with `get` to read them on my machine.

![](/images/blog/biohazard/16.png)

One of them was a normal file, but the other was this weird thing called `helmet_key.txt.gpg`. At first I had no clue what to do with it. I tried decrypting it anyway:

```bash
gpg --decrypt --output decrupted.txt helmet_key.txt.gpg
```

It asks for a password I don't have yet. The text message I got says the helmet key is inside the text file, but what does that even mean. Confusing. Moving on for now.

![](/images/blog/biohazard/17.png)

There were also three `.jpg` files inside, so I downloaded all three to see what they were hiding.

Ran `strings` on all of them, and I could see there's a `.txt` buried inside the `003` image. Let me extract it:

```bash
binwalk -e 003-key.jpg
```

![](/images/blog/biohazard/18.png)

Inside the extracted files there's a key text file with the string `3aXRoX3Zqb2x0`.

![](/images/blog/biohazard/19.png)

I figured this was the password for the gpg file. Tried it. Nope. Didn't work, so the string is meant for something else. I even tried using it on `http://10.80.183.214/hidden_closet/` and that didn't work either.

Then I wondered if maybe the string was encoded and I needed to decode it first. Couldn't get any result decoding it on its own, so I got a little stuck here. Eventually it clicked that this is probably just ONE piece of a bigger key, which means the other two images are hiding strings too. Let me check them.

```bash
steghide extract -sf 001-key.jpg
```

Didn't enter any passphrase, just hit enter, and files got extracted.

![](/images/blog/biohazard/20.png)

Inside `key-001.txt` from the 001 image there's `cGxhbnQ0Ml9jYW`, plus the same piece I already found in 003. Now I just need the 002 string and I'll have the full thing.

```bash
exiftool 002-key.jpg
```

![](/images/blog/biohazard/21.png)

That gives me the string `5fYmVfZGVzdHJveV9` in the comments. You can also pull the exact same thing with `strings 002-key.jpg`, it's right at the top.

Now combine all the pieces:

```
cGxhbnQ0Ml9jYW5fYmVfZGVzdHJveV93aXRoX3Zqb2x0
```

That's base64, and it decodes to:

```
plant42_can_be_destroy_with_vjolt
```

Which is the password for that gpg file from earlier. So back to it:

```bash
gpg --decrypt --output decrupted.txt helmet_key.txt.gpg
```

![](/images/blog/biohazard/22.png)

Entered the password, and now I've got `decrupted.txt`. Read it and there's the helmet flag:

```
helmet_key{458493193501d2b94bbab2e727f8db4b}
```

That's the flag for `http://10.80.183.214/hidden_closet/`.

![](/images/blog/biohazard/23.png)

---

## Hidden Closet

Fed the helmet flag into the hidden closet path and it opens up. There are two links in there, each with a string:

```
wpbwbxr wpkzg pltwnhro, txrks_xfqsxrd_bvv_fy_rvmexa_ajk
```

and

```
SSH password: T_virus_rules
```

The first one is probably a username. Tried to decode it and this one was rough. I could tell it was some kind of cipher but I couldn't figure out which one, so I left it for a bit.

I remembered there was a `http://10.80.183.214/studyRoom/` path that wanted the helmet flag, and I'd never actually checked it. Maybe that's the missing piece. Sure enough, the helmet flag works there, and it gives me a file download (`doom.tar.gz`). Let me extract it.

```bash
gunzip doom.tar.gz
tar -xf doom.tar
```

That gives me `eagle_medal.txt`, which finally reads:

```
SSH user: umbrella_guest
```

So now I've got a username and password for SSH. I still don't get what that other cipher string is, but I'll come back to it later.

---

## SSH as umbrella_guest

Logged in with the creds.

```bash
ssh umbrella_guest@10.80.183.214
```

And I'm in. Time to poke around.

First thing I did was an `ls -la` to see what's hiding, and there's a `.jailcell` directory. Inside it there's a `chris.txt`, which is a little story breadcrumb (and also the answer to one of the questions, more on that at the bottom).

The other interesting thing I found was `/home/weasker/weasker_note.txt`:

```
Weaker: Finally, you are here, Jill.
Jill: Weasker! stop it, You are destroying the  mankind.
Weasker: Destroying the mankind? How about creating a 'new' mankind. A world, only the strong can survive.
Jill: This is insane.
Weasker: Let me show you the ultimate lifeform, the Tyrant.

(Tyrant jump out and kill Weasker instantly)
(Jill able to stun the tyrant will a few powerful magnum round)

Alarm: Warning! warning! Self-detruct sequence has been activated. All personal, please evacuate immediately. (Repeat)
Jill: Poor bastard
```

Good for the story, but there's nothing actually useful in here for me, so back to poking around.

And this is where I got stuck for a solid 10 to 15 minutes. I didn't know what the next step was. Eventually I realized the answer was probably that cipher string I'd been ignoring this whole time. Time to actually solve it.

---

## Cracking the Vigenere String (umbrella_guest to weasker)

I knew it was a cipher, but to solve it I needed a key I didn't have. So I threw it into one of those online cipher tools that have an autosolve feature, hoping it could guess the key for me.

And it worked. It came back as a Vigenere cipher (same type as that earlier `rebecca` one), and the key turned out to be `albert`. Decoded, it reads:

```
weasker login password, stars_members_are_my_guinea_pig
```

![](/images/blog/biohazard/24.png)

So that string was weasker's password the entire time. Now I can SSH as him.

```bash
ssh weasker@10.80.183.214
```

And I'm in as weasker.

---

## Privilege Escalation

The last user had basically no privileges, so let me check if weasker has more to work with.

```bash
sudo -l
```

![](/images/blog/biohazard/25.png)

And there it is. weasker can run everything as root with no restrictions at all. That makes this trivial, I'll just become root directly:

```bash
sudo su
```

![](/images/blog/biohazard/26.png)

And it works. I'm root, and the root flag is right there. I think I've got everything I need to answer all the questions now.

---

## Answers

**Task 1**

How many open ports? `3`

What is the team name in operation? `STARS alpha team`

**Task 2**

What is the emblem flag? `emblem{fec832623ea498e20bf4fe1821d58727}`

What is the lock pick flag? `lock_pick{037b35e2ff90916a9abf99129c8e1837}`

What is the music sheet flag? `music_sheet{362d72deaf65f5bdc63daece6a1f676e}`

What is the gold emblem flag? `gold_emblem{58a8c41a9d08b8a4e38d02a4d7ff4843}`

What is the shield key flag? `shield_key{48a7a9227cd7eb89f0a062590798cbac}`

What is the blue gem flag? `blue_jewel{e1d457e96cac640f863ec7bc475d48aa}`

What is the FTP username? `hunter`

What is the FTP password? `you_cant_hide_forever`

**Task 3**

Where is the hidden directory mentioned by Barry? `/hidden_closet/`

Password for the encrypted file? `plant42_can_be_destroy_with_vjolt`

What is the helmet key flag? `helmet_key{458493193501d2b94bbab2e727f8db4b}`

**Task 4**

What is the SSH login username? `umbrella_guest`

What is the SSH login password? `T_virus_rules`

Who is the STARS bravo team leader? `Enrico` (full disclosure, I didn't actually solve this one. The answer is in one of the paths if you read the story, which I mostly skipped. So if you're doing this room and you care about the story, slow down and read it.)

**Task 5**

Where you found Chris? `.jailcell` (for this one, do an `ls -la` once you're in with the first SSH creds (umbrella_guest) and you'll see `.jailcell`, with a `chris.txt` inside.)

Who is the traitor? `weasker`

The login password for the traitor? `stars_members_are_my_guinea_pig`

The name of the ultimate form? `Tyrant`

The root flag? `3c5794a00dc56c35f2bf096571edf3bf`

---

## Takeaway

I'll be honest, this one wasn't really satisfying for most of the way through. The first big chunk is just an endless loop of follow a link, view source, decode a string, find the next link, repeat. The crest section especially was layer after layer of base64, base32, base58, binary, hex, in different combinations, and after a while it stops feeling like hacking and starts feeling like data entry.

That said, it got good towards the end. The stego part with the three images splitting one key into pieces was clever, and I liked that you couldn't just decode one image and win, you had to gather all three and stitch them together. The two Vigenere ciphers were a nice callback too, once I hit the second one I already knew the move was to autosolve for the key.

The thing that cost me the most time was ignoring that weasker cipher string for too long because it looked annoying. Lesson there is that when you're stuck and out of leads, the annoying thing you skipped is usually the next step. Should've just sat down and solved it instead of poking around the filesystem hoping something would jump out.

Privesec was the easiest part of the whole room by a mile. `sudo -l` showing full unrestricted root and then `sudo su` is about as gift-wrapped as it gets, which was a funny way to end such a long grind.

Everyone's got different preferences, and the encoding maze clearly isn't mine, but it was a solid room overall and I did enjoy it once it found its footing.

---
