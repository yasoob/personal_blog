---
title: Exception handling
author: yasoob
type: post
date: 2013-07-29T21:03:40+00:00
url: /2013/07/30/exception-handling/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - error handling
  - errors
  - exceptions
  - try except

---
Okay so the chances are you already know about exception handling in python but some new programmers don't. How do you handle exceptions in python? 

First let me tell you what exceptions are. Exceptions are when something unexpected happens with your code. Just think that you writing a huge program which browses the internet and accesses web pages, the program works fine on your side and you consider packaging and distributing it. But something unexpected occurs on the pc of the user who downloaded your package from the internet and tried to run it. His internet connection dropped. What will happen?

```
>>> import urllib2
>>> urllib2.urlopen('http://www.google.com/').read()

Traceback (most recent call last):
  File "", line 1, in 
    urllib2.urlopen('http://www.google.com/').read()
  File "C:\Python27\lib\urllib2.py", line 127, in urlopen
    return _opener.open(url, data, timeout)
  File "C:\Python27\lib\urllib2.py", line 404, in open
    response = self._open(req, data)
  File "C:\Python27\lib\urllib2.py", line 422, in _open
    '_open', req)
  File "C:\Python27\lib\urllib2.py", line 382, in _call_chain
    result = func(*args)
  File "C:\Python27\lib\urllib2.py", line 1214, in http_open
    return self.do_open(httplib.HTTPConnection, req)
  File "C:\Python27\lib\urllib2.py", line 1184, in do_open
    raise URLError(err)
```

So in order to save yourself from this you have to use `Exception Handling`. There are three keywords available within python which help you to handle exceptions. They are usually referred to as `try-except` clause. Just watch the below code.

```
>>> try:
	urllib2.urlopen('http://www.google.com/').read()
except urllib2.URLError as e:
	print "An error " 
	
An error
>>> 
```

Here we are doing the same thing but using the try except clause. Lets get somewhat deeper into it. We wrap our main code in the try clause. After that we wrap some code in except clause which gets executed if an exception occurs in the code wrapped in try clause. But wait where is the third keyword? The third keyword is `finally`. It comes after the except clause and gets executed even if no exception occurs. Let me show you the same example but this time with the finally clause as well.

```
>>> try:
	urllib2.urlopen('http://www.google.com/').read()
except urllib2.URLError as e:
	print "An error %s " %e
finally:
	print "This is going to be printed even if no exception occurs"
<code>
'Google(function(){\nwindow.google={kEI:"sdD2UbmEOMzBtAbyqYCgDQ",ge
</code>
------------------------trancuated------------------- 
This is going to be printed even if no exception occurs
```

So as you can see the finally clause got executed even when there was no exception. Okay now i am going to tell you a little secret which most of us don't know and even i got to know it just few days ago. While using the except clause if we want to handle any exception that we are not aware of then what should we do? Here in this situation we can put more except clauses for each exception which is likely to occur and in the end we can put another except clause which caches all exceptions which were not likely to occur. Here is an example:

```
>>> try:
    print ali
except KeyboardInterrupt:
    print "'E's pining!"
except :
    print "This is going to handle every type of exception"
finally:
    print "okay the end"

This is going to handle every type of exception
okay the end
```

Okay i guess thats it for now. However i just gave you an intro of exception handling in python and if you want to study further then go to [this](http://docs.python.org/2/tutorial/errors.html) link. I hope you liked today's post. Do share your views about todays post in the comments below.

Source : http://docs.python.org/2/tutorial/errors.html
