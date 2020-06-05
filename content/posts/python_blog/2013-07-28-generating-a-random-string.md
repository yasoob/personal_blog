---
title: Generating a random string
author: yasoob
type: post
date: 2013-07-28T12:40:54+00:00
url: /2013/07/28/generating-a-random-string/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:515;}s:2:"wp";a:1:{i:0;i:0;}}'
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-28 12:43:49";}'
categories:
  - python
tags:
  - random
  - string

---

Okay, so, most of us do not know how to generate random strings which include letters and digits. This can be really useful for generating a password (or, you know, stuff to aid you in your plan for world domination). So how _do_ we generate a random string? Have you ever heard of the string module available in python? Chances are, you haven't. So what does this module provide us? Okay here you go lets understand this module by example:


```
# first we have to import random module as this
# provides the backbone for our random string
# generator and then we have to import the string
# module.

>>> import random
>>> import string

# now lets see what this string module provide us.
# I wont be going into depth because the python
# documentation provides ample information.
# so lets generate a random string with 32 characters.

>>> random = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
>>> print random
'9fAgMmc9hl6VXIsFu3ddb5MJ2U86qEad'
>>> print len(random)
32
```

Another example with a function:

```
>>> import string
>>> import random
>>> def random_generator(size=6, chars=string.ascii_uppercase + string.digits):
...    return ''.join(random.choice(chars) for x in range(size))
...
>>> random_generator()
'G5G74W'
>>> random_generator(3, "6793YUIO")
'Y3U'
```

So thats it for now. If you want to further explore the string module then go to the official [documentation](http://docs.python.org/2/library/string.html).
