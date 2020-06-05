---
title: Python for Scientists
author: yasoob
type: post
date: 2016-01-06T17:58:39+00:00
url: /2016/01/06/python-for-scientists/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - python for scientists
  - python tutorial
  - science python
  - scientific python
  - scipy

---
_**This is a guest post by Brian David Hall from [codenhance.com][1]. He develops tutorials and resources to help scientists learn to code, including his latest Kickstarter project, [Learn the Command Line &#8230; for Science!][2]**_

Spoiler alert: in this post, I will argue that Python is the best programming language for scientists to learn. Forget Perl, Java, FORTRAN, IDL, or whatever else they were pushing when you got your degree. This type of discussion is usually emotionally charged – many a flame war has been fought over programming languages. Feelings will get hurt. Heads will roll. But first …

## Do scientists even need to learn to program? {#do-scientists-even-need-to-learn-to-program}

No. Not necessarily. As counseled by Jeff Atwood in [“Please Don’t Learn to Code”][3], it’s better to focus on solutions rather than methods. A scientist who already has a love-hate-but-mostly-hate relationship with computers would do better to leave the programming to the programmers. This way, the code gets written, the research gets completed, and the scientist herself never has to debug a single syntax error.

That said, scientists who _are_ prepared and motivated to add programming to their skillset couldn’t ask for a better language than Python. This post will outline some of the advantages of learning Python and some resources for getting started. But first …

## Does it even matter what language you learn? {#does-it-even-matter-what-language-you-learn}

No. Not necessarily. Most experienced programmers are proficient in several languages, and are able to become productive in a new language over the course of a long weekend. Obviously there’s more to learning programming than memorizing the syntax of a single language. That said, Python offers a number of distinct advantage to the beginner.

## The universe wants you to learn Python {#the-universe-wants-you-to-learn-python}

One of the greatest strengths of Python is the vibrant community and wealth of high quality training materials available. Want to try Python out without installing anything, just to get a feel for it? [Codecademy][4] has you covered. Would you rather watch video lectures and follow a semester format? [Coursera][5] has a free course that lets you do just that.

Suppose you’re more of a textbook learner. You’ve got a ton of options, including:

  * [Learn Python the Hard Way][6], which takes you from zero to the beginnings of a web game
  * [Python for Informatics][7], which takes beginners all the way to topics like using databases and visualizing data
  * [Automate the Boring Stuff with Python][8], which focuses on the kind of practical, repetitive tasks that scientific computing so frequently requires
  * [Intermediate Python][9], a great resource for anyone who’s ready to move past the basics and learn some of Python’s more powerful features

Even better, all of these texts are free to read online.

## The universe wants you to be productive in Python {#the-universe-wants-you-to-be-productive-in-python}

It’s not just the learning materials that make Python such a great choice for scientists learning to code. There’s also a wealth of free packages, tools, and documentation for every field of science you can imagine.

For astronomers, there’s Astropy, which contains modules for astronomical [constants][10], [coordinate systems][11], [model fitting][12], and more. As an example, here’s a script that downloads a [FITS][13] file containing spectral data on the [Horsehead Nebula][14] and plots it. Five imports and five lines of code are all it takes:

```
import numpy as np
import matplotlib
import matplotlib.pyplot as plt

from astropy.utils.data import download_file
from astropy.io import fits

image_file = download_file(
        'http://data.astropy.org/tutorials/FITS-images/HorseHead.fits', 
         cache=True)
image_data = fits.getdata(image_file)

plt.imshow(image_data, cmap='gray')
plt.colorbar()
plt.show()
```

Here’s what the image looks like:

![Horsehead Nebula](/wp-content/uploads/2016/08/horsehead_nebula.png)

The full tutorial is [here][15] if you want to do more!

For biologists, there’s [Biopython][16]. Want to [read genetic sequence data][17]? [Parse BLAST output][18]? [Read from a protein database][19]? [Produce a random genome][20]? Biopython’s got you covered.

There are also a number of tools that are useful for all scientists, regardless of their specific field. Machine learning touches nearly every data-driven scientific discipline, and of course you can do it with Python – just take a look at the beautiful documentation for the [scikit-learn][20] package. Need to produce publication-quality visualizations? You’re guaranteed to find a walkthrough for the chart you need in the thoroughly-documented [Bokeh][21] library.

## The universe will thank you for using Python {#the-universe-will-thank-you-for-using-python}

Python is an open source language*, and so are the libraries mentioned above. As a scientist, this should matter to you. Using open source tools that are widely available is a great way to ensure that your experiments are easily reproducible.

Compare this with the experience of a researcher who would like to extend your experiment, but must first purchase an expensive license in order to recreate your programming environment. This is exactly the case in much of astronomy, with many legacy projects locked into the proprietary IDL language. Working astronomers are largely migrating to Python in order to facilitate collaboration. It’s the future!

## Everyone else is doing it {#everyone-else-is-doing-it}

Python’s already in use at Google, NASA, the National Weather Service, even the Los Alamos National Laboratory (LANL) Theoretical Physics Division (longer list [here][22]). Not to mention nearly a million projects on [GitHub][23]. This means that the strengths mentioned above – the high quality training materials, useful libraries, and active community – will only grow with time. By embracing Python, a scientist enters into a movement toward openness and simplicity in computational science that is already changing the world around us. If you’re a scientist looking to learn how to code, I’d love to hear from you in the comments. What’s the nature of your research? What will learning Python allow you to do? How can I help you get started?

*Technically an open source _implementation_ of a language.

 [1]: http://codenhance.com
 [2]: http://kck.st/1R7BOIn
 [3]: http://blog.codinghorror.com/please-dont-learn-to-code/
 [4]: https://www.codecademy.com/learn/python
 [5]: https://www.coursera.org/learn/python
 [6]: http://learnpythonthehardway.org/
 [7]: http://pythonlearn.com/book.php
 [8]: https://automatetheboringstuff.com/
 [9]: http://book.pythontips.com/en/latest/
 [10]: http://docs.astropy.org/en/stable/constants/index.html
 [11]: http://docs.astropy.org/en/stable/coordinates/index.html
 [12]: http://docs.astropy.org/en/stable/modeling/index.html
 [13]: https://en.wikipedia.org/wiki/FITS
 [14]: https://en.wikipedia.org/wiki/Horsehead_Nebula
 [15]: http://www.astropy.org/astropy-tutorials/FITS-images.html
 [16]: http://biopython.org/wiki/Biopython
 [17]: http://biopython.org/DIST/docs/tutorial/Tutorial.html#htoc48
 [18]: http://biopython.org/DIST/docs/tutorial/Tutorial.html#htoc85
 [19]: http://biopython.org/DIST/docs/tutorial/Tutorial.html#htoc135
 [20]: http://biopython.org/DIST/docs/tutorial/Tutorial.html#htoc281
 [21]: http://bokeh.pydata.org/en/latest/
 [22]: https://wiki.python.org/moin/OrganizationsUsingPython
 [23]: https://github.com/search?utf8=%E2%9C%93&q=language%3APython&type=Repositories&ref=advsearch&l=Python&l=