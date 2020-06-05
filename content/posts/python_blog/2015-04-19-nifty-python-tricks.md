---
title: Nifty Python tricks
author: yasoob
type: post
date: 2015-04-19T05:04:08+00:00
url: /2015/04/19/nifty-python-tricks/
publicize_facebook_url:
  - https://facebook.com/509724922449953_859871717435270
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/VWonsP3N0Z
categories:
  - python
tags:
  - list comprehensions
  - object introspection
  - pdb
  - reversing string
  - set comprehensions

---
Hi there folks. It's been a long time since I last published a post. I have been busy. However in this post I am going to share some really informative tips and tricks which you might not have known about. So without wasting any time lets get straight to them:

## Enumerate

Instead of doing:

```
i = 0 
for item in iterable: 
    print i, item 
    i += 1
```

We can do:

```
for i, item in enumerate(iterable):
    print i, item
```

Enumerate can also take a second argument. Here is an example:

```
>>> list(enumerate('abc')) 
[(0, 'a'), (1, 'b'), (2, 'c')] 

>>> list(enumerate('abc', 1)) 
[(1, 'a'), (2, 'b'), (3, 'c')]
```

## Dict/Set comprehensions

You might know about list comprehensions but you might not be aware of _dict/set comprehensions_. They are simple to use and just as effective. Here is an example:

```
my_dict = {i: i * i for i in xrange(100)} 
my_set = {i * 15 for i in xrange(100)}

# There is only a difference of ':' in both
```

## Forcing float division:

If we divide whole numbers Python gives us the result as a whole number even if the result was a float. In order to circumvent this issue we have to do something like this:

```
result = 1.0/2
```

But there is another way to solve this problem which even I wasn't aware of. You can do:

```
from __future__ import division 
result = 1/2
# print(result)
# 0.5
```

Voila! Now you don't need to append _.0_ in order to get an accurate answer. Do note that this trick is for Python 2 only. In Python 3 there is no need to do the import as it handles this case by default.

## Simple Server

Do you want to quickly and easily share files from a directory? You can simply do:

```
# Python2
python -m SimpleHTTPServer

# Python 3
python3 -m http.server
```

This would start up a server.

## Evaluating Python expressions

We all know about _eval_ but do we all know about _literal_eval_? Perhaps not. You can do:

```
import ast 
my_list = ast.literal_eval(expr)
```

Instead of:

```
expr = "[1, 2, 3]" 
my_list = eval(expr)
```

I am sure that it's something new for most of us but it has been a part of Python for a long time.

## Profiling a script

You can easily profile a script by running it like this:

```
python -m cProfile my_script.py
```

## Object introspection

You can inspect objects in Python by using `dir()`. Here is a simple example:

```
>>> foo = [1, 2, 3, 4]
>>> dir(foo) 
['__add__', '__class__', '__contains__', 
'__delattr__', '__delitem__', '__delslice__', ... , 
'extend', 'index', 'insert', 'pop', 'remove', 
'reverse', 'sort']
```

## Debugging scripts

You can easily set breakpoints in your script using the _pdb _module. Here is an example:

```
import pdb
pdb.set_trace()
```

You can write `pdb.set_trace()` anywhere in your script and it will set a breakpoint there. Super convenient. You should also read more about [pdb][1] as it has a couple of other hidden gems as well.

## Simplify if constructs 

If you have to check for several values you can easily do:

```
if n in [1,4,5,6]:
```

instead of:

```
if n==1 or n==4 or n==5 or n==6:
```

## Reversing a list/string

You can quickly reverse a list by using:

```
>>> a = [1,2,3,4]
>>> a[::-1]
[4, 3, 2, 1]

# This creates a new reversed list. 
# If you want to reverse a list in place you can do:

a.reverse()
```

and the same can be applied to a string as well:

```
>>> foo = "yasoob"
>>> foo[::-1]
'boosay'
```

## Pretty print

You can print dicts and lists in a beautiful way by doing:

```
from pprint import pprint 
pprint(my_dict)
```

This is more effective on dicts. Moreover, if you want to pretty print json quickly from a file then you can simply do:

```
cat file.json | python -m json.tools
```

## Ternary Operators

Ternary operators are shortcut for an if-else statement, and are also known as a conditional operators. Here are some examples which you can use to make your code compact and more beautiful.

```
[on_true] if [expression] else [on_false]
x, y = 50, 25
small = x if x < y else y
```

Thats all for today! I hope you enjoyed this article and picked up a trick or two along the way. See you in the next article. Make sure that you follow us on [Facebook][2] and [Twitter][3]!

Do you have any comments or suggestions? You can write a comment or email me on yasoob.khld (at) gmail.com

 [1]: https://docs.python.org/3/library/pdb.html
 [2]: https://www.facebook.com/freepythontips
 [3]: https://twitter.com/yasoobkhalid