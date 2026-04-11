---
title: "Linux Fundamentals Part 3 — TryHackMe Cyber Security 101"
date: 2026-04-08
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Linux Fundamentals Part 3 room - Power-up your Linux skills and get hands-on with some common utilities that you are likely to use day-to-day!"
image: "/images/blog/57.png"
readtime: "35 min read"
draft: false
---

# Linux Fundamentals Part 3

The last part of the Linux Fundamentals module. Parts 1 and 2 got you walking, this one is supposed to get you running. Text editors, downloading files, processes, scheduling tasks, package management, and reading logs. A lot of ground to cover but nothing that is going to break your brain.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Deploy Your Linux Machine](#task-2)
- [Task 3 — Terminal Text Editors](#task-3)
- [Task 4 — General/Useful Utilities](#task-4)
- [Task 5 — Processes 101](#task-5)
- [Task 6 — Maintaining Your System: Automation](#task-6)
- [Task 7 — Maintaining Your System: Package Management](#task-7)
- [Task 8 — Maintaining Your System: Logs](#task-8)
- [Task 9 — Conclusions & Summaries](#task-9)

---

## Task 1 — Introduction {#task-1}

The room pretty much says hey, you made it to part three, good job. From here you are going to learn things you would actually use on a real Linux machine on a regular basis. Text editors so you can stop abusing `echo` to write files, ways to move files around, how processes work, how to automate stuff, how packages are managed, and how to read logs when something inevitably goes wrong.

This is where Linux starts feeling less like a puzzle and more like an actual tool.

---

## Task 2 — Deploy Your Linux Machine {#task-2}

Same setup as Part 2. Hit the green Start Machine button, grab the IP, start the AttackBox, open a terminal and SSH in:

```bash
ssh tryhackme@MACHINE_IP
```

Password is `tryhackme`. Nothing shows when you type it, that is normal, just hit enter.

---

## Task 3 — Terminal Text Editors {#task-3}

Up until now every time you needed to put something in a file you were doing something like:

```bash
echo "some text" > myfile
```

Which works fine for one line but the second you need to write anything with actual structure it falls apart completely. So let's talk about real text editors.

**Nano**

Nano is the beginner friendly one. To create or open a file with nano you just do:

```bash
nano myfile
```

It opens in the terminal and you can just start typing. No weird modes, no commands to memorize before you can even type a letter. You navigate with the arrow keys and start new lines with enter like a normal person.

The bottom of the screen shows you shortcuts. The `^` symbol means Ctrl. So `^X` means Ctrl+X which exits nano. If you made changes it will ask if you want to save, hit `Y` and then enter to confirm the filename.

The main things nano can do that you will use:

Search for text with Ctrl+W

Copy and paste with Alt+6 to copy a line and Ctrl+U to paste

Jump to a specific line number with Ctrl+_ (underscore)

See what line you are on with Ctrl+C

That covers basically everything you need day to day. Go and test it!

**VIM**

VIM is also in this task and the room mentions it mainly so you know it exists. It is way more powerful than nano but the learning curve is genuinely steep. The thing that trips everyone up the first time is that VIM has different modes. You open it and you cannot just start typing because you are in normal mode, not insert mode. You press `i` to start typing and `Esc` to go back to normal mode and `:q!` to quit without saving and `:wq` to save and quit. If you accidentally open VIM and cannot get out, that is why.

TryHackMe has a whole separate room for VIM if you want to go deep on it later. For now nano is fine.

**Question: Edit "task3" located in "tryhackme"'s home directory using Nano. What is the flag?**

Opened the file with:

```bash
nano task3
```

Flag was there in the file.

`THM{TEXT_EDITORS}`

---

## Task 4 — General/Useful Utilities {#task-4}

This task is about moving files around in different ways. There are three methods covered here and they are all useful in different situations.

**Downloading Files with wget**

`wget` lets you download a file from the internet directly into your terminal. You just give it the URL:

```bash
wget https://assets.tryhackme.com/additional/linux-fundamentals/part3/myfile.txt
```

It will download the file into whatever directory you are currently in. Clean and simple.

**Copying Files Between Machines with SCP**

SCP stands for Secure Copy. It uses SSH under the hood which means everything is encrypted and it uses the same authentication. The format is always source first, destination second.

To copy a file from your machine to a remote one:

```bash
scp important.txt ubuntu@192.168.1.30:/home/ubuntu/transferred.txt
```

To copy a file from a remote machine to yours:

```bash
scp ubuntu@192.168.1.30:/home/ubuntu/documents.txt notes.txt
```

It is just like `cp` but one of the paths is on another machine.

**Serving Files with Python's HTTP Server**

This one is genuinely handy. Python3 comes installed on Ubuntu by default and it has a built in module that turns your machine into a basic web server instantly:

```bash
python3 -m http.server
```

Run that and it starts serving files from your current directory on port 8000. Then from another machine you can grab those files with wget:

```bash
wget http://MACHINE_IP:8000/myfile
```

The catch is that the server keeps running in that terminal so you need to open a second terminal to run the wget command. Once you are done you kill the server with Ctrl+C.

One thing worth knowing is there is no file listing. You cannot browse to the IP in a browser and see a list of files. You have to know the exact filename you want. If you forget the name you are stuck. There are better tools for this like Updog but the Python server works fine for quick jobs.

**Question: Download the file http://MACHINE_IP:8000/.flag.txt onto the TryHackMe AttackBox. What are the contents?** `THM{WGET_WEBSERVER}`

On the deployed machine I went to the tryhackme home directory and started the server:

```bash
python3 -m http.server
```

Then in a second terminal on the AttackBox:

```bash
wget http://MACHINE_IP:8000/.flag.txt
cat .flag.txt
```

`THM{WGET_WEBSERVER}`

---

## Task 5 — Processes 101 {#task-5}

Every program running on your machine is a process. Each one gets a number called a PID, which stands for Process ID. They are assigned in order so the first process to start gets PID 1 and it counts up from there.

**Viewing Processes**

The `ps` command shows you what is running in your current session:

```bash
ps
```

But that only shows your own stuff. To see everything running on the whole system including stuff running as other users you add `aux`:

```bash
ps aux
```

That gives you a much bigger picture. You can see who owns each process, how much CPU it is using, and what the actual command is.

If you want something that updates in real time instead of a one time snapshot, `top` is what you want. It refreshes every 10 seconds and you can scroll around with the arrow keys. Press `q` to quit.

**Killing Processes**

To kill a process you use the `kill` command followed by the PID:

```bash
kill 1337
```

There are different signals you can send with kill depending on how aggressively you want to end the process:

`SIGTERM` kills it but lets the process clean up first, close files, free memory, that kind of thing

`SIGKILL` kills it immediately with no cleanup at all

`SIGSTOP` pauses the process without killing it

**How Processes Start**

When Linux boots up, the very first process that starts has PID 0 and it kicks off `systemd`. Everything else on the system starts as a child of systemd. So when you install a web server or a database and it runs as a service, it is sitting under systemd in this big family tree of processes.

**Starting Services on Boot**

`systemctl` is how you talk to systemd. The format is:

```bash
systemctl [option] [service]
```

The options you use most are `start`, `stop`, `enable`, `disable`, and `status`. Start and stop are immediate. Enable and disable control whether the service starts automatically on boot.

So to start apache2 right now:

```bash
systemctl start apache2
```

To make it start every time the machine boots:

```bash
systemctl enable apache2
```

**Background and Foreground**

By default when you run a command it runs in the foreground, meaning it holds your terminal until it finishes. If you want to run something in the background you add `&` at the end:

```bash
echo "Hi THM" &
```

You can also push a running process to the background with Ctrl+Z. That pauses it and hands your terminal back to you.

To bring a backgrounded process back to the foreground you use `fg`.


**Question: If we were to launch a process where the previous ID was "300", what would the ID of this new process be?** `301`

**If we wanted to cleanly kill a process, what signal would we send it?** `SIGTERM`

**Locate the process that is running on the deployed instance. What flag is given?**

Ran `ps aux` and scrolled through the output looking for anything that stood out. Found it.

`THM{PROCESSES}`

**What command would we use to stop the service "myservice"?** `systemctl stop myservice`

**What command would we use to start the same service on the boot-up of the system?** `systemctl enable myservice`

**What command would we use to bring a previously backgrounded process back to the foreground?** `fg`

---

## Task 6 — Maintaining Your System: Automation {#task-6}

Sometimes you want something to happen on a schedule without you having to remember to do it. Backups, cleanup scripts, whatever. That is what cron is for.

Cron is a process that runs in the background and it reads from a file called a crontab to know what to run and when. You edit your crontab with:

```bash
crontab -e
```

Each line in a crontab has six parts:

```
minute | hour | day of month | month | day of week | command
```

So if you wanted to back up a folder every 12 hours it would look like this:

```bash
0 */12 * * * cp -R /home/cmnatic/Documents /var/backups/
```

The `*` is a wildcard meaning any value. So `* * * * *` would mean run every single minute of every hour of every day. The `*/12` means every 12 hours.

If the syntax makes your head hurt, there are websites like Crontab Generator and Cron Guru that let you just click what you want and they spit out the right format for you.

**Question: When will the crontab on the deployed instance run?** `@reboot`

Checked with:

```bash
cat /etc/crontab
```

The relevant line was `@reboot` for the tryhackme user, meaning the cron job runs at reboot.

---

## Task 7 — Maintaining Your System: Package Management {#task-7}

On Ubuntu, software is installed through a package manager called `apt`. When developers want to publish software for Linux users they put it in a repository and if it gets approved people can install it with a simple command.

To install something:

```bash
apt install sublime-text
```

To remove it:

```bash
apt remove sublime-text
```

Before installing anything it is good practice to update your package list so apt knows about the latest versions:

```bash
apt update
```

Sometimes the software you want is not in the default Ubuntu repositories. In that case you can add a third party repository manually. The process for that is a bit more involved but the general idea is:

Download and trust the developer's GPG key so your system can verify the software is legit

Add their repository to your sources list

Run `apt update` so apt picks up the new repo

Install the software normally with `apt install`

To add a repository there is also the `add-apt-repository` command. And to remove one you can use `add-apt-repository --remove` or just delete the file you added to `/etc/apt/sources.list.d/`.

The reason this whole GPG key thing exists is so you cannot just point apt at some random server and have it install whatever is there. The key verifies that the software actually came from who it says it came from.

This task is more of a read through than a hands on one. No machine interaction needed, just good to understand how this works.

---

## Task 8 — Maintaining Your System: Logs {#task-8}

Logs live in `/var/log`. Pretty much every service running on the system writes something there. When something breaks or something suspicious happens this is the first place you go.

The room highlights three services worth knowing about:

Apache2 web server logs, which track every single HTTP request that hits the server

fail2ban logs, which track brute force attempts and bans

UFW logs, which is the firewall

For apache2 specifically there are two files you care about. The access log which records every request, and the error log which records anything that went wrong. The access log is gold for figuring out what someone was doing on your server.

**Question: What is the IP address of the user who visited the site?** `10.9.232.111`

**Question: What is the IP address of the user who visited the site?** `catsanddogs.jpg`

---

## Task 9 — Conclusions and Summaries {#task-9}

And that is the Linux Fundamentals module done. Three rooms, a lot of commands, and hopefully Linux feels a lot less mysterious now than it did at the start.

To recap what Part 3 covered:

Nano for actually editing files

wget and SCP for moving files around

Python's HTTP server for quick and dirty file serving

Processes, PIDs, killing things, and systemctl for managing services

Cron jobs for automating tasks on a schedule

Package management with apt

Reading logs in /var/log to figure out what happened on a system

---