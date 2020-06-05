---
title: Python dis module and constant folding
author: yasoob
type: post
date: 2019-02-26T05:40:49+00:00
url: /2019/02/26/python-dis-module-and-constant-folding/
timeline_notification:
  - 1551159654
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - bytecode
  - dis module
  - python bytecode disassemble

---
Hi people! Recently, I was super confused when I found out that:  


```
>>> pow(3,89)
```

runs slower than:  


```
>>> 3**89
```

I tried to think of a suitable answer but couldn&#8217;t find any. I timed the execution of both of these statements using the [timeit][1] module in Python3:  

```
$ python3 -m timeit 'pow(3,89)'
500000 loops, best of 5: 688 nsec per loop

$ python3 -m timeit '3**89'
500000 loops, best of 5: 519 nsec per loop
```

The difference is not big. It is only 0.1µs but it was still bugging me. If I can&#8217;t explain something in programming, I usually end up having sleepless nights 😅

I found the answer through the Python IRC channel on Freenode. The reason why _pow_ is slightly slower is that in CPython there is an additional step of loading _pow_ from the namespace. Whereas, in 3**9 there is no such loading required. This also means that the difference will remain more or less constant even if the input numbers get bigger and bigger.

The hypothesis is true:

```
$ python3 -m timeit 'pow(3,9999)'
5000 loops, best of 5: 58.5 usec per loop

$ python3 -m timeit '3**9999'
5000 loops, best of 5: 57.3 usec per loop
```

During the process of exploring the solution to this question I also got to learn about the [dis][2] module. It allows you to decompile the Python Bytecode and inspect it. This was a super exciting discovery mainly because I am learning more about reverse engineering binaries now-a-days and this module fits right in. 

I disassembled the bytecode of the above statements like this in Python:

```
>>> import dis
>>> dis.dis('pow(3,89)')
#  1           0 LOAD_NAME                0 (pow)
#              2 LOAD_CONST               0 (3)
#              4 LOAD_CONST               1 (89)
#              6 CALL_FUNCTION            2
#              8 RETURN_VALUE

>>> dis.dis('3**64')
#  1           0 LOAD_CONST               0 (3433683820292512484657849089281)
#              2 RETURN_VALUE

>>> dis.dis('3**65')
#  1           0 LOAD_CONST               0 (3)
#              2 LOAD_CONST               1 (65)
#              4 BINARY_POWER
#              6 RETURN_VALUE
```

You can learn about how to understand the output of _dis.dis_ by reading [this answer][3] on Stackoverflow

Ok back to the code. The disassembly of _pow_ makes sense. It is loading _pow_ from the namespace and then loading 3 and 89 to registers and finally calling the _pow_ function. But why does the output of the next two disassemblies differ from each other? The only thing we changed is the exponent value from 64 to 65! 

This question introduced me to another new concept of &#8220;[constant folding][4]&#8220;. It just means that when we have a constant expression Python evaluates the value of that expression at compile time so that when you actually run the program it doesn&#8217;t take as long to run because Python uses the already computed value. Think of it like this:

```
def one_plue_one():
    return 1+1

# --vs--

def one_plue_one():
    return 2
```

Python compiles the first function to the second one and uses that when you run the code. Neat, eh? 

So why is constant folding working for 3\*\*64 and not 3\*\*65? Well, I don&#8217;t know. This probably has something to do with a limit to how many powers the system has pre-computed in memory. I can be totally wrong. The next step in my mind is to dabble in the Python source code in my free time and try to figure out what is happening. **I am still trying to figure out an answer for this so if you have any suggestions please drop them in the comments section below.** 

What I want you to take away from this post is that you should seek solutions to basic questions. You never know where the answers will lead you. You might end up learning something entirely new (like I just did)! I hope you guys keep this flame of curiosity burning. See you later 🙂 

PS: If you want to learn more about Python Bytecode and how to play around with it, someone (njs on #python) suggested me [this talk][5]. I personally haven&#8217;t watched it but I probably will once I get some free time.

 [1]: https://docs.python.org/3/library/timeit.html
 [2]: https://docs.python.org/3/library/dis.html#dis.dis
 [3]: https://stackoverflow.com/questions/12673074/how-should-i-understand-the-output-of-dis-dis
 [4]: https://www.wikiwand.com/en/Constant_folding
 [5]: https://www.youtube.com/watch?v=mxjv9KqzwjI