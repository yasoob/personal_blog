---
title: "Using Python to Post Stories on Instagram"
date: 2020-09-22T00:24:49-04:00
draft: false
teaser: "Have you ever wanted to post stories on Instagram in an automated fashion? In this article, I will show you how to use Python and the Instagram-API-python library to do exactly that. Fasten your seatbelts and let's get started!"
categories: ["programming", "python"]
---

Hi everyone! :wave: In my book (Practical Python Projects), I initially had a section showing the readers how to upload stories on Instagram in an automated fashion. I ended up removing the code from the last draft of the book for various reasons. During the span of a few months, the library I was using to post on Instagram was removed from GitHub. 

Just because this is not an officially supported feature by Instagram and the third-party libraries on GitHub come and go every couple of months, I decided not to add the code for automation in the book that is tied to any such third-party library. Just because I had initially advertised that I will show you how to upload stories to Instagram in the book, I decided to post the redacted part of the chapter on my blog.

Getting started
---------------

To upload the stories on Instagram, we need to either reverse engineer Instagram API ourselves or use an already existing library. I searched on Google for Instagram API in Python. What I ended up learning was that there is no actively maintained official Python API. I decided to use ~~[this unofficial API](https://github.com/LevPasha/Instagram-API-python)~~ (this library has been taken down now). I searched around to check if there was a story upload function/method somewhere. My search led me to ~~[this closed pull request](https://github.com/LevPasha/Instagram-API-python/pull/308)~~. The author of the pull request had closed it before it got merged with the source repo. I ended up downloading (cloning) the repository and made the required changes (by following the afore-mentioned PR) to make the story feature working.

You can download the code from [my GitHub repository](https://github.com/yasoob/Instagram-API-python/) and then install the library from the downloaded folder by running:

```
$ python setup.py install
```

Now we can import `InstagramAPI` in our Python file:

```
from InstagramAPI import InstagramAPI
```

Now we need to `login` to Instagram using the API:

```
user = "your instagram username"
password = "your instagram password"
InstagramAPI = InstagramAPI(user, password)
InstagramAPI.login() 
```

**Note:** Make sure you change the `user` and `password` variable values. 

Next, we need to upload the image using the `uploadPhoto` method:

```
photo_path = 'image_to_upload.jpg'
InstagramAPI.uploadPhoto(photo_path, is_story=True)
```

Final Code
----------

The final code should look like this:

```
from InstagramAPI import InstagramAPI

user = "your instagram username"
password = "your instagram password"
InstagramAPI = InstagramAPI(user, password)
InstagramAPI.login() 

photo_path = 'image_to_upload.jpg'
InstagramAPI.uploadPhoto(photo_path, is_story=True)
```

Now save this code to `app.py` and run it. If everything works out, the `image_to_upload.jpg` should now be uploaded on your Instagram account as a story. 

Warning
-------

If you decide to automate interactions with Instagram, make sure that you don't log in with each new request. That will get your account flagged. Instead, save the authentication tokens and continue using those for any subsequent requests. Last I remember, the auth tokens remain valid for **90** days!

Conclusion
----------

That's it! I hope you find this super short tutorial useful. If you are interested in making more fun stuff similar to this, make sure you buy my book: [Practical Python Projects](https://feld.to/ppp). I will see you in the next article! :joy: :wave: