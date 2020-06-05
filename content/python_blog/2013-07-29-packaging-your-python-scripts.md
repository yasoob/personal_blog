---
title: Packaging your python scripts.
author: yasoob
type: post
date: 2013-07-29T09:42:38+00:00
url: /2013/07/29/packaging-your-python-scripts/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:6;}s:2:"fb";a:1:{i:4182098;i:518;}s:2:"wp";a:1:{i:0;i:0;}}'
categories:
  - python
tags:
  - distribute
  - distutils
  - packaging
  - pypi
  - scripts
  - setuptools

---
Oh hi there! Welcome to another useful post. This post is going to be about how to package your python scripts and packages for distribution on PyPI or some other place. Here I won't go too deep into explaining everything as most of us just need to know the basics of packaging. However i will provide you with different links for further study. 

Okay lets talk about `setuptools` first. What is it? It's a Python module which allows us to easily package our python scripts and modules for distribution. However there are other packaging libraries as well but here i will talk about setuptools only.

So what should be the basic example to show the usage of setuptools? Here you go. For basic use of setuptools, just import things from setuptools and then look below for the minimal setup script using setuptools.

```
from setuptools import setup, find_packages
setup(
    name = "HelloWorld",
    version = "0.1",
    packages = find_packages(),
)
```

As you see we don't have to specify much in order to use setuptools in a project. Just by doing the above, this project will be able to produce eggs, upload to PyPI, and automatically include all packages in the directory where the setup.py lives. But when you are releasing your projects on PyPI then you should add a bit more information about yourself and this package and if your project relies on some external dependencies then list them there as well. Here is another script which can do all that:

```
from setuptools import setup, find_packages
setup(
    name = "HelloWorld",
    version = "0.1",
    packages = find_packages(),
    scripts = ['say_hello.py'],

    # Project uses reStructuredText, so ensure that the 
    # docutils get installed or upgraded on the target 
    # machine
    install_requires = ['docutils>=0.3'],

    package_data = {
        # If any package contains *.txt or *.rst files,
        # include them:
        '': ['*.txt', '*.rst'],
        # And include any *.msg files found in the 
        # 'hello' package, too:
        'hello': ['*.msg'],
    },

    # metadata for upload to PyPI
    author = "Me",
    author_email = "me@example.com",
    description = "This is an Example Package",
    license = "PSF",
    keywords = "hello world example examples",
    # project home page, if any :
    url = "http://example.com/HelloWorld/",   

    # could also include long_description, download_url,
    # classifiers, etc.
)
```

I hope this is enough for now. However here are some other packaging libraries in case you were wondering :
  
1. Distutils is the standard tool used for packaging. It works rather well for simple needs, but is limited and not trivial to extend.
2. Setuptools is a project born from the desire to fill missing distutils functionality and explore new directions. In some sub-communities, it’s a de facto standard. It uses monkey-patching and magic that is frowned upon by Python core developers.
3. Distribute is a fork of Setuptools that was started by developers feeling that its development pace was too slow and that it was not possible to evolve it. Its development was considerably slowed when distutils2 was started by the same group.
4. Distutils2 is a new distutils library, started as a fork of the distutils codebase, with good ideas taken from setup tools (of which some were thoroughly discussed in PEPs), and a basic installer inspired by pip. Distutils2 did not make the Python 3.3 release, and it was put on hold.

Source: [Stackoverflow](http://stackoverflow.com/questions/6344076/differences-between-distribute-distutils-setuptools-and-distutils2 )

For further study i recommend: http://pythonhosted.org/distribute/setuptools.html