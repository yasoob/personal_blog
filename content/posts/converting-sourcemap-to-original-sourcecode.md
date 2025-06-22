---
title: "Converting Sourcemaps to Original JavaScript/TypeScript Sourcecode"
date: 2025-06-22T05:54:24-07:00
draft: false
categories: ['reverse engineering', 'javascript']
teaser: "In this tutorial, you will learn how to convert the sourcemap files to original JavaScript/TypeScript sourcecode using open source tools. You will use mitmproxy and Sourcemapper to achieve this goal."

---

## Introduction

Hi everyone! This is going to be a short and quick tutorial on how to download sourcemap files and convert them into the original JavaScript source code. Here’s an example of minified code from a Next.js website:

![Minified code](/images/sourcemaps/minified-code.png)

And here is the same code after the browser has done its magic and reconstructed the original code using sourcemaps:

![Original code](/images/sourcemaps/original-code.png)

Take a look at the bottom toolbar — it shows whether the displayed code is a bundled file or the original source file.

Our goal is to download this original file to our local system. Currently, you can view the original code in browsers for websites that publicly publish their sourcemaps, but browsers don’t let you download the original code in bulk. This means you can individually download each file from the developer tools, but you can’t download an entire directory at once. This is a problem because websites usually contain hundreds (if not thousands) of source files.

I’m not aware of any way to do this using browser extensions. There is one prominent Chrome extension that mostly works: [ResourcesSaverExt](https://github.com/up209d/ResourcesSaverExt), but it’s currently experiencing issues with Webpack. My understanding is that this is a Google Chrome limitation, as described in [this issue](https://github.com/up209d/ResourcesSaverExt/issues/72).

Instead, we’ll use [Mitmproxy](https://mitmproxy.org/) to intercept all web requests and log the sourcemap URLs, and then use [Sourcemapper](https://github.com/denandz/sourcemapper) to download and reconstruct the original code using those sourcemaps.

---

## Step 1: Install and Run Mitmproxy

Mitmproxy is a free and open-source proxy that you can use to route all your network requests through. It’s extremely powerful and provides a very flexible scripting environment. You can follow the instructions on the [official website](https://mitmproxy.org/) to install it.

Once installation is complete, run the proxy from your terminal and set your system proxy to route all requests through it. After that, open any website in your browser. You should see all the requests being logged in the terminal:

![Mitmproxy working](/images/sourcemaps/mitmproxy-working.png)

Perfect! Now clear the list of flows by pressing `z`.

---

## Step 2: Open the Target Website

Next, open the target website in your browser. This won’t automatically trigger the loading of sourcemap files. You need to open the developer tools and go to the `Sources` tab in Chrome or the `Debugger` tab in Firefox. Once you do that, you’ll see a bunch of new requests in Mitmproxy ending with `.js.map`:

![Mitmproxy sourcemaps](/images/sourcemaps/mitmproxy-sourcemaps.png)

At this point, press `w` in Mitmproxy and enter a name for the dump file where these intercepted flows will be stored. I’ll assume you named it `dump`.

---

## Step 3: Extract Sourcemap URLs

Create a `script.py` file containing a bit of code to filter the dump file you just created. In my case, this is what it looked like:

```python
def request(flow):
    if "targetdomain" in flow.request.url and flow.request.url.endswith(".map"):
        print(flow.request.url)
```

Replace `"targetdomain"` with the domain you're targeting. This filters out any intercepted requests from other domains you're not interested in. We’re also filtering for `.map` since sourcemap files always end with that extension.

Now, run this command to process the dump file using your script:

```bash
mitmdump -q -s script.py -r dump
```

This will print each sourcemap URL on a new line in the terminal, like this:

```
https://example.com/a.js.map  
https://example.com/b.js.map
```

---

## Step 4: Pipe Sourcemap URLs to Sourcemapper

This is the final step. You’ll now pipe these URLs into Sourcemapper. This tool downloads each sourcemap and reconstructs the original source code. A typical Sourcemapper command looks like this:

```bash
sourcemapper -output outputdirectory -url https://sampleurl.com
```

Instead of running this manually for each URL, you can use:

```bash
mitmdump -q -s script.py -r dump | xargs -n 1 sourcemapper -output output -url
```

Once the command finishes, the original source code will be saved in the `output` directory.

---

## Issues with Sourcemapper

I did run into a few issues with Sourcemapper. For instance, the file structure it produces doesn’t exactly match what you see in the browser. All the files are recreated, but the nesting might be off. This was acceptable in my case, but you may want to investigate further depending on your use case.

---

## Conclusion

I’m glad I can view the original JS/TS code of most websites. However, if you want to keep your code private, make sure you’re not publicly publishing your sourcemaps. Almost all major build tools support removing sourcemaps from public directories.

**P.S.**: At one point, I considered patching Firefox’s source code to dump all the generated sourcemaps to the local file system. That’s probably the best way to get the most accurate source code. However, Firefox's build process is slow, and the method I’ve shared here worked well enough for my needs.
