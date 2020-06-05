---
title: Finding the module version
author: yasoob
type: post
date: 2013-08-28T03:57:05+00:00
url: /2013/08/28/finding-the-module-version/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:50;}s:2:"fb";a:1:{i:4182098;i:19;}s:2:"wp";a:1:{i:0;i:40;}}'
categories:
  - python
tags:
  - how to
  - module
  - tutorial
  - version

---

Hi there folks. I know I have not been active recently and it was because I was not in town. I was in Canada. So this post will be short. In this post i will show you how you can find the version number of any python module. Sometimes you need to find the version number in order to know whether you have the desired version of the module or not. So here is the trick.

1. First of all launch python:

```
$ python
```

2. Import the module which in our case is requests:

```
>>> import requests
```

3. Lastly type this:

```
>>> requests.__version__
'1.2.3'
```

So I hope you got the trick. If you have any questions then feel free to post them below and stay tuned for the next post.