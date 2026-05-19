---
title: "Digital Forensics Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-19
category: "writeup"
excerpt: "Walkthrough of TryHackMe's Digital Forensics Fundamentals room — Learn about digital forensics and related processes and experiment with a practical example."
image: "/images/blog/125.png"
readtime: "24 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction to Digital Forensics](#task-1)
- [Task 2 — Digital Forensics Methodology](#task-2)
- [Task 3 — Evidence Acquisition](#task-3)
- [Task 4 — Windows Forensics](#task-4)
- [Task 5 — Practical Example of Digital Forensics](#task-5)

---

## Task 1 — Introduction to Digital Forensics {#task-1}

Forensics. The CSI side of cyber security. If SOC work is being the cop on patrol, forensics is being the detective who shows up after something already happened and figures out what went down.

Digital forensics is just forensics applied to digital stuff. Instead of fingerprints and tire tracks, you're pulling metadata out of files, recovering deleted photos off a hard drive, dumping memory from a running computer, that kind of thing. The whole field exists because crimes don't happen in the physical world anymore, or at least most of them don't. They happen on laptops and phones and in the cloud.

The room kicks off with a story about a bank robbery to illustrate the idea. Cops raid the suspect's house, find a laptop, a phone, a hard drive, and a USB. They hand all of it to the digital forensics team. The team goes through everything carefully in their lab and finds:

- A digital map of the bank on the laptop
- A document with the entrance and escape routes on the hard drive
- Notes on how to bypass the bank's physical security
- Photos and videos of previous robberies
- Phone chats and call logs tying him to a group

Game over. That's enough evidence to put someone away, but only because the forensics team collected it the right way. If they messed up the collection process or contaminated the evidence, none of that stuff would be usable in court. That's the whole point of this room. Learning the proper procedures so the evidence holds up.

**Which team was handed the case by law enforcement?** `digital forensics`

---

## Task 2 — Digital Forensics Methodology {#task-2}

NIST (National Institute of Standards and Technology) has a four-phase process for how a forensics investigation should go. Pretty much every forensics team in the world follows some version of this.

### The four phases

**1. Collection.** Grab everything that might have evidence on it. Laptops, phones, USB drives, SD cards, etc. The big rule here is don't change anything. If you boot up the suspect's laptop and start clicking around, you've already altered timestamps, written stuff to the disk, and basically ruined your own evidence. We'll go into how you do this safely in the next task.

**2. Examination.** Once you have a pile of devices, you don't have time to look at every single file on every single one. You filter. If the case is about something that happened on June 5th, you focus on data from around that time. If the suspect had 8 user accounts on the machine, you focus on the one they used. The point of this phase is to narrow down to the stuff that matters.

**3. Analysis.** This is where the detective work happens. You take the filtered data and start piecing the story together. What did the suspect do, in what order, on which device. You correlate evidence from one device with evidence from another. Like, the laptop browser history shows them searching for a target's address at 2pm, and the phone GPS shows them at that address at 3pm. Now you have a timeline.

**4. Reporting.** Write it all up. Methodology, findings, evidence chain, conclusions. The report has to be readable by people who aren't technical because it might end up in front of a judge or a CEO. Always include an executive summary because the people deciding what to do about your findings often won't read the full 80-page technical report.

### Types of digital forensics

Forensics isn't one thing, it's a bunch of specializations depending on what kind of device or data you're dealing with.

**Computer forensics** is the big one. Laptops and desktops. This is what most people picture when they hear "digital forensics."

**Mobile forensics** is its own world. Phones store crazy amounts of data, call logs, texts, location history, app data. Different tools, different challenges, because phones are way more locked down than computers.

**Network forensics** is investigating the network itself, not the endpoints. You're looking at traffic captures (pcaps), firewall logs, IDS alerts, that sort of thing. Useful when you don't have the attacker's machine but you have a record of what they sent over the wire.

**Database forensics** is for cases where someone messed with a database directly. Insider stealing customer data, attacker dumping a table, that kind of thing. You're looking at database logs, transaction histories, audit trails.

**Cloud forensics** is the annoying one. When everything lives in AWS or Azure or whatever, you don't have the physical hardware. You're at the mercy of whatever logs the cloud provider gives you, and that varies a lot. This is hard mode forensics.

**Email forensics** is mostly about phishing and fraud. Looking at email headers to trace where a message came from, checking if attachments are malicious, figuring out if an account was compromised or if the user sent the weird email themselves.

**Which phase of digital forensics is concerned with correlating the collected data to draw any conclusions from it?** `Analysis`

**Which phase of digital forensics is concerned with extracting the data of interest from the collected evidence?** `Examination`

---

## Task 3 — Evidence Acquisition {#task-3}

Collecting evidence is way more careful than people think. You can't just grab the laptop, unplug it, and throw it in a bag. There are rules, and if you break them, all your evidence might be thrown out in court.

### Authorization

You need permission first. Whether that's a search warrant for a criminal case, or written approval from a company's legal team for an internal investigation, doesn't matter. If you start collecting data without proper authorization, anything you find could be unusable. Worse, you might be committing a crime yourself depending on the country.

This is the part people new to the field skip past, but it matters more than the technical stuff. The fanciest forensic skills in the world mean nothing if your evidence gets thrown out because you didn't have the paperwork.

### Chain of Custody

The chain of custody is a document. Just paperwork. But it's the most important paperwork in the whole investigation.

It tracks every single piece of evidence from the moment it's collected. Who collected it, when, where, where it's stored, every single person who touched it after that, and when they touched it. If a USB drive sits in evidence for three months and a defense lawyer asks "how do we know nobody tampered with this," the chain of custody document is the answer. It shows who had access and when.

The kinds of stuff a chain of custody captures:

- What the evidence is (description, type, serial numbers if any)
- Who collected it
- When and where it was collected
- Where it's being stored (sealed evidence bag, locked safe, specific room, whatever)
- Every person who's accessed it, with timestamps

Skip the chain of custody and you've basically given the defense an easy win.

NIST has a sample chain of custody form on their website you can download to see what one looks like in practice.

### Write Blockers

This is the cool tool part. A write blocker is a physical device (or sometimes software) that sits between your forensic workstation and the suspect's storage device. It lets you READ from the device but physically blocks any writes.

Why? When you plug a hard drive into a Windows machine, Windows does a TON of stuff in the background. It updates timestamps. It writes thumbnail caches. It might index the drive. It might offer to "fix" the file system. Any of that activity changes the data on the drive, which means it's no longer in its original state, which means in court the defense can argue the evidence was tampered with.

A write blocker stops all of that. The forensic workstation can read everything, dump the disk image, do its thing, but absolutely nothing gets written back to the original drive. The drive stays in the exact state it was in when it was seized.

Without a write blocker you're already losing before you start. Every serious forensic kit has one.

**Which tool is used to ensure data integrity during the collection?** `write blocker`

**What is the name of the document that has all the details of the collected digital evidence?** `chain of custody`

---

## Task 4 — Windows Forensics {#task-4}

Most computers seized in investigations are running Windows because most computers in the world run Windows. So Windows forensics is the bread and butter of the field.

When you're collecting evidence from a Windows machine, you take two kinds of images.

### Disk image vs Memory image

**Disk image.** A bit-by-bit copy of the entire storage device. Every single byte on the hard drive or SSD gets copied into one big file. Files, deleted files (which usually aren't gone, just marked as deleted), browser history, registry hives, all of it. Disk data is non-volatile, meaning it survives a reboot. You can take a disk image at your leisure once you have the machine.

**Memory image.** A copy of what's currently in RAM. This includes running processes, open files, active network connections, decrypted versions of stuff that's encrypted on disk, passwords in memory, all the good stuff. The catch, RAM is volatile. The second the machine powers off or restarts, everything in RAM is gone forever.

This is why memory images get taken FIRST in real investigations. If you walk into a room with a running suspect machine, you image the memory before you ever touch the power button. Once you shut it down, you've lost potentially the most interesting evidence in the case. Open chat windows, decryption keys, processes that were running, all gone.

### The tools

**FTK Imager.** The classic for disk imaging on Windows. Nice GUI, easy to use, supports a bunch of image formats. Can also analyze images after the fact. Free, which is rare in this field where most tools cost money.

**Autopsy.** Open source, free, and really good. You feed it a disk image and it tears through the whole thing looking for stuff. Deleted files, browser artifacts, file metadata, keyword search, file extension mismatches (renamed an `.exe` to `.txt`? Autopsy will catch that). This is the tool you'll see in basically every forensics course.

**DumpIt.** Tiny command-line tool that takes a memory image. You run it, it dumps RAM to a file. That's it. Stupidly simple, which is exactly what you want in a memory acquisition tool because the simpler the tool, the less it changes the system you're imaging.

**Volatility.** The memory analysis tool. Free, open source, written in Python. Has a plugin system where each plugin pulls a specific kind of info out of a memory image. Want to see what processes were running? There's a plugin for that. Want to find network connections? Plugin. Want to extract password hashes from memory? Plugin. Volatility is a beast and you'll use it in every memory forensics challenge you ever do.

**Which type of forensic image is taken to collect the volatile data from the operating system?** `Memory Image`

---

## Task 5 — Practical Example of Digital Forensics {#task-5}

Finally something hands on. And it's a fun scenario, somebody kidnapped a cat named Gado and sent a ransom letter. We have the ransom document. Our job is to pull metadata out of it and figure out who sent it.

This is a really good intro example because it shows how much data files leak about themselves without you ever realizing. Every Word document you've ever made, every photo you've ever taken on your phone, has a pile of metadata baked in that says where it came from, who made it, when, and sometimes where on earth it physically was at the time.

### Setup

Fire up the AttackBox. Open a terminal. Navigate to the case files:

```bash
cd /root/Rooms/introdigitalforensics
```

You'll see two files, the ransom letter as a PDF, and an image that was attached to the original Word document.

### Pulling metadata from the PDF

The tool for this is `pdfinfo`. It comes with `poppler-utils` and it's already on the AttackBox. If you're on Kali and somehow don't have it:

```bash
sudo apt install poppler-utils
```

Run it on the ransom letter:

```bash
pdfinfo ransom-letter.pdf
```

You'll get back a bunch of fields. Title, Author, Creator, Producer, CreationDate, ModDate, etc. The one we care about right now is **Author**. That's the question. Look at the Author field in the output.

`Ann Gree Shepherd`. The kidnapper made the document under their own name. People forget that Word automatically stamps the author field with whatever account name is logged into Office when you create the doc. Or they just don't know that field exists. Either way, it's there in plain text.

That's already a big lead. We have a name.

### Pulling EXIF data from the image

Now the image. EXIF (Exchangeable Image File Format) is the metadata standard for image files. Every photo your phone takes has EXIF data attached. Camera model, lens, focal length, ISO, shutter speed, and crucially on modern phones, GPS coordinates. Most people have no idea this is happening every single time they snap a photo.

The tool is `exiftool`. Already installed on the AttackBox. On Kali if needed:

```bash
sudo apt install libimage-exiftool-perl
```

Run it:

```bash
exiftool IMAGE.jpg
```

You'll get a wall of output. Scroll through it and look for two things.

First, **Camera Model Name**. That answers the third question. `Canon EOS R6`. So this wasn't even taken on a phone, it's a proper DSLR. Which makes it weirder that they left the EXIF data in, because a photographer using an R6 probably knows what EXIF is. They just forgot.

Second, **GPS Position**. That gives you the latitude and longitude where the photo was taken. The format will be something like `51 deg 31' 4.00" N, 0 deg 5' 48.30" W`. To plug this into Google Maps you have to clean it up a bit. Replace `deg` with `°` and squish the spaces. So it becomes something like:

```
51°31'4.0"N 0°5'48.3"W
```

Paste that into Google Maps or Bing Maps and zoom in. The pin lands on a street in London. The street name is `Milk Street`.

That's wild when you think about it. Someone took a photo, attached it to a ransom letter, and along with the image they accidentally shipped the exact GPS coordinates of where they took the photo.

**Using `pdfinfo`, find out the author of the attached PDF file, `ransom-letter.pdf`.** `Ann Gree Shepherd`

**Using `exiftool` or any similar tool, try to find where the kidnappers took the image they attached to their document. What is the name of the street?** `Milk Street`

**What is the model name of the camera used to take this photo?** `Canon EOS R6`

---

## Wrap up

That's the room. Mostly theory again, but the practical at the end is useful because it teaches a habit you should already have if you're going to be poking at files for a living. Always check the metadata.

The two big takeaways here are the methodology side (collection → examination → analysis → reporting) and the procedural stuff like chain of custody and write blockers. These aren't sexy topics. They're also the difference between a case that goes to court and a case that gets thrown out. Real forensics work is 80% paperwork and procedure, 20% cool technical wizardry. People come into the field expecting the wizardry and get burned out when they realize how much of the job is documentation.

Couple of practical notes from doing this stuff for fun.

One, `exiftool` works on a LOT more than just JPEGs. PDFs, Word docs, MP4s, RAW camera files, audio files. Anytime you have an unknown file and want to know more about it, exiftool is a good first move. Way more comprehensive than `pdfinfo` for most stuff.

Two, this stuff cuts both ways. Same way you can yank GPS coordinates out of a photo someone else sent you, anyone you send a photo to can yank GPS coordinates out of yours. Most social media sites strip EXIF when you upload (Twitter does, Facebook does), but a lot of messaging apps don't. Worth knowing.

Three, if you ever do this for real, do it on copies. Never run analysis tools on original evidence. Image the disk, then analyze the image. Image the image if you have to, but never touch the original. Same rule as the write blocker, just at the software level.

---