---
title: "SQL Fundamentals — TryHackMe Cyber Security 101"
date: 2026-05-05
category: "writeup"
excerpt: "Walkthrough of TryHackMe's SQL Fundamentals room — Learn how to perform basic SQL queries to retrieve and manage data in a database."
image: "/images/blog/113.png"
readtime: "66 min read"
draft: false
---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Databases 101](#task-2)
- [Task 3 — SQL](#task-3)
- [Task 4 — Database and Table Statements](#task-4)
- [Task 5 — CRUD Operations](#task-5)
- [Task 6 — Clauses](#task-6)
- [Task 7 — Operators](#task-7)
- [Task 8 — Functions](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

SQL time. Databases are everywhere. Login systems, social media, streaming services, your bank, basically anything that needs to remember stuff between when you close it and when you open it again is sitting on top of a database.

For security this matters from both sides. Offensively you need to know SQL to understand SQL injection, which is one of the oldest and still one of the most common web vulns. Defensively you need to be able to dig through database logs and understand what queries are doing if you want to spot anything suspicious.

This room is the basics. What a database is, the different types, then actually using SQL to do stuff.

---

## Task 2 — Databases 101 {#task-2}

So what's a database. It's just organized data that you can pull from, change, or analyze easily. That's it. Could be usernames and passwords, could be your Netflix watch history, could be a list of books at a bookstore. Anything where you need to store information and get it back later in a structured way.

There are two main flavors:

**Relational databases (SQL)** store data in tables with rows and columns. Everything has a strict structure. If your "users" table expects a first_name, last_name, email, and password, then every new user has to have those fields. You can also link tables together, like connecting a "users" table to an "orders" table, hence "relational". This is what you want when your data is predictable and you care about accuracy. E-commerce, banking, that kind of thing.

**Non-relational databases (NoSQL)** don't use tables. They store data in a more flexible format, usually something that looks like JSON. Each record can have different fields. Useful when your data is messy or varies a lot between records, like social media posts where one might have an image, another a video, another just text.

Here's what a NoSQL document might look like:

```json
{
    _id: ObjectId("4556712cd2b2397ce1b47661"),
    name: { first: "Thomas", last: "Anderson" },
    date_of_birth: new Date('Sep 2, 1964'),
    occupation: [ "The One"],
    steps_taken : NumberLong(4738947387743977493)
}
```

Pick whichever fits the data. That's the whole decision.

### Tables, Rows and Columns

We're focusing on relational from here on. Quick vocab:

A **table** is where you store one type of thing. Like a "Books" table for books.

**Columns** are the fields each record has. For books that might be id, name, published_date. When you set up the columns you also pick the data type each one expects (text, number, date, etc). If you try to shove a string into a number column, the database tells you no.

A **row** is one actual record. So one book in your Books table is one row.

### Primary and Foreign Keys

Now imagine you have a Books table and an Authors table, and you want to know which author wrote which book. You need a way to link them. That's what keys are for.

A **primary key** is a column that uniquely identifies each row. Like an id number. Two books might have the same name (it happens), but they'll never have the same id. Every table needs exactly one primary key column.

A **foreign key** is a column in one table that points to the primary key of another table. So your Books table might have an `author_id` column, and that author_id matches the id over in the Authors table. That's the link. A table can have multiple foreign keys.

That's how relational databases stay organized while still letting things connect.

**What type of database should you consider using if the data you're going to be storing will vary greatly in its format?** `Non-relational database`

**What type of database should you consider using if the data you're going to be storing will reliably be in the same structured format?** `relational database`

**In our example, once a record of a book is inserted into our "Books" table, it would be represented as a ___ in that table?** `row`

**Which type of key provides a link from one table to another?** `foreign key`

**Which type of key ensures a record is unique within a table?** `primary key`

---

## Task 3 — SQL {#task-3}

Okay so you don't usually talk to a database directly. You go through a Database Management System (DBMS), which is the software that actually runs the database. MySQL, MariaDB, MongoDB, Oracle, those are all DBMSs.

To tell the DBMS what you want, you use **SQL** (Structured Query Language). It's the language for querying and managing relational databases. Reads almost like English once you get used to it. `SELECT name FROM books` literally means select the name from books. Not exactly cryptic.

Why people use SQL and relational databases:

- It's fast, even with huge amounts of data.
- It's easy to learn compared to most programming languages.
- It's reliable because the structure is enforced.
- It's flexible enough to do pretty deep analysis with the right queries.

### Getting Hands On

Time to actually use it. Start the machine, wait for it to boot, then open the terminal and run:

```shell-session
user@tryhackme$ mysql -u root -p
```

It'll ask for a password. The password is `tryhackme`. Type it in and hit enter (it won't show anything as you type, that's normal).

You should land in the mysql prompt:

```shell-session
mysql> 
```

That's it. You're in.

**What serves as an interface between a database and an end user?** `DBMS`

**What query language can be used to interact with a relational database?** `SQL`

---

## Task 4 — Database and Table Statements {#task-4}

Now we actually start making things.

### CREATE DATABASE

To make a new database:

```sql
CREATE DATABASE database_name;
```

Make one called `thm_bookmarket_db`:

```sql
CREATE DATABASE thm_bookmarket_db;
```

Don't forget the semicolon at the end. MySQL waits for one before it actually runs your query, so if nothing happens when you hit enter it's probably because you forgot the `;`.

### SHOW DATABASES

To see what databases exist:

```sql
SHOW DATABASES;
```

You'll see your new one in there along with a bunch that come with MySQL by default (`mysql`, `information_schema`, `performance_schema`, `sys`). Don't touch those, they're system stuff.

You'll also see one with a flag for a name. That's the answer to the first question.

### USE

You need to tell MySQL which database you actually want to work with before you can do anything inside it:

```sql
USE thm_bookmarket_db;
```

Now anything you do happens inside that database.

### DROP DATABASE

If you ever want to delete a database:

```sql
DROP DATABASE database_name;
```

Don't run this on the one we just made, we'll need it.

### CREATE TABLE

Once you've picked a database with `USE`, you can make tables in it. Syntax is:

```sql
CREATE TABLE example_table_name (
    example_column1 data_type,
    example_column2 data_type,
    example_column3 data_type
);
```

Each column needs a name and a data type. Let's make a real one:

```sql
CREATE TABLE book_inventory (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    publication_date DATE
);
```

Breaking that down:

- `book_id` is an integer (`INT`), it auto-increments (so the first book gets id 1, next gets 2, and so on without you having to set it manually), and it's the `PRIMARY KEY` so it uniquely identifies each row.
- `book_name` is a `VARCHAR(255)`, meaning text up to 255 characters. `NOT NULL` means you can't insert a row without filling this in.
- `publication_date` is a `DATE`.

### SHOW TABLES

To list tables in the current database:

```sql
SHOW TABLES;
```

You should see `book_inventory`.

### DESCRIBE

If you want to see what columns a table has and their types:

```sql
DESCRIBE book_inventory;
```

You can shorten this to `DESC`. Output looks like:

```shell-session
mysql> DESCRIBE book_inventory;
+------------------+--------------+------+-----+---------+----------------+
| Field            | Type         | Null | Key | Default | Extra          |
+------------------+--------------+------+-----+---------+----------------+
| book_id          | int          | NO   | PRI | NULL    | auto_increment |
| book_name        | varchar(255) | NO   |     | NULL    |                |
| publication_date | date         | YES  |     | NULL    |                |
+------------------+--------------+------+-----+---------+----------------+
```

Useful when you forget what columns a table has, which happens a lot.

### ALTER

If you want to change a table after it exists, like add a column:

```sql
ALTER TABLE book_inventory
ADD page_count INT;
```

You can also use `ALTER` to rename columns, change data types, or remove columns.

### DROP TABLE

To delete a table:

```sql
DROP TABLE table_name;
```

Don't need to run this one either.

For the questions, run `SHOW DATABASES;` and one of them will literally be the flag, just copy it. Then `USE task_4_db;` and `SHOW TABLES;` and the other flag is the name of a table in there.

**Using the statement you've learned to list all databases, it should reveal a database with a flag for a name; what is it?** `THM{575a947132312f97b30ee5aeebba629b723d30f9}`

**In the list of available databases, you should also see the `task_4_db` database. Set this as your active database and list all tables in this database; what is the flag present here?** `THM{692aa7eaec2a2a827f4d1a8bed1f90e5e49d2410}`

---

## Task 5 — CRUD Operations {#task-5}

CRUD stands for Create, Read, Update, Delete. These are the four things you do with data in any system, ever. Doesn't matter what language or what database, every system has some version of these.

For this task switch to the books database:

```sql
USE thm_books;
```

### Create (INSERT)

Adds a new row to a table.

```sql
INSERT INTO books (id, name, published_date, description)
    VALUES (1, "Android Security Internals", "2014-10-14", "An In-Depth Guide to Android's Security Architecture");
```

You list the columns you're inserting into, then provide values in the same order. The room says this is already in the database, so don't bother running it.

### Read (SELECT)

Pulls data out. The most basic version is grab everything:

```sql
SELECT * FROM books;
```

The `*` means "all columns". Output:

```shell-session
+----+----------------------------+----------------+------------------------------------------------------+
| id | name                       | published_date | description                                          |
+----+----------------------------+----------------+------------------------------------------------------+
|  1 | Android Security Internals | 2014-10-14     | An In-Depth Guide to Android's Security Architecture |
+----+----------------------------+----------------+------------------------------------------------------+
```

If you only want certain columns, list them instead of using `*`:

```sql
SELECT name, description FROM books;
```

### Update

Changes an existing row.

```sql
UPDATE books
    SET description = "An In-Depth Guide to Android's Security Architecture."
    WHERE id = 1;
```

The `WHERE` clause is super important here. Without it, UPDATE changes EVERY row in the table. Forget the WHERE on a real database and you might just rewrite everyone's password to the same thing. Always include WHERE on UPDATE statements.

### Delete

Removes rows.

```sql
DELETE FROM books WHERE id = 1;
```

Same warning as UPDATE. No WHERE = delete everything. The room says don't run this one because it'll mess up the other examples.

### Quick recap

- `INSERT` adds rows
- `SELECT` reads rows
- `UPDATE` changes rows
- `DELETE` removes rows

For the questions you need to switch databases. Run `USE tools_db;` then `SELECT * FROM hacking_tools;` to see what's in there. Find the man-in-the-middle wireless tool, and find the two tools that share a category about USB attacks.

**Using the `tools_db` database, what is the name of the tool in the `hacking_tools` table that can be used to perform man-in-the-middle attacks on wireless networks?** `Wi-Fi Pineapple`

**Using the `tools_db` database, what is the shared category for both USB Rubber Ducky and Bash Bunny?** `USB attacks`

---

## Task 6 — Clauses {#task-6}

A clause is a piece of a SQL statement that adds conditions to it. We've already used `FROM` (which table) and `WHERE` (which rows). This task adds four more.

Switch back:

```sql
USE thm_books;
```

### DISTINCT

Removes duplicates from results. If you do a normal `SELECT * FROM books;` you might see "Ethical Hacking" twice because there are two entries for it. With DISTINCT:

```sql
SELECT DISTINCT name FROM books;
```

You only get unique names. Ethical Hacking shows up once.

### GROUP BY

Groups rows that have the same value in some column. Usually used with aggregate functions like `COUNT`:

```sql
SELECT name, COUNT(*)
    FROM books
    GROUP BY name;
```

This counts how many of each book there are. Ethical Hacking shows up with a count of 2, the rest show 1. Useful when you want to know "how many of each thing".

### ORDER BY

Sorts the results. You can sort ascending (`ASC`) or descending (`DESC`):

```sql
SELECT *
    FROM books
    ORDER BY published_date ASC;
```

Oldest book first. Switch to `DESC` and you get newest first.

```sql
SELECT *
    FROM books
    ORDER BY published_date DESC;
```

If you don't specify ASC or DESC, the default is ASC.

### HAVING

`HAVING` is like `WHERE` but it works on grouped results. The difference matters because `WHERE` filters rows BEFORE they get grouped, while `HAVING` filters AFTER.

```sql
SELECT name, COUNT(*)
    FROM books
    GROUP BY name
    HAVING name LIKE '%Hack%';
```

This groups books by name, counts them, then only shows the groups where the name has "Hack" in it. So you get Car Hacker's Handbook (count 1) and Ethical Hacking (count 2).

For the questions, swap to `tools_db` again. Use `SELECT DISTINCT category FROM hacking_tools;` to see unique categories and count them. Use `ORDER BY name ASC` to find the alphabetically first tool, and `ORDER BY name DESC` for the last.

**Using the `tools_db` database, what is the total number of distinct categories in the `hacking_tools` table?** `6`

**Using the `tools_db` database, what is the first tool (by name) in ascending order from the `hacking_tools` table?** `Bash Bunny`

**Using the `tools_db` database, what is the first tool (by name) in descending order from the `hacking_tools` table?** `Wi-Fi Pineapple`

---

## Task 7 — Operators {#task-7}

Operators are how you actually express conditions. The stuff that goes after WHERE. There are a lot of them but they all do exactly what they sound like, which is nice.

Switch databases for this task:

```sql
USE thm_books2;
```

### Logical Operators

These return TRUE or FALSE based on conditions.

**LIKE** is for pattern matching. The `%` is a wildcard meaning "anything":

```sql
SELECT *
    FROM books
    WHERE description LIKE "%guide%";
```

Returns any book where "guide" appears anywhere in the description.

**AND** requires multiple conditions to all be true:

```sql
SELECT *
    FROM books
    WHERE category = "Offensive Security" AND name = "Bug Bounty Bootcamp"; 
```

Has to match both.

**OR** requires at least one condition to be true:

```sql
SELECT *
    FROM books
    WHERE name LIKE "%Android%" OR name LIKE "%iOS%"; 
```

Either name pattern works.

**NOT** flips a condition:

```sql
SELECT *
    FROM books
    WHERE NOT description LIKE "%guide%";
```

Books where the description does NOT contain "guide".

**BETWEEN** checks if a value falls within a range:

```sql
SELECT *
    FROM books
    WHERE id BETWEEN 2 AND 4;
```

Includes both ends. So 2, 3, and 4.

### Comparison Operators

These are math basically.

**=** is equal to:

```sql
SELECT *
    FROM books
    WHERE name = "Designing Secure Software";
```

Note: SQL uses single `=` for comparison, not `==` like most programming languages. Catches people out all the time.

**!=** is not equal:

```sql
SELECT *
    FROM books
    WHERE category != "Offensive Security";
```

**<** is less than:

```sql
SELECT *
    FROM books
    WHERE published_date < "2020-01-01";
```

Books published before Jan 1 2020. Works with dates because dates are sortable.

**>** is greater than:

```sql
SELECT *
    FROM books
    WHERE published_date > "2020-01-01";
```

Books after that date.

**<=** and **>=** are less/greater than or equal to. Same idea, just includes the boundary.

```sql
SELECT *
    FROM books
    WHERE published_date <= "2021-11-15";
```

```sql
SELECT *
    FROM books
    WHERE published_date >= "2021-11-02";
```

For the questions go back to `tools_db`. Look at the columns first with `DESCRIBE hacking_tools;` so you know what fields exist (specifically the `amount` and `description` fields). Then write queries with the right WHERE clauses.

**Using the `tools_db` database, which tool falls under the Multi-tool category and is useful for pentesters and geeks?** `Flipper Zero`

**Using the `tools_db` database, what is the category of tools with an amount greater than or equal to 300?** `RFID cloning`

**Using the `tools_db` database, which tool falls under the Network intelligence category with an amount less than 100?** `Lan Turtle`

---

## Task 8 — Functions {#task-8}

Functions are built-in things SQL can do to data. Two main groups: string functions and aggregate functions.

### String Functions

These do stuff to text.

**CONCAT()** sticks strings together:

```sql
SELECT CONCAT(name, " is a type of ", category, " book.") AS book_info FROM books;
```

The `AS book_info` part renames the output column to "book_info". Without it the column header would be the entire CONCAT expression which looks ugly.

Output:

```shell-session
+------------------------------------------------------------------+
| book_info                                                        |
+------------------------------------------------------------------+
| Android Security Internals is a type of Defensive Security book. |
| Bug Bounty Bootcamp is a type of Offensive Security book.        |
| ...                                                              |
+------------------------------------------------------------------+
```

**GROUP_CONCAT()** is wild. It mashes multiple rows into one string:

```sql
SELECT category, GROUP_CONCAT(name SEPARATOR ", ") AS books
    FROM books
    GROUP BY category;
```

So instead of getting one row per book, you get one row per category with all the book names smooshed together separated by commas. Useful when you want a quick summary view.

**SUBSTRING()** grabs a piece of a string. Pass it the string, the starting position, and the length:

```sql
SELECT SUBSTRING(published_date, 1, 4) AS published_year FROM books;
```

This grabs the first 4 characters of `published_date`, which gives you just the year. Heads up: SQL counts from 1, not from 0. So position 1 is the first character. Trips people up.

**LENGTH()** returns how many characters are in a string:

```sql
SELECT LENGTH(name) AS name_length FROM books;
```

Counts spaces and punctuation too.

### Aggregate Functions

These work on multiple rows and return one value.

**COUNT()** counts rows:

```sql
SELECT COUNT(*) AS total_books FROM books;
```

`COUNT(*)` counts all rows. You can also do `COUNT(column_name)` to count rows where that column isn't NULL.

**SUM()** adds up numbers in a column:

```sql
SELECT SUM(price) AS total_price FROM books;
```

The room says don't run this one (the books table here doesn't have a price column).

**MAX()** gets the biggest value:

```sql
SELECT MAX(published_date) AS latest_book FROM books;
```

For dates this means most recent.

**MIN()** gets the smallest:

```sql
SELECT MIN(published_date) AS earliest_book FROM books;
```

Oldest date.

For the questions, back to `tools_db`. Use `LENGTH(name)` with `ORDER BY` to find the longest tool name. Use `SUM(amount)` for the total. The last question is trickier, you need to filter for tools where the amount doesn't end in 0 (which means `amount % 10 != 0`, the modulo gives the remainder when dividing by 10), then GROUP_CONCAT them with " & " as the separator.

```sql
SELECT GROUP_CONCAT(name SEPARATOR " & ") FROM hacking_tools WHERE amount % 10 != 0;
```

**Using the `tools_db` database, what is the tool with the longest name based on character length?** `USB Rubber Ducky`

**Using the `tools_db` database, what is the total sum of all tools?** `1444`

**Using the `tools_db` database, what are the tool names where the amount does not end in 0, and group the tool names concatenated by " & ".** `Flipper Zero & iCopy-XS`

---

## Task 9 — Conclusion {#task-9}

Done. Databases, the difference between relational and non-relational, how tables work with primary and foreign keys, and then a pretty thorough run through SQL itself. CREATE/USE/DROP for databases, CREATE/ALTER/DROP for tables, the four CRUD operations, the main clauses for filtering and sorting, all the operators, and the most common functions.

The thing to take away is that SQL really does read like English most of the time. `SELECT name FROM books WHERE category = "Offensive Security" ORDER BY published_date DESC` is basically a sentence. Once you know the keywords you can pretty much guess what most queries do.

---