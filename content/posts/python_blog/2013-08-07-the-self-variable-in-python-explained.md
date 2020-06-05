---
title: The self variable in python explained
author: yasoob
type: post
date: 2013-08-06T21:21:30+00:00
url: /2013/08/07/the-self-variable-in-python-explained/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:35;}s:2:"fb";a:1:{i:4182098;i:17;}s:2:"wp";a:1:{i:0;i:26;}}'
categories:
  - python
tags:
  - beginner
  - learn
  - self
  - self in python
  - self keyword
  - self variable
  - self variable in python explained

---
Hi everyone! In this post I am going to teach you about the `self` variable in python. I have seen many beginners struggling to grasp the concept of `self` variable. If you are one of them then this post is for you. So lets start by making a class involving the `self` variable.

## A simple class

So here is our class:

```
class Restaurant(object):
    bankrupt = False
    def open_branch(self):
        if not self.bankrupt:
            print("branch opened")
```

First let me explain the above code without the technicalities. First of all we make a class Restaurant. Then we assign it a property 'bankrupt' which is currently false. After that we assign it a function open_branch which can only occur if 'bankrupt' is False which means that the Restaurant has some money.

## Making a resturant

Now that we have made a class for a Restaurant, lets actually make a resturant:

```
x = Restaurant()
```

Now x is a Restaurant which has a property bankrupt and a function `open_branch`. Now we can access the property bankrupt by typing:

```
x.bankrupt
```

The above command is same as:

```
Restaurant().bankrupt
```

Now you can see that self refers to the bound variable or object. In the first case it was x because we had assigned the Restaurant class to x whereas in the second case it referred to `Restaurant()`. Now if we have another Restaurant y, self will know to access the bankrupt value of y and not x. For example check this example:

```
>>> x = Restaurant()
>>> x.bankrupt
False

>>> y = Restaurant()
>>> y.bankrupt = True
>>> y.bankrupt
True

>>> x.bankrupt
False
```

The first argument of every class method, including `init`, is always a reference to the current instance of the class. By convention, this argument is always named self. In the `init` method, self refers to the newly created object; in other class methods, it refers to the instance whose method was called. For example the below code is the same as the above code.

```
class Restaurant(object):
    bankrupt = False
    def open_branch(this):
        if not this.bankrupt:
            print("branch opened")
```

## Free Tip

However self is not a reserved keyword in python it's just a strong convention. Many people say that why do we have to write self? Why can't we have it set automatically like in Java? Someone also filed a PEP (improvement suggestion) in which he suggested to remove the explicit assignment of self keyword. However Guido Van Rossum (the maker of python) wrote [a blogpost in which he told why explicit self has to stay][1].

I hope you have understood to concept of self. If you have any other questions then feel free to comment. If you liked this post then make sure that you share it on facebook, tweet it on twitter and follow our blog.

## You might also like
  
- [Python socket network programming][2]
- [`*args` and `**kwargs` in python explained][3]
- [Making a url shortener in python][4]

 [1]: http://neopythonic.blogspot.com/2008/10/why-explicit-self-has-to-stay.html
 [2]: http://freepythontips.wordpress.com/2013/08/06/python-socket-network-programming/
 [3]: http://freepythontips.wordpress.com/2013/08/04/args-and-kwargs-in-python-explained/
 [4]: http://freepythontips.wordpress.com/2013/08/03/a-url-shortener-in-python/