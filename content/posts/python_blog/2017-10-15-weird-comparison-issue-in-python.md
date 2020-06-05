---
title: Weird Comparison Issue in Python
author: yasoob
type: post
date: 2017-10-15T03:23:41+00:00
url: /2017/10/15/weird-comparison-issue-in-python/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - comparison
  - comparison bug
  - comparison chaining
  - python chaining bug

---
Hi guys! I am back with a new article. This time I will tackle a problem which seems easy enough at first but will surprize some of you. Suppose you have the following piece of code:

    a = 3
    b = False
    c = """12"""
    d = 4.7
    

and you have to evaluate this:

    d + 2 * a > int(c) == b
    

Before reading the rest of the post please take a minute to solve this statement in your head and try to come up with the answer.

So while solving it my thought process went something like this:

    2 * a = 6
    d + 6 = 10.7
    10.7 > int(c) is equal to False
    False == b is equal to True 
    

But lo-and-behold. If we run this code in Python shell we get the following output:

    False
    

Dang! What went wrong there? Was our thinking wrong? I am pretty sure it was supposed to return True. I went through the official docs a couple of times but couldn’t find the answer. There was also a possibility in my mind that this might be some Python 2 bug but when I tried this code in Python 3 I got the same output. Finally, I turned to the Python’s IRC channel which is always full of extremely helpful people. I got my answer from there.

So I got to know that I was chaining comparisons. But I knew that already. What I didn’t know was that whenever you chain comparisons, Python compares each thing in order and then does an “AND”. So our comparison code is equivalent to:

    (d + 2*a) > (int(c)) and (int(c)) == (b)
    

This brings us to the question that whenever you chain comparisons, does Python compares each thing in order and then does an “AND”?

As it turns out this is exactly what Python does: `x <comparison> y <comparison> z` is executed just like `x <comparison> y and y <comparison> z`, except `y` is only evaluated once.

I hope you found this article helpful. If you have any questions, comments, suggestions please feel free to reach out to me via email or the comments section below.