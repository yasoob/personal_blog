---
title: In-place value swapping
author: yasoob
type: post
date: 2013-07-27T21:08:51+00:00
url: /2013/07/28/in-place-value-swapping/
categories:
  - python

---
Okay so this is kinda new for some of us. If you are a seasoned programmer then this might not be surprising for you but if you are a new programmer then this is something you really need to know. Okay so here we go. In normal situations if you would want to swap the values of two variables then this would be something you would go after:

```
a = 1
b = 2
c = a
a = b
b = c
```

But there's a more simple method which will merely take three lines. Here it is:

```
a = 1
b = 2
a, b = b, a
```

This is surely a simple way to swap values. Do comment below and tell me your views about this.