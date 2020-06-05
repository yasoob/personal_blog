---
title: The with statement
author: yasoob
type: post
date: 2013-07-28T10:23:14+00:00
url: /2013/07/28/the-with-statement/
categories:
  - python
tags:
  - with
  - with statement

---
So the chances are that you already know about the with statement but some of us do not know about it. Lets face the reality the with statement saves us a lot of time and reduces our code base. Just imagine you are opening a file width python and then saving something to it. You would normally do:

```
file = open('file.txt','w')
file.write("freepythontips.wordpress.com")
file.close()
```

But what if an exception occurs while writing to file ? then the file won't be closed properly. I know how much trouble it can cause. It once happened with me that i was running a web scrapper and it was running for past three hours and then unexpectedly an exception occured and my whole csv file got corrupted and i had to run the scrapper again. 

So lets come to the point. What method can you adopt to prevent such disaster. Obviously you can not prevent the exception when it is unexpected but you can take some precautions. Firstly you can wrap up your code in a try-except clause or better yet you can use a with statement. Let's first talk about try-except clause. You would normally do something like this:

```
try:
    file = open('file.txt','w')
    file.write(data)
except:
    # do something in case of an exception
finally:
    # here comes the trick. The finally clause gets 
    # executed even if an exception occured in try 
    # or except clause. now we can safely close this
    # file.
    file.close()
```

Now lets talk about the with statement. While using a with statement you would normally do:

```
with open('file.txt','w') as file:
    file.write(data)
```

Okay so here while using the with statement we do not have to close the file explicitly. It is automatically closed after the data is written to the file. 

Do share your views about this post below in the comments.