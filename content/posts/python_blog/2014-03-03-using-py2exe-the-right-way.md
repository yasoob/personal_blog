---
title: Using py2exe the right way
author: yasoob
type: post
date: 2014-03-03T11:58:30+00:00
url: /2014/03/03/using-py2exe-the-right-way/
publicize_facebook_url:
  - https://facebook.com/509724922449953_10203416239516609
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/LADPKkb0vb
categories:
  - python
tags:
  - fixing py2exe
  - MSVCP90.dll missing
  - no module named sip
  - py2exe
  - py2exe error
  - pyqt py2exe
  - using py2exe

---

Hi guys how are you? I hope all of you are fine. Recently I was working on a PyQt project. The project was [youtube-dl-GUI](http://github.com/yasoob/youtube-dl-GUI). It is a GUI for the ever popular [youtube-dl](http://github.com/rg3/youtube-dl) project. 

After writing all the code I decided to make an exe in order to ease the deployment of my project on windows. For this purpose I decided to use py2exe which suited best to my needs. However it is necessary to know that py2exe is not the only Python to exe compiler out there. Some of the other popular Python exe makers out there are [pyinstaller][2] and [cx_freeze][3].

These exe makers simply compile our script to bytecode and packages it with a Python execultable so that our program/script can work on those Windows' PC's which don't have Python installed.

However during the exe making process I faced a couple of problems and there was not a single blogpost anywhere dedicated to solving **all** of those problems. In this post I will try to list all of those problems and will also list the solutions which I used to solve those problems.

## `MSVCP90.dll` missing {#msvcp90dllmissing}

The first error which I came across was the `MSVCP90.dll missing` error. I searched on Google and came to know that I needed to install the [Microsoft Visual C++ 2008 Redistributable Package][4] in order to solve the problem. I came to know that it was already installed on my system but I still reinstalled it just to be sure. After reinstallation I tried to run py2exe again but the problem still persisted. After searching endlessly for an hour or so I came forward to a solution. The solution was to search and copy `MSVCP90.dll` from my system folder to Python's DLL folder which in my case was `C:\Python27\DLLs` (it might be different on your system). I applied the solution and _Voila_ it worked.

## No module named sip {#nomodulenamedsip}

Another error I came across while compiling a PyQt4 script was the `ImportError: No module named sip` error. This one was pretty easy to solve. The solution was located on [py2exe website][5]. One solution was to use py2exe like this:

    
    python setup.py py2exe --includes sip
    

The content of the `setup.py` were as follows:

    
    from py2exe.build_exe import py2exe
    from distutils.core import setup
    setup( console=[{"script": "main.py"}] )
    

Another solution was to modify the `setup.py` file like this:

    
    from distutils.core import setup
    import py2exe
    setup(windows=[{"script":"main.py"}], options={"py2exe":{"includes":["sip"]}})
    

And then run py2exe like this:

    
    python setup.py py2exe
    

These solutions solved the problem for me.

## No images displayed in PyQt {#noimagesdisplayedinpyqt}

This solution was again hard to find but however I was able to find it. The solution was to package the PyQt image plugins with the application. I added this in my setup.py file:

    
    DATA=[('imageformats',['C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qjpeg4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qgif4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qico4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qmng4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qsvg4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qtiff4.dll'
        ])]
    setup( 
        #...
        #...
        data_files = DATA,
    )
    

This solved the problem for me.

## Making a single exe {#makingasingleexe}

Previously I use innosetup to make an installer but later I came across another method which allowed me to use py2exe to directly create a bundled exe which could be run by double clicking. In order to achieve this I modified my setup.py file like this:

    
    from distutils.core import setup
    import py2exe, sys, os
    #...
    #...
    setup(
        options = {'py2exe': {'bundle_files': 1, 'compressed': True,"includes":["sip"]}},
        #...
        #...
    )
    

Please note that if you want to make an installer you need to use innosetup or an equivalent.

## Finally {#finally}

After making all those edits I ended up with something like this:

    
    from distutils.core import setup
    import py2exe, sys, os
    
    sys.argv.append('py2exe')
    
    DATA=[('imageformats',['C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qjpeg4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qgif4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qico4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qmng4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qsvg4.dll',
        'C:\\Python27/Lib/site-packages/PyQt4/plugins/imageformats/qtiff4.dll'
        ])]
    
    setup(
        options = {'py2exe': {'bundle_files': 1, 'compressed': True,"includes":["sip"]}},
        windows = [{'script': "main.py"}],
        zipfile = None,
        data_files = DATA,
    )
    

I hope this post allowed you to solve some of your py2exe problems. If you need any further help then comment below, [shoot me an email][6] or [tweet it][7] directly to me.

 [1]: http://yasoob.github.io/beta/using-py2exe-the-right-way/
 [2]: http://www.pyinstaller.org/
 [3]: http://cx-freeze.sourceforge.net/
 [4]: http://www.microsoft.com/downloads/details.aspx?FamilyID=9b2da534-3e03-4391-8a4d-074b9f2bc1bf&displaylang=en
 [5]: http://www.py2exe.org/index.cgi/Py2exeAndPyQt
 [6]: mailto:yasoob.khld@gmail.com
 [7]: https://twitter.com/yasoobkhalid