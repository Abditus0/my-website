---
title: "Cloud Computing Fundamentals — TryHackMe Pre Security Path"
date: 2026-04-03
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Cloud Computing Fundamentals room - Discover how cloud computing helps businesses move faster, do more, and scale with less effort."
image: "/images/blog/31.png"
readtime: "15 min read"
draft: false
---

# Cloud Computing Fundamentals

Say you built an app and it lives on your laptop. Someone on the other side of the world tries to use it and gets terrible lag. Then 50 people try to use it at the same time and it crashes. Then you close your laptop and it goes offline. That is the problem the cloud was built to solve.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Cloud Computing Overview](#task-2)
- [Task 3 — Deploying a Cloud Instance](#task-3)
- [Task 4 — Conclusion](#task-4)

---

## Task 1 — Introduction {#task-1}

The cloud is not some completely new technology. It is built on top of things you already learned, like virtualization and containers. What it does is take all of that and make it available over the internet, so instead of running everything on one machine in one place, you can run it across infrastructure that already exists around the world.

This room covers what cloud computing is, the different ways we can use it, and the different types of cloud setups available. At the end there is a hands-on exercise where we deploy a real cloud environment.

---

## Task 2 — Cloud Computing Overview {#task-2}

**How we got here**

Cloud computing did not just appear. It came from years of trying to make servers cheaper, more efficient, and easier to manage. The short version: companies started with physical servers, moved to virtualization to use those servers better, and eventually that turned into what we now call the cloud, where you just rent what you need over the internet without touching any hardware yourself.

**Why people actually use it**

A few things make the cloud genuinely useful compared to running your own hardware.

Scalability means your app can handle way more users when things get busy and scale back down when things are quiet, without you doing anything. On-demand self-service means you can spin up a new server in seconds instead of waiting weeks for hardware to arrive. You only pay for what you actually use, so there are no big upfront costs. Cloud providers also handle a lot of the security and keep things running even if part of the system fails. And because the infrastructure is spread across the world, people anywhere can access your app without terrible lag.

**Types of cloud**

There are three ways to deploy a cloud setup depending on what you need.

Public cloud is the most common one. Your app runs on shared infrastructure managed by a provider like AWS or Google. It is affordable, easy to scale, and you do not have to manage anything physical. Most companies use this.

Private cloud is when a company builds their own cloud just for themselves. Banks, hospitals, and government organizations tend to go this route because they need more control over their data and have strict rules to follow.

Hybrid cloud is a mix of both. A company might keep sensitive data on a private setup but use public cloud to handle extra traffic during busy periods, like an online store during a big sale.

**Service models**

On top of the deployment types, there are three ways to actually use cloud services depending on how much you want to manage yourself.

IaaS, or Infrastructure as a Service, means you rent the raw resources like virtual servers and storage. You manage the operating system and your app. The provider handles the physical hardware. This is the most hands-on option.

PaaS, or Platform as a Service, means the provider handles both the hardware and the operating system. You just focus on building and deploying your app.

SaaS, or Software as a Service, means you just use a finished product over the internet. Gmail and Zoom are SaaS. You do not manage anything, you just use it.

A good way to think about it: IaaS is renting an empty apartment and furnishing it yourself. PaaS is renting a furnished apartment. SaaS is staying in a hotel where everything is already taken care of.

**Who the big players are**

AWS is the biggest and most widely used cloud provider by far. Microsoft Azure is the main competitor, especially popular in enterprise settings. Google Cloud is known for data and machine learning tools. Alibaba Cloud is big in Asia. IBM Cloud and Oracle Cloud focus more on business and enterprise use cases.

**How real companies use it**

Netflix runs its entire platform on AWS so it can stream to millions of people at once without going down. Spotify uses the cloud to handle huge amounts of music and users, especially when something big drops. Instagram stores and delivers billions of photos and videos through cloud infrastructure. Online stores use it to survive traffic spikes during things like Black Friday without permanently paying for that capacity.

**Question: What is the characteristic of cloud environments that enables you to handle an unexpected increase in access to your application?** `Scalability`

**Question: What is the most common type of cloud deployment used?** `Public Cloud`

**Question: Suppose you want to deploy an application to the internet, focusing only on application development and leaving infrastructure to others. What type of cloud service is the best?** `PaaS`

---

## Task 3 — Deploying a Cloud Instance {#task-3}

This task puts you in a simulated AWS-style cloud console where you actually deploy an environment for a cyber security training app. The goal is not to memorize every button but to get a feel for how quick and easy it is to manage cloud resources.

**A couple of terms to know first**

EC2 is basically a virtual computer in the cloud. It has CPU and RAM and can run apps just like a real machine. Instance type is just how powerful that virtual machine is. Bigger instance types have more CPU and RAM but cost more.

**Setting up the environment**

First you pick a region, which is just the physical location where your servers will live.

Then you create three virtual machines. The first one is the main interface for the app:

- Instance Name: `application-interface`
- Instance Type: `t3.micro`
- Status: `running`

Then two machines for users to practice on. These need to be more powerful since people will actually be running stuff on them:

- Instance Name: `study-machine-1`
- Instance Type: `m5.large`
- Status: `running`

- Instance Name: `study-machine-2`
- Instance Type: `m5.large`
- Status: `running`

**Looking at billing**

Once the machines are running you go to the Billing section to see what everything costs. Since the app is still in development and nobody is using the study machines yet, it makes sense to stop them to save credits.

After stopping `study-machine-1` and `study-machine-2` you can see how much the cost dropped. This is a really simple example of one of the best things about cloud: you stop paying for things you are not using.

**Question: What is the total cost of credits of the entire environment if `study-machine-1` and `study-machine-2` are stopped?** `30`

**Question: How many credits does an `m5.large` EC2 instance cost per month?** `70`

**Question: What is the total cost of credits if only the new instances we created are running?** `150`

**Question: What would be the total running cost of the entire environment you created if you add a third `t3a.small` study machine?** `188`

---

## Task 4 — Conclusion {#task-4}

Quick recap of everything covered in this room. Public cloud is shared infrastructure anyone can use over the internet. Private cloud is a setup built for one company with more control. Hybrid cloud mixes both. IaaS gives you raw infrastructure to manage. PaaS gives you a ready environment to just build on. SaaS is just using finished software online. EC2 is Amazon's virtual machine service that you can create and resize whenever you need.

The main reasons to use cloud come down to: you can scale without buying hardware, you only pay for what you use, it stays online even when things go wrong, and your users can reach it from anywhere in the world.

---