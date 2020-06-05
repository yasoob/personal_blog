---
title: 'Sending & Sniffing WLAN Beacon Frames using Scapy'
author: yasoob
type: post
date: 2018-09-08T16:48:21+00:00
url: /2018/09/08/sending-sniffing-wlan-beacon-frames-using-scapy/
timeline_notification:
  - 1536425306
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - networking
  - packet
  - packet sniffer
  - scapy
  - scapy intercept
  - scapy sniffer

---
Hi everyone! Over the summers I did research on Wi-Fi and part of my research involved sending and receiving different kinds of IEEE 802.11 packets. I did most of this stuff using [Scapy][1] so I thought why not create a tutorial about it? When I started my research I had to look through multiple online articles/tutorials in order to get started with Scapy. In order to save you time I am going to bring you up-to speed by running you through a short tutorial.<!--more-->

**Goal:** Our end goal is to create two scripts. The first script will send WLAN beacon frames and the second script will intercept those beacon frames. Both of these scripts will be running on two different systems. We want to be able to send beacon frames from one system and intercept them from the second one.

For those of you who don't know what a beacon frame is ([Wikipedia][2]):

> **Beacon frame** is one of the management frames in [IEEE 802.11][3] based WLANs. It contains all the information about the network. Beacon frames are transmitted periodically, they serve to announce the presence of a wireless LAN and to synchronise the members of the service set. Beacon frames are transmitted by the [access point][4](AP) in an infrastructure [basic service set][5] (BSS). In IBSS network beacon generation is distributed among the stations.

## Sending Beacon frames:

```
from __future__ import print_function
from scapy.all import ( Dot11,
                        Dot11Beacon,
                        Dot11Elt,
                        RadioTap,
                        sendp,
                        hexdump)

SSID = 'Test SSID' 
iface = 'wlp2s0'   
sender = 'ac:cb:12:ad:58:27'

dot11 = Dot11(type=0, subtype=8, addr1='ff:ff:ff:ff:ff:ff',
addr2=sender, addr3=sender)
beacon = Dot11Beacon()
essid = Dot11Elt(ID='SSID',info=SSID, len=len(SSID))

frame = RadioTap()/dot11/beacon/essid

sendp(frame, iface=iface, inter=0.100, loop=1)
```

First of all we import all of the required modules and then define some variables. Modify the sender address to the MAC address of your WiFi card and change the iface to your wireless interface name (common variants are `wlan0` and `mon0`). 

Scapy works with "layers" so we then define the Dot11 layer with some parameters. The type parameter = 0 simply means that this is a management frame and the subtype = 8 means that this is a beacon frame. Addr1 is the receiver address. In our case this is going to be a broadcast (`ff:ff:ff:ff:ff:ff` is the broadcast MAC address) because we aren't sending the beacon to a specific device. Then we create a Dot11Beacon layer. 

Most of the time we don't need to pass any parameters to a layer because Scapy has sane defaults which work most of the time. After that we create a Dot11Elt layer which takes the SSID of the fake access point as an input along with some other SSID related inputs. SSID is the name of the network which you see while scanning for WiFi on other devices. Lastly we stack the layers in order and add a RadioTap layer at the bottom. Now that the layers are all set-up we just need to send the frame and the sendp function does exactly that.

## Sniffing Beacon Frames

The sniffing part is pretty similar to the sending part. The code is as follows:

```
#!/usr/bin/env python

from scapy.all import Dot11, sniff
                       

ap_list = []

def PacketHandler(packet):
    if packet.haslayer(Dot11):
        if packet.type == 0 and packet.subtype == 8:
            if packet.addr2 not in ap_list:
                ap_list.append(packet.addr2)
                print("Access Point MAC: %s with SSID: %s " %(packet.addr2, packet.info))


sniff(iface="wlp2s0", prn = PacketHandler)
```

Firstly, we import the Dot11 layer and the sniff function. We create a packet filter function which takes a packet as an input. Then it checks whether the packet has a Dot11 layer or not. Then it checks if it is a beacon or not (type & subtype). Lastly, it adds it to the ap_list list and prints out the MAC address and the SSID on screen.

I hope you all found this short walk-through helpful. I love how powerful Scapy is. We have only scratched the surface in this post. You can do all sorts of packet manipulation stuff in Scapy. The [official docs][6] are really good and the [WLAN BY GERMAN ENGINEERING][7] blog is also super helpful.

See you next time!

 [1]: https://github.com/secdev/scapy
 [2]: https://en.wikipedia.org/wiki/Beacon_frame
 [3]: https://en.wikipedia.org/wiki/IEEE_802.11 "IEEE 802.11"
 [4]: https://en.wikipedia.org/wiki/Wireless_access_point "Wireless access point"
 [5]: https://en.wikipedia.org/wiki/Service_set_(802.11_network) "Service set (802.11 network)"
 [6]: https://scapy.readthedocs.io/en/latest/
 [7]: https://wlan1nde.wordpress.com/