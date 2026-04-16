---
title: "Linux Shells — TryHackMe Cyber Security 101"
date: 2026-04-15
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Linux Shells room — Learn about scripting and the different types of Linux shells."
image: "/images/blog/77.png"
readtime: "32 min read"
draft: false
---

# Linux Shells

If you have done the Linux Fundamentals module before this one, welcome back. If not, the room actually lists it as a prerequisite so maybe go do that first. Either way, this room is about Linux shells. What they are, which ones exist, and how to write basic shell scripts. Not the most glamorous topic but genuinely useful stuff.

Connect to the machine however you prefer. The room gives you SSH credentials:

Username: `user`
Password: `user@Tryhackme`

Once you are in, you are ready to go.

---

## Tasks

- [Task 1 — Introduction to Linux Shells](#task-1)
- [Task 2 — How To Interact With a Shell?](#task-2)
- [Task 3 — Types of Linux Shells](#task-3)
- [Task 4 — Shell Scripting and Components](#task-4)
- [Task 5 — The Locker Script](#task-5)
- [Task 6 — Practical Exercise](#task-6)
- [Task 7 — Conclusion](#task-7)

---

## Task 1 — Introduction to Linux Shells {#task-1}

The room opens with an analogy that is pretty decent. Using the GUI is like ordering food from a menu at a restaurant. Using the CLI is like walking into the kitchen and cooking it yourself. The shell in this case is whatever helps you figure out the recipe.

The point is that CLI gives you more control and is more efficient than clicking through menus. Most Linux users prefer it. Those cool hacking scenes in movies with terminals full of flying commands? That is basically just people using shells. Less dramatic in real life but still satisfying once you get comfortable with it.

The room promises to cover how to interact with a Linux shell, basic commands, the different types of shells available, and some shell scripting at the end.

**Question: Who is the facilitator between the user and the OS?** `Shell`

---

## Task 2 — How To Interact With a Shell? {#task-2}

This task is a quick refresher on basic Linux commands. If you have done the Linux Fundamentals module you have seen all of this before. If not, here is the rundown.

Most Linux distributions use Bash as the default shell. When you open a terminal you will see a prompt that looks something like `user@tryhackme:~$` and that is where you type your commands.

`pwd` stands for Print Working Directory. It tells you where you currently are in the filesystem. When you first open a terminal you are usually in your home directory.

```powershell
user@tryhackme:~$ pwd
/home/user
```

`cd` is Change Directory. Use it to move around the filesystem. `cd Desktop` takes you to the Desktop folder. `cd ..` takes you one level up.

`ls` lists the contents of whatever directory you are currently in. Files, folders, all of it.

`cat` followed by a filename prints the contents of that file to the terminal. Super useful for reading files without opening a text editor.

`grep` is the powerful one. It searches inside a file for a specific word or pattern and returns only the lines that match. Really handy when you are dealing with a massive log file and need to find one specific thing buried in it.

```powershell
user@tryhackme:~$ grep THM dictionary.txt
The flag is THM
```

**Question: What is the default shell in most Linux distributions?** `Bash`

**Question: Which command utility is used to list down the contents of a directory?** `ls`

**Question: Which command utility can help you search for anything in a file?** `grep`

---

## Task 3 — Types of Linux Shells {#task-3}

Linux does not just have one shell. There are several, and you can actually switch between them whenever you want.

To check which shell you are currently using:

```powershell
user@tryhackme:~$ echo $SHELL
/bin/bash
```

To see all the shells installed on your system, the file `/etc/shells` has them all listed. Just cat it:

```powershell
user@tryhackme:~$ cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/bash
/usr/bin/bash
/bin/rbash
/usr/bin/rbash
/bin/dash
/usr/bin/dash
/usr/bin/tmux
/usr/bin/screen
/bin/zsh
/usr/bin/zsh
```

You can switch to any of those by just typing its name. Want Zsh? Type `zsh`. The prompt changes and you are in it. If you want to make a shell your permanent default, use `chsh -s /usr/bin/zsh` and it will stick across sessions.

The room covers three main shells. Here is what you need to know about each one.

**Bash (Bourne Again Shell)** is the default on most Linux distributions. It came along to replace older shells like sh, ksh, and csh and basically took the best bits from all of them. It has scripting, tab completion (press Tab mid-command and it will try to finish it for you), and it logs your command history. Press the up arrow key to cycle back through previous commands, or just type `history` to see them all.

**Fish (Friendly Interactive Shell)** is not installed by default anywhere but it is the most beginner-friendly of the three. It has a simpler syntax, auto spell correction so if you typo a command it will suggest what you probably meant, syntax highlighting that colors different parts of a command so you can spot mistakes visually, and some nice customization options for your prompt. Good shell if you are just starting out.

**Zsh (Z Shell)** is also not default anywhere. It is the most powerful of the three and sits somewhere between Bash and Fish in terms of how it works. Advanced tab completion, spell correction, and a massive customization ecosystem through the oh-my-zsh framework. The downside is that all that customization can make it slower than the other two.

**Question: Which shell comes with syntax highlighting as an out-of-the-box feature?** `Fish`

**Question: Which shell does not have auto spell correction?** `Bash`

**Question: Which command displays all the previously executed commands of the current session?** `history`

---

## Task 4 — Shell Scripting and Components {#task-4}

Now the room gets into scripting. A shell script is just a file full of commands that run in sequence automatically. Instead of typing the same ten commands every morning like a robot, you write them once in a script, run the script, and go make coffee. That is the whole pitch.

One thing the room clarifies early: you can write scripts in various programming languages, not just shell. But this room is specifically about shell scripting, so that is what we are sticking with.

**Creating a script file**

First you need a file. Scripts use the `.sh` extension. Open a text editor like nano and create the file:

```powershell
user@tryhackme:~$ nano first_script.sh
```

**Shebang**

Every script starts with a shebang. That is the `#!` characters at the very top of the file, followed by the path to the interpreter you want to use. For Bash scripts it looks like this:

```shell
#!/bin/bash
```

This tells the system "use Bash to run this file." Without it the system might not know how to execute it.

**Variables**

A variable just stores a value so you can use it later without having to type it out again every time. Here is a simple script that asks for your name and then greets you with it:

```shell
#!/bin/bash
echo "Hey, what's your name?"
read name
echo "Welcome, $name"
```

`read` takes input from the user and stores it in whatever variable name you give it. Then you reference it later with a `$` in front of the variable name.

Before you can run the script you have to give it execution permissions:

```powershell
user@tryhackme:~$ chmod +x first_script.sh
```

Then run it with `./` before the name. The `./` is important because it tells the shell to look for the file in the current directory specifically. Without it, the shell goes hunting through the PATH directories and does not find your script, which just gives you an error and wastes your time.

```powershell
user@ubuntu:~$ ./first_script.sh
Hey, What's your name?
John
Welcome, John
```

**Loops**

Loops let you repeat a block of code multiple times. The example the room uses prints numbers 1 through 10:

```shell
#!/bin/bash
for i in {1..10};
do
echo $i
done
```

`for i in {1..10}` means: go through each number from 1 to 10, store it in `i`, and run whatever is between `do` and `done` each time. Here that is just `echo $i` which prints the current number.

**Conditional Statements**

Conditional statements let you run different code depending on whether a condition is true or not. This script shows a secret only if you enter the right name:

```shell
#!/bin/bash
echo "Please enter your name first:"
read name
if [ "$name" = "Stewart" ]; then
        echo "Welcome Stewart! Here is the secret: THM_Script"
else
        echo "Sorry! You are not authorized to access the secret."
fi
```

`if` checks the condition. `then` defines what happens when it is true. `else` defines what happens when it is not. `fi` ends the whole thing. Simple enough once you see it a few times.

**Comments**

Comments are lines in your script that do nothing. They are just notes for yourself or whoever reads the code later. You write them with `#` at the start of the line:

```shell
#!/bin/bash

# Asking the user to enter a value.
echo "Please enter your name first:"

# Storing the user input value in a variable.
read name

# Checking if the name the user entered is equal to our required name.
if [ "$name" = "Stewart" ]; then
        echo "Welcome Stewart! Here is the secret: THM_Script"
else
        echo "Sorry! You are not authorized to access the secret."
fi
```

A script without comments is painful to read after you have not looked at it for two weeks. Add comments in the important spots. Your future self will thank you.

**Question: What is the shebang used in a Bash script?** `#!/bin/bash`

**Question: Which command gives executable permissions to a script?** `chmod +x`

**Question: Which scripting functionality helps us configure iterative tasks?** `Loops`

---

## Task 5 — The Locker Script {#task-5}

This task puts everything from Task 4 together into one script. The scenario is a bank locker that needs to verify your identity before letting you in. The script asks for a username, company name, and PIN in sequence using a loop, then checks all three against the correct values using a conditional statement.

```shell
#!/bin/bash 

username=""
companyname=""
pin=""

for i in {1..3}; do
        if [ "$i" -eq 1 ]; then
                echo "Enter your Username:"
                read username
        elif [ "$i" -eq 2 ]; then
                echo "Enter your Company name:"
                read companyname
        else
                echo "Enter your PIN:"
                read pin
        fi
done

if [ "$username" = "John" ] && [ "$companyname" = "Tryhackme" ] && [ "$pin" = "7385" ]; then
        echo "Authentication Successful. You can now access your locker, John."
else
        echo "Authentication Denied!!"
fi
```

The loop runs 3 times. Each iteration has a different `elif` condition based on the value of `i`, so the first pass asks for the username, second pass asks for the company name, third asks for the PIN. Once all three inputs are collected the final `if` checks all of them together with `&&` meaning all conditions have to be true for access to be granted.

The question just asks for the correct PIN, which is right there in the script.

**Question: What would be the correct PIN to authenticate in the locker script?** `7385`

---

## Task 6 — Practical Exercise {#task-6}

Alright, this is the hands-on part and it is where things get slightly annoying before they get satisfying.

The machine has a script sitting in `/home/user` that searches for a keyword across all `.log` files in a given directory. Your job is to open the script, fill in the two empty values, and run it to find the flag.

First, become root because you will need the permissions to read through `/var/log`:

```powershell
user@tryhackme:~$ sudo su
[sudo] password for user: 
root@tryhackme:/home/user#
```

Password is `user@Tryhackme` from the credentials in Task 2.

Then open the script to see what you are working with (use nano). When you read through it you will spot a couple of empty double quotes `" "` sitting there waiting to be filled in. The hint tells you exactly what goes in them: the keyword to search for is `thm-flag01-script` and the directory to search through is `/var/log`. Fill those in, save the file, and then run it.

Do not leave any spaces inside the quotes. The hint specifically calls that out and yes, it matters. Script will not work right if you put a space in there by accident.

Once you run it, the script goes through all the `.log` files in `/var/log` looking for that keyword and tells you exactly which file it found it in.

```bash
#!/bin/bash

# Defining the directory to search our flag
directory="/var/log"

# Defining the flag to search
flag="thm-flag01-script"

echo "Flag search in directory: $directory in progress..."

# Defining for loop to iterate over all the files with .log extension in the defined directory
for file in "$directory"/*.log; do
    # Check if the file contains the flag
    if grep -q "$flag" "$file"; then
        # Print the filename
        echo "Flag found in: $(basename "$file")"
    fi
done


root@tryhackme:/home/user# ./the_script.sh
```

The file it lands on is `authentication.log`. Read it with `cat /var/log/authentication.log`.

**Question: Which file has the keyword?** `authentication.log`

**Question: Where is the cat sleeping?** `under the table`

---

## Task 7 — Conclusion {#task-7}

That is the room done. Honestly a decent intro to shells. It is not going to make you a scripting expert but it covers the basics in a way that actually makes sense. Variables, loops, conditional statements, comments. That is most of what you need to start writing useful scripts.

A few things worth keeping from this room:

`echo $SHELL` tells you which shell you are currently in. Useful to know, especially if you are ever dropped into an environment and not sure what you are working with.

`chmod +x` before you try to run any script. You will forget this at least once and feel dumb about it. It happens to everyone.

The `./` before the script name when running it is not optional. The shell will not find your script without it because it only searches PATH directories by default and your current directory is not in there.

Comments are not optional either, even when you think "I will remember what this does." You will not. Write the comments.

---