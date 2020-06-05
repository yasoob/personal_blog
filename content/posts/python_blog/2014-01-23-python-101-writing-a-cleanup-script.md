---
title: 'Python 101: Writing a cleanup script'
author: yasoob
type: post
date: 2014-01-23T16:58:47+00:00
url: /2014/01/23/python-101-writing-a-cleanup-script/
publicize_facebook_url:
  - https://facebook.com/509724922449953_10203125756654719
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/HvarIG89Pn
categories:
  - python
tags:
  - cleanup script
  - deleting files with python
  - python cleanup script
  - python delete
  - python file delete

---
So hi there guys! I hope you are fine. So what is in this post? Today we will be writing a cleanup script. The idea for this post came from [Mike Driscol][1] who recently wrote a very useful post about writing a cleanup script in python. So how is my post different from his post? In my post I will be using `path.py`. When I used `path.py` for the first time I just fell in love with it. 

## Installing path.py {#installingpathpy}

So there are several ways for installing path.py. Path.py may be installed using setuptools or distribute or pip:
  
```
easy_install path.py
```
  
The latest release is always updated to the [Python Package Index][2]. The source code is hosted on [Github][3].

## Finding the number of files in a directory {#findingthenumberoffilesinadirectory}

So our first task is to find the number of files present in a directory. In this example we will not iterate over subdirectories instead we will just count the number of files present in the top level directory. This one is simple. Here is my solution:

    from path import path
    d = path(DIRECTORY) 
    #Replace DIRECTORY with your required directory
    num_files = len(d.files())
    
    print num_files
    

In this script we first of all imported the path module. Then we set the `num_file` variable to 0. This variable is going to keep count for the number of files in our directory. Then we call the path function with a directory name. Firthermore we iterate over the files present in the root of our directory and increment the `num_files` variable. Finally we print the value of `num_files` variable. Here is a litle bit modified version of this script which outputs the number of subdirectories present in the root of our directory. 

    from path import path
    d = path(DIRECTORY) 
    #Replace DIRECTORY with your required directory
    num_dirs = len(d.dirs())
    
    print num_dirs 
    
## Finding the number of files recursively in a directory {#findingthenumberoffilesrecursivelyinadirectory}

That was easy! Wasn't it? So now our work is to find the number of files recursively in a directory. In order to acomplish this task we are given the `walk()` method by `path.py`. This is the same as `os.walk()`. So lets write a simple script for recursively listing all files in a directory and its subdirectories in Python.

    from path import path
    file_count = 0
    dir_count = 0
    total = 0
    d = path(DIRECTORY)
    #Replace DIRECTORY with your required directory
    for i in d.walk():
        if i.isfile():
            file_count += 1
        elif i.isdir():
            dir_count += 1
        else:
            pass
        total += 1
    
    print "Total number of files == {0}".format(file_count)
    print "Total number of directories == {0}".format(dir_count)
    

That was again very easy. Now what if we want to pretty print the directory names? I know there are some terminal one-liners but here we are talking about Python only. Lets see how we can achieve that.

    files_loc = {}
    file_count = 0
    dir_count = 0
    total = 0
    for i in d.walk():
        if i.isfile():
            if i.dirname().basename() in files_loc:
                files_loc[i.dirname().basename()].append(i.basename())
            else:
                files_loc[i.dirname().basename()] = []
                files_loc[i.dirname().basename()].append(i.basename())
            file_count += 1
        elif i.isdir():
            dir_count += 1
        else:
            pass
        total += 1
    
    for i in files_loc:
        print "|---"+i
        for i in files_loc[i]:
            print "|   |"
            print "|   `---"+i
        print "|"
    

There is nothing fancy here. In this script we are just pretty printing a directory and the files it contains. Now lets continue.

## Deleting a specific file from a directory {#deletingaspecificfilefromadirectory}

So lets suppose we have a file called `this_file_sucks.py`. Now how do we delete it. Let’s make this scenario more real by saying that we do not know in which directory it is placed. Its simple to solve this problem as well. Just go to the top level directory and execute this script:

    from path import path
    d = path(DIRECTORY)
    #replace directory with your desired directory
    for i in d.walk():
        if i.isfile():
            if i.name == 'php.py':
                i.remove()
    

In the above script I did not implement any logging and error handling. That is left as an exercise for the reader. 

## Deleting files based on their extension {#deletingfilesbasedontheirextension}

Just suppose you want to remove all the '.pyc' files from the directory. How would you go about dealing with this problem. Here is a solution which I came up with in `path.py`.

    from path import path
    d = path(DIRECTORY)
    files = d.walkfiles("*.pyc")
    for file in files:
        file.remove()
        print "Removed {} file".format(file)
    

This will also print the name of the file which is deleted.

## Deleting files based on their size {#deletingfilesbasedontheirsize}

So another interesting scenario. What if we want to delete those files which exceed 5Mb size?
  
**NOTE:** There is a difference between Mb and MB. I will be covering Mb here. 
  
Is it possible with `path.py`? Yes it is! So here is a script which does this work:

    d = path('./')
    del_size = 4522420
    for i in d.walk():
        if i.isfile():
            if i.size > del_size:
            #4522420 is approximately equal to 4.1Mb
            #Change it to your desired size
                i.remove()
    

So we saw how we can remove files based on their size.

## Deleting files based on their last access time {#deletingfilesbasedontheirlastaccesstime}

In this part we will take a look on how to delete files based on their last access time. I have written the code below to achieve this target. Just change the number of days to anything you like. This script will remove the files which were last modified before the `DAYS` variable.

    from path import path
    import time
    
    #Change the DAYS to your liking
    DAYS = 6
    removed = 0
    d = path(DIRECTORY)
    #Replace DIRECTORY with your required directory
    time_in_secs = time.time() - (DAYS * 24 * 60 * 60)
    
    for i in d.walk():
        if i.isfile():
            if i.mtime <= time_in_secs:
                i.remove()
                removed += 1
    
    print removed
    

So we have also learned how to remove files based on their last modified time. If you want to delete files based on last access time just change `i.mtime` to `i.atime` and you will be good to go.

## Goodbye {#goodbye}

So that was it. I hope you liked the post. In the end I would like to make a public apology that my English is not good so you may find some grammar mistakes. You are requested to email them to me so that I can improve my English. If you liked this post then don't forget to follow me on [twitter][4] and [facebook][5]. A retweet won't hurt either! If you want to send me a pm then use [this][6] email.

 [1]: http://www.blog.pythonlibrary.org/2013/11/14/python-101-how-to-write-a-cleanup-script/
 [2]: http://pypi.python.org/pypi/path.py
 [3]: https://github.com/jaraco/path.py
 [4]: http://twitter.com/yasoobkhalid
 [5]: https://www.facebook.com/freepythontips
 [6]: mailto:yasoob.khld@gmail.com