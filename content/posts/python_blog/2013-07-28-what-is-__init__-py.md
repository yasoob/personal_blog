---
title: What is __init__.py ?
author: yasoob
type: post
date: 2013-07-28T11:00:30+00:00
url: /2013/07/28/what-is-__init__-py/
publicize_twitter_user:
  - yasoobkhalid
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-28 11:08:47";}'
categories:
  - python
tags:
  - __init__.py
  - programming

---
Okay yet another useful post. This post is really important and useful for anyone just starting out with python. So what is the `__init__.py` file ?

Files name `__init__.py` are used to mark directories on disk as Python package directories. If you have the following files:

```
mydir/spam/__init__.py
mydir/spam/module.py
```

and `mydir` is on your path, you can import the code in `module.py` as

```
import spam.module
```

or

```
from spam import module
```

If you remove the `__init__.py` file, Python will no longer look for submodules inside that directory, so attempts to import the module will fail.

The `__init__.py` file is usually empty, but can be used to export selected portions of the package under more convenient name, hold convenience functions, etc. Given the example above, the contents of the init module can be accessed as

```
import spam
```

And finally here is what the official [documentation](http://docs.python.org/tutorial/modules.html#packages) has to say about this file:

    
> The `__init__.py` files are required to make Python treat the directories as containing packages; this is done to prevent directories with a common name, such as string, from unintentionally hiding valid modules that occur later on the module search path. In the simplest case, `__init__.py` can just be an empty file, but it can also execute initialization code for the package or set the `__all__` variable, described later.
    
    

Source : http://effbot.org/pyfaq/what-is-init-py-used-for.htm
