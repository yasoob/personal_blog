---
title: Month in review – Articles and news
author: yasoob
type: post
date: 2015-03-18T16:18:29+00:00
url: /2015/03/18/month-in-review-articles-and-news/
publicize_facebook_url:
  - https://facebook.com/509724922449953_843000869122355
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/RBvvKseF3V
categories:
  - python
tags:
  - googlecode shutdown
  - invent you computer games with python
  - news
  - python coroutines
  - python descriptors
  - python tips

---
Hi folks. In this post I am going to share some great articles which I recently got across. Apart from that I would also be sharing some news relating to Python.

## Articles

1. [Python Descriptors ][1]

This IPython notebook was really helpful for me to learn about descriptors and properties in Python. It is topic which is greatly shadowed in a lot of Python books. This Notebook would be really beneficial for you if you want to grasp the concept in an effective and understandable manner.

2. [Using Coroutines for running many functions concurrently][2]

Let me be honest. I never thought of this way before. This article from Brett sheds light on an obscure method of running many functions concurrently. I never saw this being discussed before.

## News

1. [Google Code is shutting down][3]

Google code is the host for a number of small Python projects. If you use any library which is hosted on Google code then make sure to back it up because it would be available for long.

2. [Invent Your Own Computer Games with Python 3rd Edition][4]

This book from Al Sweigart has helped a number of people to start programming in Python. If you are new then I am sure that it would help you immensely. This is a new edition of the book.

## Tip

```
cdp () {
    cd "$(python -c "import os.path as _, ${1}; \
            print(_.dirname(_.realpath(${1}.__file__[:-1])))"
        )"
}
```

Put it in your `.bashrc` or `.bash_profile` and do `cdp <python module name>` to get in the directory where the module is defined. This work:

```
~ $ cdp os
/usr/lib/python2.7 $

~ $ cdp os.path
/usr/lib/python2.7 $
```

It also works if a virtual environment is active. This tip was taken from [Reddit][5].

If you have any questions don't forget to ask. The more you ask, the more you learn.

 [1]: http://nbviewer.ipython.org/gist/ChrisBeaumont/5758381/descriptor_writeup.ipynb
 [2]: http://www.effectivepython.com/2015/03/10/consider-coroutines-to-run-many-functions-concurrently/
 [3]: http://google-opensource.blogspot.com/2015/03/farewell-to-google-code.html
 [4]: http://inventwithpython.com/inventwithpython_3rd.pdf
 [5]: http://www.reddit.com/r/Python/comments/2ysd91/what_are_some_nifty_python_snippets_that_you_have/cpckhcg