---
title: "How Websites Work — TryHackMe Pre Security Path"
date: 2026-04-02
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's How Websites Work room - To exploit a website, you first need to know how they are created."
image: "/images/blog/24.png"
readtime: "15 min read"
draft: false
---

# How Websites Work

This room is about how websites work. What they are made of, how the browser shows them to you, and some basic ways they can go wrong from a security point of view.

---

## Tasks

- [Task 1 — How websites work](#task-1)
- [Task 2 — HTML](#task-2)
- [Task 3 — JavaScript](#task-3)
- [Task 4 — Sensitive Data Exposure](#task-4)
- [Task 5 — HTML Injection](#task-5)

---

## Task 1 — How Websites Work {#task-1}

Every time you visit a website, your browser (like Chrome or Safari) sends a request to a web server. That server is just a computer somewhere in the world that handles your request and sends back data. Your browser then uses that data to show you the page.

There are two main parts to any website:

- **Front End (Client-Side)**: This is what your browser actually renders and shows you
- **Back End (Server-Side)**: This is the server that handles your request and sends back a response

That is the basic loop. You ask, the server answers, your browser shows it.

**Question: What term best describes the component of a web application rendered by your browser?** `Front End`

---

## Task 2 — HTML {#task-2}

Websites are built using three main things:

- **HTML** to build the structure
- **CSS** to make it look good
- **JavaScript** to make it interactive

HTML stands for **HyperText Markup Language**. It uses elements, also called tags, to tell the browser how to display content. Here is what a basic HTML page looks like:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe HTML Editor</title>
    </head>
    <body>
        <h1>Cat Website!</h1>
        <p>See images of all my cats!</p>
        <img src='img/cat-1.jpg'>
        <img src='img/cat-2.jpg'>
        <img src='img/dog-1.png'>
    </body>
</html>
```

Breaking down what each part does:

- `<!DOCTYPE html>` tells the browser this is an HTML5 document
- `<html>` is the root of the whole page, everything sits inside this
- `<head>` holds info about the page like the title, but is not shown on the page itself
- `<body>` is where all the visible content goes
- `<h1>` is a large heading
- `<p>` is a paragraph
- `<img>` is an image tag

Tags can also have attributes inside them. For example `<p class="bold-text">` uses a class attribute to style the paragraph. The `src` attribute on an image tells the browser where to find the image file: `<img src="img/cat.jpg">`. Elements can have multiple attributes at the same time too.

There is also the `id` attribute, like `<p id="example">`. Unlike a class which can be shared across many elements, an id has to be unique. Only one element on the page should have that id.

You can see the HTML of any website by right clicking and selecting View Page Source in Chrome or Show Page Source in Safari.

**Practical**

The task gives us an HTML editor with a cat website. The starting code looks like this:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe HTML Editor</title>
    </head>
    <body>
        <h1>Cat Website!</h1>
        <p>See images of all my cats!</p>
        <img src='img/cat-1.jpg'>
        <img src='img/cat-2.'>
        <!-- Add dog image here -->
    </body>
</html>
```

The second image tag has a broken src, it says `img/cat-2.` with nothing after the dot. We fix it by completing the filename to `img/cat-2.jpg`. Once fixed, the image loads.

Then for the dog image, we add a new `<img>` tag on line 11 pointing to `img/dog-1.png` like this:
```html
<img src='img/dog-1.png'>
```

**Question: One of the images on the cat website is broken - fix it, and the image will reveal the hidden text answer!** `HTMLHERO`

**Question: Add a dog image to the page by adding another img tag on line 11. The dog image location is img/dog-1.png. What is the text in the dog image?** `DOGHTML`

---

## Task 3 — JavaScript {#task-3}

JavaScript is what makes web pages interactive. Without it, everything on a page would be completely static and nothing would move or respond to you. HTML gives the page structure, CSS makes it look nice, and JavaScript makes it actually do things.

You can add JavaScript to a page in two ways. Either directly inside `<script>` tags:
```html
<script type="text/javascript">
    // your code here
</script>
```

Or loaded from an external file using the src attribute:
```html
<script src="/location/of/javascript_file.js"></script>
```

JavaScript can find elements on the page and change them. For example this line finds an element with the id of "demo" and changes what it says:
```javascript
document.getElementById("demo").innerHTML = "Hack the Planet";
```

HTML elements can also have events attached to them. An `onclick` event runs JavaScript when someone clicks something:
```html
<button onclick='document.getElementById("demo").innerHTML = "Button Clicked";'>Click Me!</button>
```

**Practical**

The starting code for this task looks like this:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe Editor</title>
    </head>
    <body>
        <div id="demo">Hi there!</div>
        <script type="text/javascript">
            // add your JavaScript here
        </script>
    </body>
</html>
```

For the first part we add this inside the script tags to change the demo element:
```javascript
document.getElementById("demo").innerHTML = "Hack the Planet";
```

For the second part we add the button with the onclick event:
```html
<button onclick='document.getElementById("demo").innerHTML = "Button Clicked";'>Click Me!</button>
```

The final code looks like this:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>TryHackMe Editor</title>
    </head>
    <body>
        <div id="demo">Hi there!</div>
        <script type="text/javascript">
            document.getElementById("demo").innerHTML = "Hack the Planet";
        </script>
        <button onclick='document.getElementById("demo").innerHTML = "Button Clicked";'>Click Me!</button>
    </body>
</html>
```

**Question: Click the "View Site" button on this task. On the right-hand side, add JavaScript that changes the demo element's content to "Hack the Planet"** `JSISFUN`


---

## Task 4 — Sensitive Data Exposure {#task-4}

Sensitive data exposure happens when a website accidentally leaves sensitive information visible in its source code. Because we can view the HTML of any page, if a developer forgets to remove something like login credentials or hidden links, anyone can just read it right there in the source.

This kind of thing shows up more than you would think. A developer might leave a comment in the HTML with test credentials they meant to remove before the site went live. If we find something like that, we could use those credentials to log in somewhere we are not supposed to be.

Whenever you are looking at a web app for security issues, checking the page source for exposed info is always one of the first things to do.

**Practical**

Looking at the page source of the vulnerable site I find this comment in the HTML:
```html
<!--
    TODO: Remove test credentials!
        Username: admin
        Password: testpasswd
-->
```

The developer left a comment with working login credentials in the source code and just never removed it. Anyone who views the source can see it.

**Question: What is the password hidden in the source code?** `testpasswd`

---

## Task 5 — HTML Injection {#task-5}

HTML injection is a vulnerability that happens when a website takes user input and puts it directly on the page without checking it first. If the site does not sanitise the input (meaning it does not filter out any HTML or JavaScript before using it), an attacker can type actual HTML tags into an input field and the browser will treat it as real HTML.

That way, a user can control what HTML gets rendered on the page, they can change how the page looks or behaves for other people. It is a client side vulnerability, meaning it happens in the browser.

The general rule here is to never trust user input. Any text a user sends should be cleaned before it ever gets used anywhere on the page. In this case the fix would be stripping out any HTML tags from the input before passing it to JavaScript.

**Practical**

The page has a name input field. Whatever you type gets passed into a JavaScript function and displayed on the page. Since the input is not sanitised, we can type actual HTML and the browser will render it.

To inject a link to `http://hacker.com` we type this into the input field:
```html
<a href='http://hacker.com'>Hacker Site</a>
```

The page renders it as a real clickable link instead of just displaying it as text.

**Question: View the website on this task and inject HTML so that a malicious link to http://hacker.com is shown.** `HTML_INJ3CTI0N`

---

That is how websites work at the basic level. HTML builds the structure, CSS styles it, JavaScript makes it interactive, and if any of that is handled carelessly it opens up security issues. Viewing source code and understanding what is actually being sent to the browser is one of the most useful habits to build.

---