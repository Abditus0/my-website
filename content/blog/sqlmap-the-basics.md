---
title: "SQLMap: The Basics — TryHackMe Cyber Security 101"
date: 2026-05-15
category: "writeup"
excerpt: "Walkthrough of TryHackMe's SQLMap: The Basics room — Learn about SQL injection and exploit this vulnerability through the SQLMap tool."
image: "/images/blog/122.png"
readtime: "26 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — SQL Injection Vulnerability](#task-2)
- [Task 3 — Automated SQL Injection Tool](#task-3)
- [Task 4 — Practical Exercise](#task-4)

---

## Task 1 — Introduction {#task-1}

SQL injection. This is one of those vulnerabilities that's been around forever and somehow still keeps showing up in real apps every year. If you've spent five minutes looking at web security you've heard of it. Now we get to use a tool that does it for us.

Before we touch SQLMap though, the room wants to make sure you understand what a database is and why this whole attack works. Quick version: a database is just a structured place where a website keeps its data. User accounts, products, blog posts, whatever. When you log into a site, the site doesn't have your password in a text file somewhere (hopefully), it's in a database. When you search for something on a bookshop site, the site asks the database "hey, what books match this search" and gets the results back.

The way the website talks to the database is with SQL. Structured Query Language. Pretty much every database understands some flavor of SQL, MySQL, PostgreSQL, SQLite, Microsoft SQL Server, etc. So if you can mess with the SQL queries the website is sending, you can mess with the database. That's the whole point of SQL injection.

**Which language builds the interaction between a website and its database?** `sql`

---

## Task 2 — SQL Injection Vulnerability {#task-2}

Okay so how does the actual attack work. Let's walk through it because the first time I read this it took me a sec.

Imagine a normal login. You type in your username `John` and password `Un@detectable444`. The website takes those values and stuffs them into a SQL query that looks like this:

```sql
SELECT * FROM users WHERE username = 'John' AND password = 'Un@detectable444';
```

Pretty straightforward. The database checks if there's a user named John with that exact password. If yes, you're in. If no, you're not. The `AND` between username and password means BOTH of them have to be right.

Now here's the trick. What if the website is dumb and doesn't check what you type before stuffing it into the query? An attacker who doesn't know John's password could type:

- Username: `John`
- Password: `abc' OR 1=1;-- -`

And now the query becomes:

```sql
SELECT * FROM users WHERE username = 'John' AND password = 'abc' OR 1=1;-- -';
```

Look at what happened. The attacker injected their own SQL into the query. The database now reads it as: check if username is John AND password is abc, OR if 1=1. The `1=1` part is always true because, well, 1 is always equal to 1. The `OR` means only one side needs to be true for the whole thing to pass. So even though the password check fails, the `1=1` succeeds, and the database happily logs the attacker in as John.

The `-- -` at the end is a SQL comment. It tells the database to ignore everything after it, which kills off the trailing single quote that would otherwise break the syntax. Without that comment the query would have a leftover `'` floating around and the database would throw an error.

The single quote after `abc` is the key part of the whole thing. It closes off the string the website was building. Without it, the entire `abc OR 1=1;-- -` would just be treated as one giant password string and nothing would happen. You're basically tricking the website into thinking your password ended early so the rest of your input becomes actual SQL code. That's the core of every SQL injection ever, you escape out of where the website thought your input would stay and inject your own code into the query.

This is why input validation matters. If the site had stripped or escaped the single quote before putting it in the query, none of this would work. But a lot of sites don't, which is why SQLMap exists.

**Which boolean operator checks if at least one side of the operator is true for the condition to be true?** `OR`

**Is 1=1 in an SQL query always true? (YEA/NAY)** `YEA`

---

## Task 3 — Automated SQL Injection Tool {#task-3}

Doing all of that by hand sucks. You have to figure out which parameter is vulnerable, what type of injection works, what database is on the back end, what the table names are, what the columns are, and then craft a query for each piece of data you want. Hours of work for one site.

SQLMap does all of that automatically. You point it at a URL, it figures out the rest. This is one of those tools where the first time you see it find a vuln in 30 seconds, you're like, oh. Oh no. That's why everyone says input validation matters.

Quick warning the room repeats and I'll repeat it too. Don't run SQLMap on websites you don't have permission to test. This isn't being preachy, this is "you will get a knock on your door" territory. CTFs and TryHackMe boxes only.

### The basic flags

If you're brand new and don't want to think about flags, run:

```bash
sqlmap --wizard
```

This walks you through the whole thing with questions. Beginner friendly. After you've used it a couple times you'll skip the wizard and just run the flags directly because it's faster.

The flags you need:

`-u <URL>` - the target URL. This is for GET-based testing where the parameters are in the URL like `?cat=1`.

`--dbs` - dump all the database names on the server.

`-D <database> --tables` - once you know the database name, list all the tables inside it.

`-D <database> -T <table> --dump` - dump every row from a specific table.

`--cookie="..."` - if the site needs you to be logged in to reach the vulnerable page, paste your session cookie here so SQLMap looks like an authenticated user. Without this on auth-protected endpoints, SQLMap will just hit a redirect to login and not find anything.

`-r <file>` - if it's a POST request instead of GET, intercept the request in Burp, save it to a text file, and feed it to SQLMap with `-r`. SQLMap reads the whole request, headers and all.

### What a real run looks like

Say you have a URL like `http://sqlmaptesting.thm/search/cat=1`. The `cat=1` is a GET parameter, that's the kind of thing SQL injection lives in.

Step one, just point SQLMap at it:

```bash
sqlmap -u http://sqlmaptesting.thm/search/cat=1
```

SQLMap goes through a whole checklist. Tests if the page is stable, checks for WAFs, then tries a bunch of injection types against the `cat` parameter. If it finds anything, you'll see something like:

```
GET parameter 'cat' is vulnerable. Do you want to keep testing the others (if any)? [y/N]
```

It also tells you what kind of injection it found. There's usually a few:

- **Boolean-based blind** - injects a true/false condition and looks at how the page responds.
- **Error-based** - tricks the database into spitting out errors that contain data.
- **Time-based blind** - injects something like `SLEEP(5)` and times the response. If the page takes 5 seconds longer, the injection worked.
- **UNION query** - the classic, glues extra SELECT statements onto the end of the original query.

You don't really need to know which one is which to use SQLMap, it picks the best one and uses it. But it's good to know they exist because in real engagements not every type works on every site, and sometimes you'll see only one type come back which tells you something about how the app is filtering input.

Step two, dump the databases:

```bash
sqlmap -u http://sqlmaptesting.thm/search/cat=1 --dbs
```

Comes back with a list. Pick one that looks interesting (`users`, `members`, names like that, not `information_schema` which is the MySQL system database).

Step three, list the tables:

```bash
sqlmap -u http://sqlmaptesting.thm/search/cat=1 -D users --tables
```

Pick a table that looks juicy. Anything with `user` or `admin` in the name.

Step four, dump the table:

```bash
sqlmap -u http://sqlmaptesting.thm/search/cat=1 -D users -T thomas --dump
```

If the table has password hashes in it, SQLMap will notice and ask if you want to crack them with a built-in dictionary attack. Sometimes useful, sometimes you'd rather pull the hashes out and crack them properly with hashcat.

That's the whole loop. Find vulnerable URL, dump databases, dump tables, dump rows. Done.

**Which flag in the SQLMap tool is used to extract all the databases available?** `--dbs`

**What would be the full command of SQLMap for extracting all tables from the "members" database? (Vulnerable URL: http://sqlmaptesting.thm/search/cat=1)** `sqlmap -u http://sqlmaptesting.thm/search/cat=1 -D members --tables`

---

## Task 4 — Practical Exercise {#task-4}

Now we attack something. Spin up the target machine, give it the full three minutes to boot, and use the AttackBox because the room is set up to work on it.

The target is a login page at `http://MACHINE_IP/ai/login`. Looks normal, two fields, email and password.

### The annoying part

In task 3 the example URL had the GET parameters right there in the URL bar (`?cat=1`). Easy. On this target the URL bar just shows `/ai/login` and nothing else. The parameters ARE GET parameters but they're not visible until the form submits. So step one is figuring out what the real URL looks like behind the scenes.

How to do it:

1. Right click on the login page and hit Inspect (or just press F12).
2. Go to the Network tab.
3. Type some garbage credentials in the form. Like `test` and `test`.
4. Click login.
5. Watch the network tab fill up. Find the request that was made when you clicked login (it'll be something like `user_login`).
6. Click on it and look at the request URL. Now you can see the full thing with the parameters.

If that whole process is being weird, the room gives you the URL anyway:

```
http://MACHINE_IP/ai/includes/user_login?email=test&password=test
```

Use that. Just swap `MACHINE_IP` for whatever your target IP is.

### Wrap the URL in quotes

Heads up. The URL has a `?` in it which the bash shell will sometimes try to interpret as a special character. Always wrap your URLs in single quotes when you paste them into a terminal command. Like this:

```bash
sqlmap -u 'http://MACHINE_IP/ai/includes/user_login?email=test&password=test'
```

If you forget the quotes you might get weird errors and waste ten minutes wondering why nothing works.

### Use --level=5

The room buries this in a note but it matters. The default scan won't find the vuln on this box. You need:

```bash
--level=5
```

at the end of your command. Level controls how many tests SQLMap runs and how aggressive it gets. Default is 1 which is fast but shallow. Level 5 throws everything at the target. Slower but it finds stuff.

### The prompts SQLMap will ask you

While SQLMap is running it'll stop and ask you a bunch of yes/no questions. The room tells you what to answer, here they are again so you don't have to scroll:

- "It looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes?" → `y`
- "For the remaining tests, do you want to include all tests for 'MySQL' extending provided risk (1) value?" → `y`
- "Injection not exploitable with NULL values. Do you want to try with a random integer value for option '--union-char'?" → `y`
- "GET parameter 'email' is vulnerable. Do you want to keep testing the others (if any)?" → `n`

That last one matters. Once SQLMap finds `email` is vulnerable you don't need it to keep testing `password` too. Saying `n` saves time.

### Step 1, find the databases

```bash
sqlmap -u 'http://MACHINE_IP/ai/includes/user_login?email=test&password=test' --dbs --level=5
```

Let it run. It'll do the prompts, find that `email` is injectable, then dump the database list. You'll see six database names come back.

### Step 2, list tables in the ai database

The interesting one is `ai`, since that matches the path in the URL.

```bash
sqlmap -u 'http://MACHINE_IP/ai/includes/user_login?email=test&password=test' -D ai --tables --level=5
```

Comes back with the table name.

### Step 3, dump the table

```bash
sqlmap -u 'http://MACHINE_IP/ai/includes/user_login?email=test&password=test' -D ai -T user --dump --level=5
```

This dumps every row in the user table. Look for the row where the email is `test@chatai.com` and grab the password from that row.

One thing to know, SQLMap caches results between runs. So once it's found the vuln on the first command, the `--dbs` `--tables` `--dump` commands are way faster because it's not re-testing the injection point each time. You'll see lines like `resuming back-end DBMS 'mysql'` when it's pulling from cache. If for some reason you want to wipe the cache and start over, add `--flush-session`.

**How many databases are available in this web application?** `6`

**What is the name of the table available in the "ai" database?** `user`

**What is the password of the email test@chatai.com?** `12345678`

---

## Wrap up

Short room but a really important tool. SQLMap is the thing where after you use it a few times you stop being amazed and start expecting it to just work, which is a problem because you should still understand what it's actually doing under the hood. If a real engagement throws a weird custom WAF at you, SQLMap might fall over and you'll need to know how to manually craft the injection it was trying to automate.

Couple notes from running this and getting tripped up.

One, ALWAYS quote your URLs in the shell. The `?` and `&` characters in URLs will eat your soul if you forget.

Two, if SQLMap isn't finding anything, crank up `--level` and `--risk` before you give up. Default settings are conservative. The room flat out won't work without `--level=5`, and real targets are often the same way.

Three, it caches sessions in `~/.sqlmap/output/`. If you're getting weird stale results, `--flush-session` resets things. Or just delete that folder if you really want a clean slate.

Four, `--cookie` is your friend on real sites. Most interesting injection points are behind a login. SQLMap with no cookie just hits the login wall and finds nothing.

Five, if the password came back as a hash instead of `12345678` like in this room, SQLMap can run a built-in dictionary attack on it (`--passwords` or just answer yes to the prompt). It works for easy hashes but for anything serious dump them and use hashcat. SQLMap's dictionary is small.

That's it. Onto the next room.

---