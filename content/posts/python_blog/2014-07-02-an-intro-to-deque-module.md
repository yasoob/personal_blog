---
title: An intro to Deque module
author: yasoob
type: post
date: 2014-07-01T20:40:04+00:00
url: /2014/07/02/an-intro-to-deque-module/
publicize_facebook_url:
  - https://facebook.com/509724922449953_688838147871962
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/g6SWE052Gd
categories:
  - python
tags:
  - deque
  - deque tutorial
  - leaning python
  - python deque
  - python stdlib

---
Hi there folks. Recently I got to know about the Python deque module. It is a part of the collections library. It provides you with a double ended queue which means that you can append and delete elements from either side of the list. So without wasting any time lets begin. First of all you have to import the deque module from the collections library. This can be done by typing:

```
from collections import deque
```

Now we can instantiate a deque object.

```
d = deque()
```

That was simple. It works like python lists and provides you with somewhat similar methods as well. For example you can do:

```
d = deque()
d.append('1')
d.append('2')
d.append('3')
len(d)
d[0]
d[-1]
```

Output:

```
3
'1'
'3'
```

You can pop values from both sides of the deque. This means that you can do this:

```
d = deque('12345')
len(d)
d.popleft()
d.pop()
d
```

Output:

```
5 
'1' 
'5' 
deque(['2', '3', '4'])
```

We can also limit the amount of items a deque can hold. By doing this when we achieve the maximum limit of out deque it will simply pop out the items from the opposite end. It is better to explain it using an example so here you go:

```
d = deque(maxlen=30)
```

Now whenever you insert values after 30, the leftmost value will be popped from the list. You can also expand the list in any direction with new values:

```
d = deque([1,2,3,4,5])
d.extendleft([0])
d.extend([6,7,8])
d
```

Output:

```
deque([0, 1, 2, 3, 4, 5, 6, 7, 8])
```

So that's it! That was a basic overview of the deque module in Python stdlib. I hope you learned something new today. I hope to see you guys later and don't forget to follow this blog to get your daily dose of Python tips and tutorials. For further reading I would suggest the following links:

  * [Python Module of The Week][1]
  * [Official Python Documentaion][2]

 [1]: http://pymotw.com/2/collections/deque.html
 [2]: https://docs.python.org/3/library/collections.html