---
title: Reverse Engineering Soundcloud API
author: yasoob
type: post
date: 2018-04-15T06:19:49+00:00
url: /2018/04/15/reverse-engineering-soundcloud-api/
enclosure:
  - |
    |
        https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
        10
        audio/mpeg
        
  - |
    |
        https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
        10
        audio/mpeg
        
  - |
    |
        https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
        10
        audio/mpeg
        
  - |
    |
        https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
        10
        audio/mpeg
        
  - |
    |
        https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
        10
        audio/mpeg
        
timeline_notification:
  - 1523773198
publicize_twitter_user:
  - yasoobkhalid
publicize_linkedin_url:
  - 'https://www.linkedin.com/updates?discuss=&scope=327033389&stype=M&topic=6391168044940427264&type=U&a=8bbb'
categories:
  - python
tags:
  - mp3
  - mp3 downloader
  - music
  - soundcloud
  - soundcloud downloader

---
Hi guys, in this post we will learn how to bypass downloading restrictions on Soundcloud. We will create a Python script which will allow us to download even those songs which are not enabled for downloading. We will work on this project in a step by step basis where we will tackle each problem as we encounter it. I will try to make it as universal in nature as possible so that you can follow this project even if Soundcloud has changed its website layout or the way it serves media files. So without any further ado let&#8217;s get started:

**Note:** I don&#8217;t endorse illicit downloading of someone else&#8217;s content. This is merely an educational guide and should be used to download your own content only.

## 1. Reverse Engineering the MP3 URL Generation Logic {#1-reverse-engineering-the-mp3-url-generation-logic}

Let&#8217;s start by opening up Chrome. Soundcloud doesn&#8217;t provide us with the `.mp3` url on the media page so we need to figure out how and from where Soundcloud gets the `.mp3` url. Open up Soundcloud and open this [publically accessible music file][1] which we will be using for testing purposes.

Now we need to open the Chrome developer tools. The network tab in the chrome developer tools will allow us to see all of the requests which the browser makes when we open Soundcloud. After opening up the developer tools and navigating to the network tab you should end up with something similar to this:

![][2]

Now refresh the page with the developer tools open. You should start seeing the requests pane getting populated by tons of different links. Don&#8217;t feel intimidated, we will make sense of all of this in just a bit. You can see that there are already 100+ requests being made by Soundcloud. We need to find a way to filter the requests so that they become manageable for us to sift through.

While looking at the requests in general I saw that Soundcloud is making multiple requests to an `api.soundcloud.com` endpoint. If you ever see any requests being made to an `api` endpoint always explore these first. Here is what you will end up with after filtering those requests which have `api` in their url:

![][3]

Now after filtering the requests I saw that there was a `stream` url. That caught my attention because most of the time `stream` urls do exactly what they stand for. They stream the media content. So I clicked on the stream link and saw what response we were getting from Soundcloud on that endpoint:

![][4]

And lo-and-behold. That endpoint returns a couple of media links. Now the one we are interested in is the `http_mp3_128_url` because they are usually the most straightforward to download.

There seems to be a problem. Whenever we try opening the `http_mp3_128_url` url in a new tab we are greeted with the `403 Forbidden` error. There is definitely something fishy going on because if I scroll down in the developer tools I can see that Soundcloud is successfully accessing that url without any `Forbidden` error. Now most of the times what happens is that the server checks the headers and cookies of the browser to verify that an authorized person is accessing the endpoint. However, I am not logged in so there might be something else going on.

After refreshing the page a couple of times I observed that `http_mp3_128_url` url changed after every refresh. That must mean that the urls are for one time use only and are programmatically generated on every access. And after the browser plays the media file for the first time, the urls expire and that is the reason we were getting a Forbidden error. To verify my observation I opened the `stream` url in a new tab and then tried accessing the `http_mp3_128_url` url myself, before the Soundcloud player.

All of a sudden we are able to access the media file without the `Forbidden` error!

Now we need to deconstruct the `stream` url as well so that we can generate it ourselves. The `stream` url in my case is this:

    https://api.soundcloud.com/i1/tracks/391350885/streams?client_id=6pDzV3ImgWPohE7UmVQOCCepAaKOgrVL
    

Everything seems pretty generic. The `cliend_id` is definitely the SoundCloud API key because I am not logged in. The interesting part of the url is `391350885` which is not a part of the original media url. Where did this number come from?

I filtered the network requests with this number and couldn&#8217;t find it&#8217;s source. The very next thing which I did was to search the HTML source of the page and bam! The track number was embedded in that!

![][5]

Now that we know how Soundcloud generates the `.mp3` url, it is the perfect time to write a script to automate this. The script should take in a Soundcloud url and should return an mp3 url. So let&#8217;s get started.

## 2. Creating a Python Script for Automating the URL generation {#2-creating-a-python-script-for-automating-the-url-generation}

Start up by creating an `app.py` file in your directory. This will hold all of the required code.

    $ touch app.py
    

Now import the required libraries. We will be using `requests` for making the HTTP requests, `sys` for taking command-line inputs and `re` for extracting the text from the HTML page. A lot of people object to the usage of re for extracting text from HTML but in this case where we know that we are only extracting a small piece of text from the page it is fine.

    import requests
    import re
    import sys
    

Lets write down the preliminary code for taking in a Soundcloud URL from the command line and opening up the Soundcloud page using `requests`.

    import sys
    import requests
    import re
    
    url = sys.argv[-1]
    html = requests.get(url)
    

We are not using [argparse][6] because we will soon be converting this script into an online API. Now we need to find a way to extract the track id from the page. Here is a simple regex which works:

    track_id = re.search(r'soundcloud://sounds:(.+?)"', html.text)
    

Now we need to open up the `api` url and get the actual `mp3` stream link. To do that add the following code to your python file:

    final_page = requests.get("https://api.soundcloud.com/i1/tracks/{0}/streams?client_id=6pDzV3ImgWPohE7UmVQOCCepAaKOgrVL".format(track_id.group(1)))
    print(final_page.json()['http_mp3_128_url'])
    

And there you go. You have the complete script which will give you the mp3 link from a Soundcloud media url. Here is the complete code:

    import sys
    import requests
    import re
    import json
    
    url = sys.argv[-1]
    html = requests.get(url)
    
    track_id = re.search(r'soundcloud://sounds:(.+?)"', html.text)
    final_page = requests.get("https://api.soundcloud.com/i1/tracks/{0}/streams?client_id=6pDzV3ImgWPohE7UmVQOCCepAaKOgrVL".format(track_id.group(1)))
    print(final_page.json()['http_mp3_128_url'])
    

Go on, save this in a file and run it. But the problem is that this isn&#8217;t terribly useful. How about we turn this into a web app which anyone can use? Now **that** would be a lot more useful.

## 3. Turning this into a web app {#3-turning-this-into-a-web-app}

We will be using Flask to convert this into a web app. The [Flask website][7] provides us with some very basic code which we can use as our starting point.

    from flask import Flask
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    

Save the above code in a `app.py` file. Run the following command in the terminal:

    $ Flask_APP=app.py flask run
    

This will tell the `flask` command line program about where to find our flask code which it needs to serve. If everything is working fine, you should see the following output:

     * Running on http://localhost:5000/
    

Now we need to implement a custom URL endpoint which will take the Soundcloud media URL as the input and will redirect user to the MP3 file URL. Let&#8217;s name our custom endpoint `/generate_link` and make it accept query parameters.

    @app.route("/generate_link")
    def generate_link():
        media_url = request.args.get('url','')
        return media_url
    

Our custom end-point doesn&#8217;t really do anything. It simply echoes back whatever you pass it through the `url` query parameter. The reason for not implementing the rest of the functionality is that we haven&#8217;t actually converted our previous script into a module. Let&#8217;s do that real quick first:

    import sys
    import requests
    import re
    import json
    
    def get_link(url):
        html = requests.get(url)
        track_id = re.search(r'soundcloud://sounds:(.+?)"', html.text)
        final_page = requests.get("https://api.soundcloud.com/i1/tracks/{0}/streams?client_id=6pDzV3ImgWPohE7UmVQOCCepAaKOgrVL".format(track_id.group(1)))
        return final_page.json()['http_mp3_128_url']
    

I am assuming that this module is saved into the same directory as your flask app. Here is my current directory structure:

    $ ls
    app.py soundcloudDownload.py
    

The `soundcloudDownload.py` contains the script (now converted to a module) and the `app.py` contains the flask app. Now let&#8217;s import `soundcloudDownload.py` into our `app.py` file and implement the functionality to make the web app a bit more useful:

    from soundcloudDownload import get_link
    from flask import Flask, request
    
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    
    @app.route("/generate_link")
    def generate_link():
        media_url = request.args.get('url','')
        return get_link(media_url)
    

Now restart your flask app in your terminal and try accessing the following url:

    http://localhost:5000/generate_link?url=https://soundcloud.com/m-yasoob-khalid/shutdown
    

If everything works fine you should get something similar to this in the response in your browser:

    https://cf-media.sndcdn.com/og4Ho8QAsLWj.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGl
    hLnNuZGNkbi5jb20vb2c0SG84UUFzTFdqLjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOj
    E1MTczNTA3NDV9fX1dfQ__&Signature=XQAyN~Atl8OGeqwmxKa7Zx7S50YX229mdIq-XiU753cGKEmWac8FGK~GdSylj0Uo2sqBnJxzDA
    fC3Ahv1MbY~LPGQ8A-q36-vwF6Z5v88-BvflDMmYuXnj0gqWvolR1GMq6SsgMPRGCfNu4D8cS0NckRCif8dGCEQxQVQ2laSCC4e4lpkuqtS
    gJOJ6L26N8zrma~2lCJc7TxqCp3~aROuejC-4JVm7P6f4vtB38-l7vT-nWjrsHNC33YLI~Kex6ciOeRGGmFU-eyUDSpooIzrfj6wiR-1A66
    MLWFkuUoKboSRfy9Zz6zFSqgPTXZKePHKoKuMzDjEAV42j5Gbm8dgQ__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ
    

Still the user needs to copy the url and open it in a new tab. Let&#8217;s improve the situation by implementing automatic redirection to the MP3 page:

    from soundcloudDownload import get_link
    from flask import Flask, re
    
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    
    @app.route("/generate_link")
    def generate_link():
        media_url = request.args.get('url','')
        return redirect(get_link(media_url), code=302)
    

Now when you try opening the same `generate_link` url in your browser you should be redirected to an mp3 file. Great! Everything is working perfectly fine and as promised you have reverse engineered the soundcloud web app and figured out a way to download mp3 files.

## 4. Further Steps {#4-further-steps}

Now we can go ahead and implement a usable web interface to this web api but I will leave that as an exercise for the reader. Search online on how you can use Jinja templates with flask and then make a front-end for this. You can also create a browser extension which injects a download button to all of the soundcloud media pages. That way the user won&#8217;t even have to copy the url. They can simply click the download button and the download will start. The end-goal is to remove as many steps as possible and streamline the process. A simple rule of thumb is that the less the number of steps required to achieve a task, the more usable a service/app is.

I might turn this into a web app with search functionality and an MP3 player. In order to stay tuned please follow my blog.

 [1]: https://soundcloud.com/m-yasoob-khalid/shutdown
 [2]: https://imgur.com/Oi7KWK2.jpg
 [3]: https://imgur.com/uBQmK9G.jpg
 [4]: /wp-content/uploads/2018/04/screen-shot-2018-01-29-at-7-30-44-pm.png
 [5]: https://imgur.com/HIRbDlI.jpg
 [6]: https://docs.python.org/dev/library/argparse.html
 [7]: http://flask.pocoo.org/