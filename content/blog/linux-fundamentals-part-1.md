---
title: "Linux Fundamentals Part 1 — TryHackMe Cyber Security 101"
date: 2026-04-06
category: "writeup"
excerpt: "First room in the Linux Fundamentals series - Embark on the journey of learning the fundamentals of Linux. Learn to run some of the first essential commands on an interactive terminal."
image: "/images/blog/55.png"
readtime: "15 min read"
draft: false
---

# Linux Fundamentals Part 1

We are continuing the Cyber Security 101 path. This one is Linux Fundamentals Part 1, which is a three part series.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — A Bit of Background on Linux](#task-2)
- [Task 3 — Interacting With Your First Linux Machine (In-Browser)](#task-3)
- [Task 4 — Running Your First few Commands](#task-4)
- [Task 5 — Interacting With the Filesystem!](#task-5)
- [Task 6 — Searching for Files](#task-6)
- [Task 7 — An Introduction to Shell Operators](#task-7)
- [Task 8 — Conclusions & Summaries](#task-8)
- [Task 9 — Linux Fundamentals Part 2](#task-9)

---

## Task 1 — Introduction {#task-1}

Linux is one of the most popular operating systems in the world. It powers smart cars, Android devices, supercomputers, home appliances, and enterprise servers. So yeah, it is kind of everywhere whether you notice it or not.

The plan for this room is pretty straightforward. You are going to run some commands in a Linux machine that runs inside your browser, learn some essential commands for working with the filesystem, learn how to search for files, and get introduced to shell operators.

Nothing too wild yet. Just setting expectations.

---

## Task 2 — A Bit of Background on Linux {#task-2}

This task gives you a bit of context on what Linux actually is and where it shows up in the real world.

First thing the room points out is that Linux is more lightweight than Windows, and you have probably used it without even knowing it. It runs the websites you visit, the checkout at shops, traffic light controllers, and car entertainment systems. So it is not just something for servers and hackers. It is everywhere.

Then it explains that Linux is actually an umbrella term. It is not one single operating system. It is a whole family of operating systems all based on something called UNIX. Because Linux is open source, people have built all kinds of different versions of it called distributions, or distros for short. Ubuntu and Debian are two of the more common ones. This room uses Ubuntu specifically.

Ubuntu Server can run on systems with only 512MB of RAM.

**Question: What year was the first release of a Linux operating system?** `1991`

---

## Task 3 — Interacting With Your First Linux Machine {#task-3}

This task is basically just telling you to hit the Start Machine button and wait for your browser-based Linux machine to spin up. There are no questions here, it is just the setup step before things actually get going.

---

## Task 4 — Running Your First Few Commands {#task-4}

The room explains that a lot of Linux systems, especially servers, do not have a graphical interface. No desktop, no icons, no taskbar. Just a text input waiting for you to tell it what to do. That is the terminal, and it is going to be your main way of interacting with Linux going forward.

It looks like this:
```bash
tryhackme@linux1:~$ enter commands here
```

The two commands this task introduces are `echo` and `whoami`.

`echo` just outputs text. If you type `echo Hello` it prints Hello back at you. If your text has spaces in it, you wrap it in double quotes, like `echo "Hello Friend!"`. Simple enough.

`whoami` tells you which user you are currently logged in as. That is it.

**Question: If we wanted to output the text "TryHackMe", what would our command be?** `echo TryHackMe`

**Question: What is the username of who you're logged in as on your deployed Linux machine?** `tryhackme`

---

## Task 5 — Interacting With the Filesystem {#task-5}

You need to be able to move around the system, see what files exist, and read them. Otherwise what is even the point.

The four commands this task covers are `ls`, `cd`, `cat`, and `pwd`.

`ls` lists what is in your current directory. You just type it and it shows you all the folders and files. You can also do `ls Pictures` to peek inside a folder without actually going into it, which is a handy little shortcut.

`cd` is how you move around. It stands for change directory. So if you want to go into the Pictures folder you type `cd Pictures`. And then from there you can run `ls` again to see what is inside it.

`cat` outputs the contents of a file. It stands for concatenate, which sounds fancy but it basically just means "show me what is in this thing." So `cat todo.txt` would print whatever is written in that file. The room also points out that sometimes usernames and passwords are stored in plain text files, which is terrifying but also useful to know.

`pwd` tells you exactly where you are in the filesystem. It stands for print working directory. When you are deep inside a bunch of nested folders and you have lost track of where you are, `pwd` just prints out the full path so you can get your bearings. Like `/home/ubuntu/Documents`. Super helpful.

**Question: On the Linux machine that you deploy, how many folders are there?** `4`

**Question: Which directory contains a file?** `folder4`

**Question: What is the contents of this file?** `Hello World`

**Question: Use the cd command to navigate to this file and find out the new current working directory. What is the path?** `/home/tryhackme/folder4`

---

## Task 6 — Searching for Files {#task-6}

Instead of clicking through folders looking for a file, you can just ask the system to find it for you.

The first tool is `find`. If you know the name of the file you are looking for, you can do `find -name passwords.txt` and it will go through every folder from where you are and find it. No manual digging required.

If you do not know the exact name but you know the file type, you can use a wildcard. Something like `find -name *.txt` will find every single text file it can get to. So if there is a passwords.txt hiding in some folder you forgot about, it will turn up.

The second tool is `grep`. This one is different because instead of searching for a file by name, it searches for specific content inside files. So if you have a log file with hundreds of lines and you want to find every entry from a specific IP address, you do `grep "81.143.211.90" access.log` and it pulls out only the lines that match.

There is also a recursive version using `grep -R` which searches through every file in a directory and all its subdirectories at once. So if you are not sure which file contains the thing you are looking for, you can cast a wide net.

**Question: Use grep on "access.log" to find the flag that has a prefix of "THM". What is the flag?** `THM{ACCESS}`

---

## Task 7 — An Introduction to Shell Operators {#task-7}

Shell operators are little symbols that change what your commands do or how they behave together. The room covers four of them.

The first is `&`. This runs a command in the background. So if you are copying a huge file and you do not want to just sit there waiting, you stick an `&` at the end and the command runs in the background while you get on with other things.

The second is `&&`. This one lets you chain two commands together on one line. The key thing is that the second command only runs if the first one actually succeeded. So `command1 && command2` means "do command1, and if that worked, do command2."

The third is `>`. This is an output redirector. Instead of printing the result of a command to your terminal, it sends it somewhere else. The classic example is `echo hey > welcome` which creates a file called welcome and puts the word "hey" in it. The catch is that if the file already exists, it gets completely overwritten. Everything that was in there before is gone.

The fourth is `>>`. This does the same thing as `>` but instead of overwriting, it appends. So if welcome already has "hey" in it and you do `echo hello >> welcome`, the file will now have both "hey" and "hello" in it. Nothing gets erased.

**Question: If we wanted to run a command in the background, what operator would we want to use?** `&`

**Question: If I wanted to replace the contents of a file named "passwords" with the word "password123", what would my command be?** `echo password123 > passwords`

**Question: Now if I wanted to add "tryhackme" to this file named "passwords" but also keep "passwords123", what would my command be?** `echo tryhackme >> passwords`

---

## Task 8 — Conclusions and Summaries {#task-8}

The room wraps up by going over everything covered. Why Linux exists and where it shows up, how to navigate the filesystem with `ls`, `cd`, `cat`, and `pwd`, how to search for files using `find` and `grep`, and how shell operators can make your commands more powerful.

---

## Task 9 — Linux Fundamentals Part 2 {#task-9}

This task just points you to the next room in the series. On to part 2.