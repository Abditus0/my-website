---
title: "Linux Fundamentals Part 2 — TryHackMe Cyber Security 101"
date: 2026-04-07
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Linux Fundamentals Part 2 room - Continue your learning Linux journey with part two. You will be learning how to log in to a Linux machine using SSH, how to advance your commands, file system interaction."
image: "/images/blog/56.png"
readtime: "22 min read"
draft: false
---

# Linux Fundamentals Part 2

This is Linux Fundamentals Part 2, and things start getting a bit more real. If you skipped Part 1, go back and do that first.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Accessing Your Linux Machine Using SSH (Deploy)](#task-2)
- [Task 3 — Introduction to Flags and Switches](#task-3)
- [Task 4 — Filesystem Interaction Continued](#task-4)
- [Task 5 — Permissions 101](#task-5)
- [Task 6 — Common Directories](#task-6)
- [Task 7 — Conclusions and Summaries](#task-7)
- [Task 8 — Linux Fundamentals Part 3](#task-8)

---

## Task 1 — Introduction {#task-1}

So Part 1 had you running commands in a browser based machine, which was a nice and cozy way to start. Part 2 throws that out and has you connecting to a real remote machine over SSH like an actual human being.

On top of that, this room covers flags and switches to make your commands actually useful, more filesystem commands, how file permissions work, and a tour of some important Linux directories. There is a lot going on but none of it is too bad once you sit with it for a bit.

---

## Task 2 — Accessing Your Linux Machine Using SSH {#task-2}

This is where the in browser machine gets retired. From here on out you are using SSH, which stands for Secure Shell. It is basically just a way to connect to another machine over a network and control it through a terminal. Everything you type gets encrypted before it travels over the internet and then decrypted on the other end. So no one snooping on the network can see what you are doing.

For this room you need two machines running. First you start the target Linux machine using the green Start Machine button. It gives you an IP address that we are going to use in a bit. Then you start the TryHackMe AttackBox, which is a separate Ubuntu machine that runs in your browser and is what you actually type your commands into.

Once the AttackBox is up, open a terminal from the desktop and use this format to connect:

```bash
ssh tryhackme@MACHINE_IP
```

Replace MACHINE_IP with whatever IP the room gave you. It will ask if you want to trust the host, say yes, and then it asks for a password. The password is `tryhackme`. When you type the password nothing shows up on screen. No dots, no asterisks, nothing. It looks like it is broken but it is not. Just type the password and hit enter.

After that, any command you run is running on the remote machine, not your own.

---

## Task 3 — Introduction to Flags and Switches {#task-3}

So you already know `ls` from Part 1. You type it and it shows you what is in the current directory. But here is the thing, by default it hides stuff. Hidden files and folders, the ones with a `.` at the start of their name, just do not show up. You would never know they were there.

That is where flags come in. Flags are extra options you pass to a command using a hyphen. So to make `ls` show hidden files too, you use:

```bash
ls -a
```

That `-a` flag is short for `--all`. Now all those hidden folders starting with `.` show up.

If you have no idea what flags a command supports, you can ask it directly:

```bash
ls --help
```

This prints out a big list of every option the command accepts with a short description of each. It is a lot to read but it is all there if you need it.

The cleaner version of this is the manual page. You access it with `man` followed by the command you want to look up:

```bash
man ls
```

This opens the full documentation for `ls` inside the terminal. You scroll through it using the arrow keys and press `q` to quit when you are done.

**Question: What directional arrow key would we use to navigate down the manual page?** `down`

**Question: What flag would we use to display the output in a "human-readable" way?** `-h`

---

## Task 4 — Filesystem Interaction Continued {#task-4}

Part 1 covered moving around and reading files. Now you get the commands to actually do things, like create, copy, move, and delete.

`touch` creates a new empty file. Just give it a name:

```bash
touch note
```

That creates a blank file called note. It does not put anything in it, it is just an empty file.

`mkdir` creates a folder. Same idea:

```bash
mkdir mydirectory
```

Now there is a new folder called mydirectory.

`rm` deletes a file:

```bash
rm note
```

Gone. If you want to delete a whole folder you need the `-R` flag, which stands for recursive, meaning it goes in and deletes everything inside it too:

```bash
rm -R mydirectory
```

Use that one carefully. There is no recycle bin here.

`cp` copies a file. You give it the original file name and then the name you want for the copy:

```bash
cp note note2
```

Now you have both note and note2, and note2 has the same contents.

`mv` moves a file. You give it the file and then the destination. But it doubles as a rename tool too, so if you do this:

```bash
mv note2 note3
```

note2 is now called note3. Same file, different name.

`file` tells you what type a file actually is. File extensions in Linux are not required, so a file could be called anything and you would not know what is inside it just by looking at the name. Running `file` on it sorts that out:

```bash
file unknown1
```

**Question: How would you create the file named "newnote"?** `touch newnote`

**Question: On the deployable machine, what is the file type of "unknown1" in "tryhackme's" home directory?** `ASCII text`

**Question: How would we move the file "myfile" to the directory "myfolder"?** `mv myfile myfolder`

**Question: What are the contents of this file?** `THM{FILESYSTEM}`

---

## Task 5 — Permissions 101 {#task-5}

Not every user on a Linux system can access every file. Permissions control who can read, write, or execute any given file or folder. To see permissions, you run `ls` with the `-l` flag:

```bash
ls -lh
```

You get output that looks like this:

```bash
-rw-r--r-- 1 cmnatic cmnatic 0 Feb 19 10:37 file1
```

That `-rw-r--r--` at the start is the permissions string. It is split into three groups of three characters, and each group covers a different set of users.

The first group is the owner, the second is the group, and the third is everyone else. Each group can have `r` for read, `w` for write, and `x` for execute. If the letter is replaced by a `-` then that permission is not set.

You will also see permissions written as numbers sometimes. Each permission has a value. Read is 4, write is 2, execute is 1. You add them together for each group. So `rwx` is 7, `rw-` is 6, `r--` is 4, and so on. That is why you see things like `chmod 755` or `chmod 644` in Linux. It is just a shorthand for the full permissions string.

Now, switching between users. The command is `su`, short for switch user:

```bash
su user2
```

It will ask for that user's password. After that you are operating as user2. If you use the `-l` flag it drops you straight into that user's home directory instead of staying where you were:

```bash
su -l user2
```

Without `-l` you switch users but stay in the previous user's home folder, which can be a bit confusing. With `-l` it behaves like you actually logged in as that user properly.

**Question: On the deployable machine, who is the owner of "important"?** `user2`

**Question: What would the command be to switch to the user "user2"?** `su user2`

**Question: Output the contents of "important", what is the flag?** `THM{SU_USER2}`

To get that flag I switched to user2 with `su -l user2`, password was `user2`, then just ran `cat important` and there it was.

---

## Task 6 — Common Directories {#task-6}

This task walks you through four important directories that exist on pretty much every Linux system. Good to know where things live.

`/etc` is where system configuration files are stored. If you are poking around a Linux machine and want to find things like user lists or password hashes, this is one of the first places you look. The `passwd` and `shadow` files in here store user account info and encrypted passwords. The `sudoers` file controls who is allowed to run commands as root.

`/var` is for variable data. Stuff that changes all the time. Logs from running services end up in `/var/log`, which is super useful when you are trying to figure out what has been happening on a machine. Databases and other application data tend to live here too.

`/root` is the home folder for the root user specifically. Not to be confused with `/` which is the root of the whole filesystem. The root user is the most powerful account on the system and their personal home directory is `/root`, not `/home/root` like you might expect.

`/tmp` is temporary storage. It gets wiped on every reboot. Anything in here is not meant to stick around. From a pentesting angle this is actually a handy place to drop scripts or tools after you get access to a machine because every user has write access to it by default.

**Question: What is the directory path that would we expect logs to be stored in?** `/var/log`

**Question: What root directory is similar to how RAM on a computer works?** `/tmp`

**Question: Name the home directory of the root user.** `/root`

---

## Task 7 — Conclusions and Summaries {#task-7}

That was a solid chunk of stuff. SSH into remote machines, flags and switches, more filesystem commands, permissions and switching users, and a tour of the key root directories. Part 1 was the warm up, this is where it starts feeling like actual Linux usage.

---

## Task 8 — Linux Fundamentals Part 3 {#task-8}

On to the third and final part. The room links directly to it so just follow that and keep going.