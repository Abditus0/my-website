---
title: "Client-Server Basics — TryHackMe Pre Security Path"
date: 2026-03-19
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Client-Server Model room - This room teaches the basics of the Client-Server model."
image: "/images/blog/30.png"
readtime: "10 min read"
draft: false
---

# Client-Server Basics

Computers used to work alone. They stored their own files, ran their own programs, and had no idea other computers existed. At some point that changed, and the idea of connecting systems together to share information and resources started taking shape. Networks like ARPANET, CYCLADES, NPL, and NSFNET were the early attempts at that, and they eventually led to what we call the internet today.

This room is about understanding how computers offer services to each other and how the client-server model makes that possible.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Pizza Delivery](#task-2)
- [Task 3 — Web Communication in Practice](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

Just like people in society develop specific skills and offer them as a service, computers started doing the same thing once they got connected. A computer on a network can offer a service, and another computer can use it.

By the end of this room you will understand how that actually works. The key concepts covered here are the client-server model, DNS, clients, servers, ports, protocols, and networks.

---

## Task 2 — Pizza Delivery {#task-2}

The room uses a pizza order to explain how the client-server model works, and it is actually a really good way to think about it.

It is Friday night. Alice and Bob want pizza. Alice looks at the menu for Luigi's Pizza and tells Bob what she wants. Bob drives to Luigi's, places the order, and brings it back home. Simple enough. But let's break down what is actually happening at each step.

**Service, Client, Server**

Alice is the client. She is the one who wants something. Bob carries the request to Luigi's, which is the server. In computer terms this is the same as opening a browser and typing in a website address. The browser is the client making the request, and the server is the machine that sends back the page.

One important thing to remember: the client is always the one who starts the conversation. The server just listens and responds.

**Request and Response**

Alice asked for a large pepperoni pizza. If the pizza place does not have it, Bob comes back with an error. The same thing happens with computers. If the client asks for something and the server cannot find it or does not understand the request, it sends back an error response instead of the content.

**Protocol**

Alice and Bob speak the same language as Luigi's. The order follows a format that both sides understand. In computer terms, that is a protocol. A protocol defines what commands both sides understand, how a request should be structured, what syntax to use, and what responses are expected. Without a shared protocol, the two systems cannot communicate.

**Port**

Luigi's has different doors for different services. Door A is for takeaway, door B is for dining in, door C is for delivery. Ports work the same way on a server. Each service running on a server listens on a specific port number. When a client wants to use a service, it connects to the right port. A single server can run many services at the same time, each on its own port.

**DNS**

Bob knew the name of the pizza place but needed an address to actually drive there. He put it into GPS and got the coordinates. DNS does exactly that for computers. When you type a website name into a browser, DNS translates that name into an IP address, which is the actual location of the server. The IP address works like a home address but for machines on a network.

**Question: What do we use to identify a specific service on a server?** `Port`

**Question: What do we call the address of a server?** `Internet protocol address`

---

## Task 3 — Web Communication in Practice {#task-3}

HTTP stands for Hypertext Transfer Protocol. HTTPS is the secure version of it. It is the protocol used for the web, and it is stateless, meaning every request is handled on its own with no memory of what came before.

That said, modern websites work around this with things like sessions and cookies. When you log into a site, the server creates a session ID and sends it back to you. Your browser includes that ID in every request after that so the server knows who you are. Without this, you would have to log in again on every single page.

**HTTP Methods**

HTTP has 9 core methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, CONNECT, and TRACE. This room focuses on GET.

**The GET Method**

GET is how you ask a server for a resource. When you type a URL into a browser and hit enter, the browser builds a GET request behind the scenes and sends it to the server. The server responds with a status code and the requested content.

The room has a practical exercise here. You open a virtual machine, launch Firefox, and navigate to `http://httpdemo.local:8080`. Then you open the developer tools with F12, go to the Network tab, and reload the page. You will see a list of GET requests appear. Clicking on the first one shows you the details of that request.

Here is what you can see in the request details:

**Scheme** tells you which protocol was used. In this case it is `http`.

**Host** is the name of the server being contacted. Here it is `httpdemo.local:8080`.

**Filename** is the specific file being requested. The "/" in the URL translates to `index.html`.

**Address** is the IP address of the server. Since the demo runs on the same machine, it shows `127.0.0.1`, which is the loopback address pointing to your own machine.

**Status** tells you if the request worked. A `200 OK` means everything went fine and the server sent back what was asked.

After the request, you also get a response. It has two parts: the response header, which contains metadata about the response, and the response body, which is the actual content. You can see the body by clicking the Response tab in the developer tools. In this exercise it shows the HTML of the demo page.

**Question: What would be the host in the following URL? `https://www.iamlearning.thm/contact`** `www.iamlearning.thm`

**Question: What would be the scheme in the following URL? `https://www.iamlearning.thm/contact`** `https`

---

## Task 4 — Conclusion {#task-4}

This room covered how computers offer and use services on a network. The client-server model is at the core of it all. The client always starts the request, the server responds. DNS translates names into IP addresses. Ports identify which service you are talking to. Protocols define the language both sides use.

Then the room went into HTTP as a real example of all of this in action. Every time you open a browser and visit a page, a GET request goes out, the server checks it, and sends back a response. The developer tools exercise makes that process very visible and it is worth doing slowly to actually see what is happening under the hood.

---