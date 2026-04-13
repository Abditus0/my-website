---
title: "Active Directory Basics — TryHackMe Cyber Security 101"
date: 2026-04-12
category: "writeup"
excerpt: "Complete walkthrough of TryHackMe's Active Directory Basics room — This room will introduce the basic concepts and functionality provided by Active Directory."
image: "/images/blog/69.png"
readtime: "28 min read"
draft: false
---

# Active Directory Basics

This room is where things start feeling a lot more like real corporate IT. Active Directory is everywhere in the business world. If you have ever logged into a computer at school or work with a username that also worked on every other computer in the building, that was Active Directory doing its thing. This room breaks down what it is, how it works, and how to manage it.

Same deal as before. Connect via RDP:

Username: `administrator`
Password: `Password321`

When connecting make sure you use `THM\Administrator` as the username so Windows knows you want the domain account and not a local one.

---

## Tasks

- [Task 1 — Introduction](#task-1)
- [Task 2 — Windows Domains](#task-2)
- [Task 3 — Active Directory](#task-3)
- [Task 4 — Managing Users in AD](#task-4)
- [Task 5 — Managing Computers in AD](#task-5)
- [Task 6 — Group Policies](#task-6)
- [Task 7 — Authentication Methods](#task-7)
- [Task 8 — Trees, Forests and Trusts](#task-8)
- [Task 9 — Conclusion](#task-9)

---

## Task 1 — Introduction {#task-1}

Just an intro. The room says it will cover what Active Directory is, what a domain is, what components make up a domain, forests, trusts, and more. Start the machine and move on.

---

## Task 2 — Windows Domains {#task-2}

The room opens with a pretty relatable scenario. Imagine you are the IT person for a small office with five computers. Easy enough, you just walk to each one and sort things out. Now imagine the company blows up and suddenly you have 157 computers across four offices and 320 users. Managing each machine individually is just not happening anymore.

That is exactly the problem Windows domains solve.

A Windows domain is basically a group of users and computers all managed by the same organisation. Instead of every machine having its own separate list of users and settings, everything gets centralised into one place called Active Directory. The server that runs Active Directory is called a Domain Controller, or DC.

The two big advantages this gives you are centralised identity management, meaning you create a user once in AD and they can log into any machine on the network, and centralised security policy management, meaning you push rules and restrictions from one place and they apply everywhere.

The school/university example in the room is a good one. That username and password you had that worked on every computer on campus? That was AD. And the reason you could not install software or open the Control Panel on those machines? Also AD, through policies set by the IT department.

**Question: In a Windows domain, credentials are stored in a centralised repository called...** `Active Directory`

**Question: The server in charge of running the Active Directory services is called...** `Domain Controller`

---

## Task 3 — Active Directory {#task-3}

The heart of any Windows domain is the Active Directory Domain Service, or AD DS. Think of it as a big catalogue of every object that exists on the network. And when the room says objects, it means users, computers, printers, shared folders, groups, and more.

**Users**

Users are one of the most common objects in AD. They are what the room calls security principals, which just means they can be authenticated by the domain and assigned permissions to things like files and printers.

Users can represent two kinds of things. People, which is what you normally think of, employees and staff who need to log in and do their jobs. And services, where a user account is created specifically to run something like IIS or MSSQL. Service accounts only get the permissions they need to run that specific service and nothing more.

**Machines**

Every computer that joins the domain gets a machine object created for it in AD. Machines are also security principals. Each one gets its own account, and that account is the local administrator for that specific computer. You are not supposed to log into a machine account directly, but the account exists and has a password. Machine account passwords are 120 random characters and rotate automatically, so good luck with that.

Machine accounts are easy to spot because they follow a naming pattern. The computer name followed by a dollar sign. So a computer called `DC01` would have a machine account called `DC01$`.

**Security Groups**

Security groups let you assign permissions to a whole bunch of users at once instead of doing it one by one. Add someone to a group and they instantly inherit everything that group has access to. Groups can contain users, machines, or even other groups.

Some important default groups worth knowing:

Domain Admins have admin rights over the entire domain including all the DCs. Server Operators can manage DCs but cannot change admin group memberships. Backup Operators can access any file regardless of permissions, specifically for backup purposes. Account Operators can create and modify other accounts. Domain Users includes every user account in the domain. Domain Computers includes every computer. Domain Controllers includes every DC.

**Active Directory Users and Computers**

This is the tool you use to actually manage all of this. You find it in the Start Menu on the Domain Controller. It shows you the hierarchy of everything in the domain, organised into Organisational Units or OUs.

OUs are container objects. They let you group users and computers together so you can apply policies to them as a set. The IT department gets different policies than the Sales department, so you put them in different OUs. One important thing to note is that a user can only be in one OU at a time.

In the THM domain there is already a `THM` OU with five child OUs inside it for IT, Management, Marketing, R&D, and Sales. This mirrors the company structure which is pretty typical.

Outside of the THM OU there are some default containers that Windows creates automatically. Builtin holds default groups. Computers is where new machines land when they first join the domain. Domain Controllers is the default OU for your DCs. Users holds default domain-wide user accounts and groups. Managed Service Accounts holds accounts used by services.

**Security Groups vs OUs**

This trips people up a bit so it is worth being clear on. OUs are for applying policies. They define what rules and settings apply to a set of users or computers. Security groups are for granting access to resources like shared folders or printers. A user can only be in one OU but can be in as many security groups as needed.

**Question: Which group normally administrates all computers and resources in a domain?** `Domain Admins`

**Question: What would be the name of the machine account associated with a machine named TOM-PC?** `TOM-PC$`

**Question: Suppose our company creates a new department for Quality Assurance. What type of containers should we use to group all Quality Assurance users so that policies can be applied consistently to them?** `Organizational Units`

---

## Task 4 — Managing Users in AD {#task-4}

First real practical task. You are given an organisational chart showing what the company structure should look like and you need to make the AD match it.

**Deleting extra OUs and users**

When you open Active Directory Users and Computers you will notice there is an extra department OU that does not appear on the chart. The room says it was closed due to budget cuts and needs to go.

Here is the annoying part. If you just right click and try to delete it, Windows throws an error at you. OUs are protected against accidental deletion by default. To get around this you need to go to the View menu and enable Advanced Features. Once that is on, right click the OU, go to Properties, find the Object tab, and uncheck the box that says protect from accidental deletion. Then you can delete it.

After that, go through each department OU and compare the users inside to the org chart. Create any users that are missing and delete any that should not be there anymore.

**Delegation**

Delegation is the process of giving a specific user control over an OU without making them a full Domain Admin. A really common use case is giving IT support the ability to reset passwords for regular users without them needing admin rights to everything.

In the room, Phillip is the IT support guy and we need to give him the ability to reset passwords for users in Sales, Marketing and Management.

To do this, right click the Sales OU and select Delegate Control. A wizard opens up and asks who you want to delegate to. Type `phillip` and click Check Names so Windows autocompletes it properly. On the next screen you pick what you want to delegate, in this case it is resetting user passwords and forcing a password change at next login.

Now to test it, you RDP in as Phillip using `THM\phillip` and `Claire2008`. Phillip cannot open Active Directory Users and Computers because he does not have the rights for that. Instead you use PowerShell to reset Sophie's password:

```powershell
Set-ADAccountPassword sophie -Reset -NewPassword (Read-Host -AsSecureString -Prompt 'New Password') -Verbose
```

Then force her to change it on next login:

```powershell
Set-ADUser -ChangePasswordAtLogon $true -Identity sophie -Verbose
```

After that you RDP in as `THM\sophie` with the new password you just set. Windows will make you change it again on first login, just set something new. Once you are on Sophie's desktop the flag is there.

**Question: What was the flag found on Sophie's desktop?** `THM{thanks_for_contacting_support}`

**Question: The process of granting privileges to a user over some OU or other AD Object is called...** `Delegation`

---

## Task 5 — Managing Computers in AD {#task-5}

When a machine joins the domain it lands in the default Computers container. If you look at it on the VM you will see a mix of servers, laptops and PCs all dumped in there together. That is not ideal because you probably want different policies for servers versus regular user workstations.

The room suggests three categories as a starting point for organising machines.

Workstations are the everyday computers that users log into to do their work. These should never have privileged accounts signed into them.

Servers provide services to users or other machines. Different use case, different policies.

Domain Controllers are already in their own OU that Windows creates automatically. They are the most sensitive machines on the network because they hold password hashes for every account in the domain.

So the task is to create two new OUs directly under the `thm.local` domain container, one called `Workstations` and one called `Servers`. Then drag the appropriate machines from the Computers container into the right OU. Personal computers and laptops go to Workstations, servers go to Servers.

After sorting everything out, seven machines ended up in the Workstations OU.

**Question: After organising the available computers, how many ended up in the Workstations OU?** `7`

**Question: Is it recommendable to create separate OUs for Servers and Workstations? (yay/nay)** `yay`

---

## Task 6 — Group Policies {#task-6}

Now that the OUs are set up and organised properly, the whole point of doing that was so you can apply different policies to different groups. This is done through Group Policy Objects, or GPOs.

A GPO is just a collection of settings. You create a GPO, configure whatever settings you want inside it, and then link it to an OU. Everyone in that OU gets those settings applied. And it cascades down, so if you link a GPO to a parent OU it also applies to all child OUs under it.

You manage GPOs through the Group Policy Management tool in the Start Menu. On the VM there are already three GPOs set up. The Default Domain Policy and RDP Policy are linked to the whole `thm.local` domain. The Default Domain Controllers Policy is linked only to the Domain Controllers OU.

**GPO distribution**

GPOs get pushed out to machines through a network share called `SYSVOL` which lives on the DC. Every machine in the domain has access to this share and checks it periodically to sync the latest policies. By default it can take up to two hours for a change to propagate. If you need it to happen right now you can run this on any machine:

```powershell
gpupdate /force
```

**Creating GPOs for THM Inc.**

The task gives you two things to implement.

First, block non-IT users from accessing the Control Panel. You create a new GPO called `Restrict Control Panel Access`, go into User Configuration and find the policy that prohibits access to the Control Panel and PC settings, enable it, and then link the GPO to the Marketing, Management and Sales OUs. IT does not get this GPO so they can still access the Control Panel.

Second, make workstations and servers auto lock after 5 minutes of inactivity. You create a new GPO called `Auto Lock Screen`, find the screen saver timeout policy under User Configuration, set it to 5 minutes, and link it to the root domain. Because all the machine OUs are children of the root domain they will all inherit it. The Sales and Marketing OUs will also inherit it technically but since it is a Computer Configuration it gets ignored on OUs that only contain users.

To verify the Control Panel restriction is working you RDP in as Mark using `THM\mark` and `M4rk3t1ng.21` and try to open the Control Panel. You should get a message saying the administrator has blocked it. If the GPO is not applying yet just run `gpupdate /force`.

**Question: What is the name of the network share used to distribute GPOs to domain machines?** `sysvol`

**Question: Can a GPO be used to apply settings to users and computers? (yay/nay)** `yay`

---

## Task 7 — Authentication Methods {#task-7}

When you log into anything on a domain, the machine needs to verify your credentials with the Domain Controller. There are two protocols Windows can use for this.

**Kerberos**

Kerberos is the default in any modern Windows domain. Instead of sending your password across the network every time you want to access something, Kerberos uses tickets.

Here is how it works. When you log in, your machine sends your username and a timestamp encrypted with your password to the Key Distribution Center (KDC), which lives on the Domain Controller. The KDC sends back a Ticket Granting Ticket or TGT. Think of the TGT as a proof that you already authenticated. It also comes with a Session Key.

When you want to access a specific service, say a shared folder, you use your TGT to ask the KDC for a Ticket Granting Service ticket or TGS. The TGS is specific to that one service. You send your username, a timestamp encrypted with the Session Key, your TGT, and the Service Principal Name of the thing you want to access. The KDC sends back a TGS and a Service Session Key.

You then take the TGS to the actual service you want to access. The service decrypts it, validates the Service Session Key, and lets you in. Your password never went across the network at any point.

The TGT itself is encrypted with the KDC's own key so you cannot tamper with it or read what is inside it.

**NetNTLM**

NetNTLM is the older protocol kept around for compatibility. It works on a challenge and response system.

You send an authentication request to a server. The server generates a random number and sends it to you as a challenge. You take your NTLM password hash, combine it with the challenge and some other known data, and send back a response. The server forwards both the challenge and your response to the Domain Controller. The DC recalculates what the response should be and compares it to what you sent. If they match, you are in.

Again your actual password never crosses the network. Just the hash and the response derived from it.

If you are using a local account instead of a domain account the server can just verify the response itself without asking the DC, because it already has the local password hash stored on the machine.

**Question: Will a current version of Windows use NetNTLM as the preferred authentication protocol by default? (yay/nay)** `nay`

**Question: When referring to Kerberos, what type of ticket allows us to request further tickets known as TGS?** `Ticket Granting Ticket`

**Question: When using NetNTLM, is a user's password transmitted over the network at any point? (yay/nay)** `nay`

---

## Task 8 — Trees, Forests and Trusts {#task-8}

So far everything has been about running a single domain. But companies grow and things get more complicated.

**Trees**

Imagine THM Inc. expands into a new country. The new country has different laws, different compliance requirements, different IT teams. You could try to cram everything into one massive OU structure but that gets messy fast and is easy to break.

Instead, Active Directory lets you split into multiple domains that share the same namespace. If you have `thm.local` and you expand to the UK and US, you could create `uk.thm.local` and `us.thm.local` as subdomains. These three domains together form a Tree, with `thm.local` as the root.

Each branch gets its own DC and its own IT team managing it independently. UK admins manage UK resources. US admins manage US resources. They do not step on each other.

When you start talking about trees a new group becomes relevant called Enterprise Admins. Enterprise Admins have admin rights across every domain in the entire tree, not just one. Regular Domain Admins still only have control over their own domain.

**Forests**

Now imagine THM Inc. acquires another company called MHT Inc. MHT has its own completely separate domain namespace, nothing to do with `thm.local`. When you join multiple trees that have different namespaces together into one network, that is called a Forest.

**Trust Relationships**

Trees and forests are great for separating management but at some point people in different domains need to access each other's resources. That is where trust relationships come in.

A one-way trust between Domain A and Domain B means users from B can access resources in A. The trust goes one direction, the access goes the other. A two-way trust means both domains trust each other mutually. When you join domains into a tree or forest, two-way trusts get set up automatically between them.

One important thing the room is clear about: a trust relationship does not automatically give everyone access to everything. It just makes it possible for you to grant access across domains. You still have to explicitly set up what is actually allowed.

**Question: What is a group of Windows domains that share the same namespace called?** `Tree`

**Question: What should be configured between two domains for a user in Domain A to access a resource in Domain B?** `A Trust Relationship`

---

## Task 9 — Conclusion {#task-9}

That is Active Directory Basics done.

The room covered a lot of ground. Windows domains and why they exist, the AD DS catalogue and the objects inside it (users, machines, groups, OUs), how to actually manage users and delegate control without handing out Domain Admin to everyone, organising computers into proper OUs, pushing settings through GPOs, how Kerberos and NetNTLM authentication work under the hood, and how trees, forests and trusts let you scale AD across a whole enterprise.

---