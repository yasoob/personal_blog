---
title: The use of return and global keywords
author: yasoob
type: post
date: 2013-07-28T18:52:08+00:00
url: /2013/07/28/the-use-of-return-and-global-keywords/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:515;}s:2:"wp";a:1:{i:0;i:0;}}'
categories:
  - python
tags:
  - functions
  - global
  - output
  - return
---

Okay so here we have another post. This post is about the return keyword. you might have encountered some functions written in python which have a return keyword in the end of the function. Do you know what it does? Lets examine this little function:

```
>>> def add(value1,value2):
...     return value1 + value2

>>> result = add(3,5)
>>> print result
8
```

The function above takes two values as input and then output their addition. We could have also done:

```
>>> def add(value1,value2):
...     global result
...     result = value1 + value2

>>> add(3,5)
>>> print result
8
```

So first lets talk about the first bit of code which involves the return keyword. What that function is doing is that it is assigning the value to the variable which is calling that function which in our case is `result`.
  
It's pretty handy in most cases and you won't need to use the global keyword. However lets examine the other bit of code as well which includes the global keyword. So what that function is doing is that it is making a global variable result. What does global mean here ? Global variable means that we can access that variable outside the function as well. Let me demonstrate it with an example:

```
# first without the global variable
>>> def add(value1,value2):
	result = value1 + value2
	
>>> add(2,4)
>>> result

# Oh crap we encountered an exception. Why is it so ?
# the python interpreter is telling us that we do not 
# have any variable with the name of result. It is so 
# because the result variable is only accessible inside 
# the function in which it is created if it is not global.
Traceback (most recent call last):
  File "", line 1, in 
    result
NameError: name 'result' is not defined

# Now lets run the same code but after making the result 
# variable global
>>> def add(value1,value2):
	global result
	result = value1 + value2

	
>>> add(2,4)
>>> result
6
```

So hopefully there were no errors in the second run as expected. If you want to further explore them you should check out the following links.
  
1. [Stackoverflow](http://stackoverflow.com/questions/3359204/python-assign-global-variable-to-function-return-requires-function-to-be-globa)
2. [Stackoverflow](http://stackoverflow.com/questions/3052793/python-output-from-functions?lq=1)