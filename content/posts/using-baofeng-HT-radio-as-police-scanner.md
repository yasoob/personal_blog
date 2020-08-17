---
title: "Using BaoFeng UV-5X3 HT as Police Scanner"
date: 2020-08-17T01:36:31-04:00
draft: false
categories: ['amateur-radio','ham']
featured_image: "/images/radio/hero.png"
teaser: "Have you seen movies where people use a radio to track police? Maybe you have seen the movie Stranger Things and saw the main characters using a radio and an antenna for communication. In this tutorial, I show you how to use a similar portable Baofeng handheld transceiver to track the local police/fire department. It is a lot of fun!"
---

Hi lovely people! :wave: I am a huge radio enthusiast. So much so that I recently gave (and cleared) my Technician Ham license exam. I am now just waiting for my call sign to appear in the FCC database. While that is happening, I went ahead and bought a [BaoFeng UV-5X3](https://www.amazon.com/BTECH-UV-5X3-Tri-Band-Amateur-Earpiece/dp/B01J2W4JUI) radio.

**Note:** If you ever decide to buy this radio look at the BaoFeng website first. You might be able to score a cheaper deal there.

I started listening to some local frequencies and quickly got bored. I asked myself  "wouldn't it be fun if I could listen to emergency services and local police on this radio?". The answer was a resounding yes and I decided to go ahead and figure out how to do exactly that. In this tutorial, I will show you how you can find out the frequency of your local PD/FD and then listen to them using your handheld transceiver.

## Finding the Police Department/Fire Department Frequency

The very first step is to find out the frequency your local PD/FD operates on. For that, you can go to the wonderful [Radio Reference](https://www.radioreference.com/) website and search for your city. I am currently in Ingham County so this is what my county page looks like:

![image-20200816030342690](/images/radio/radio-reference.png)

If you scroll down you will see the various departments in your area and the frequencies they operate on:

![image-20200816030526562](/images/radio/radio-reference-1.png)

The two important columns for us are the Frequency and the Tone columns. The frequency column tells us what frequency a particular Base Station or Repeater is transmitting at and the Tone column tells us if the station uses any CTCSS tone or not. A [CTCSS](https://www.wikiwand.com/en/Continuous_Tone-Coded_Squelch_System) tone is also known as PL tone and that is what the Tone column lists for most stations on Radio Reference website.

If a station uses CTCSS then in addition to setting up the station frequency, you need to set the CTCSS frequency in your HT as well. 

## Inputting the Station Frequency and CTCSS (PL) 

For our use case, let's assume that we are trying to access the frequency 453.480 MHz whose CTCSS is listed as 162.2 PL. The first step is to go to the menu on our radio and add the CTSS frequency. To do that follow these steps:

1. Press `MENU` button
2. Press `11` and that will take you to the `R-CTCSS` setting
3. Press `MENU` again to start updating the `R-CTCSS` setting
4. Type `162.2` or use the up and down arrow keys to navigate to it manually
5. Press `MENU` to confirm the setting

Now that the CTCSS is successfully set we can tune in to 453.480 MHz. First of all, make sure that your HT is in the appropriate mode and band. First press the `VFO/MR` button to enter the `VFO` mode. In frequency (VFO) mode we can tune to custom frequencies. Now cycle through the bands by pressing the `BAND` button. Once it shows `460.525` on the screen you can be sure that you are in the right band for our desired frequency. Now manually type in 453.480 and it should tune to that frequency. Now it is just a matter of waiting for someone to speak on that frequency and you should be able to listen to them.

You can also use the scan option by long-pressing the `*` key and inputting a range of frequencies. It will tell you which frequency has some chatter going on. I am sure you will be able to find a couple of frequencies with people talking on them.

PS: I also bought this [Nagoya NA-320A Triband HT Antenna](https://www.amazon.com/Nagoya-NA-320A-2M-1-25M-70CM-144-220-440Mhz-BTECH/dp/B01K10B9XK/) for my UV-5X3. It greatly increased the range of signals I was able to receive on my HT.

## Help I don't hear anything!

When I inputted CTCSS, my radio didn't output anything useful at the listed frequencies on Radio Reference. I then went ahead and started scanning the channel range without inputting any CTCSS frequency and was able to successfully tune in into the local PD frequency. It was in the vicinity of the frequency values listed on Radio Reference but wasn't exactly the same. So if you encounter a similar problem try removing the CTCSS frequency and scanning through the range of frequencies.

I saw that most of the signals were between 450 and 464 MHz so I scanned between these frequencies. Before scanning you can modify the `Scan Resume Method` on your Baofeng to `Time Operation` (TO) mode so that the scanner continues scanning the range of frequencies even after it picks up chatter at a particular frequency. `Scan Resume Method`, or `SC-REV`, sets delay on scanning. I like this mode because I don't have to manually initiate the scan again if my radio picks up a useless frequency. If you want to change the `Scan Resume Method` you can go through the following steps:

1. Press `MENU` button
2. Press `18` and that will take you to the `SC-REV` setting
3. Press `MENU` again to start updating the `SC-REV` setting
4. Press up/down arrow keys to get to `TO` 
5. Press `MENU` to confirm the setting

All valid `SC-REV` setting values are:

1. (TO)=Preset Time, starts automatically 
2. (CO)=Carrier present auto startup 
3. (SE)=Stops on carrier, manual restart. 

## Conclusion

In this tutorial, I showed you how to find out the frequency used by PD/FD in your local area and how to input those in a BaoFeng UV-5X3. Keep in mind that some Police and Fire departments have/are moving to encrypted (trunked) digital radio. As far as I am aware you can not use this Baofeng radio to pick up on the chatter on trunked frequencies. For that, you will have to either buy a police radio scanner or use an SDR. I might write an article on how to use an SDR in the future. 

As I mentioned, I recently cleared my Amateur Technician license exam so I am still learning. I am currently preparing for my General class exam so that I can make use of certain High Frequncy bands and contact people at a much longer distance without a repeater. You can expect to see a lot more radio related articles in the future. It is a fun hobby and I am not sure why there aren't more young people interested in it.

I hope you enjoyed this article. I will see you in the next one. Take care and stay safe! :wave: :heart: 