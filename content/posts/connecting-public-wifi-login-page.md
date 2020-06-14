---
title: "Help! My browser isn't connecting to public WiFi!"
date: 2020-06-14T00:01:05-04:00
draft: false
categories: ['random-tip']
featured_image: '/images/firefox-hotspot.png'
teaser: "Have you ever found yourself unable to connect to a public WiFi just because your browser couldn't open the login page? Learn a simple trick which always works."
---

Have you ever been to a coffee shop and tried connecting to the public WiFi only to find out that your browser isn't automatically opening up the router login page? These situations suck and happen far too often with all of us. I recently got a new Linux based machine and Firefox wasn't successfully detecting the hotspot access page. 

It was telling me that there was an SSL error but even non-https websites were not getting redirected to the router login page.

## Methods I tried

I then tried an old and tested method of opening up [nonhttps.com]() but that too failed. Firefox just did not want me to use the internet that day (or maybe it was PopOS?). Next, I tried different variations of typical router management IP addresses: `192.168.1.1`, `127.1.1.1` & `localhost` but these too were failing. I hopped on the internet and found out another solution.

## Solution

The solution was fairly easy. Open up your terminal and type `route`:

```
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         _gateway        0.0.0.0         UG    600    0        0 wlp0s20f3
35.22.0.0       0.0.0.0         255.255.128.0   U     600    0        0 wlp0s20f3
```

This command provides you details about the IP routing table in your system. This told me that the access point's gateway is accessible at `_gateway`. I opened it in Firefox and lo and behold the login page opened. Then I just had to click `Accept` (for privacy policy) and I was connected to the internet highway. 

So if you ever find yourself in a similar situation just use the `route` command to find the access page. 