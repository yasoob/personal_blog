---
title: Reverse engineering myspace
author: yasoob
type: post
date: 2013-11-22T20:44:01+00:00
url: /2013/11/23/reverse-engineering-myspace/
publicize_facebook_url:
  - https://facebook.com/509724922449953_572616766160768
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/cPnZUOf0oC
categories:
  - python
tags:
  - mp3 downloader
  - music downloader
  - myspace downloader
  - myspace.com
  - reverse engineer
  - tutorial

---
Hi guys! In todays post we will be looking into myspace.com and check whether it is possible to download songs with python or not. If it is possible then we will make a python script which will assist us in downloading the songs.

## Tools

  1. python - I am using py2k
  2. browser - I am using chrome
  3. rtmpdump & rtmpsrv
  4. internet connection

So lets start. Lets go to myspace: 

![Go to myspace](/wp-content/uploads/2013/11/screenshot-from-2013-11-22-190528.png)

We don't need this page. Lets go to a song page for instance I am going to open [this page][1]. Now lets check out the source of the page to see whether we can find any mp3 link. What I usually do is that I right click on the name of the song and click on "Inspect this". Usually the name is in the song link on most websites. So just do this and see if you get anything. Here is what I got: 

![Dev tools myspace](/wp-content/uploads/2013/11/screenshot-from-2013-11-22-215408.png)

Can you see that data stream url? Oh yes the one which I have highlighted. That is an rtmp url. RTMP is a streaming protocol. Now the problem is that we can not directly download the rtmp links so what should we do now? We are very lucky because there is already a software which can help us in downloading this and it is called `rtmpdump`.

However rtmpdump requires some additional parameters for downloading the song. They are the play path, stream url, file name and etc. So how do we get those? So again we are very lucky because there is a software for this as well and it is developed by the same people who have developed rtmpdump. This one is called `rtmpsrv`

Just search for it on google and download it. This is like a proxy. It scans all of your data and searches for rtmp streams. When it has found a stream it just outputs a single command which can be used to download a file with rtmpdump. However first we have to route all the tcp traffic to port 1935. Thats the port where rtmpsrv runs. In order to do so just type this in the terminal:

```
sudo iptables -t nat -A OUTPUT -p tcp --dport 1935 -j REDIRECT
```

This will add a firewall rule. Now go to myspace and play a song. After you hit play and wait for some seconds then you will see that a couple of lines are outputted by rtmpsrv. Check this out:   

![rtmpsrv output](/wp-content/uploads/2013/11/screenshot-from-2013-11-22-223634.png)

Now if you copy this command and paste it in the terminal you will see that rtmpdump will start to download the file. Now close rtmpsrv and revert the firewall rule by using this command:

```
sudo iptables -t nat -D OUTPUT -p tcp --dport 1935 -j REDIRECT
```

Now comes the main part. It is not convenient to go through all of these steps again and again just to download a single song. Now we need to automate this and for that we will use python. After doing a little bit of tinkering I saw that only the `-y` and `-p` parameters are changed for every song. 

Further down the lane we can see that the `-p` parameter is just the url of the song page and the `-y` parameter is taken from the rtmp link which we found on the song page.

## Writing Python script

So lets first make a script which will get the rtmp link from the page. Here is my solution:

```
import requests as r
import re
html = r.get(song_page_url)
rtmp_link = re.findall('data-stream-url="(.+?)"',
            html.text)[0] 
print rtmp_link
```

So now we have a script which gets the rtmp link. Now we need to modify this script so that it outputs the required rtmpdump command. Again here is my solution:

```
import requests as r
import re
html = r.get(song_page_url)
rtmp_link = re.findall('data-stream-url="(.+?)"',
            html.text)[0] 
y = rtmp_link.split(';')[1]
name = ' '.join(song_page_url.split('/')[-1].split('-')[:-2])
rtmp_command = 'rtmpdump -r "rtmpte://fms.ec-music.myspacecdn.com/" \
-a "" -f "LNX 11,9,900,152" -o "{}.flv" \
-W "http://lads.myspacecdn.com/music/sdkwrapper/SDKWrapper.2.2.16.swf" \
-p "http://www.myspace.com" -y "{}"'.format(name,y)
```

So now we just need to open rtmpdump with the parameters. For that I will be using the subprocess module. Here is the final code:

    import re
    import sys
    import requests
    import subprocess
    
    song_page_url = sys.argv[1]
    html = requests.get(song_page_url).text
    match = re.search('data-stream-url="(rtmpe://[^;]+);([^"]+)"', html)
    rtmpurl, playpath = match.group(1, 2)
    filename = ' '.join(song_page_url.split('/')[-1].split('-')[:-2]) + '.flv'
    
    print 'downloading', filename
    subprocess.call(['rtmpdump', '-o', filename, '-r', rtmpurl, '-y', playpath],
                        stderr=subprocess.DEVNULL)
    

Just run this file like this:

```
$ python myspace.py https://myspace.com/brunomars/music/song/somewhere-in-brooklyn-69059954-74825216
```

Thats it! We now have a simple script that will download myspace songs for us. I know you are thinking about more features in this script. Let me give you some ideas. This script downloads just songs and does not have any input validation in place. Maybe you can make a similar script for videos? When you make something do let me know. 

I will see you later and don't forget to follow this blog, [like it on facebook][4], [follow me on twitter][5] and reply below 🙂 This is the best way to repay me. Lastly stay tuned for the next post.

 [1]: https://myspace.com/brunomars/music/song/somewhere-in-brooklyn-69059954-74825216
 [2]: http://wp.docker.localhost:8000/wp-content/uploads/2013/11/screenshot-from-2013-11-22-215408.png
 [3]: http://wp.docker.localhost:8000/wp-content/uploads/2013/11/screenshot-from-2013-11-22-223634.png
 [4]: https://www.facebook.com/freepythontips
 [5]: http://www.twitter.com/yasoobkhalid