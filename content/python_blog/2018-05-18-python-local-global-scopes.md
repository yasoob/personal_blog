---
title: Python local/global scopes
author: yasoob
type: post
date: 2018-05-18T20:47:14+00:00
url: /2018/05/18/python-local-global-scopes/
timeline_notification:
  - 1526676438
publicize_twitter_user:
  - yasoobkhalid
publicize_linkedin_url:
  - 'https://www.linkedin.com/updates?discuss=&scope=327033389&stype=M&topic=6403345100499361793&type=U&a=Rjg1'
categories:
  - python
tags:
  - global
  - global scope
  - gobal python
  - local scope
  - python scopes
  - python variables

---
How’s everyone? I am back with another tip/gotcha which might trip beginner programmers. This one relates to Python scopes so if you are already familiar with them then this article might not be very informative for you. If you are not very well versed in Python scopes then keep reading.

Lets start with a code sample. Save the following code in a file and run it:

    command = "You are a LOVELY person!"
    
    def shout():
        print(command)
    
    shout()
    print(command)
    

Output:

    You are a LOVELY person!
    You are a LOVELY person!
    

Perfect. Working as expected. Now modify it a bit and run the modified code:

    command = "You are a LOVELY person!"
    
    def shout():
        command = "HI!"
        print(command)
    
    shout()
    print(command)
    

Output:

    HI!
    You are a LOVELY person!
    

Amazing! Still working fine. Now modify it a tad bit more and run the new code:

    command = "You are a LOVELY person!"
    
    def shout():
        command = "HI!"
        print(command)
        command = "You are amazing!!"
    
    shout()
    print(command)
    

Output:

    HI!
    You are a LOVELY person!
    

Umm the output is not as intuitively expected but lets make one last change before we discuss it:

    command = "You are a LOVELY person!"
    
    def shout():
        print(command)
        command = "You are amazing!!"
    
    shout()
    print(command)
    

Output:

    Traceback (most recent call last):
      File "prog.py", line 8, in <module>
        shout()
      File "prog.py", line 4, in shout
        print(command)
    UnboundLocalError: local variable 'command' referenced before assignment
    

Woah! What’s that? We do have command declared and initialised in the very first line of our file. This might stump a lot of beginner Python programmers. Once I was also confused about what was happening. However, if you are aware of how Python handles variable scopes then this shouldn’t be new for you.

In the last example which worked fine, a lot of beginners might have expected the output to be:

    HI!
    You are amazing!!
    

The reason for expecting that output is simple. We are modifying the `command` variable and giving it the value “You are amazing!!” within the function. It doesn’t work as expected because we are modifying the value of `command` in the scope of the `shout` function. The modification stays within that function. As soon as we get out of that function into the `global` scope, `command` points to its previous `global` value.

When we are accessing the value of a variable within a function and that variable is not defined in that function, Python assumes that we want to access the value of a global variable with that name. That is why this piece of code works:

    command = "You are a LOVELY person!"
    
    def shout():
        print(command)
    
    shout()
    print(command)
    

However, if we modify the value of the variable or change its assignment in an ambiguous way, Python gives us an error. Look at this previous code:

    command = "You are a LOVELY person!"
    
    def shout():
        print(command)
        command = "You are amazing!!"
    
    shout()
    print(command)
    

The problem arises when Python searches for `command` in the scope of `shout` and finds it declared and initialized AFTER we are trying to print its value. At that moment, Python doesn’t know which `command`&#8216;s value we want to print.

We can fix this problem by explicitly telling Python that we want to print the value of the global `command` and we want to edit that global variable. Edit your code like this:

    command = "You are a LOVELY person!"
    
    def shout():
        global command
        print(command)
        command = "You are amazing!!"
    
    shout()
    print(command)

Output:

    You are a LOVELY person!
    You are amazing!!
    

Normally, I try as much as possible to stay away from global variables because if you aren’t careful then your code might give you unexpected outputs. Only use global when you know that you can’t get away with using return values and class variables.

Now, you might ask yourself why does Python “assume” that we are referring to the global variable instead of throwing an error whenever a variable isn’t defined in the function scope? Python docs give a beautiful explanation:

> **What are the rules for local and global variables in Python?**
> 
> In Python, variables that are only referenced inside a function are implicitly global. If a variable is assigned a value anywhere within the function’s body, it’s assumed to be a local unless explicitly declared as global.
> 
> Though a bit surprising at first, a moment’s consideration explains this. On one hand, requiring global for assigned variables provides a bar against unintended side-effects. On the other hand, if global was required for all global references, you’d be using global all the time. You’d have to declare as global every reference to a built-in function or to a component of an imported module. This clutter would defeat the usefulness of the global declaration for identifying side-effects.
> 
> Source: <https://docs.python.org/3/faq/programming.html#what-are-the-rules-for-local-and-global-variables-in-python>

I hope this was informative for you. Let me know if you have ever faced this issue before in the comments below.

&nbsp;