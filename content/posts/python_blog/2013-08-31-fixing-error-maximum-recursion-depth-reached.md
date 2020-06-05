---
title: Fixing error – maximum recursion depth reached
author: yasoob
type: post
date: 2013-08-30T19:35:34+00:00
url: /2013/08/31/fixing-error-maximum-recursion-depth-reached/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:50;}s:2:"fb";a:1:{i:4182098;i:19;}s:2:"wp";a:1:{i:0;i:41;}}'
categories:
  - python
tags:
  - debug
  - default limit
  - error
  - help
  - increase
  - recursion

---
Hi there folks. In this post I am going to teach you how to increase the recursion depth in python. Most of us at some time get this error:

```
RuntimeError: maximum recursion depth exceeded
```

If you want to fix this error just increase the default recursion depth limit but how to do it? Just import the `sys` module in your script and in the beginning of the script type this:

```
sys.setrecursionlimit(1500)
```

This will increase the default limit to 1500. For the record, the default limit is 1000. I hope that you found this post useful. Do share this on facebook and twitter and stay tuned for my next post. :heart: :wave: