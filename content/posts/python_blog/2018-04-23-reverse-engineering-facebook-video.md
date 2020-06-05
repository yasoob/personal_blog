---
title: 'Reverse Engineering Facebook: Public Video Downloader'
author: yasoob
type: post
date: 2018-04-23T13:47:07+00:00
url: /2018/04/23/reverse-engineering-facebook-video/
timeline_notification:
  - 1524491237
publicize_twitter_user:
  - yasoobkhalid
publicize_linkedin_url:
  - 'https://www.linkedin.com/updates?discuss=&scope=327033389&stype=M&topic=6394179718735757313&type=U&a=18ni'
categories:
  - python
tags:
  - download facebook videos
  - facebook
  - facebook api
  - facebook bot
  - facebook video downloader

---
[In the last post][1] we took a look at downloading songs from [Soundcloud][2]. In this post we will take a look at Facebook and how we can create a downloader for Facebook videos. It all started with me wanting to download a video from Facebook which I had the copyrights to. I wanted to automate the process so that I could download multiple videos with just one command. <!--more-->Now there are tools like 

[youtube-dl][3] which can do this job for you but I wanted to explore Facebook&#8217;s API myself. Without any further ado let me show you step by step how I approached this project. In this post we will cover downloading public videos. In the next post I will take a look at downloading private videos.

## Step 1: Finding a Video {#step-1-finding-a-video}

Find a video which you own and have copyrights to. Now there are two types of videos on Facebook. The main type is the public videos which can be accessed by anyone and then there are private videos which are accessible only by a certain subset of people on Facebook. Just to keep things easy, I initially decided to use a public video with plans on expanding the system for private videos afterwards.

## Step 2: Recon {#step-2-recon}

In this step we will open up the video in a new tab where we aren&#8217;t logged in just to see whether we can access these public videos without being logged in or not. I tried doing it for the video in question and this is what I got:
  
![Image](/wp-content/uploads/2018/04/rnz0ack.png)

Apparently we can&#8217;t access the globally shared video as well without logging in. However, I remembered that I recently saw a video without being logged in and that piqued my interest. I decided to explore the original video a bit more.

I right-clicked on the original video just to check it&#8217;s source and to figure out whether the video url was reconstructable using the original page url. Instead of finding the video source, I found a different url which can be used to share this video. Take a look at these pictures to get a better understanding of what I am talking about:

![][4]

![][5]

I tried opening this url in a new window without being logged in and boom! The video opened! Now I am not sure whether it worked just by sheer luck or it really is a valid way to view a video without being logged in. I tried this on multiple videos and it worked each and every single time. Either Way, we have got a way to access the video without logging in and now it&#8217;s time to intercept the requests which Facebook makes when we try to play the video.

Open up Chrome developer tools and click on the XHR button just like this:![][6]

XHR stands for XMLHttpRequest and is used by the websites to request additional data using Javascript once the webpage has been loaded. Mozilla docs has a good explanation of it:

> Use `XMLHttpRequest` (XHR) objects to interact with servers. You can retrieve data from a URL without having to do a full page refresh. This enables a Web page to update just part of a page without disrupting what the user is doing. `XMLHttpRequest` is used heavily in [Ajax][7] programming.

Filtering requests using XHR allows us to cut down the number of requests we would have to look through. It might not work always so if you don&#8217;t see anything interesting after filtering out requests using XHR, take a look at the &#8220;all&#8221; tab.

The XHR tab was interesting, it did not contain any API request. Instead the very first requested link was the mp4 video itself.![][8]

This was surprizing because usually companies like Facebook like to have an intermediate server so that they don&#8217;t have to hardcore the mp4 links in the webpage. However, if it is easy for me this way then who am I to complain?

My very next step was to search for this url in the original source of the page and luckily I found it:![][9]

This confirmed my suspicions. Facebook hardcores the video url in the original page if you view the page without signing in. We will late see how this is different when you are signed in. The url in current case is found in a `<script>` tag.

## Step 3: Automating it

Now let&#8217;s write a Python script to download public videos. The script is pretty simple. Here is the code:

```
import requests as r
import re
import sys

url = sys.argv[-1]
html = r.get(url)
video_url = re.search('hd_src:"(.+?)"', html.text).group(1)
print(video_url)
```

Save the above code in a _video_download.py_ file and use it like this:

```
$ python video_download.py video_url
```

Don&#8217;t forget to replace video_url with actual video url of this form:

```
https://www.facebook.com/username/videos/10213942282701232/
```

The script gets the video url from the command line. It then opens up the video page using requests and then uses regular expressions to parse the video url from the page. This might not work if the video isn&#8217;t available in HD. I leave that up to you to figure out how to handle that case.

That is all for today. I will cover the downloading of your private videos in the next post. That is a bit more involved and requires you logging into Facebook. Follow the blog and stay tuned! If you have any questions/comments/suggestions please use the comment form or email me.

Have a great day!

 [1]: https://pythontips.com/2018/04/15/reverse-engineering-soundcloud-api/
 [2]: https://soundcloud.com
 [3]: http://github.com/rg3/youtube-dl
 [4]: https://imgur.com/b6WFhwf.jpg
 [5]: https://imgur.com/TZEah3l.png
 [6]: https://imgur.com/UDc4LqA.jpg
 [7]: https://developer.mozilla.org/en-US/docs/AJAX
 [8]: https://imgur.com/fy5ksHu.jpg
 [9]: https://imgur.com/sXsSfsU.jpg