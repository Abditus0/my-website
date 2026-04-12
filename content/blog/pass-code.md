---
title: "PassCode"
date: 2026-04-10
category: "ctf"
excerpt: "Walkthrough of a TryHackMe PassCode challenge - From the Hackfinity Battle CTF event."
image: "/images/blog/68.png"
readtime: "10 min read"
draft: false
---

# PassCode

First time doing a blockchain challenge. I had no idea what to expect going in. The description says there is a smart contract running on a private blockchain and my goal is to make a function called `isSolved()` return true. That is it. No source code, no hints upfront, just a contract sitting on a blockchain waiting to be poked.

Start the machine, wait a couple of minutes, then run all 7 setup commands to get the environment ready. After that you are good to go.

---

## Figuring Out What We Are Dealing With

First thing I did was hit the challenge API to see what info it gives back:

```bash
curl -s $API_URL/challenge | jq
```

`$API_URL/challenge` is the challenge API endpoint and `jq` just formats the JSON so it does not look like a wall of text. Nothing groundbreaking here but it confirms the setup is working.

![](/images/blog/pass-code/1.png)

Now since there is no source code provided, I need to reverse engineer the contract. Every smart contract on a blockchain is stored as bytecode. It looks like complete gibberish but it actually contains function selectors which are short 4 byte fingerprints of every function inside the contract. Think of it like this:

`source code > compiler > bytecode`

To grab the raw bytecode I ran:

```bash
cast code $CONTRACT_ADDRESS --rpc-url $RPC_URL
```

Got the bytecode. Now I need to make sense of it.

---

## Decompiling the Bytecode

Copy the whole bytecode output and paste it into `https://app.dedaub.com/decompile`. Once it processes, the most important part is at the top which is the function routing table.

![](/images/blog/pass-code/2.png)

What is happening there is pretty straightforward. When someone calls the contract, it looks at which function is being called, compares it against a list of 4 byte selectors, and jumps to the matching code. So the caller says "I want function `0x6198e339`", the contract checks its list, finds the match, and runs it.

Now I need to decode those selectors into actual human readable names. I ran `cast 4byte` on each one:

```bash
cast 4byte 0x6198e339
cast 4byte 0x64d98f6e
cast 4byte 0xf9633930
cast 4byte 0xfbf552db
```

![](/images/blog/pass-code/3.png)

And got back:

```
0x6198e339  ->  unlock(uint256)
0x64d98f6e  ->  isSolved()
0xf9633930  ->  getFlag()
0xfbf552db  ->  hint()
```

Now I know exactly what this contract can do. `isSolved()` checks if the challenge is complete. `unlock(uint256)` takes a number as input and is clearly the key to everything. `getFlag()` gives the flag once solved. And `hint()` which is going to give us a hint.

---

## Getting the Hint

```bash
cast call $CONTRACT_ADDRESS "hint()(string)" --rpc-url $RPC_URL
```

![](/images/blog/pass-code/4.png)

It straight up told me the code is `333`. Ok then. That was easier than expected. I was half expecting some cryptic riddle.

---

## Unlocking the Contract

Now lets call `unlock(uint256)` with `333` and see what happens:

```bash
cast send $CONTRACT_ADDRESS "unlock(uint256)" 333 --rpc-url $RPC_URL --private-key $PRIVATE_KEY --legacy
```

This sends a transaction to the blockchain, passes in the code from the hint, and signs it with my wallet using the private key. The `--legacy` flag is needed for compatibility with older transaction formats.

![](/images/blog/pass-code/5.png)

Transaction went through.

Now lets check if that actually did anything:

```bash
cast call $CONTRACT_ADDRESS "isSolved()(bool)" --rpc-url $RPC_URL
```

![](/images/blog/pass-code/6.png)

`true`. Nice.

---

## Getting the Flag

```bash
cast call $CONTRACT_ADDRESS "getFlag()(string)" --rpc-url $RPC_URL
```

**Flag:** `THM{web3_h4ck1ng_code}`

![](/images/blog/pass-code/7.png)

---

This was a short one but genuinely interesting. I had never touched a blockchain challenge before and going in blind with no source code felt kind of intimidating. Reverse engineering the bytecode through a decompiler and decoding the function selectors was a cool process. Once I had the function names it basically walked itself. The hint function giving away the answer directly was funny. But hey, I will take it.

---
