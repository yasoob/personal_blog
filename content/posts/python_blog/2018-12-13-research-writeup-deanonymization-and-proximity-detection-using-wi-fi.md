---
title: 'Research Writeup: Deanonymization and Proximity Detection Using Wi-Fi'
author: yasoob
type: post
date: 2018-12-13T05:54:12+00:00
url: /2018/12/13/research-writeup-deanonymization-and-proximity-detection-using-wi-fi/
timeline_notification:
  - 1544680457
publicize_twitter_user:
  - yasoobkhalid
categories:
  - Personal
tags:
  - proximity detection
  - research
  - summer research
  - wifi deanonymization
  - wifi tracking

---
Hi everyone! If you have been following my blog for a while you will know that I did research at Colgate University over the summers. My research was on Wi-Fi and how I can do some interesting stuff using it. The university just published its annual catalogue of all the research projects which happened over the summer. My research was done under the mentorship of Aaron Gember-Jacobson. I could not have asked for a better advisor. Here is the writeup of my project:

According to RAINN (Rape, Abuse & Incest National Network), 23.1% of female and 5.4% of male undergraduate students experience rape or sexual assault, with only a minute percentage reporting their assault to law enforcement<sup>1</sup>. In certain cases, survivors can forget who the perpetrator was due to trauma and/or intoxication. I want to use technology to counter this problem. My hope is to reduce the number of potential culprits when such an incident occurs to make it easier for the survivor to identify the perpetrator.  

This can be made possible by using a device that most people carry at all times – a smartphone. The idea is to save the device identifier and the distance between your phone and that of each person who comes near you in a searchable database. This allows you, the user, to search for which device was near you at a particular time. The research is further divided into two parts. The first involved finding a way to effectively calculate the relative distance between two smartphones and the second involved information storage and querying. I focused mainly on the first part, which turned out to be more difficult and involved than I anticipated.  

The cornerstone of this idea is Wi-Fi and the information your smartphone emits when the Wi-Fi is turned on, though not necessarily connected to an access point. The formal requirements of this system are as follows: it should be passive so you don’t have to actively monitor it; it shouldn’t require other people’s smartphones to run any specific application; the error in distance estimation should be less than 1 meter so the algorithm can accurately identify a human interaction; the system needs to work in NLOS (Non-line-of-sight) scenarios since people often have their smartphones in their pockets; finally, it should not require more than three devices, including your smartphone, a nearby smartphone, and a Wi-Fi Access Point to which both phones are connected, because the system should be portable.  

Previous research in relative distance estimation offers varying levels of precision. One method involves using RSSI (Received Signal Strength Indication) readings from multiple access points (4+ for accuracy) and triangulating smartphone position based on that. We cannot use this method because 4+ devices are required. Another method involves using Time-of-Flight (ToF) measurements. There are multiple variations of this method, but the basic idea is to send data from your device to the device being localized, and recording the time taken for the data to travel from one device to another and for an acknowledgment to be received. Based on this timing measurement and the required time delay (known as SIFS, or Short Interframe Space) between a device receiving data and sending an acknowledgement, we can estimate the distance between two devices. This gives the best accuracy but is not directly applicable to this situation, because it requires a direct connection between the two smartphones.  

![Image](https://lh4.googleusercontent.com/FTP3tO9XwIKLV_mnH8Hb6cuioBkCFcLnDSxZw4M74VVLyqj-H9l-kKThDXz4Fe38wYOCIRB-MBqQpq1GI9XofbrZ1seSGFdHho1ZUIMfmkNJV5LB45azTM6rgqYImRnb-zyJKOePDLDc4SJEww)

I sought to develop a modified version of the ToF method, because it offers the best precision and requires the least number of devices to work effectively. The method I developed was to send unsolicited control packets (a special type of data frame) to the target mobile device and force it to send an acknowledgement (see figure). The major research question is: how do we force the target device to send an acknowledgement even if we are not directly connected to it?  

I set up a testbed with three desktops equipped with Wi-Fi cards and running Ubuntu Linux. I used Scapy (a Python program for generating network packets) to generate and send control packets from one desktop to another and tcpdump on the third desktop to monitor and analyze the wireless communication taking place. I was able to send the control packets and solicit an acknowledgment from the target mobile (Ubuntu desktop) without being directly connected to it.  

However, there was a bug in the networking drivers of Ubuntu that generated acknowledgments even in cases where no acknowledgment was supposed to be sent by the target device. Currently, I am investigating the bug and trying to figure out the most suitable way forward. Through this research, I found that the process of distance estimation is more ****complicated than it seems. There are several variables and timing issues that need to be taken into account. In the future, I plan on finding a workaround for this bug, with the eventual goal of making this system usable in everyday life.

If you have any questions about my research or anything in general please write them in the comments below. Looking forward to hearing your views! Have a great day/night! 🙂
