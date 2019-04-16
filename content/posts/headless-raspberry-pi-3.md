---
title: "Interfacing with Raspberry Pi 3 over UART using CP210x"
date: 2019-04-16T12:04:57-04:00
draft: false
categories: ["electronics"]
---

Hi people! If you read the last article you might be aware that I am exploring raspberry pi right now. I have Pi 3B+ and I am using it to work on some remote sensors. The biggest issue I have with the Pi is that I don't have an external monitor, mouse, and keyboard handy to use with the Pi. 

As I am exploring electronics and sensors, I happen to have access to a low-cost CP2102 USB 2.0 to TTL UART converter. 

![CP2102](/images/raspberry/cp210x_large.png)

I decided to interface with my RPi over TTL UART. Most of the tutorials online use ftdi so if you use CP2102 this is one of the few tutorials which focus on it. 


**Step 1: Flashing fresh Rasbpian**

Flash a fresh Raspbian image on a micro-sd card using [Etcher](https://www.balena.io/etcher/).

![Etcher](/images/raspberry/etcher.png)

**Step 2: Updating Config**

Edit `config.txt` file in the `boot` partition on the sd card. Add the following line at the end of the file:

```
enable_uart=1
```

**Step 3: Connecting CP2102**

Wire up the Raspberry Pi and CP2102 together based on the diagram below. 

![](/images/raspberry/raspi_cp2102.png)

Plug in the CP2102 with your laptop.

**Step 4: Using Screen to interface with Pi**

Figure out which interface you need to connect to for interfacing with the mini-UART. You can figure that out by typing this in the terminal on a mac:

```
$ ls /dev/tty.*
```

You need to look for something along the lines of `/dev/tty.SLAB_USBtoUART`. After figuring that out you can use `screen` to interface with the raspberry pi.

```
$ screen /dev/tty.SLAB_USBtoUART 115200
```

The number at the end (baud rate) is important because both devices need to be sending and receiving data at the same rate for this work. Raspberry Pi sends and receives data at 115200 bps. 

After opening up screen the raspberry pi will ask you for user and pass. The default user/pass is pi/raspberry. 

<hr>

- [SparkFun tutorial for using FTDI Basic](https://learn.sparkfun.com/tutorials/headless-raspberry-pi-setup/all)
- [CP2102 Image ref](https://eecs.oregonstate.edu/education/hardware/cp210x/)
- [Fritzing circuit file](/images/raspberry/CP2102-circuit.fzz)