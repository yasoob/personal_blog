---
title: "Software Engineering Within SpaceX"
date: 2020-06-01T15:51:39-04:00
draft: false
categories: ['spacex', 'random', 'programming']
---

![SpaceX Dragon launch](/images/spacex/dragon-launch.jpg)

Hi everyone! :wave: I am sure quite a few of you must have seen the SpaceX launch this past Saturday. It was an amazing and historic event. Millions of people were watching it live on YouTube and elsewhere. With each passing day, we are getting closer to commercial space flights and I have to agree I am excited.

In addition to fueling my excitement about space travel, this launch also made me curious about the tech which goes in these rockets. I did some research from the Computer Science perspective and wanted to share what I found. It goes without saying that most of this information is gathered from different sources I came across online. Even though I tried to make sure I don't include any wrong information, there is no guarantee that this information is 100% accurate.

## Teams

There was an [AMA by the SpaceX Software Engineering](https://www.reddit.com/r/IAmA/comments/1853ap/we_are_spacex_software_engineers_we_launch/) team 7 years ago where they shared some insights about how they work and what they work on. They have 4 separate Software teams:

- Flight Software team

> The Flight Software team is about 35 people. We write all the code for Falcon 9, Grasshopper, and Dragon applications; and do the core platform work, also on those vehicles; we also write simulation software; test the flight code; write the communications and analysis software, deployed in our ground stations. We also work in Mission Control to support active missions.

- Enterprise Information Systems team 

> The Enterprise Information Systems team builds the internal software systems that makes SpaceX run. We wear many hats, but the flagship product we develop and release is an internal web application that nearly every person in the company uses. This includes the people that are creating purchase orders and filling our part inventory, engineers creating designs and work orders with those parts, technicians on the floor clocking in and seeing what today's work will be per those designs...and literally everything in between. There are commercially available products that do this but ours kicks major ass! SpaceX is transforming from a research and engineering company into a manufacturing one - which is critical to our success - and our team is on the forefront of making that happen. We leverage C#/MVC4/EF/SQL; Javascript/Knockout/Handlebars/LESS/etc and a super sexy REST API.

- Ground Software team

> The Ground Software team is about 9 people. We primarily code in LabVIEW. We develop the GUIs used in Mission and Launch control, for engineers and operators to monitor vehicle telemetry and command the rocket, spacecraft, and pad support equipment. We are pushing high bandwidth data around a highly distributed system and implementing complex user interfaces with strict requirements to ensure operators can control and evaluate spacecraft in a timely manner.

- Avionics Test team

> The Avionics Test team works with the avionics hardware designers to write software for testing. We catch problems with the hardware early; when it's time for integration and testing with flight software it better be a working unit. The main objective is to write very comprehensive and robust software to be able to automate finding issues with the hardware at high volume. The software usually runs during mechanical environmental tests.

## Hardware + Software Redundancy

Someone also recounted their interaction with the SpaceX team at GDC 2015/2016 in an [answer on StackExchange](https://space.stackexchange.com/a/9446). They talk about the tripple redundancy system and how SpaceX uses the Actor-Judge system. In short there are 3 dual core ARM processors running on custom board ([according to elteto](https://news.ycombinator.com/item?id=23369065)). For each decision a "flight string" compares the result from each core on a single processor. If the output matches the command is sent to different controllers. There are 3 processors (with dual cores) so that means each controller/sensor will get three different commands. The controllers then act as the judge and compare the three commands. If all three are in agreement, they carry out the operation. If even a single command is in disagreement, the controller carries out the command from the processor which had previously been sending the correct commands. 

**This means that at any given point there are 6 running processes of the flight software.**

## Software Certifications

Most of the important software in mission-critical infra goes through various certifications. For instance, you can't run any random software on an airplane. Even the entertainment system code has to satisfy various certifications. One such certification is [DO-178B](https://en.wikipedia.org/wiki/DO-178B) which stands for **Software Considerations in Airborne Systems and Equipment Certification*.

The certification and correctness part is made easier by using software verification tools. One such tool is [Astrée](https://www.absint.com/astree/index.htm). It is a static code analyzer that checks for runtime errors and concurrency related bugs in C projects. This also leads us to the answer for why a lot of mission-critical code is written in C. Its because there are a lot of static analyzers and software verification tools for C. 

A fun fact which I got via [Hacker News](https://news.ycombinator.com/item?id=23369675): 

> Automatic docking software for the ATV that delivers supply to ISS is written using C code and verified with Astree.

SpaceX also made use of Chromium and JavaScript for Dragon 2 flight interface. I am not sure how that passed the certification. I assume it was allowed because for every mission-critical input on the display, there was a physical button underneath the display as well. So if in case the screen malfunctioned, the astronauts could potentially make use of the physical buttons. You can see the buttons in the image below.

![Falcon 9 touch input display](/images/spacex/touch-input.jpg)

The astronauts explain how the system works and what they do in case of UI malfunction in [this video](https://mobile.twitter.com/NASA/status/1266885097359388672).

Mission Critical infra also uses real-time operating system. These operating systems have special assurances that might not be provided by regular operating systems. For example, faster interrupt response and better memory protection. A ROS provides real-time guarantees which are essential for such software. One such operating system is [VxWorks](https://www.windriver.com/products/vxworks/). It was launched in 1987, targets Embedded systems, and is owned by Wind River Systems. It is used in the Mars Rover and SpaceX Dragon ([among other systems](https://en.wikipedia.org/wiki/VxWorks#Aerospace_and_defense)). Having so many certifications doesn't mean that bugs can't show up. Apparently, the 2003 Mars rovers experienced a bug in their flash memory driver but it was sorted out by sending an update from earth ([source](https://www.computerworld.com/article/2574759/out-of-memory-problem-caused-mars-rover-s-glitch.html)).

## Model Rockets

If you want to indulge your curiosities and explore programming for rockets, you should check out model rockets. Joe Barnard works on [BPS.space](https://bps.space/) and has made small hobby rockets do amazing stuff. He has developed his own little flight controller called [Signal](https://bps.space/signal). He made a Falcon 9 replica which is stabilized using [Thrust Vector Control](https://bps.space/tvc). There are so many opportunities nowadays for learning about actual space rockets and working your way up from small model rockets. 

![Falcon 9 replica](/images/spacex/falcon9-replica.jpeg)

If you are interested in model rockets, you should explore the different certifications and licenses available in your country for amateur rocketeers. US has 3 levels of certifications and each level gives you more possibilities for rocket launches.

If you are curious about how much cool stuff you can do using model rockets, check out this landing rocket developed by Joe below.

[![Auto model rocket landing](/images/spacex/rocket-landing.gif)](https://youtu.be/yx5zLykjKy8) 

I will continue to update this article based on any new stuff I find during my research. If you feel like I misquoted something or if there is something new I should add to this article please let me know in a comment below! 

Till next time, have a wonderful day, and stay safe! :wave: :heart:

PS: SpaceX also [launched a simulator](https://iss-sim.spacex.com/) where you can try your hands at docking the Falcon 9 with the ISS :rocket:

