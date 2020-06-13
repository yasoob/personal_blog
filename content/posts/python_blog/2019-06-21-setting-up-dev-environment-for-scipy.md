---
title: Setting up dev environment for SciPy
author: yasoob
type: post
date: 2019-06-21T21:03:25+00:00
url: /2019/06/21/setting-up-dev-environment-for-scipy/
timeline_notification:
  - 1561151010
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - dependencies
  - develop package
  - library develop
  - numpy
  - scipy
  - setup.py develop
teaser: 'Someone recently reached out and asked me how to setup a dev environment for SciPy. Read this article to find out how.'
---
Hi everyone! 👋

I got an email from someone pretty recently who wanted to setup a dev environment for SciPy. He had made changes to the source code of SciPy and now wanted to test if his changes were working or not. He had gotten so far without actually testing the code. In this post I will share details on how to setup a dev environment the right way. I will focus mainly on Mac OS.

Firstly, go to the GitHub repo and try to figure out the dependencies for the project. Normally they are listed in the readme file. If they are not listed there then you just try installing the package/libary and the errors in the terminal will give you a clue as to what you are missing. I did that and figured out that I needed Fortran compiler, [Cython][1] and [NumPy][2].

## <a id="Installing_dependencies_4"></a>Installing dependencies:

Let’s start with Fortran:

    brew install gcc
    

Now create a new folder and setup a virtualenv there:

    mkdir ~/dev
    cd ~/dev
    python -m venv env
    

Activate the virtualenv:

    source env/bin/activate
    

Now install Cython and NumPy:

    pip install cython
    pip install numpy
    

Now clone SciPy:

    git clone git@github.com:scipy/scipy.git
    

And finally install SciPy in development mode:

    cd scipy
    python setup.py develop
    

Normally if you are installing a Python package using the `setup.py` file, you use `python setup.py install`. This copies the code into the site-packages directory. After that if you make any changes to the source code of the package, you need to run `python setup.py install` each time.

The difference between that and `python setup.py develop` is that in the later case Python does not copy the code to site-packages. It uses the code from that development folder directly whenever you import the package. This way if you make any changes to the package you don’t need to run `python setup.py install` or `python setup.py develop`.

After you are done with the development you can safely type `deactivate` and this will turn off the virtualenv.

You can read more about virtualenv on [Real Python][3]. I hope someone out there in the same boat as one of my other readers finds this helpful.

Have a good day! ❤️

 [1]: https://cython.org
 [2]: https://github.com/numpy/numpy
 [3]: https://realpython.com/python-virtual-environments-a-primer/