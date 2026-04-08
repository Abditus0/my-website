---
title: "Operation Slither"
date: 2026-04-02
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Operation Slither challenge - Follow the leads and find who's behind this operation."
image: "/images/blog/49.png"
readtime: "17 min read"
draft: false
---

## What Are We Working With

Someone stole data from a company called TryTelecomMe and is now selling it online. We have to find who that is. The starting point is this post:

```
Full user database TryTelecomMe on sale!!!

As part of Operation Slither, we've been hiding for weeks in their network
and have now started to exfiltrate information. This is just the beginning.
We'll be releasing more data soon. Stay tuned!

@v3n0mbyt3_
```

One username. That is all we have. Let's go.

---

## Starting With the Username

I searched `@v3n0mbyt3_` and found two accounts. One on X and one on Threads. Both of them have posts and interactions with other people so there is plenty to dig through.

![](/images/blog/operation-slither/1.png)

The first task from TryHackMe is asking for other platforms used. `threads` is the answer for that. Also a flag which I figured would probably be hidden somewhere in a post or a reply. So I started going through everything.

---

## Digging Through Threads

On Threads, `@v3n0mbyt3_` is very active and openly talking with a friend under the handle `_myst1cv1x3n_`. Out there in public. Interesting choice.

![](/images/blog/operation-slither/2.png)


I clicked on `_myst1cv1x3n_` Threads profile and saw that there is also Instagram account.

![](/images/blog/operation-slither/8.png)

![](/images/blog/operation-slither/9.png)

Inside the comments of the third Instagram post, I found a SoundCloud link:

![](/images/blog/operation-slither/3.png)

This leads to the SoundCloud profile of `_myst1cv1x3n_` and looking at the profile, I found that inside of `Prototype 2` there is a string:

![](/images/blog/operation-slither/4.png)

![](/images/blog/operation-slither/5.png)

```
VEhNe3MwY20xbnRfMDBwczNjX2Yxbmczcl9tMXNjbDFja30=
```


I had no idea what to do with it at first. Then I looked at it again and realized it is base64. Threw it into [base64decode.org](https://www.base64decode.org/) and got:

```
THM{s0cm1nt_00ps3c_f1ng3r_m1scl1ck}
```

I thought this was going to be the flag for task 1 but it turned out it was for task 2. So I accidentally solved task 2 before task 1. Fine, let's just go with it.

Looking at task 2:

```
60GB of data owned by TryTelecomMe is now up for bidding!

Number of users: 64500000
Accepting all types of crypto
For takers, send your bid on Threads via this handle:
[HIDDEN CONTENT]
--------------------------------------------------------------------------
```

I had already seen this on Threads so I went back and found the actual account behind it.

![](/images/blog/operation-slither/6.png)

I don't need to search and dig for answering those questions, I already had them.

**Task 2 answers:**
- Username of the second operator: `_myst1cv1x3n_`
- Flag: `THM{s0cm1nt_00ps3c_f1ng3r_m1scl1ck}`

---

## Going Back for Task 1

Now I still needed the flag for task 1. I went back through `@v3n0mbyt3_`'s replies on Threads and found another base64 string.

![](/images/blog/operation-slither/7.png)

Decoded it and got:

```
THM{sl1th3ry_tw33tz_4nd_l34ky_r3pl13s!}
```


**Task 1 flag:** `THM{sl1th3ry_tw33tz_4nd_l34ky_r3pl13s!}`

---

## Hunting the Third Operator

The task 3 post:

```
FOR SALE

Advanced automation scripts for phishing and initial access!

Inclusions:
- Terraform scripts for a resilient phishing infrastructure
- Updated Google Phishlet (evilginx v3.0)
- GoPhish automation scripts
- Google MFA bypass script
- Google account enumerator
- Automated Google brute-forcing script
- Cobalt Strike aggressor scripts
- SentinelOne, CrowdStrike, Cortex XDR bypass payloads

PRICE: $1500
Accepting all types of crypto
Contact me on REDACTED@protonmail.com
```

I started looking at `_myst1cv1x3n_`'s account for leads but that went nowhere.

Then I went back to the SoundCloud profile I had found earlier. There is a second track called `Prototype 2` and it is actually a conversation between the group. They talk about a GitHub repo in it. That was the piece I was missing.

Now I needed to find the third person. I looked at who was following `_myst1cv1x3n_` on SoundCloud and found a suspicious account. That gave me the third operator's handle: `sh4d0wF4NG`.

![](/images/blog/operation-slither/10.png)

Two out of three questions for task 3 were already answered from this:

Handle of the third operator: `sh4d0wF4NG`

Other platform they use: `github`


All I needed now was the flag. I searched `sh4d0wF4NG` on GitHub and found an account with a project called `red-team-infra`.

![](/images/blog/operation-slither/11.png)

I went through every file looking for something useful and found nothing obvious. So I switched to looking at the activity and commit history instead.

I went through almost everything before I finally found it. You have to navigate to the `.gitignore`, then there is a new gophish script:

![](/images/blog/operation-slither/12.png)

Then `terraform.tfstate.backup`.

![](/images/blog/operation-slither/13.png)

Then Load Diff

![](/images/blog/operation-slither/14.png)

Inside that file there is this:

![](/images/blog/operation-slither/15.png)

```
VEhNe3NoNHJwX2Y0bmd6X2wzNGszZF9ibDAwZHlfcHd9
```

Base64 again. Decoded:

```
THM{sh4rp_f4ngz_l34k3d_bl00dy_pw}
```

That is the last flag.

**Task 3 answers:**

Handle of the third operator: `sh4d0wF4NG`

Other platform: `github`

Flag: `THM{sh4rp_f4ngz_l34k3d_bl00dy_pw}`

---

## Wrapping Up

This was a really fun one. I got stuck a couple of times, mostly on finding the third operator because the SoundCloud second track was not obvious at all. But once I found that conversation the rest connected quickly.

The whole thing took around 30 minutes. The big takeaway is that people doing shady things online are sometimes incredibly careless about it.

---