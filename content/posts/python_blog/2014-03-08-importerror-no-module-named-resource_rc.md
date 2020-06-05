---
title: 'ImportError: No module named resource_rc'
author: yasoob
type: post
date: 2014-03-07T19:40:23+00:00
url: /2014/03/08/importerror-no-module-named-resource_rc/
publicize_facebook_url:
  - https://facebook.com/509724922449953_10203448091392886
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/TQ2S0qYmJN
categories:
  - python
tags:
  - .qrc
  - gui python
  - 'ImportError: No module named resource_rc'
  - pyqt
  - pyqt4
  - resource_rc

---
Hi there folks. How are you? Recently I was using Qt Designer to design a GUI for one of my apps. After doing all the designing I saved my ui file and ran pyuic4 over it. Everything worked fine and I had a Python ui file created in my system. But when I tried to run the Python ui file I was confronted with an error. It read something like this:
  
```
ImportError: No module named resource_rc
```
  
So what was the problem? After doing some research I saw that a resource_rc file was referenced in my Python ui file but I was not able to find that `resource_rc` file anywhere in my system. But there was a `.qrc` file which I had not noticed before.
  
After searching a little I came to know that the `.qrc` file was a resource file of the Qt Designer. At that moment I came to know what the problem was. I had not converted the `.qrc` file into Python. The problem was hard to find because there was not a single helpful error which clearly stated that I had not converted the resource file into Python. I solved the problem by running this command:

```
pyrcc4 -o App/ui/resources_rc.py App/resources.qrc
```    

The above command runs the PyQt resource compiler which was already installed with PyQt4 on my Ubuntu laptop. pyrcc4 then compiles the resource file into Python which can easily be imported and used in Python. That solution solved my problem.

So that was it. I hope that this post was helpful for you. In order to stay updated with my future posts then don't forget to follow me on [Twitter][1], [Facebook][2] and this blog. Stay tuned for my next post which is going to be a book giveaway. Goodbye!

 [1]: https://twitter.com/yasoobkhalid
 [2]: https://www.facebook.com/freepythontips