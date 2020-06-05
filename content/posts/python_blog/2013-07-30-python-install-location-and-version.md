---
title: Python install location and version
author: yasoob
type: post
date: 2013-07-29T19:17:34+00:00
url: /2013/07/30/python-install-location-and-version/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:518;}s:2:"wp";a:1:{i:0;i:0;}}'
categories:
  - python
tags:
  - installation
  - location
  - path
  - programing
  - version

---
Have you ever wondered how to check the install path of python and it's version? If you have then this post is for you. It is very easy to check the version and install location of python on linux as well as on windows. First I will show the method of checking this on linux and then on windows.

- On linux just type these two commands in the terminal:

```
# for python install path
root@bt:/$ which python
/usr/bin/python

# for python version;
root@bt:/usr/bin$ python -V
Python 2.7.5
```

- On windows type this commands in the command prompt for python version:

```
python -V
```

And type these commands in the python shell for python install path

```
>>> import os
>>> import sys
>>> os.path.dirname(sys.executable)
'C:\\Python27'
```

This comes in handy when you need to know the version and path of python real quick. I hope you liked today's post. Stay tuned for the next one. Do share your views in the comments below.