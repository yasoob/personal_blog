---
title: Running Python in the Browser
author: yasoob
type: post
date: 2019-05-22T17:49:45+00:00
url: /2019/05/22/running-python-in-the-browser/
timeline_notification:
  - 1558547391
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - batavia
  - browser python
  - brython
  - pyodide
  - python in browser
  - skulpt
  - transcrypt

---

_Running Python in the web browser has been getting a lot of attention lately. Shaun Taylor-Morgan knows what he’s talking about here - he works for[Anvil][1], a full-featured application platform for writing full-stack web apps with nothing but Python. So I invited him to give us an overview and comparison of the open-source solutions for running Python code in your web browser._

In the past, if you wanted to build a web UI, your only choice was JavaScript. 

That’s no longer true. There are quite a few ways to run Python in your web browser. This is a survey of what’s available.

## SIX SYSTEMS {#six-systems}

I’m looking at six systems that all take a different approach to the problem. Here’s a diagram that sums up their differences.<figure class="wp-block-image">

![Python in browser](/wp-content/uploads/2019/05/python-in-browser.png)

The x-axis answers the question: when does Python get compiled? At one extreme, you run a command-line script to compile Python yourself. At the other extreme, the compilation gets done in the user’s browser as they write Python code.

The y-axis answers the question: what does Python get compiled to? Three systems make a direct conversion between the Python you write and some equivalent JavaScript. The other three actually run a live Python interpreter in your browser, each in a slightly different way.

## 1. TRANSCRYPT {#1-transcrypt}

![Transcrypt](/wp-content/uploads/2019/05/transcrypt.png)

Transcrypt gives you a command-line tool you can run to compile a Python script into a JavaScript file.

You interact with the page structure (the DOM) using a toolbox of specialized Python objects and functions. For example, if you`import document`, you can find any object on the page by using `document` like a dictionary. To get the element whose ID is`name-box`, you would use `document["name-box"]`. Any readers familiar with JQuery will be feeling very at home.

Here’s a basic example. I wrote a Hello, World page with just an input box and a button:

```
<input id="name-box" placeholder="Enter your name">
<button id="greet-button">Say Hello</button>
```

To make it do something, I wrote some Python. When you click the button, an event handler fires that displays an alert with a greeting:

```
def greet():
    alert("Hello " + document.getElementById("name-box").value + "!")

document.getElementById("greet-button").addEventListener('click', greet)
```

I wrote this in a file called `hello.py`and compiled it using `transcrypt hello.py`. The compiler spat out a JavaScript version of my file, called `hello.js`.

Transcrypt makes the conversion to JavaScript at the earliest possible time - before the browser is even running. Next we’ll look at Brython, which makes the conversion on page load.

## 2. BRYTHON {#2-brython}

![Brython](/wp-content/uploads/2019/05/brython.png)

Brython lets you write Python in script tags in exactly the same way you write JavaScript. Just as with Transcrypt, it has a `document` object for interacting with the DOM.

The same widget I wrote above can be written in a script tag like this:

```
<script type="text/python">
from browser import document, alert

def greet(event):
    alert("Hello " + document["name-box"].value + "!")

document["greet-button"].bind("click", greet)
</script>
```

Pretty cool, huh? A script tag whose type is `text/python`!

There’s a good explanation of how it works on the [Brython GitHub page][2]. In short, you run a function when your page loads:

```
<body onload="brython()">
```

that transpiles anything it finds in a Python script tag:

```
<script type="text/python"></script>
```

which results in some machine-generated JavaScript that it runs using JS’s `eval()` function.

## 3. SKULPT {#3-skulpt}

![Skulpt](/wp-content/uploads/2019/05/skulpt.png)

Skulpt sits at the far end of our diagram - it compiles Python to JavaScript at runtime. This means the Python doesn’t have to be written until_after the page has loaded_.

The [Skulpt website][3] has a Python REPL that runs in your browser. It’s not making requests back to a Python interpreter on a server somewhere, it’s actually running on your machine.

![Skulpt repl](/wp-content/uploads/2019/05/skulpt-repl.gif)

Skulpt does not have a built-in way to interact with the DOM. This can be an advantage, because you can build your own DOM manipulation system depending on what you’re trying to achieve. More on this later.

Skulpt was originally created to produce educational tools that need a live Python session on a web page (example: [Trinket.io][4]). While Transcrypt and Brython are designed as direct replacements for JavaScript, Skulpt is more suited to building Python programming environments on the web (such as the full-stack app platform, [Anvil][1]).

We’ve reached the end of the x-axis in our diagram. Next we head in the vertical direction: our final three technologies don’t compile Python to JavaScript, they actually implement a Python runtime in the web browser.

![x axis done](/wp-content/uploads/2019/05/x-axis-done.png)

## 4. PYPY.JS {#4-pypyjs}

![Pypy.js](/wp-content/uploads/2019/05/pypyjs.png)

[PyPy.js][5]is a JavaScript implementation of a Python interpreter. The developers took a C-to-JavaScript compiler called[emscripten][6]and ran it on the source code of[PyPy][7]. The result is PyPy, but running in your browser.

**Advantages:** It’s a very faithful implementation of Python, and code gets executed quickly. 

**Disadvantages:** A web page that embeds PyPy.js contains an entire Python interpreter, so it’s pretty big as web pages go (think megabytes).

You import the interpreter using `<script>` tags, and you get an object called `pypyjs` in the global JS scope.

There are three main functions for interacting with the interpreter. To execute some Python, run `pypyjs.exec(<python code>)`. To pass values between JavaScript and Python, use `pypyjs.set(variable, value)` and `pypyjs.get(variable)`.

Here’s a script that uses PyPy.js to calculate the first ten square numbers:

```
<script type="text/javascript">
  pypyjs.exec(
    // Run some Python
    'y = [x**2. for x in range(10)]'
  ).then(function() {
    // Transfer the value of y from Python to JavaScript
    pypyjs.get('y')
  }).then(function(result) {
    // Display an alert box with the value of y in it
    alert(result)
  });
</script>
```

PyPy.js has a few features that make it feel like a native Python environment - there’s even an in-memory filesystem so you can read and write files. There’s also a `document` object that gives you access to the DOM from Python.

[The project has a great readme][8] if you’re interested in learning more.

## 5. BATAVIA {#5-batavia}

![Batavia](/wp-content/uploads/2019/05/batavia.png)

Batavia is a bit like PyPy.js, but it runs bytecode rather than Python. Here’s a Hello, World script written in Batavia:

```
<script id="batavia-helloworld" type="application/python-bytecode">
    7gwNCkIUE1cWAAAA4wAAAAAAAAAAAAAAAAIAAABAAAAAcw4AAABlAABkAACDAQABZAEAUykCegtI
    ZWxsbyBXb3JsZE4pAdoFcHJpbnSpAHICAAAAcgIAAAD6PC92YXIvZm9sZGVycy85cC9uenY0MGxf
    OTc0ZGRocDFoZnJjY2JwdzgwMDAwZ24vVC90bXB4amMzZXJyddoIPG1vZHVsZT4BAAAAcwAAAAA=
</script>
```

Bytecode is the ‘assembly language’ of the Python virtual machine - if you’ve ever looked at the `.pyc` files Python generates, that’s what they contain ([Yasoob dug into some bytecode][9] in a recent post on this blog). This example doesn’t look like assembly language because it’s base64-encoded.

Batavia is potentially faster than PyPy.js, since it doesn’t have to compile your Python to bytecode. It also makes the download smaller -[around 400kB][10]. The disadvantage is that your code needs to be written and compiled in a native (non-browser) environment, as was the case with Transcrypt.

Again, Batavia lets you manipulate the DOM using a Python module it provides (in this case it’s called `dom`).

The Batavia project is quite promising because it fills an otherwise unfilled niche - ahead-of-time compiled Python in the browser that runs in a full Python VM. Unfortunately, the GitHub repo’s commit rate seems to have slowed in the past year or so. If you’re interested in helping out, [here’s their developer guide][11].

## 6. PYODIDE {#6-pyodide}

![Pyodide](/wp-content/uploads/2019/05/pyodide.png)

[Mozilla’s Pyodide][12]was announced in April 2019. It solves a difficult problem: interactive data visualisation in Python, in the browser.

Python has become a favourite language for data science thanks to libraries such as [NumPy][13], [SciPy][14], [Matplotlib][15] and [Pandas][16]. We already have [Jupyter Notebooks][17], which are a great way to present a data pipeline online, but they must be hosted on a server somewhere.

If you can put the data processing on the user’s machine, they avoid the round-trip to your server so real-time visualisation is more powerful. And you can scale to so many more users if their own machines are providing the compute.

It’s easier said than done. Fortunately, the Mozilla team came across a version of the reference Python implementation ([CPython][18]) that was compiled into [WebAssembly][19]. WebAssembly is a low-level compliment to JavaScript that performs closer to native speeds, which opens the browser up for performance-critical applications like this.

Mozilla took charge of the WebAssembly CPython project and recompiled NumPy, SciPy, Matplotlib and Pandas into WebAssembly too. The result is a lot like Jupyter Notebooks in the browser -[here’s an introductory notebook][20].

![pyodide screen](/wp-content/uploads/2019/05/pyodide-screen.png)

It’s an even bigger download than PyPy.js (that example is around 50MB), but as Mozilla point out, a good browser will cache that for you. And for a data processing notebook, waiting a few seconds for the page to load is not a problem.

You can write HTML, MarkDown and JavaScript in Pyodide Notebooks too. And yes, there’s a`document`object to access the DOM. It’s a really promising project!

## MAKING A CHOICE {#making-a-choice}

I’ve given you six different ways to write Python in the browser, and you might be able to find more. Which one to choose? This summary table may help you decide.  

![Image](/wp-content/uploads/2019/05/screen-shot-2019-05-22-at-1.34.17-pm.png)

There’s a more general point here too: the fact that there _is_ a choice.

As a web developer, it often feels like you_have_to write JavaScript, you_have_to build an HTTP API, you_have_to write SQL and HTML and CSS. The six systems we’ve looked at make JavaScript seem more like a language that gets_compiled to_, and you choose what to compile to it (And WebAssembly is actually_designed_to be used this way).

Why not treat the whole web stack this way? The future of web development is to move beyond the technologies that we’ve always ‘had’ to use. The future is to build abstractions on top of those technologies, to reduce the unnecessary complexity and optimise developer efficiency. That’s why Python itself is so popular - it’s a language that puts developer efficiency first.

## ONE UNIFIED SYSTEM {#one-unified-system}

There should be one way to represent data, from the database all the way to the UI. Since we’re Pythonistas, we’d like everything to be a Python object, not an SQL SELECT statement followed by a Python object followed by JSON followed by a JavaScript object followed by a DOM element.

That’s what [Anvil][21] does - it’s a full-stack Python environment that abstracts away the complexity of the web. [Here’s a 7-minute video][21] that covers how it works.

![Web stacks](/wp-content/uploads/2019/05/web-stacks.png)

Remember I said that it can be an advantage that Skulpt doesn’t have a built-in way to interact with the DOM? This is why. If you want to go beyond ‘Python in the browser’ and build a fully-integrated Python environment, your abstraction of the User Interface needs to fit in with your overall abstraction of the web system.

So Python in the browser is just the start of something bigger. I like to live dangerously, so I’m going to make a prediction. In 5 years’ time, more than 50% of web apps will be built with tools that sit one abstraction level higher than JavaScript frameworks such as React and Angular. It has already happened for static sites: most people who want a static site will use WordPress or Wix rather than firing up a text editor and writing HTML. As systems mature, they become unified and the amount of incidental complexity gradually minimises.

If you’re reading this in 2024, why not get in touch and tell me whether I was right?

 [1]: https://anvil.works/
 [2]: https://github.com/brython-dev/brython/wiki/How%20Brython%20works
 [3]: http://www.skulpt.org/
 [4]: https://trinket.io/
 [5]: https://pypyjs.org/
 [6]: https://emscripten.org/
 [7]: https://pypy.org/
 [8]: https://github.com/pypyjs/pypyjs/blob/master/README.dist.rst
 [9]: https://pythontips.com/2019/02/26/python-dis-module-and-constant-folding/
 [10]: https://batavia.readthedocs.io/en/latest/background/faq.html
 [11]: https://beeware.org/contributing/how/first-time/
 [12]: https://github.com/iodide-project/pyodide/
 [13]: https://www.numpy.org/
 [14]: https://www.scipy.org/
 [15]: https://matplotlib.org/
 [16]: https://pandas.pydata.org/
 [17]: https://jupyter.org/
 [18]: https://en.wikipedia.org/wiki/CPython
 [19]: https://webassembly.org/
 [20]: https://alpha.iodide.io/notebooks/300/
 [21]: https://anvil.works/blog/hello-world