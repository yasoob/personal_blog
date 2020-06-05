---
title: Making a song downloader with python
author: yasoob
type: post
date: 2013-08-13T17:50:38+00:00
url: /2013/08/13/making-a-song-downloader-with-python/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - downloader
  - script
  - searcher
  - song
  - tutorial

---

**Edit:** This post is about ex.fm which is not functioning anymore. ex.fm has closed their operations :crying_face:

Hi there folks. Some time ago i was very much interested in how music downloaders for various websites worked. In order to learn this i went forward to make my own downloader for ex.fm. Currently ex.fm does not allow users to download songs so this was a very good chance for me to learn song downloading with python. 

During this process i also came forward to youtube-dl. It is a python script which allows anyone to download music and videos from numerous websites. Now let me tell you how i went forward to make this downloader. 

First of all I opened ex.fm in chrome and also started chrome web inspector to intercept network calls. Then i clicked on a song for it to play. When the song started to play i saw the XHR requests made by ex.fm. There i saw a request being made to `ex.fm/api`. 

This was interesting because most websites use apis to provide info for specific songs. I opened the link and saw that the link returned json data with direct link to the song. That way i came to know the url used by ex.fm to get the direct link to the song. 

After that I wanted to know how to automate song searching from python. For this i again opened ex.fm and chrome web inspector. This time instead of playing a song i clicked on search and searched for a song. Again a url got my attention. 

```
http://ex.fm/api/v3/song/search/{search term}?start=0&results=20
```

This url also returned json response. After i became aware of these two urls i started to write a python script to automate this. I used only three libraries and all three of them come preinstalled with python (batteries included). These three libraries were:

```
urllib2 
json
sys
```

I won't be explaining the code here instead i will give you the code itself. If you have any questions about the code feel free to comment below. Lastly let me make it clear that this script can be written in better ways but i just made it for learning purposes. 

[Here is the link][1] to the github repository.

 [1]: https://github.com/yasoob/ex.fm-dl