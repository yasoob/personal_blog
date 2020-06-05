---
title: Packaging and distributing your python libraries
author: yasoob
type: post
date: 2013-08-01T09:51:08+00:00
url: /2013/08/01/packaging-and-distributing-your-python-libraries/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:7;}s:2:"fb";a:1:{i:4182098;i:15;}s:2:"wp";a:1:{i:0;i:4;}}'
categories:
  - python
tags:
  - distribute
  - packages
  - python libraries
  - uploading

---
Hi there fellow coders. This post will go over the basics of packaging and deploying your python libraries. So without wasting a minute lets get started..

## Folder structure

So first thing first. What should be your folder structure? At minimum you can have only two files. The first one should be the [setup.py file][1] and the second one should be your module file. But today I am not going to talk about the very basics. Today we are going to follow this folder structure:

```
My_module/
    LICENSE.txt
    README.txt
    setup.py
    My_module/
        <a href="http://freepythontips.wordpress.com/2013/07/28/what-is-__init__-py/">__init__.py</a>
```

Here I have 4 files. The License file contains the license under which you want to distribute your module. So lets move on. What should be our second step? Obviously it should be to describe our module and write some meta data into the setup.py file.

## Describing your module

The setup.py file is the heart of any python module or library. It describes the module and lists some other useful info about the module like it lists any dependencies on which a module depends and it also tells distutils where to find the necessary scripts of this module. So lets describe our module with the help of our setup.py file.

```
from distutils.core import setup

setup(
    name='My super module',
    version='0.1dev',
    packages=['My_module',],
    license='Creative Commons Attribution-Noncommercial-Share Alike license',
    long_description=open('README.txt').read(),
)
```

Here we could have rewritten the long_description ourselves but we reused our README file. We wrote 'dev' in the version because we still do not have anything in our module but we are moving toward the 0.1 release. When you have enough code in your module then feel free to drop 'dev' from the version field. Now the next step is to make our first release.

## Making your first release

So how do we make our first release? Just follow me. Your release should have a single archive file. It can be easily made with this command. 

```
$ python setup.py sdist
```

Just go to the root of your module folder and execute this command. It will create a subdirectory with the name of dist and will package all of your module scripts and other files into a single archive file ready to be uploaded on PyPI (Python Package Index). This archive file will have the default extension of `zip` on windows and `tar.gz` on POSIX systems.

## Publishing your module

Now that archive file can be uploaded anywhere for distribution but we will focus on PyPI. In order to upload on PyPI you will first have to make an account on http://pypi.python.org/pypi. After that you will have to register your package on PyPI like this:

```
$ cd path/to/My_module
$ python setup.py register
```

Just use your existing login. Afte that run the following command to upload it to PyPI.

```
$ python setup.py sdist upload
```

This will make the distribution one time more and will upload it to PyPI. Now you should be proud of yourself because you have just contributed to the opensource world. I hope you liked my post. If you want to read about setup.py then go [here][1]. For further study i recommend the [Hichhikers guide to packaging][2]. I hope you liked today's post. Do share your views in the comments below and stay tuned for the next post.

 [1]: http://freepythontips.wordpress.com/2013/07/29/packaging-your-python-scripts/
 [2]: http://guide.python-distribute.org/index.html