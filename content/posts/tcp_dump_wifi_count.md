---
title: "Headless counting of WiFi devices using tcpdump"
date: 2019-04-10T00:21:55-04:00
draft: true
---

Hi lovely people! I was recently working on a research project for my Computer Networks class at Colgate University. The idea was to calculate the number of devices using wifi at different places on campus and concurrently measure the bandwidth available at those spots. This would help uncover areas where network coverage is poor and addition of more routers would be beneficial. In this article I will focus on the headless wifi devices counting part.

I knew that devices which use wifi emit probe requests at different intervals which I can intercept and get an idea of how many devices are near me. These probe requests also contain the MAC addresses of the devices which emit them. However, lately a lot of devices have started randomizing their MAC address in these requests. 