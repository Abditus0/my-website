---
title: "Dig Dug"
date: 2026-03-27
category: "ctf"
excerpt: "Walkthrough of the TryHackMe Dig Dug challenge - Turns out this machine is a DNS server - it's time to get your shovels out!"
image: "/images/blog/33.png"
readtime: "5 min read"
draft: false
---

## What Is Going On Here

Before jumping in, let me break down the setup because it is a little different.

We have two things to work with:

- `givemetheflag.com` is the target domain we want info about
- `10.112.180.174` is a DNS server set up specifically for this CTF

The thing is, you cannot just Google `givemetheflag.com` or run a normal DNS lookup and expect to find anything useful. Regular DNS servers out there on the internet have no idea about this domain. Only this specific server at `10.112.180.174` has been configured to know about it, and it is hiding the flag somewhere in its records.

So the goal is simple: point our DNS query directly at that server and ask it what it knows about `givemetheflag.com`.

---

## Start Digging

When you query a specific DNS server instead of your default one, the `dig` syntax looks like this:
```bash
dig @(dns server ip) example.com (record type)
```

The `@` tells dig to go ask that specific server instead of whatever your system normally uses. So in my case, I will start with an A record query:
```bash
dig @10.112.180.174 givemetheflag.com A
```

![](/images/blog/dig-dug/1.png)

I was not expecting to get the flag that fast, but okay.

---

## We Asked for A But Got TXT?

Yeah, a little weird. We asked for an A record, which normally returns an IP address. But the server shot back a TXT record with the flag in it instead.

This is just a misconfigured server doing its own thing, basically set up to dump the TXT record no matter what record type you ask for. Not something you would see in the wild, but it works for a CTF.

The more interesting takeaway is why TXT records are worth checking in real engagements. Companies use them for all kinds of things:

- Domain verification tokens for services like Google or Microsoft
- SPF and DMARC email config, which can tell you a lot about how their email security is set up
- Sometimes just plain sensitive info that someone forgot was public (this challenge)

So whenever you are doing recon on a domain, always throw a TXT query in there.

**Flag:** `flag{0767ccd06e79853318f25aeb08ff83e2}`
