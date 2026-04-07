---
title: "JavaScript: Simple Demo — TryHackMe Pre Security Path"
date: 2026-04-07
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's JavaScript: Simple Demo room - Explore what a basic JavaScript program looks like."
image: "/images/blog/45.png"
readtime: "32 min read"
draft: false
---

# JavaScript: Simple Demo

So we just finished building a number guessing game in Python. And now TryHackMe goes "okay cool, let's build the exact same thing again, but in JavaScript." At first I thought that was lazy room design but actually it is kind of genius. When you already know what the program is supposed to do, you can focus entirely on how the language does things differently instead of trying to learn the logic and the syntax at the same time.

So that is what this room is. Same game, different language, and a chance to see where JavaScript and Python agree, and where they go their separate ways.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Variables](#task-2)
- [Task 3 — Prompting the User for Input](#task-3)
- [Task 4 — Conditional Statements](#task-4)
- [Task 5 — Iterations](#task-5)
- [Task 6 — Conclusion](#task-6)

---

## Task 1 — Introduction {#task-1}

JavaScript is everywhere. Like really, if you have visited a website today, you have already run JavaScript code on your machine without thinking about it. It started as a language that only lived inside web browsers, meant to run on the client side, meaning your computer, not the server. Then Node.js came along and changed that. Node.js lets JavaScript run on the server too, so now it is on both sides of the conversation.

For this room we are using Node.js to run our code from the command line, not a browser. Same game as before though. The computer picks a number between 1 and 20, you guess, it tells you if you are too high or too low, and you keep going until you nail it.
```shell-session
ubuntu@tryhackme:~/JavaScript-Demo$ node guess_v3.js
I'm thinking of a number between 1 and 20
Take a guess: 10
Too high, try again.
Take a guess: 5
Too low, try again.
Take a guess: 7
You got it in 3 tries!
```

By the end you will have seen variables, conditionals, and loops in JavaScript. Three things that show up in basically every program ever written, in any language.

---

## Task 2 — Variables {#task-2}

**let and const**

Python just lets you create a variable by writing its name and giving it a value. JavaScript makes you be a bit more explicit about it. You have two keywords to choose from: `let` and `const`.

`let` is for things that will change. The number of tries the user has made will go up every guess. The guess itself will change every round. Those get `let`.
```javascript
let tries = 0;
let guess = 0;
```

`const` is for things that should not change. The secret number gets picked once at the start and then it stays the same for the whole game. That gets `const`. And this is actually a difference from Python worth noticing. Python does not have a built in constant keyword. JavaScript does, and it will actually stop you if you try to change a `const` later. Which is nice.

To pick the secret number, JavaScript uses `Math.random()`. Here is the full line:
```javascript
const secret = Math.floor(Math.random() * (20)) + 1;
```

The room breaks this down step by step and it is worth following along:

`Math.random()` gives you a random decimal between 0 and just under 1. Something like `0.372`.
Multiply that by 20 and you get somewhere between 0 and just under 20. So like `7.44`.
`Math.floor()` strips the decimal by rounding down. `7.44` becomes `7`.
Adding 1 at the end shifts the whole range from `0-19` up to `1-20`.

So `secret` ends up being a whole number from 1 to 20. Every time.

**Displaying output**

Python uses `print()`. JavaScript uses `console.log()`. Same idea, different name.
```javascript
console.log("I'm thinking of a number between 1 and 20");
```

**Question: What word is used to declare a variable?** `let`

**Question: What word is used to declare a constant?** `const`

**Question: What is the method that we call to display text on the screen?** `console.log()`

---

## Task 3 — Prompting the User for Input {#task-3}

Okay so this is where JavaScript gets a little painful compared to Python. In Python, getting input from the user is literally one line. `input("Take a guess: ")` and you are done.

In JavaScript, specifically when running through Node.js, it is not that simple. And the reason is kind of interesting once you get it. Node.js was built for web servers. Web servers do not sit around waiting for someone to type something. They handle requests, they do their thing, they move on. So by default Node.js does not even know how to politely pause and wait for keyboard input. You have to tell it how.

That requires importing some extra tools:
```javascript
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
```

The first line brings in the `readline` module. The `/promises` part means it can pause and wait without breaking everything. The second line imports `stdin` (keyboard input) and `stdout` (screen output) and renames them to `input` and `output` to keep things readable. The third line connects them together and creates `rl`, which is basically the channel you use to ask questions and receive answers.

The room describes this as setting up a microphone before a Q&A session, which is a good way to think about it.

Once all that setup is done, getting the user's input looks like this:
```javascript
const text = await rl.question("Take a guess: ");
guess = parseInt(text, 10);
```

The `await` on the first line is what makes the program actually stop and wait for the user to type something instead of just blowing past it. The second line converts the input from text to an actual number, same as Python's `int()`. In JavaScript the function is `parseInt()` and you pass it the text and the number 10, which just means "interpret this as a base 10 number." Normal math numbers. Not binary, not hex, just regular numbers.

And just like you turn off a microphone when you are done, you close the `rl` interface when the program finishes. The room wraps everything in a `try` and `finally` block for this:
```javascript
const rl = readline.createInterface({ input, output });

try {
    // program stuff goes here
} finally {
    rl.close();
}
```

The `try` block runs your code. If something goes wrong inside it, the program does not just crash messily. The `finally` block runs no matter what, even if there was an error, so the cleanup always happens.

Here is where the program stands at this point, saved as `guess_v1.js`:
```javascript
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
    const secret = Math.floor(Math.random() * (20)) + 1; // 1 <= secret <= 20
    let tries = 0;
    let guess = 0; // start with a value that cannot be the secret (since secret is 1..20)

    console.log("I'm thinking of a number between 1 and 20");

    const text = await rl.question("Take a guess: "); // rl.question() returns text (a string)
    guess = parseInt(text, 10); // convert the text to a number

    tries = tries + 1; // add 1 try

} finally {
    rl.close();
}
```

It picks a number, asks for a guess, converts it, counts the try. And then does absolutely nothing with any of that information. No feedback, no response, nothing. You type a number and the program just goes silent and exits. Which is technically correct but completely useless as a game. Task 4 fixes that.

**Question: What method is used to convert user input into a number?** `parseInt()`

---

## Task 4 — Conditional Statements {#task-4}

Now the program can pick a number and receive a guess. It just cannot react to it yet. Let's fix that.

The logic is the same as the Python version. Four possible situations to handle:

Guess is outside 1 to 20, tell them it is out of range. 
Guess is less than the secret, tell them it is too low. 
Guess is greater than the secret, tell them it is too high. 
None of the above, which means it has to be equal, so they got it.  

In JavaScript that looks like this:
```javascript
if (guess < 1 || guess > 20) {
    console.log("That number is out of range. Try again.");
} else if (guess < secret) {
    console.log("Too low, try again.");
} else if (guess > secret) {
    console.log("Too high, try again.");
} else {
    console.log("You got it in", tries, "tries!");
}
```

Python uses `or` in plain English. JavaScript uses `||` for the same thing. So `guess < 1 || guess > 20` means "guess is less than 1 or guess is greater than 20." Same idea, different symbols.

The `else if` structure works exactly like Python's `elif`. Check the first condition, if it is false move to the next one, keep going until something is true or you fall through to the plain `else` at the bottom.

Here is the updated program as `guess_v2.js`:
```javascript
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
    const secret =
        Math.floor(Math.random() * (20)) + 1; // 1 <= secret <= 20
    let tries = 0;
    let guess = 0; // start with a value that cannot be the secret (since secret is 1..20)

    console.log("I'm thinking of a number between 1 and 20");

    const text = await rl.question("Take a guess: "); // rl.question() returns text (a string)
    guess = parseInt(text, 10); // convert the text to a number

    tries = tries + 1; // add 1 try

    if (guess < 1 || guess > 20) {
        console.log("That number is out of range. Try again.");
    } else if (guess < secret) {
        console.log("Too low, try again.");
    } else if (guess > secret) {
        console.log("Too high, try again.");
    } else {
        console.log("You got it in", tries, "tries!");
    }
} finally {
    rl.close();
}
```

Progress! Now the program actually responds to your guess. But it still only gives you one shot. Guess wrong and it just tells you "too low" and exits. Not exactly gripping gameplay. One more task to go.

**Question: The secret is 10. What will the program display if the user guesses 15?** `Too high, try again.`

**Question: The secret is 10. What will the program display if the user guesses 35?** `That number is out of range. Try again.`

---

## Task 5 — Iterations {#task-5}

Last piece. The program needs to keep asking the user for guesses until they get it right instead of just giving up after one attempt.

Same solution as Python. A `while` loop. The condition is: keep going while `guess` does not equal `secret`. In JavaScript, "not equal" is `!==`. So:
```javascript
while (guess !== secret) {
    // everything goes in here
}
```

One thing to notice: Python uses `!=` for not equal. JavaScript uses `!==`. The triple equals thing is a JavaScript quirk. There is also `!=` in JavaScript but `!==` is stricter and generally what you want to use. The room uses `!==` and that is the right call.

Everything from Task 4 just gets moved inside the loop:
```javascript
while (guess !== secret) {
    const text = await rl.question("Take a guess: ");
    guess = parseInt(text, 10);

    tries = tries + 1;

    if (guess < 1 || guess > 20) {
        console.log("That number is out of range. Try again.");
    } else if (guess < secret) {
        console.log("Too low, try again.");
    } else if (guess > secret) {
        console.log("Too high, try again.");
    } else {
        console.log("You got it in", tries, "tries!");
    }
}
```

Before the loop starts, `guess` is 0 and `secret` is somewhere between 1 and 20. So `guess !== secret` is true right from the beginning and the loop runs. Each time the user guesses correctly, `guess` becomes equal to `secret`, the condition becomes false, and the loop stops.

And here is the finished game as `guess_v3.js`:
```javascript
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

try {
    const secret =
        Math.floor(Math.random() * (20)) + 1; // 1 <= secret <= 20
    let tries = 0;
    let guess = 0; // start with a value that cannot be the secret (since secret is 1..20)

    console.log("I'm thinking of a number between 1 and 20");

    while (guess !== secret) {
        const text = await rl.question("Take a guess: ");
        guess = parseInt(text, 10);

        tries = tries + 1;

        if (guess < 1 || guess > 20) {
            console.log("That number is out of range. Try again.");
        } else if (guess < secret) {
            console.log("Too low, try again.");
        } else if (guess > secret) {
            console.log("Too high, try again.");
        } else {
            console.log("You got it in", tries, "tries!");
        }
    }
} finally {
    rl.close();
}
```

Run it with `node guess_v3.js` and it actually works like a real game now. Picks a number, loops, gives feedback, and when you finally get it right it tells you how many tries it took. Satisfying.

The room also mentions there is a `guess_v4.js` that improves things a bit further. It is not required for this room but it is worth peeking at if you are curious about where the code could go next.

**Question: What is the name of the loop used in this task?** `while`

**Question: What is the name of the variable incremented by one when the user makes a wrong guess?** `tries`

**Question: How is "not equal" written in JavaScript?** `!==`

---

## Task 6 — Conclusion {#task-6}

Same three concepts as the Python room, different language:

Variables store your data. `let` for things that change, `const` for things that should not.

Conditionals handle decisions. `if`, `else if`, and `else` in JavaScript work basically the same as Python's `if`, `elif`, and `else`. The main syntax difference is JavaScript uses `||` where Python uses `or`.

Loops repeat code. The `while` loop in JavaScript works the same as in Python. Keep running as long as the condition is true, stop when it is not.

The biggest takeaway from doing both rooms back to back is that the logic is genuinely identical. Same game, same structure, same flow. The differences are mostly surface level syntax. Python reads a bit more like plain English. JavaScript has more punctuation and a slightly rougher setup for things like reading user input. But once you know what a variable, a conditional, and a loop are, picking up a new language is mostly just learning its version of those same ideas.

The room suggests comparing the two files side by side and honestly that is worth doing. Put the Python version and the JavaScript version next to each other and just read through them. The similarities are more obvious than the differences.

---