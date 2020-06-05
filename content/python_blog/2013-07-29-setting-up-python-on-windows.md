---
title: Setting up python on windows
author: yasoob
type: post
date: 2013-07-29T11:44:11+00:00
url: /2013/07/29/setting-up-python-on-windows/
publicize_twitter_user:
  - yasoobkhalid
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-29 11:44:11";}'
categories:
  - python
tags:
  - download
  - path variable
  - setting up python
  - setuptools
  - windows

---
Hi there pythonistas. Most of the new python programmers don't know how to correctly install python on windows. Today I am going to share clean and clear instructions on how to install python on a Windows 7 machine. There are only 4 steps involved so without wasting a minute lets get started.

1. Visit the official Python [download page](http://python.org/download/) and grab the Windows installer. Choose the 32-bit version. (A 64-bit version is available, but there are compatibility issues with some modules you may want to install later.) 
**Note:** Python currently exists in two versions. One is 2.xx version and the other is 3.xx version. In this post i am going to focus only on 2.xx version as it is more widely used right now and some modules don't support 3.xx version as yet. 
2. Run the installer and accept all the default settings. Don't change the default directory it creates. 
3. Now comes the trickiest part. We have to add python to our environment variable. You do not have to understand what environment variable is. Just follow along with me. We set the system’s PATH variable to include directories that include Python components and packages so that they are available in the command prompt. Without doing this we won't be able to use python from command line. To do this:


- Right-click Computer and select Properties.
- In the dialog box, select Advanced System Settings.
- In the next dialog, select Environment Variables.
- In the User Variables section, edit the PATH statement to include this:

```
C:\Python27;C:\Python27\Lib\site-packages\;C:\Python27\Scripts\;
```

4. Now, you can open a command prompt (Start Menu|Accessories or Start Menu|Run|cmd) and type:

```
python
```

That will load the Python interpreter:

```
Python 2.7.3  (default, Apr 10 2012, 14:24) [MSC v.1500 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or license for more information.
>>>
```
  
Just because of the changes that you did to the path variable you are now able to use python from command prompt. Now press Control-Z to exit the interpreter and get back to a C: prompt. 

Till now the the installation of python is complete but you may want to install [setuptools](http://pypi.python.org/pypi/setuptools) which offers the helpful `easy_install` utility for installing Python packages. Grab the appropriate version for your system and install and that's it for now. Stay tuned for the next post.