---
title: "Connecting Raspberry Pi to Eduroam Wifi"
date: 2019-04-14T17:34:40-04:00
draft: false
categories: ["sysadmin"]
---

Hi people! I was working with Raspberry Pi lately and was trying to connect it to eduroam. If you are not familiar with eduroam, it is a service used by most universities to provide Wifi on their campuses. It uses Enterprise WPA and Raspberry Pi does not connect to it automatically out of the box.

I actually found these instructions on a different website but that website is down now. I am putting these instructions here for all of you who might be stuck in the same situation.

Raspberry Pi uses `wpa-supplicant` to connect to the wifi. `wpa-supplicant` has a `wpa_supplicant.conf`configuration file where you can manually add information about an access point which you want your Pi to connect to. We will update this `wpa_supplicant.conf` file to add information about eduroam so that whenever our Pi gets signals from eduroam, it automatically connects to it.

Step 1:
--------

Let's edit the `wpa_supplicant.conf` file. Open up the terminal on your Raspberry Pi and type the following command (without the `$`):

```
$ sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

This will open up nano (text editor) to allow you to edit the file. Now paste in the following text in the file:

```
network={
        ssid="eduroam"
        scan_ssid=1
        key_mgmt=WPA-EAP
        eap=PEAP
        identity="yourDetails@yourSchool.edu"
        password="yourpassword"
        phase1="peaplabel=0"
        phase2="auth=MSCHAPV2"
}
```

Change the `identity` and `password` to your username and password which you normally use to connect to eduroam on your laptop/phone. 

Now save the file and close nano. You can do that by pressing `Ctrl+x` and then pressing `Y`.

Step 2:
--------

Now we need to tell our Pi to reload the configuration file. To do that type the following command in your terminal on the Pi:

```
$ sudo wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
```

Your Pi will either connect to eduroam at this point or it might need a reboot to make things work. If it doesn't connect, reboot your Pi and it should automatically connect to eduroam on next run.

I hope this guide was useful for you all. Best of luck! And if you have any questions/comments/concerns please email me! My email is in the footer of this page :smile:. 






