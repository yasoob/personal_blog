---
title: Python decorators finally demystified
author: yasoob
type: post
date: 2013-12-05T16:09:59+00:00
url: /2013/12/05/python-decorators-finally-demystified/
publicize_facebook_url:
  - https://facebook.com/509724922449953_578917295530715
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/hjmmHKuiz5
categories:
  - python
tags:
  - decorator-pattern
  - decorators
  - design-patterns
  - patterns
  - programming
  - python decorators

---
Hi there guys! I hope all of you are fine and doing well. Recently I was hanging out on a python related IRC where I got a request from someone to write an article on decorators in Python. It is perhaps one of the most difficult concept to grasp. So as usual without wasting anytime let get on with it.

## Everything in python is an object (Functions too!): {#everythinginpythonisanobjectfunctionstoo}

First of all let's understand functions in python:

    def hi(name="yasoob"):
        return "hi "+name
    
    print hi()
    #output: 'hi yasoob'
    
    #We can even assign a function to a variable like
    greet = hi
    #We are not using parentheses here because we are not calling the function hi
    #instead we are just putting it into the greet variable. Let's try to run this 
    
    print greet()
    #output: 'hi yasoob'
    
    #lets see what happens if we delete the old hi function!
    del hi
    print hi()
    #outputs: NameError
    
    print greet()
    #outputs: 'hi yasoob'
    

## Defining functions within functions: {#definingfunctionswithinfunctions}

So those are the basics when it comes to functions. Lets take your knowledge one step further! In Python we can define functions inside other functions. You might be wondering what sorcery is this! Let me explain it with an example.

    def hi(name="yasoob"):
        print "now you are inside the hi() function"
    
        def greet():
            return "now you are in the greet() function"
    
        def welcome():
            return "now you are in the welcome() function"
    
        print greet()
        print welcome()
        print "now you are back in the hi() function"           
    
    hi()
    #output:now you are inside the hi() function
    #       now you are in the greet() function
    #       now you are in the welcome() function
    #       now you are back in the hi() function
    
    # This shows that whenever you call hi(), greet() and welcome()
    # are also called. However the greet() and welcome() functions
    # are not available outsite the hi() function e.g:
    
    greet()
    #outputs: NameError: name 'greet' is not defined
    

So now we know that we can define functions in other functions. In simpler words we can make nested functions. Now you need to learn one more thing that functions can return functions too.

## Returning functions from within functions: {#returningfunctionsfromwithinfunctions}

It is not necessary to execute a function within another function, we can return it as an output as well. Let's take a look at it with an example!

    def hi(name="yasoob"):
        def greet():
            return "now you are in the greet() function"
    
        def welcome():
            return "now you are in the welcome() function"
    
        if name == "yasoob":
            return greet
        else:
            return welcome
    
    a = hi()
    print a
    #outputs: <function greet at 0x7f2143c01500>
    
    #This clearly shows that `a` now points to the greet() function in hi()
    #Now try this
    
    print a()
    #outputs: now you are in the greet() function
    

Just take a look at the code again! In the if/else clause we are returning greet and welcome, not `greet()` and `welcome()`. Why is that? It is so because when you put parentheses around it the function gets executed whereas if you don't put parenthesis around it then it can be passed around and can be assigned to other variables without executing it. Did you get it? Let me explain it a little bit in more detail. When we write `a = hi()` hi() gets executed and because the name is `yasoob` by default, the function greet is returned. If we change the statement to `a = hi(name = "ali")` then the welcome function will be returned. We can also do `print hi()()` which outputs `now you are in the greet() function`. I hope you have not fainted by now. Was it difficult? No? I guess you are in the mood to finally learn about decorators! Lets continue our talk and move forward.

## Giving a function as an argument to another function: {#givingafunctionasanargumenttoanotherfunction}

Lets take a look at an example:

    def hi():
        return "hi yasoob!"
    
    def doSomethingBeforeHi(func):
        print "I am doing some  boring work before executing hi()"
        print func()
    
    doSomethingBeforeHi(hi)
    #outputs:I am doing some  boring work before executing hi()
    #        hi yasoob!
    

Congratulations! You have all of the knowledge to entitle you as a decorator wrangler! Oh wait, I still haven't told you what decorators really are. Here is a short definition:

> decorators let you execute code before and after the function they decorate

## Writing your first decorator: {#writingyourfirstdecorator}

You have already written your first decorator! Do you know when? In the last example we actually made a decorator! Lets modify the previous decorator and make a little bit more usable program:

    def a_new_decorator(a_func):
    
        def wrapTheFunction():
            print "I am doing some  boring work before executing a_func()"
    
            a_func()
    
            print "I am doing some boring work after executing a_func()"
    
        return wrapTheFunction
    
    def a_function_requiring_decoration():
        print "I am the function which needs some decoration to remove my foul smell"
    
    a_function_requiring_decoration()
    #outputs: "I am the function which needs some decoration to remove my foul smell"
    
    a_function_requiring_decoration = a_new_decorator(a_function_requiring_decoration)
    #now a_function_requiring_decoration is wrapped by wrapTheFunction() 
    
    a_function_requiring_decoration()
    #outputs:I am doing some  boring work before executing a_function_requiring_decoration()
    #        I am the function which needs some decoration to remove my foul smell
    #        I am doing some boring work after executing a_function_requiring_decoration()
    

Did you get it? We just applied the previously learned principles. This is exactly what the decorators do in python! They wrap a function and modify its behaviour in one way or the another. Now you might be wondering that we did not use the `@` anywhere in our code? That is just a short way of making up a decorated function. Here is how we could have run the previous code sample using `@`.

    @a_new_decorator
    def a_function_requiring_decoration():
        print "I am the function which needs some decoration to remove my foul smell"
    
    a_function_requiring_decoration()
    #outputs: I am doing some  boring work before executing a_function_requiring_decoration()
    #         I am the function which needs some decoration to remove my foul smell
    #         I am doing some boring work after executing a_function_requiring_decoration()
    
    #the @a_new_decorator is just a short way of saying:
    a_function_requiring_decoration = a_new_decorator(a_function_requiring_decoration)
    

## Decorators Demystified: {#decoratorsdemystified}

I hope you now have a basic understanding of how decorators work in Python. They are not something to be afraid of at all. In addition, we can chain two or more than two decorators! For example:

    def bread(func):
        def wrapper():
            print "</''''''\>"
            func()
            print "<\______/>"
        return wrapper
    
    def ingredients(func):
        def wrapper():
            print "#tomatoes#"
            func()
            print "~salad~"
        return wrapper
    
    def sandwich(food="--ham--"):
        print food
    
    sandwich()
    #outputs: --ham--
    sandwich = bread(ingredients(sandwich))
    sandwich()
    #outputs:
    #</''''''\>
    # #tomatoes#
    # --ham--
    # ~salad~
    #<\______/>
    

In the following example [e-satis][2] really does a great job demonstrating how decorators are used. We can run the previous example as so:

    @bread
    @ingredients
    def sandwich(food="--ham--"):
        print food
    
    sandwich()
    #outputs:
    #</''''''\>
    # #tomatoes#
    # --ham--
    # ~salad~
    #<\______/>
    

The order in which you use decorators matters and can change the whole behaviour of your decorated function if they are not executed in the intended order. Suppose you write this:

    @ingredients
    @bread
    def sandwich(food="--ham--"):
        print food
    
    sandwich()
    #outputs:
    ##tomatoes#
    #</''''''\>
    # --ham--
    #<\______/>
    # ~salad~
    

Nobody wants a sandwich with tomato on the top and salad on the bottom. This demonstrates why you should not mix up the arrangement of the decorators; otherwise you'll pay the price. In our case we paid the price by ruining our beautiful sandwich.

I hope you learned something useful from this post! If there's any demand I will cover some more gotchas and features of decorators in the future. Please share your views in the comments below. If you have any suggestions, then please do tell me about them.

You can also follow me on facebook, twitter, or you can send me an email. The links to my social media accounts are at the bottom of the post. Farewell, and don't forget to subscribe to my blog, tweet, and share this post on facebook.

 [2]: http://stackoverflow.com/users/9951/e-satis