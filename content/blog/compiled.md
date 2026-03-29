---
title: "Compiled CTF"
date: 2026-03-22
category: "ctf"
excerpt: "Walkthrough of TryHackMe's Compiled CTF — Strings can only help you so far."
image: "/images/blog/9.png"
readtime: "5 min read"
draft: false
---

# Compiled

We're given a binary and asked to find the password. I'm using the TryHackMe attack box, so I navigate to `/room/Rooms/Compiled` to access it.

---

Inside the directory there's one file: `Compiled.Compiled`.

![](/images/blog/compiled/1.png)

First thing I do is `cat` it.

It's a binary so most of the output is unreadable, but one line catches my eye immediately:

![](/images/blog/compiled/2.png)

```
Password: DoYouEven%sCTF__dso_handle_initCorrect!Try again!
```

We already have the start of the password: `DoYouEven`. But there's a `%s` in the middle, meaning something is missing. Let's throw the binary into a decompiler to figure out what.

## Decompiling with Ghidra

I upload the binary to **Decompiler Explorer** and pick **Ghidra**. The main function starts at line 144:

![](/images/blog/compiled/3.png)

```c
undefined8 main(void)
{
  int iVar1;
  char local_28 [32];
  
  fwrite("Password: ",1,10,stdout);
  __isoc99_scanf("DoYouEven%sCTF",local_28);
  iVar1 = strcmp(local_28,"__dso_handle");
  if ((-1 < iVar1) && (iVar1 = strcmp(local_28,"__dso_handle"), iVar1 < 1)) {
    printf("Try again!");
    return 0;
  }
  iVar1 = strcmp(local_28,"_init");
  if (iVar1 == 0) {
    printf("Correct!");
  }
  else {
    printf("Try again!");
  }
  return 0;
}
```

## Reading the Code

The `scanf` line is using `DoYouEven%sCTF` as its format. Whatever you type in place of `%s` gets stored into `local_28`. That's what gets checked.

This is the important part:

```c
iVar1 = strcmp(local_28,"_init");
if (iVar1 == 0) {
    printf("Correct!");
}
```

`strcmp` returns 0 when the two strings are the same. So `local_28` needs to be `_init`. That's our missing piece.

Does that mean the password is `DoYouEven_init`? Let's try it.

![](/images/blog/compiled/4.png)

It works!

- `cat` on a binary is mostly unreadable, but strings always show up and that's often all you need to get started
- `scanf` format strings tell you exactly what shape the input needs to be
- `strcmp` returning 0 means a match. Find what it's comparing against and you have your answer

**Password:** `DoYouEven_init`