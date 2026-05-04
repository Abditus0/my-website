---
title: "JavaScript Essentials — TryHackMe Cyber Security 101"
date: 2026-05-04
category: "writeup"
excerpt: "Walkthrough of TryHackMe's JavaScript Essentials room — Learn how to use JavaScript to add interactivity to a website and understand associated vulnerabilities."
image: "/images/blog/112.png"
readtime: "25 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Essential Concepts](#task-2)
- [Task 3 — JavaScript Overview](#task-3)
- [Task 4 — Integrating JavaScript in HTML](#task-4)
- [Task 5 — Abusing Dialogue Functions](#task-5)
- [Task 6 — Bypassing Control Flow Statements](#task-6)
- [Task 7 — Exploring Minified Files](#task-7)
- [Task 8 — Best Practices](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

JavaScript time. HTML is the structure, CSS is the paint, JS is the thing that actually makes stuff move and react when you click it. Forms that validate, buttons that do things, popups that wont go away, all of that is JS.

This room is the basics from a security angle. Not learning JS to become a web dev, learning enough JS to understand what's happening when an attacker abuses it.

---

## Task 2 — Essential Concepts {#task-2}

This task is just vocabulary. Variables, data types, functions, loops. If you've touched any other programming language before, none of this is new. If you haven't, the room gives you enough to follow along.

Quick rundown of the bits worth remembering:

A **variable** is a labeled box that holds a value. In JS you make one with `var`, `let`, or `const`. The room mentions `var` is function-scoped while `let` and `const` are block-scoped. For now just use `let` for stuff that changes and `const` for stuff that doesn't.

**Data types** are what kind of thing the variable holds. Strings (text), numbers, booleans (true/false), and a few others.

A **function** is a chunk of code with a name. You write it once and then call it whenever you need to do that thing again. The room's example is a `PrintResult(rollNum)` function that prints a student's exam result. Without a function you'd have to write the same code over and over for every student. With one, you write it once.

A **loop** runs the same code multiple times until a condition is met. The classic case is "do this 100 times". You don't write the function call 100 times, you put it in a loop.

**What term allows you to run a code block multiple times as long as it is a condition?** `loop`

---

## Task 3 — JavaScript Overview {#task-3}

Time to actually run something. The nice thing about JS is you don't need to install anything. The browser already runs it. Open Chrome, hit `Ctrl + Shift + I`, click the Console tab and you've got a place to type code and see what happens.

The task gives you a tiny program that adds two numbers:

```javascript
let x = 5;
let y = 10;
let result = x + y;
console.log("The result is: " + result);
```

Paste it in the console, hit enter, you get `The result is: 15`. Cool. Then it asks what happens if x is 10 instead of 5. You don't even need to run it for this one, 10 + 10 is 20.

**What is the code output if the value of x is changed to 10?** `The result is: 20`

The other question is whether JS is compiled or interpreted. Compiled languages get turned into machine code before they run (like C). Interpreted languages get read and executed line by line as they go. JS is the second one. The browser reads your code and runs it on the fly, no compile step. That's why you can just paste stuff into the console and have it work immediately.

**Is JavaScript a compiled or interpreted language?** `Interpreted`

---

## Task 4 — Integrating JavaScript in HTML {#task-4}

So JS by itself isn't very useful. It needs HTML to work with. There are two ways to glue them together.

**Internal JS** is when you write your JS directly inside the HTML file, between `<script>` tags. Easy for small stuff, fine for learning, gets messy fast on bigger projects.

**External JS** is when you put your JS in a separate `.js` file and link to it from the HTML using `<script src="script.js"></script>`. This is what you actually want to do most of the time because you can reuse the same JS across multiple pages, and your HTML stays clean.

The room walks you through making both versions of the same little "add two numbers" program. The output is identical, the only difference is where the code lives.

The interesting bit is the last part. As a pentester, when you land on a website, one of the first things you do is check the source code to see how the JS is being loaded. Right click, View Page Source. If you see `<script>` tags with code inside, that's internal. If you see `<script src="something.js">`, that's external and you can go fetch that file and read it. Sometimes devs leave juicy stuff in those files. We'll get to that later.

The room asks you to open `external_test.html` from the exercises folder and check what file it's loading. View source, find the script tag with the src attribute, read the filename.

**Which type of JavaScript integration places the code directly within the HTML document?** `Internal`

**Which method is better for reusing JS across multiple web pages?** `External`

**What is the name of the external JS file that is being called by external_test.html?** `thm_external.js`

**What attribute links an external JS file in the `<script>` tag?** `src`

---

## Task 5 — Abusing Dialogue Functions {#task-5}

Now the fun part. JS has three built in functions for talking to the user through popup boxes:

- `alert("text")` shows a message with an OK button
- `prompt("question")` asks for input and gives back what the user typed
- `confirm("question")` shows OK and Cancel and gives back true or false

Open the Chrome console, paste `alert("Hello THM")`, hit enter. Box pops up. Click OK. Done. Same idea for the other two.

The prompt example chains two together:

```javascript
name = prompt("What is your name?");
alert("Hello " + name);
```

Type your name into the prompt, click OK, then an alert pops up greeting you. Whatever.

Where this gets interesting is the abuse case. The room has you make a file called `invoice.html` with this in it:

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Hacked</title>
</head>
<body>
    <script>
        for (let i = 0; i < 3; i++) {
            alert("Hacked");
        }
    </script>
</body>
</html>
```

Save it, double click, and now you've got an alert that pops up saying "Hacked", and when you close it another one pops up, and another one. Three times total because of `i < 3`. Annoying but harmless.

If you change the loop to `i < 500` you can see how this would actually be a real problem if someone sent you a malicious HTML file. You'd be sitting there clicking OK forever. There are even worse versions where the popup has scary text trying to get you to call a fake support number, classic scam stuff.

Lesson is don't open random HTML files from people you don't trust. Same energy as not opening random .exe files.

**In the file invoice.html, how many times does the code show the alert Hacked?** `5`

**Which of the JS interactive elements should be used to display a dialogue box that asks the user for input?** `prompt`

**If the user enters Tesla, what value is stored in the carName variable?** `Tesla`

The last one is just asking what the prompt returns. Whatever you type in is what gets stored. Type Tesla, you get Tesla. Not a trick question.

---

## Task 6 — Bypassing Control Flow Statements {#task-6}

Control flow is the if/else stuff and loops. The bit that makes a program actually make decisions instead of just running top to bottom.

The first example is simple. Make `age.html`, paste in the code, open it in Chrome. It prompts you for your age. Type something. If the number is 18 or higher you get told you're an adult. If it's lower you get told you're a minor. The whole thing hinges on this:

```javascript
if (age >= 18) {
    document.getElementById("message").innerHTML = "You are an adult.";
} else {
    document.getElementById("message").innerHTML = "You are a minor.";
}
```

Type 17, get the minor message.

Now the interesting part. The room has you open `login.html` from the exercises folder. It's a login form. Username and password. The room tells you the user is admin and the password is in the source page `ComplexPassword`, but the whole point of this task is to understand WHY this is bad.

Here's the thing. When a website does login validation in JavaScript on the client side, the password has to be in the JS code somewhere. The browser needs to compare what you typed against something, and that something is sitting right there in the source. So you can just open the file, look at the JS, and read the password directly. No hacking required. The check looks something like:

```javascript
if (username === "admin" && password === "ComplexPassword") {
    // log them in
}
```

Right click, View Page Source, and there it is. The password is in plaintext in code that gets sent to your browser. Game over.

This is why you should never do real authentication in client side JS. Anything the browser can see, the user can see. Real login systems check passwords on the server, where the user can't see what they're being compared against.

**What is the message displayed if you enter the age less than 18?** `You are a minor.`

**What is the password for the user admin?** `ComplexPassword`

---

## Task 7 — Exploring Minified Files {#task-7}

So far all the JS we've looked at has been clean and readable. In production websites this is rarely the case. Real sites use minified and obfuscated JS, and there's a difference between those two.

**Minification** strips out everything unnecessary. Spaces, line breaks, comments, long variable names all get crunched down. The point is making the file smaller so the page loads faster. The code still works exactly the same, it's just hard to read.

**Obfuscation** goes further. It deliberately makes the code confusing. Variable names become nonsense like `_0x114713`. Numbers get replaced with weird math expressions that evaluate to the same value. Functions get split apart and reassembled in confusing ways. The goal is to stop people from understanding what the code does.

The room walks you through both. First you make `hello.html` and `hello.js` with a simple greeting function:

```javascript
function hi() {
  alert("Welcome to THM");
}
hi();
```

Open it in Chrome, alert pops up saying "Welcome to THM", easy.

Then you go to codebeautify.org/javascript-obfuscator, paste the JS in, and the tool spits out the obfuscated version. It's a wall of nonsense. Variables named with hex codes, weird math everywhere, hard to follow. But if you replace your `hello.js` with this gibberish and reload the page, the alert still says "Welcome to THM". The browser doesn't care that it's unreadable. It still runs.

The cool part is you can also go the other way. obf-io.deobfuscate.io takes obfuscated code and tries to clean it up into something readable. Not always perfect but it gets you most of the way there. So obfuscation isn't a security mechanism, it just slows people down. A motivated attacker (or pentester) will figure it out.

**What is the alert message shown after running the file hello.html?** `Welcome to THM`

**What is the value of the age variable in the obfuscated code snippet?** `21`

---

## Task 8 — Best Practices {#task-8}

Quick task. Just read it really.

Don't rely only on client side validation, because users can disable JS or modify it. Always validate on the server too. If your website only checks "is this email valid" in the browser, anyone with five minutes can bypass that.

Don't include random JS libraries from sources you don't trust. Attackers upload malicious libraries with names that look like real popular ones (this is called typosquatting). If you blindly include `react-comonents` instead of `react-components`, congrats you just gave someone a backdoor into your site.

Don't hardcode secrets in JS. The room shows the obvious bad example:

```javascript
const privateAPIKey = 'pk_TryHackMe-1337';
```

Anyone viewing source sees this. Same problem as the login form earlier. If it's in the JS, it's public.

Minify and obfuscate your production code. Not because it's secure, but because it slows down anyone trying to reverse engineer your stuff. Combined with actual security on the backend, it's one more layer.

**Is it a good practice to blindly include JS in your code from any source?** `nay`

---

## Task 9 — Conclusion {#task-9}

Done. JS basics, integration with HTML, abusing alert/prompt/confirm, bypassing client side login forms by just reading the source, and understanding minification vs obfuscation.

The big takeaway is the same one from the login.html task. JavaScript runs on the user's machine. Anything in your JS code is visible to anyone who knows where to look. Passwords, API keys, business logic, all of it. So when you're hunting for vulnerabilities, the source code of every page is one of the first places you check. People leave stuff in there all the time.

On to the next one.

---