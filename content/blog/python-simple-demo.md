---
title: "Python: Simple Demo — TryHackMe Pre Security Path"
date: 2026-03-29
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Python: Simple Demo room - Explore what a basic Python program looks like."
image: "/images/blog/44.png"
readtime: "25 min read"
draft: false
---

# Python: Simple Demo

Okay so the last two rooms were about how computers store numbers and characters. Fun stuff in a nerdy way. But now we are writing code. Like real code that runs and does things. The room picks Python as the language to start with and honestly that is a solid choice because Python is probably the least hostile language you can learn as a beginner and it's also my favorite.

The whole room builds one game from scratch. A number guessing game. The computer picks a number between 1 and 20, you keep guessing, it tells you if you are too high or too low, and when you get it the game tells you how many tries it took. Simple idea, but it covers a surprising amount of ground.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Variables](#task-2)
- [Task 3 — Conditional Statements](#task-3)
- [Task 4 — Iterations](#task-4)
- [Task 5 — Conclusion](#task-5)

---

## Task 1 — Introduction {#task-1}

So the room starts by connecting back to the previous two. We learned how computers handle numbers, characters, colors, emoji, all of that. Now the question is: how do you actually tell a computer to do something useful with all of that?

That is where programming languages come in. And the one this room uses is Python. The room describes it as a high level general purpose language. High level means it hides a lot of the messy stuff happening under the hood. You do not have to think about memory addresses or bits directly. General purpose means you can use it for basically anything, web apps, automation, data science, machine learning, whatever.

The game we are building works like this:

The computer secretly picks a number between 1 and 20.

You keep guessing until you get it right.

After each wrong guess it tells you if you went too low or too high.


Here is what a finished session looks like:
```shell-session
ubuntu@tryhackme:~$ python guess_the_number.py
I'm thinking of a number between 1 and 20
Take a guess: 10
Too high, try again.
Take a guess: 5
Too low, try again.
Take a guess: 7
Too low, try again.
Take a guess: 8
You got it in 4 tries!
```

By the end of the room you will understand variables, conditional statements, and loops. Three things that show up in basically every program ever written.

---

## Task 2 — Variables {#task-2}

**The first piece: storing things**

A variable is just a box with a label on it. You put a value in the box and then refer to it by the label later. That is genuinely all it is.

The game needs three variables to start. A `secret` to hold the number the computer picks, a `guess` to hold whatever the user types in, and a `tries` counter to track how many attempts the user has made.

Python has a built-in `random` library and inside it there is a method called `random.randint()`. You give it two numbers and it picks a random integer between them. So `random.randint(1, 20)` gives you a number anywhere from 1 to 20. That becomes the secret.

The `tries` counter starts at 0 because the user has not guessed yet. The `guess` also starts at 0, and that is intentional. Since the secret is always between 1 and 20, starting `guess` at 0 means the game loop condition works correctly from the beginning. More on that in Task 4.
```python
import random  # gives us tools for picking random numbers

secret = random.randint(1, 20)  # a <= secret <= b
tries = 0
guess = 0  # start with a value that cannot be the secret (since secret is 1..20)

print("I'm thinking of a number between 1 and 20")
```

The `print()` function just displays text on the screen. You pass it whatever you want to show and it shows it. Simple.

**Getting input from the user**

Now the program needs to actually ask the user for a number. Python has an `input()` function for this. The catch is that `input()` always returns text, even if the user types a number. So if the user types `10`, Python gets the string `"10"`, not the integer `10`. You cannot do math on a string, so you have to convert it using `int()`.
```python
text = input("Take a guess: ")  # input() returns text (a string)
guess = int(text)  # convert the text to a number

tries = tries + 1  # add 1 try (written long-form for clarity)
```

Every time the user makes a guess, `tries` goes up by 1. The long form `tries = tries + 1` is used here on purpose for clarity. It just means take the current value of `tries`, add 1, and store the result back in `tries`.

At this point the program can pick a number and read a guess, but it does not do anything with them. It does not compare them, does not give any feedback, nothing. That is what Task 3 fixes.

**Question: What is the name of the function we used to display text on the screen?** `print()`

**Question: What is the name of the function that we used to convert user input to an integer?** `int()`

---

## Task 3 — Conditional Statements {#task-3}

**Actually doing something with the guess**

Right now the program picks a number and reads a guess and then just sits there. Not great. We need it to compare the two and say something useful.

This is where conditionals come in. A conditional is basically the program asking itself a question and doing different things depending on the answer. In Python the structure is `if`, `elif`, and `else`.

The logic for the game looks like this in plain English first:

If the guess is less than 1 or greater than 20, tell the user it is out of range.

Else if the guess is less than the secret, tell them it is too low.

Else if the guess is greater than the secret, tell them it is too high.

Else, they got it right.


That last else works because if the guess is not less than and not greater than the secret, it has to be equal to it. There is no other option. So you do not need to explicitly check for equality.

In actual Python:
```python
if guess < 1 or guess > 20:
    print("That number is out of range. Try again.")
elif guess < secret:
    print("Too low, try again.")
elif guess > secret:
    print("Too high, try again.")
else:
    print("You got it in", tries, "tries!")
```

`elif` is just Python's way of writing else if. You check the first condition, and if it is false you move to the next `elif`, and if that is also false you move to the next one, all the way down until you either hit a true condition or fall through to the `else`.

A few quick examples to make sure this makes sense. Say the secret is 10:

User types 30. The first `if` fires because 30 is greater than 20. Program prints out of range.
User types 5. First `if` is false, 5 is within range. First `elif` is true, 5 is less than 10. Program prints too low.
User types 15. First `if` is false. First `elif` is false, 15 is not less than 10. Second `elif` is true, 15 is greater than 10. Program prints too high.
User types 10. All conditions are false. Program falls through to `else` and prints you got it.

The limitation right now is that the user only gets one chance. If they guess wrong the program just ends. That is obviously not how a guessing game works, so Task 4 fixes that.

**Question: How does Python write "else if"?** `elif`

**Question: What will the program display if the user's input is 50?** `That number is out of range. Try again.`

---

## Task 4 — Iterations {#task-4}

**Letting the user actually play the game**

One guess and done, is not a game. It is barely a program. To make this actually work, the code from Task 3 needs to run over and over until the user gets it right. That is what a loop does.

In Python, a `while` loop keeps running as long as a condition is true. The condition here is straightforward: keep going while `guess` does not equal `secret`. In Python, "does not equal" is `!=`. So the loop condition is `while guess != secret:`.

Everything inside the loop is indented, and Python uses indentation to know what belongs to the loop. The whole block from Task 3 just goes inside:
```python
while guess != secret:
    text = input("Take a guess: ")
    guess = int(text)
    
    tries = tries + 1

    if guess < 1 or guess > 20:
        print("That number is out of range. Try again.")
    elif guess < secret:
        print("Too low, try again.")
    elif guess > secret:
        print("Too high, try again.")
    else:
        print("You got it in", tries, "tries!")
```

Python checks the condition before each run of the loop. If `guess != secret` is true, it runs all the indented lines. Then checks again. And again. Until eventually the user guesses correctly, at which point `guess` equals `secret`, the condition becomes false, and the loop stops.

This is also why `guess` was set to 0 at the start. When the program first reaches the `while` loop, it checks if `guess != secret`. Since `guess` is 0 and `secret` is somewhere between 1 and 20, that is always true, so the loop starts. If you had set `guess` to something that might accidentally equal the secret, the loop might never run at all.

The full final version of the game looks like this:
```python
import random

secret = random.randint(1, 20)
tries = 0
guess = 0

print("I'm thinking of a number between 1 and 20")

while guess != secret:
    text = input("Take a guess: ")
    guess = int(text)
    
    tries = tries + 1

    if guess < 1 or guess > 20:
        print("That number is out of range. Try again.")
    elif guess < secret:
        print("Too low, try again.")
    elif guess > secret:
        print("Too high, try again.")
    else:
        print("You got it in", tries, "tries!")
```

And yeah, it works. You run it, it picks a number, you guess, it pushes you in the right direction, and eventually you get it. Satisfying in a dumb little way.

**Question: What type of loop does this program use?** `while`

**Question: What will the program display if the user makes the correct guess in 3 tries?** `You got it in 3 tries!`

---

## Task 5 — Conclusion {#task-5}

The room covered three things that show up in almost every program you will ever read or write:

Variables are how you store and label data so you can use it later. Without variables you cannot track anything between steps.

Conditionals let the program make decisions. `if`, `elif`, and `else` let you handle different situations with different responses instead of the program doing the same thing no matter what.

Loops let you repeat code without copy pasting it a hundred times. The `while` loop keeps running as long as its condition is true, which is exactly what you need for a game where you do not know how many tries the user will need.

The room also notes that if this is your first time seeing Python, you are not expected to be able to write something like this from scratch yet. Understanding and being able to explain the code is the starting point. Writing it yourself takes practice on top of that.

---