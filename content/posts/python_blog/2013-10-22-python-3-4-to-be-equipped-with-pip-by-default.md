---
title: Python 3.4 to be equipped with pip by default
author: yasoob
type: post
date: 2013-10-22T16:59:27+00:00
url: /2013/10/22/python-3-4-to-be-equipped-with-pip-by-default/
publicize_facebook_url:
  - https://facebook.com/509724922449953_556081187814326
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/IJYiLUOghg
categories:
  - python
tags:
  - acceptance
  - news
  - PEP
  - pep 453
  - pip

---
Hi there Pythonistas. A news has arrived that **pip** will be available by default with python 3.4. [PEP 453][1] which was "Explicit bootstrapping of pip in Python installations" has been accepted. Python 3.4 which has entered into the beta phase after the release of final alpha will have pip by default. If you are new to python then you might be wondering what pip is ? Pip is a tool for installing and managing Python packages. Previously easy_install has been the most used package manager. 

_Easy_Install_ is a python module (`easy_install`) bundled with `setuptools` that lets you automatically download, build, install, and manage Python packages but has a lot of weak points in front of pip. In order to use pip you first have to install it by using _easy_install_. Why pip is better:

  * The command is simpler, shorter
  * First-class support of virtualenv
  * More commands than just `install`, including `uninstall`. `pip bundle`, `pip freeze` and `pip search` are pretty nice as well.
  * Can install from a VCS (via `-e`), or from source
  * Requirements files are easy to use, clearly describes what happens in its process
  * If it can not download all the dependencies, it will not install anything (though I don't think it rolls stuff back if an installation fails

I hope you are as much happy as I am with the acceptance of this PEP. Do share your views in the comments below and don't forget to share this post and follow this blog in order to get the latest news relating with the python world.

 [1]: http://www.python.org/dev/peps/pep-0453/