---
title: Dictionaries have a get() method
author: yasoob
type: post
date: 2013-07-28T19:59:13+00:00
url: /2013/07/29/dictionaries-have-a-get-method/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:515;}s:2:"wp";a:1:{i:0;i:0;}}'
categories:
  - python
tags:
  - default
  - dict
  - dictionaries
  - get()
  - software

---
Okay here we are with yet another post. However this post is going to be short as in this post i am going to teach you a small, simple and very useful trick. Have you ever tried to access a value from a dictionary and got an exception that there is no value mapped to that key? Like this:

```
>>> dict = {'key1':2,'key2':3}
>>> dict['key1']
2
>>> dict['key3']

Traceback (most recent call last):
  File "", line 1, in 
    dict['key3']
KeyError: 'key3'
```

Sometimes you do not want anything like this because this error can break your whole program and make it useless until you fix this issue. Is there any way through which we can see if a key is present in a dictionary or not and if it is not present then get a default value in it's place? the chances are that you don't know of any such method. Okay so here's the trick. Just examine the code below and i will explain it later.

```
>>> dict = {'key1':2,'key2':3}
>>> dict['key1']
2
>>> a = dict.get('key3', 0)
>>> print a
0
```

So what is happening above? We are still accessing the same key but where has the exception gone? Let me introduce you to `get()` method which is available with a dictionary. What this method does is that it allows you to specify a default value which is returned in case the key is not present in the dictionary. 

In our case there is no `key3` in our dict but when we are using the `get()` method we are specifying the default value which should be returned in case if key3 is not present and the default value which i have set is 0. The syntax of the get method is: 

```
dict.get('anykey','the default value to return if the key is not present')
```

However if we do not set a default value then this returns `None` if the key is not present. I hope it's enough for you guys however if you want to further explore this `get()` method then google is your friend.

Do share your views in the comments below.