---
title: Introduction to unittest
author: yasoob
type: post
date: 2013-11-15T18:04:58+00:00
url: /2013/11/15/introduction-to-unittest/
publicize_twitter_user:
  - yasoobkhalid
publicize_facebook_url:
  - https://facebook.com/509724922449953_569076126514832
publicize_twitter_url:
  - http://t.co/ENNSDgew9V
categories:
  - Uncategorized
tags:
  - mock
  - nose
  - python
  - python testing
  - testing
  - testing in python
  - unittest
  - unittest tutorial

---
Hi there folks. I recently thought that I have not written even a single post about testing in python. Testing is one of the most important part of any language. In this post I am going to share some information about unittest with you. 

So what exactly is unittest? You might have heard about it on StackOverflow or some other forum. It is a testing framework for python just like Junit for Java. It comes pre-installed with python from 2.1. It is easy to use. 

However there are a lot of other testing frameworks for python out there as well but I will be focusing on unittest today as it is the default testing framework for python. So without wasting any time lets get started.

The standard workflow while using unittest is:

  1. derive your own class from `unittest.TestCase`
  2. write your tests in functions which start with `test_`
  3. finally write `unittest.main()` at the end of your file to run the tests

I was also used to be scared by testing. Testing seemed to me as something from outer space but now I have learned its importance and it is essential for every programmer to learn it.

## A simple script

So lets write a simple script which we can later test. This script is going to do some math functions for us. So here is the script:

```
# save it as math.py
def multiply(n1, n2):
    return n1 * n2

def add(n1, n2):
    return n1 + n2
```

So thats our little script. Now lets move forward and write our first test.

## Our first test

So as I told you before that every unittest file contains a custom class derived from `unittest.TestCase` so lets create that:

```
import unittest
from math import multiply, add

class TestingMath(unittest.TestCase):
    pass

if __name__ == "__main__":
    unittest.main()
```

So that was the first part. Now we need to define our tests. In unittest there is a `setUp()` and `tearDown()` function. The `setUp()` function is used to set up the test environment and `tearDown()` is used to clean up after a test. We do not need them as they are usually used when a lot of tests are written for a larger software. 

The default implementation of `setUp()` and `tearDown()` does nothing. So now lets write our first test by editing our previous script.

```
import unittest
from math import multiply, add

class TestingMath(unittest.TestCase):

    def setUp(self):
        pass
    def test_multiply(self):
        self.assertEqual( multiply(3,5), 15)

    def test_add(self):
        self.assertEqual( add(3,5), 8)
if __name__ == "__main__":
    unittest.main()
```

Now save this file as test.py and run it from the command line and you will see some output like this:

```
yasoob@yasoob:~/Desktop$ python test.py
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s
OK
```

Congratulations! You have written your very first fully working test suite in python. Wait! what are those `assertEqual()` statements there? Let me explain them. These assert funtions are the backbones of testing in unittest. They check whether the result is correct or not. There are a lot of assert functions in unittest. In our case we used `assertEqual()` which checks whether two values are equal or not. We gave 2 parameters to `assertEqual()` now the job of `assertEqual()` is to check whether both parameters are equal or not. 

Just for reference some other assert functions are:

```
assertTrue(x)
assertFalse(x)
assertNotEqual(a, b)
assertIs(a, b)
assertIsNot(a, b)
assertIsNone(x)
```

## Test Discovery

So just think about it for a minute. You have a lot of test files and want to run all of them. The only method which comes to mind is to manually run all of those files separately. This is possible if you have 10 files but what if you have a 100 files? That is were automatic test discovery comes to rescue. So if I have all of my tests in app/tests directory I would simply run:

```
python -m unittest discover app/tests
```

So this command would gather all of the test files in the tests directory and will run them. I hope that was helpful.

## Furthur

So now you have got some idea of how testing works in python. Remember that this was just an introduction and there is a whole lot to unittest than this. If you want to further increase your knowledge then check out the original [python docs about unittest][1]. I will cover other testing frameworks as well in the future. 

I hope you enjoyed this article and do remember this one tip that the best time to write tests is while developing. If you write tests bit by bit while developing then they will not become a burden and your application will be rock solid. 

Do share your views in the comments below or feel free to [email me][2] or [tweet me][3]. Last but not the least follow this blog and stay tuned for the next post.

 [1]: http://docs.python.org/2/library/unittest.html
 [2]: yasoob.khld@gmail.com
 [3]: http://twitter.com/yasoobkhalid