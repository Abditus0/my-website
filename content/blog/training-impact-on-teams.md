---
title: "Training Impact on Teams — TryHackMe Cyber Security 101"
date: 2026-05-18
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Training Impact on Teams room — Discover the impact of training on teams and organisations."
image: "/images/blog/145.png"
readtime: "15 min read"
draft: false
---

## Tasks

- [Task 1 — Understanding the Impact of Cyber Security Training](#task-1)
- [Task 2 — Cyber Security Training for Large Organisations](#task-2)
- [Task 3 — Write a Cyber Security Training Investment Proposal](#task-3)
- [Task 4 — Vendor Selection](#task-4)
- [Task 5 — Conclusion](#task-5)

---

## Task 1 — Understanding the Impact of Cyber Security Training {#task-1}

Heads up before we start, this room is basically a TryHackMe ad. The whole thing is about why companies should buy training (specifically theirs). It's not really a technical room, it's more of a "here's why your boss should pay for this" pitch.

That said, the underlying point is fair. You don't become good at security by reading about it. You become good by doing it, breaking stuff in a safe environment, and screwing up where it doesn't matter. And the reason platforms like TryHackMe (or HackTheBox, or whatever you use) exist is because you can't exactly practice exploiting things on production systems without going to jail.

The room makes a few points about training from a company's perspective:

- It's better to learn in a lab than during an actual incident. Yeah obviously.
- Training increases team capacity without having to hire more people. A trained team handles more.
- It lets you hire junior people and bring them up to speed faster, instead of having seniors waste time teaching the same stuff over and over.
- Standardised training gives you a real way to measure people's skills instead of just slapping "junior" or "senior" on them and hoping that means something.
- It can also be fun, like CTFs build team bonds and stuff.

The "junior vs senior" point is the most useful one in this whole room IMO. Those titles mean basically nothing across companies. Someone called "senior" at one place is "junior" at another. If you have actual skills tracking based on what people have completed and demonstrated, that's way more useful than a job title.

**What is the most efficient way to ramp up the skills of a junior hire in cyber security?** `Training`

---

## Task 2 — Cyber Security Training for Large Organisations {#task-2}

This is where the room gets really sales-pitchy. The gist is that small teams can use off-the-shelf training (just buy the standard stuff), but bigger teams might want to customise it. TryHackMe has a thing called Content Studio that lets companies tweak modules or build their own.

The other thing it mentions is that big companies want integration with their existing systems. SSO so people don't have to remember another login, APIs so the training platform can talk to their HR systems or whatever. This is the kind of stuff that matters a lot when you're at a company of 5000 people and nothing matters at all when you're a solo person learning at home.

Not much to unpack here, just answer the question and move on.

**What is the name of the dashboard that TryHackMe offers for companies to create customised training paths?** `Content Studio`

---

## Task 3 — Write a Cyber Security Training Investment Proposal {#task-3}

Okay this is the math task. They want you to figure out the ROI on training a team. It's pretty simple once you see the formula but if you're tired and reading fast it's easy to mess up. The room walks through one example first then asks you to do another one with different numbers.

### The example they give you

Setup:
- 10 employees on the team
- Each one costs $80,000 a year in salary
- Training is assumed to make people 4% more productive
- Training itself costs $500 per employee

The way the math works is:

**Savings** = number of employees × productivity boost × cost per employee
= 10 × 4% × $80,000
= 10 × 0.04 × 80,000
= $32,000

So you "gain" $32,000 worth of productivity from a more efficient team.

**Total training cost** = number of employees × cost per employee
= 10 × $500
= $5,000

**ROI** = savings divided by cost
= $32,000 / $5,000
= 6.4
= 640%

That's the example.

### The actual question

Now they change the numbers:
- 20 employees
- $50,000 per employee per year
- Still 4% productivity boost
- Still $500 per employee for training

**Savings** = 20 × 4% × $50,000
= 20 × 0.04 × 50,000
= $40,000

**Cost** = 20 × $500 = $10,000

**ROI** = $40,000 / $10,000 = 4 = 400%

There's also a proposal template you can download from the task. Honestly if you ever  need to pitch training to a boss it's not a bad starting point. For the room you don't  need it, just the math above.

**What would be the savings due to the increased productivity?** `40000`

**Assuming that training costs $500 per employee, what is the Return on Investment?** `400%`

Heads up on this one, when you type the answer make sure you include the % sign because TryHackMe is picky about exact answer format. If you just put `400` it might not accept it.

---

## Task 4 — Vendor Selection {#task-4}

No questions here, just a checklist of things to think about when picking a training vendor. The list is basically:

- Who are you buying this for? Different roles need different training.
- Does the vendor have experience with companies like yours?
- Is the content deep enough on the topics you care about, or is it surface level?
- Can people learn AND practice on the same platform, or do they have to bounce between sites?
- And yeah, cost matters, but compared to what cyber security people cost to employ, the training is cheap.

That's it. Just read it and click through.

---

## Task 5 — Conclusion {#task-5}

Wrap up paragraph saying training is good, lifelong learning is good, and oh by the way here are the TryHackMe Business and Classrooms links if you want to give us money. That's the whole task.

No questions. Done.

---

## Wrap up

Yeah, this room is a marketing piece more than a real lesson. Don't feel bad if you blast through it in like 10 minutes, that's pretty much all it deserves. The math task is the only thing that requires you to think and even that is just multiplication and division.

Couple takeaways though that aren't totally useless:

One, if you ever want to ask your company to pay for training, the ROI math from Task 3 is a decent angle. Bosses respond to "this saves us money" way better than "I want to learn things." Frame it as productivity savings vs cost and most managers will sign off.

Two, the point about job titles being meaningless and skill-based tracking being more useful is genuinely true. If you're job hunting it's way more impressive to say "I've completed these specific paths and can demonstrate these specific skills" than "I'm a senior something or other."

Three, don't sleep on the team aspect of CTFs. The room mentions it briefly but seriously, doing a CTF with a few friends or coworkers is one of the best ways to build actual relationships in this field. Way more memorable than a training video.

Onto the next one.

---