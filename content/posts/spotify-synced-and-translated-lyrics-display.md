---
title: "Project Write-up: Display Spotify lyrics on external display"
date: 2022-08-11T01:43:58+05:00
featured_image: "/images/spotify-lyrics/header.png"
draft: false
teaser: "I came across a job posting on Upwork where someone was looking for a software that plays the lyrics of a Spotify song on dual screens. I was really intrigued so I decided to give it a go. In this article I am going to talk about the whole thought process I went through while trying to figure out a solution as I think that part is often missing from programming tutorials."
categories: ['python', 'programming', 'spotify', 'automation', 'project']
---

Hi guys! 👋

It has been a while since I last posted anything. I have been busy but I am back with a fun article. I came across a job posting on Upwork where someone was looking for a software that plays the lyrics of a Spotify song on dual screens. One screen will display the English lyrics and the other one will display Hungarian lyrics. I was really intrigued so I decided to give it a go. In this article I am going to talk about the whole thought process I went through while trying to figure out a solution as I think that part is often missing from programming tutorials.

![Job posting](/images/spotify-lyrics/job.png)

I learned about a few fun things while implementing this project. The first one is MPRIS (Media Player Remote Interfacing Specification). It is a standard D-Bus interface that provides a common programmatic API for controlling media players. Spotify supports MPRIS however, as far as I am aware, MPRIS is mainly a Unix-specific technology. It is theoretically supported on Mac but I couldn't find much useful information about it. 

I did not end up using MPRIS for this project but I wanted to mention it here for my future self. And if you are working with multimedia on a Unix-based system, you should definitely check it out! 

Enough with the prelude, let's dive right in.

## Final product

This is what I ended up making:

<video width="100%" height="100%" controls>
 <source src="https://i.imgur.com/UMC4EUe.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

As you can see, the lyrics are all synced up with the song. Only the currently playing stanza is showed up on the screen. The lyrics are loaded from local text files where each song has an accompanying text file containing the lyrics.

## Doing the research

As soon as I read the problem statement, I decided to flex my Google-fu and run some searches. You will be surprised how often there is an open source project doing exactly what you are trying to do and you can repurpose it for your use case. However, my searches didn't result in much success. I guess the main reason for it was that this is such a niche use case. Spotify already provides perfectly synced lyrics for songs and most people don't need them translated. And even if they do, they can simply use Google translate. 

![Lyrics inside Spotify](/images/spotify-lyrics/spotify-english-lyrics.png)

I did come across two projects on GitHub:

- [Lyrics-in-Terminal](https://github.com/Jugran/lyrics-in-terminal)
- [SwSpotify](https://github.com/SwagLyrics/SwSpotify)

However, neither of these projects catered to my specific needs. The first project was not cross-platform. It only works on Linux and so I ruled it out right away.

The second project was a bit more useful. It gives the name of the currently playing song and the artist for that song. Most importantly, it was multi-platform. I figured that if I can get this to work on my machine, I can use the name of the song and the artist to locate a local text file containing the lyrics of the song and display them in a browser window using Flask.

The only remaining issue was that the song and artist name were not enough for me to display the lyrics. I needed a way to display only the current stanza that was playing. SwSpotify didn't have an API for me to get the current location of the playhead. I needed that to figure out which stanza to play. Luckily, SwSpotify showed me a method that I could use to get this information. I saw that it was using Apple Script to query Spotify for the song information. 

This is what the [relevant code section](https://github.com/SwagLyrics/SwSpotify/blob/master/SwSpotify/spotify.py#L111) looked like:

```python
apple_script_code = """
# Check if Spotify is currently running
if application "Spotify" is running then
    # If this executes it means Spotify is currently running
    getCurrentlyPlayingTrack()
end if
on getCurrentlyPlayingTrack()
    tell application "Spotify"
        set isPlaying to player state as string
        set currentArtist to artist of current track as string
        set currentTrack to name of current track as string
        return {currentArtist, currentTrack, isPlaying}
    end tell
end getCurrentlyPlayingTrack
"""
```

Sadly I had no idea which queries were supported by the Spotify application. I decided to run some Google searches again and came across [this StackOverflow question](https://stackoverflow.com/questions/8901556/controlling-spotify-with-applescript). Someone had helpfully mentioned a file that contained all the available queries.

```
/Applications/Spotify.app/Contents/Resources/Spotify.sdef
```

I quickly opened it up and saw `player position`. I tested it out in the Apple Script Editor and thankfully it worked right away:

![Apple Script Editor](/images/spotify-lyrics/apple-script.png)

This is the final Apple Script that I ended up with:

```
if application "Spotify" is running then
    # If this executes it means Spotify is currently running
    getCurrentTrackPosition()
end if
on getCurrentTrackPosition()
    tell application "Spotify"
        set trackPosition to player position as string
        return trackPosition
    end tell
end getCurrentTrackPosition
```

After figuring out the Apple Script, I decided that I was going to prepare the lyrics files such that there was a timecode before each stanza. I can then process these lyrics files in Python and match the track position with the appropriate stanza.

This is what the relevant section of one of these files ended up looking like:

```
[00:08.62]
First things first
I'ma say all the words inside my head
I'm fired up and tired of the way that things have been, oh ooh
The way that things have been, oh ooh

[00:22.63]
Second thing second
Don't you tell me what you think that I can be
I'm the one at the sail, I'm the master of my sea, oh ooh
The master of my sea, oh ooh
```

At this point, the only missing piece was to figure out how to stream lyrics from Flask to the browser. I wanted it to be as simple as possible so I didn't want to use web sockets. Luckily I had used streaming responses in Flask before so I knew I could use them for this purpose. I searched online for a ready-made example and came across [this StackOverflow answer](https://stackoverflow.com/questions/61398680/updating-streamed-data-from-flask-in-real-time) that contained some sample code for me to use.

## Final code

I used the code from that answer and ended up with this final code:

```python
from SwSpotify import spotify, SpotifyNotRunning, SpotifyPaused
from flask import Flask, render_template
import subprocess
import time
import re

app = Flask(__name__)


def get_current_time():
    apple_script_code = """
    # Check if Spotify is currently running
    if application "Spotify" is running then
        # If this executes it means Spotify is currently running
        getCurrentTrackPosition()
    end if
    on getCurrentTrackPosition()
        tell application "Spotify"
            set trackPosition to player position as string
            return trackPosition
        end tell
    end getCurrentTrackPosition
    """

    result = subprocess.run(
        ["osascript", "-e", apple_script_code],
        capture_output=True,
        encoding="utf-8",
    )
    print(result.stdout)
    return result.stdout or ""


def get_sec(time_str):
    """Get seconds from time."""
    m, s = time_str.split(":")
    return int(m) * 60 + float(s)


def get_lyrics(song_name, language):
    try:
        with open(f"./{language}_lyrics/{song_name}.txt", "r") as f:
            lyrics = f.read()
    except FileNotFoundError:
        return
    pattern = re.compile("\[(.+)\]((?:\n.+)+)", re.MULTILINE)
    splitted = re.findall(pattern, lyrics)
    time_stanza = {}
    for (time, stanza) in splitted:
        time_stanza[get_sec(time)] = stanza.strip()
    return time_stanza


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/stream")
def stream():
    def generate():
        while True:
            try:
                title, artist = spotify.current()
            except (SpotifyNotRunning, SpotifyPaused) as e:
                print(e)
            else:
                print(f"{title} - {artist}")
                current_time = float(get_current_time())
                print(current_time)
                time_stanza = get_lyrics(title, "english")
                current_stanza = ""
                if time_stanza:
                    time_list = list(time_stanza.keys())
                    for index, stanza_start_time in enumerate(time_list):
                        if (
                            stanza_start_time < current_time
                            and time_list[index + 1] > current_time
                        ):
                            current_stanza = time_stanza[stanza_start_time]
                            break
                yield f"{title.title()} - {artist.title()} ##{current_stanza}\n----"

            time.sleep(1)

    return app.response_class(generate(), mimetype="text/plain")


app.run()
```

This is the accompanying HTML template:

```jinja
<!DOCTYPE html>
<html>

<head>

</head>

<body>
    <div class="song-meta">
        <img src={{ url_for('static', filename='images/music.png' ) }} width="50" alt="song name" />
        <span id="songName">Loading..</span>
    </div>
    <div class="lyrics">
        <pre id="stanza">
        </pre>
    </div>
    <script>

        var songNameSpan = document.getElementById('songName');
        var stanzaSpan = document.getElementById('stanza');
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '{{ url_for('stream') }}');

        xhr.onreadystatechange = function () {
            var all_lines = xhr.responseText.split('\n----');
            last_line = all_lines.length - 2
            var songName_stanza = all_lines[last_line]
            if (songName_stanza){
                songName_stanza = songName_stanza.split('##')
                console.log(songName_stanza)
                songNameSpan.textContent = songName_stanza[0]
                stanzaSpan.textContent = songName_stanza[1]
            }

            if (xhr.readyState == XMLHttpRequest.DONE) {
                /*Sometimes it stops working when the stream is finished (song changes)
                so I just refresh the page. It almost always solves the issue*/
                document.location.reload()
                songNameSpan.textContent = "The End of Stream"
            }
        }

        xhr.send();

    </script>

    <style>
        html,
        body {
            height: 100%;
        }

        body {
            margin: 0;
            background-color: #272727;
        }

        .song-meta {
            position: absolute;
            top: 40px;
            left: 40px;
            display: flex;
            align-items: center;
        }

        #songName {
            font-size: 2rem;
            margin-left: 20px;
            background-color: white;
            padding: 10px 20px;
            border-radius: 20px;
        }

        .lyrics {
            height: 100%;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #stanza {
            width: auto;
            font-family: Helvetica, sans-serif;
            padding: 5px;
            margin: 10px;
            line-height: 1.5em;
            color: white;
            font-size: 4rem;
            text-align: center;
        }
    </style>
</body>

</html>
```

My final directory structure looked like this:

```
.
├── app.py
├── english_lyrics
│   └── Believer.txt
├── static
│   └── images
│       └── music.png
└── templates
    └── index.html
```

And this is what the final application website looked like:

![Final web app](/images/spotify-lyrics/final-application.png)

## Conclusion

There is a lot of stuff that is not optimized in the Python code. This is a quick and dirty solution to this problem but it works perfectly fine. I did not work with the buyer so I had no reason to improve it. I just wanted to test out the idea because the project seemed fun 😃

I had a lot of fun while working on this project. I hope you learned about my thought process in this article and saw how you can go from point 0 to a fully working project and put different pieces together. If you like reading about this kind of stuff please comment below. I love to hear from you guys!

Till next time! 👋


