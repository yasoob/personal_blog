---
title: 4 Command-line tools for more Python productivity
author: yasoob
type: post
date: 2015-06-20T21:02:19+00:00
url: /2015/06/21/4-command-line-tools-for-more-python-productivity/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - autoenv
  - cookiecutter
  - improve python
  - increase productivity
  - ipython
  - productivity
  - smartcd

---
Hi there folks. In this post I would be sharing a couple of command-line tools which can help to increase your python productivity. These tools have helped me a lot and might help you as well! This post is inspired by <a href="http://stevenloria.com/three-command-line-tools-for-productive-python-development/" target="_blank" rel="noopener noreferrer">another post</a>.

1. ## IPython

IPython is the Python REPL on steroids. It has some really nice editions on top of the standard REPL. I am sure that if you use it once you will fall in love with it. The easiest way to install IPython is using pip:

```
$ pip install ipython
```

Now you can use it by typing this in your terminal:

```
$ ipython
```

You can read more about the nice features and tricks of IPython <a href="http://blog.endpoint.com/2015/06/ipython-tips-and-tricks.html" target="_blank" rel="noopener noreferrer">over here</a>.

You can also automatically import modules when you enter the Python or IPython interpreter. <a href="https://stackoverflow.com/questions/11124578/automatically-import-modules-when-entering-the-python-or-ipython-interpreter" target="_blank" rel="noopener noreferrer">Here</a> is the Stackoverflow link which shows you how to do it.

<a href="http://ipython.org/index.html" target="_blank" rel="noopener noreferrer">more information.</a>

2. ## Autoenv

This is a simple tool built by Kenneth Reitz. It allows you to automatically activate your projects virtual environment.

You can install it using pip:

```
$ pip install autoenv
```

You can also use git:

```
$ git clone git://github.com/kennethreitz/autoenv.git ~/.autoenv
$ echo 'source ~/.autoenv/activate.sh' >> ~/.bashrc
```

And if you are on Mac OSX then Homebrew is also an option:

```
$ brew install autoenv
$ echo 'source /usr/local/opt/autoenv/activate.sh' >> ~/.bash_profile
```

What you have to do is make a file with the name of `.env` in your projects directory. The contents of that file will be somewhat like this:

```
# .env
source env/bin/activate
```

This is the command which you use to activate your virtual environment. It might be different for you. For instance if you use virtualenvwrapper then it would be something like this:

```
workon project
```

You can also use <a href="https://github.com/cxreg/smartcd" target="_blank" rel="noopener noreferrer">smartcd</a> for more control and power. I have used it in the past.

<a href="https://github.com/kennethreitz/autoenv" target="_blank" rel="noopener noreferrer">more information.</a>

3. ## Cookie Cutter

You can use Cookie Cutter to make project boilerplates and then quickly start new projects based on those boilerplates. It is extremely useful and I have used it countless times. Currently there are a lot of Python project templates <a href="https://github.com/audreyr/cookiecutter#python" target="_blank" rel="noopener noreferrer">on GitHub</a> which use Cookie Cutter.

You can install it using pip:

```
$ pip install cookiecutter
```

Now you can simply clone Cookie Cutter templates on GitHub using it:

```
$ cookiecutter https://github.com/JackStouffer/cookiecutter-Flask-Foundation.git
```

Now answer a couple of questions and your project is good to go!

<a href="https://github.com/audreyr/cookiecutter" target="_blank" rel="noopener noreferrer">more information.</a>

4. ## Bash Git Prompt

This is not strictly Python related. It is a `bash` prompt that displays information about the current git repository. In particular the branch name, difference with remote branch, number of files staged, changed, etc.

You can install it using git:

```
cd ~ 
git clone https://github.com/magicmonty/bash-git-prompt.git .bash-git-prompt
```

This tool can help you a lot if you are a regular git user. It saves you countless minutes if not hours.

<a href="https://github.com/magicmonty/bash-git-prompt" target="_blank" rel="noopener noreferrer">more information.</a>

I would also like to remind you that I have started a Python newsletter which lists curated articles and news regarding Python and it's community. You can signup <a href="http://newsletter.pythontips.com" target="_blank" rel="noopener noreferrer">over here!</a>

Which tools do you use for increasing your Python productivity? Share them with me in the comments section below!