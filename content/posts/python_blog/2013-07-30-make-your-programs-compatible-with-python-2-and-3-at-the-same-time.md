---
title: Targeting python 2 and 3 at the same time.
author: yasoob
type: post
date: 2013-07-30T14:58:06+00:00
url: /2013/07/30/make-your-programs-compatible-with-python-2-and-3-at-the-same-time/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:13;}s:2:"wp";a:1:{i:0;i:1;}}'
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-30 19:13:38";}'
categories:
  - python
tags:
  - compatibility
  - language
  - programming
  - python 2
  - python 3
  - support
  - targeting

---
Hi there pythonistas. Today i am not going to write a lengthy tutorial about how to make your programs compatible with python 2 and 3 at the same time, but i am going to share a simple tip with you guys which will help you achieve this target. 

Just imagine that you have a very popular python module which is use by hundreds of people but not all of them have python 2 or 3. In that case you have two choices. The first one is to distribute 2 modules. One for python 2 and the other for python 3 and the other choice is to modify your current code so that it can be used with both python 2 and 3. 

I am going to talk about the second choice. First tell me how you import packages in your script? Most of us do this:

```
import foo
# or
from foo import bar
```

Do you know that you can do something like this as well? 

```
import foo as foo
```

I know it's function is the same as above listed code but it is vital for making your script compatible with python 2 and 3. Now examine the code below:

```
try:
    import urllib.request as urllib_request #for python 3
except ImportError:
    import urllib2 as urllib_request # for python 2
```

Did you find something noteworthy in the above code? So let me explain the above code a little. We are wrapping our importing code in a try except clause. Why are we doing that? 

We are doing it because in python2 there is no `urllib.request` module and will result in an `ImportError`. The functionality of `urllib.request` is provided by `urllib2` module in python2. So now when python2 try to import `urllib.request` and get an import error we tell it to import urllib2 instead. 

The final thing you need to know about is the `as` keyword. It is mapping the imported module to `urllib_request`. So that now all of the Classes and methods of urllib2 are available to us by `urllib_request`. 

So how did this help us in targeting python 2 and 3 at the same time? Okay here is the trick. Once you have got a library that works in python 2 but is not available in python 3 then you have to find out it's alternative in python 3 (most libraries have their alternatives for python 3 but some don't). 

I know it's trivial and that is why a lot of modules have still not been ported to python 3. After that you have to wrap your module importing code in a try-except clause with a common variable following the `as` keyword. After that use the imported module. Here is a complete example which should work both in python 2 and 3:

```
try:
    import urllib.request as compat_urllib_request
except ImportError: # Python 2
    import urllib2 as compat_urllib_request
html = compat_urllib_request.urlopen("http://www.google.com/")
print html.headers['content-type']
'text/html; charset=ISO-8859-1'
```

Another example which involves the json library:

```
try:
    import json
except ImportError:
    import simplejson as json
```

I hope you liked today's post. Stay tuned for the next one. If you have any suggestions then do post them in the comments below.