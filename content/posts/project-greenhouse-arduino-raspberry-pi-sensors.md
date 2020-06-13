---
title: "Project Greenhouse Using Arduino, Raspberry Pi & Sensors"
date: 2019-09-17T01:01:01+02:00
draft: false
categories: ["arduino", "electronics"]
teaser: 'Take a look at the final project I made using Arduino, Raspberry Pi & a couple of sensors for a digital studio class. I have also written some in-process articles about this project in the past.'
---

Hi lovely people! :wave: A couple of months ago I wrote a couple of articles on how to connect different sensors and an LCD to an Arduino. However, I didn't write one final article about how these things all fit together to form a greenhouse monitoring system. I don't think I will be able to get to it anytime soon (lack of time for a detailed tutorial). Therefore, I decided to just write about what the final project was and what it did and most importantly, where the inspiration for it came from.

Before we dive into the explanation, here are some images of the final product.

![Final Case](/images/arduino-greenhouse/case.jpg)

![Case with Sensor](/images/arduino-greenhouse/case_with_sensor.jpg)

![Back side of the case](/images/arduino-greenhouse/back-side.jpg)

![Internal circuit](/images/arduino-greenhouse/internal.jpg)

It was the final project for my digital studio class at Colgate. The prompt was pretty open-ended and gave us multiple options to exercise our creativity. I decided to make use of electronics to make some sort of art because I was always interested in learning more about Arduino. Moreover, I had spent my free time in the last couple of months exploring the platform.

The idea behind the project was that just like no two humans are same, no two plants are the same either. But is there a way to show this difference somehow? I then realized that each plant requires a different level of sunlight, temperature and soil moisture to grow properly. A certain combination of these three variables might be good for one plant but not for a different one (i.e one plant might require more sunlight than the other). To visualize these three variables I decided to show them as a gradient made of RGB values. Each sensor (light, temperature, soil moisture) data was fed to the R, G and B input of the gradient. 

When the soil moisture sensor was placed in a plant which requires less water, the gradient was different from when it was placed in a plant which requires more water.

These sensors were connected to an Arduino which itself was connected to a Raspberry Pi. The Raspberry Pi was configured to automatically connect to local wifi on boot and stream RGB values to a publically accessible web app. The Arduino, sensors and Raspberry Pi were housed in a custom laser-cut and laser-engraved case.

I had an amazing time learning about Arduino through this project. The feeling of actually shipping a product is unlike any other. I am pretty sure I will be working more with the Arduino in the future. Here is a video showing the product in action:

<div style="width:100%;height:480px;background-color:black;text-align:center;">
  <video style="height:100%;" controls>
    <source src="https://lh3.googleusercontent.com/-Pw0J04e6swHvT_ZAdJMmUOpt6UTeEro27_hmYJGZ12MT_lE21nSMdSLZtCKbACrBkl42hzl74Zazc9lhL6uh-HmWlwA8h_59RnHrnrwDQh4jN9kBWPoKjmlRXEDSBVy7ZtgtWlUew=m37" type="video/mp4">
  </video>
</div>

<br>

In the video, you can see the gradient transitioning from one color to another. The screen looks kinda wonky because it was a cheap display. 

Like always, I am looking forward to your comments, suggestions, and feedback. Let me know what you think about this project in the comments below. See you in the next post! :heart:
