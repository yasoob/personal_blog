---
title: What is virtualenv and why you should use it.
author: yasoob
type: post
date: 2013-07-30T09:02:12+00:00
url: /2013/07/30/what-is-virtualenv/
publicize_twitter_user:
  - yasoobkhalid
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-30 09:16:40";}'
categories:
  - python
tags:
  - environment
  - how to
  - installation
  - isolated
  - tutorial
  - virtualenv

---
Have you ever heard of virtualenv? The chances are that if you are a beginner then you might not have heard about it but if you are a seasoned programmer than it's a vital part of your toolset. So what is virtualenv really? Virtualenv is a tool which allows us to make isolated python environments. How does making isolated python environments help us? 

Imagine you have an application that needs version 2 of a LibraryBar, but another application requires version 2. How can you use and develop both these applications? If you install everything into /usr/lib/python2.7/site-packages (or whatever your platform's standard location is), it's easy to end up in a situation where you unintentionally upgrade an application that shouldn't be upgraded. 

In another case just imagine that you have an application which is fully developed and you do not want to make any change to the libraries it is using but at the same time you start developing another application which requires the updated versions of those libraries. What will you do? It is where virtualenv comes into play. It creates isolated environments for you python application and allows you to install python libraries in that isolated environment instead of installing them globally. In order to install it just type this command in the shell:

```
$ pip install virtualenv
```

Now i am going to list some of it's commands. The most important ones are:

```
$ virtualenv ENV
```

and 

```
$ source bin/activate
```

So what does these two commands do? This first one makes an isolated virtualenv environment in the `ENV` folder and the second command activates that isolated environment. Now you can install any library without disturbing the global libraries or the libraries of the other environments. This was just a short intro to virtualenv. There's a lot more to it. For further study i recommend [this link.][1] It will remove all of your confusions about virtualenv. I hope you liked today's post. Do share your views in the comments below and stay tuned for the next post.

Source: http://docs.python-guide.org/en/latest/dev/virtualenvs.html

 [1]: http://docs.python-guide.org/en/latest/dev/virtualenvs.html