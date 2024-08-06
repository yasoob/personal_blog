---
title: "Breaking Kakasoft USB Copy Protection"
date: 2024-08-05T15:37:31-07:00
draft: false
categories: ['hacking', 'security']
featured_image: "/images/breaking-kakasoft-protection/header.png"
teaser: "I stumbled upon a USB drive locked down with Kakasoft's USB Copy Protection software. Challenge accepted! I decided to crack this DRM protection wide open. In this article, I'll take you through every step of the process, sharing my strategies and thought process so you can break free from such flimsy defenses too."
---

I recently got my hands on a USB drive with Kakasoft USB Copy Protection (DRM protection). This software promises to let you share data without the fear of it being copied by the end user. However, the pseudo-hacker in me couldn’t resist the challenge. After all, "If it can be read, it can be copied." In this article, I’ll walk you through the entire process I used to crack this protection, sharing my thought process and detailed steps along the way. Don’t worry—I’ve pixelated any sensitive information, but you’ll still get a clear picture of how to bypass such weak defenses.

## How the Copy Protection Works

Kakasoft’s method involves placing an executable file on the USB that acts as a virtual file explorer, disabling the usual copy/paste operations. You can open files from this explorer, but you can’t move them outside of the USB. Here’s a peek at the UI:

![Virtual browser](/images/breaking-kakasoft-protection/virtual-browser.png)

As you can see, the copy icon is grayed out, and right-clicking on any file or directory won’t help either—the copy option is disabled.

## Initial Attempts to Break the Protection

I had a few theories on how this software might work, and I set out to test each one.

### Hidden Directories
First, I thought the data might be in a hidden directory on the USB, displayed by the virtual explorer. While the USB did have hidden directories, none contained meaningful data.

### Self-Extracting Archive
Next, I wondered if the exe was a self-extracting archive. I tried using 7-zip to extract it, but it was no use—7-zip reported a broken archive.

### Online Search
Turning to the internet, I searched for ideas using the hidden directory name, `HPSafeBox`. This led me to a [Reddit post](https://www.reddit.com/r/Xenoblade_Chronicles/comments/3vikin/warning_the_xenoblade_chronicles_x_ost_has_a/) discussing the same copy protection. The post suggested that data was stored in the HPSafeBox directory or a hidden `Y` drive. Checking and modifying local registry settings didn’t help.

### Partition Editor
I ran various offline tools, including a partition editor, hoping to uncover hidden drives. [TreeSize](https://www.jam-software.com/treesize_free) only showed the `C` drive and the USB's `F` drive:

![TreeSize UI](/images/breaking-kakasoft-protection/treesize-ui.png)

*I used TreeSize as someone was able to uncover the hidden drive using it in a YouTube video*

## Finding the exe Location

In my case, the USB came with an executable software hidden behind the virtual file browser. I decided to try and trace where the executable might be running from, hoping that it might give me some clues about the hidden data's location. My thought process was that if the exe file is able to run on the system then it must be stored in an accessible location. I tried using Task Manager to figure out the file location but clicking on "Open file location" did nothing:

![Task Manager](/images/breaking-kakasoft-protection/task-manager.png)

Next, I used a very old tool called [`Api Monitor`](http://www.rohitab.com/apimonitor). It allows you to monitor a program and shows which DLL calls that program is making. This gave me my next clue—the path of the executable running from the F drive, but with a command line reference to a hidden Z drive:

![API Monitor](/images/breaking-kakasoft-protection/api-monitor.png)

Accessing the `F` drive path was blocked:

![Explorer Error](/images/breaking-kakasoft-protection/explorer-error.png)

And the `Z` drive also returned an error:

![Explorer error](/images/breaking-kakasoft-protection/explorer-error-2.png)

## Disabling Group Policy Changes

The `Z` drive error intrigued me. I was accessing this drive on my personal computer and I don't remember putting any restrictions in place. [This SuperUser post](https://superuser.com/questions/1184157/windows-this-operation-has-been-cancelled-due-to-restrictions-in-effect-on-thi) mentioned some Group Policy changes to disable this restriction. I went ahead and disabled the "Prevent access to drives from My Computer" setting:

![Group Policy Editor](/images/breaking-kakasoft-protection/policy-editor.png)

With this restriction lifted, I accessed the Z drive, uncovering the `NLLastF` directory containing all the files I needed:

![File Browser](/images/breaking-kakasoft-protection/file-browser.png)

Let this be a reminder: if something is accessible offline, it’s only a matter of time before the security measures or DRM protections are bypassed.