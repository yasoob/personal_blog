---
title: 'Python mind-teaser: Make the function return True'
author: yasoob
type: post
date: 2019-07-30T22:43:13+00:00
url: /2019/07/30/python-mind-teaser-make-the-function-return-true/
timeline_notification:
  - 1564526599
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - brain-teaser
  - mind-teaser
  - python challenge
teaser: 'I came across this teaser on Reddit. It took me some time to figure out the solution. Look at the question and see if you can figure it out on your own before looking at my detailed writeup.'
---

Hi everyone! 👋 I was browsing [/r/python][1] and came across [this post][2]:

![Image](/wp-content/uploads/2019/07/python.png)

The challenge was easy. Provide such an input that if 1 is added to it, it is the instance of the same object but if 2 is added it is not.

## Solution 1: Custom class

The way I personally thought to solve this challenge was this:

```
def check(x):
    if x+1 is 1+x:
        return False
    if x+2 is not 2+x:
        return False
    return True

class Test(int):
    def __add__(self, v):
        if v == 1:
            return 0
        else:
            return v

print(check(Test()))
# output: True
```

Let me explain how this works. In Python when we use the `+` operator Python calls a different dunder method depending on which side of the operator our object is. If our object is on the left side of the operator then `__add__` will be called, if it is on the right side then `__radd__` will be called.

Our Test object will return `0` if `Test() + 1` is called and `1` if `1 + Test()` is called. The trick is that we are overloading only one dunder method and keeping the other one same. This will help us pass the first if condition. If you take a second look at it you will see that it helps us pass the second if check as well because we simply return the input if it is not 1 so `Test() + 2` will always be similar to `2 + Test()`.

However, after reading the comments, I found another solution which did not require a custom class.

## Solution 2: A unique integer

User [/u/SethGecko11][3] came up with this absurdly short answer:

```
def check(x):
    if x+1 is 1+x:
        return False
    if x+2 is not 2+x:
        return False
    return True

print(check(-7))
# output: True
```

Only -7 works. Any other number will not return True. If you are confused as to why this works then you aren&#8217;t alone. I had to read the comments to figure out the reasoning.

So apparently, in Python, integers from -5 to 256 are pre-allocated. When you do any operation and the result falls within that range, you get the pre-allocated object. These are singletons so the `is` operator returns `True`. However, if you try using integers which don&#8217;t fall in this range, you get a new instance.

The memory requirement for pre-allocating these integers is not that high but apparently the performance gains are huge.

So when you use -7 as input, you get a new instance of -6 but the same instance when the answer is -5. This doesn&#8217;t work with the upper bound (256) precisely because of the way if statements are constructed. 255 would work as an answer if the check function was implemented like this:

```
def check(x):
    if x+1 is not 1+x:
        return False
    if x+2 is 2+x:
        return False
    return True
```

I hope you learned something new in this article. I don&#8217;t think you would ever have to use this in any code-base ever but it is a really good mind-teaser which can catch even seasoned Python developers off-guard.

Happy programming! I will see you in the next article 😊

 [1]: https://www.reddit.com/r/Python/
 [2]: https://www.reddit.com/r/Python/comments/cje5yh/short_python_challenge_make_this_return_true/
 [3]: https://www.reddit.com/user/SethGecko11/