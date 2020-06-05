---
title: Making a url shortener in python
author: yasoob
type: post
date: 2013-08-03T04:54:10+00:00
url: /2013/08/03/a-url-shortener-in-python/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:28;}s:2:"fb";a:1:{i:4182098;i:16;}s:2:"wp";a:1:{i:0;i:9;}}'
categories:
  - python
tags:
  - beginner
  - tinyurl
  - tutorial
  - url shortener

---
Hi there fellas. Today in this post i am going to show you how we can use python to make bulk urls tiny. Let me clear that we are not making a url shortening SERVICE instead what we are going to do is that we are going to unofficially use the [tinyurl][1] api (Tinyurl is a url shortening service). There's not any official python api released by tinyurl. So lets begin with this:

## Do required imports
  
So first of all we have to do some imports. We have to import 7 libraries to make this work. 

```
from __future__ import with_statement
import contextlib
try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen
import sys
```

We could have imported just one library to make this work but in order to make a good url shortener we have to import these seven libraries.

## Implement `make_tiny` mathod
  
So now we have to start making a method that will handle the url shortening. Watch the code closely because it is self explanatory but however i will explain it later.

```
def make_tiny(url):
    request_url = ('http://tinyurl.com/api-create.php?' + 
    urlencode({'url':url}))
    <a href="http://freepythontips.wordpress.com/2013/07/28/the-with-statement/">with</a> contextlib.closing(urlopen(request_url)) as response:
        return response.read().decode('utf-8')
```

Did you manage to understand the code? Let me explain it to the beginners. First of all we define a `make_tiny` function which takes a url as an input. After that we start defining the working of our function. The `url_encode` takes a url as an input and encodes it i.e escapes it. After that we append the escaped url to the end of tinyurl's api url. Then we open the request_url using urlopen. And lastly we read the response after converting it to utf-8. Why did we convert the response to utf-8? The reason for this is that the urlopen function returns a stream of bytes rather than a string so in order to print it and alter it we have to convert it into utf-8. Was that difficult?

So now the next step is to get the input from the user. For this we are going to use the sys library. 

## Define the `main` function 
  
So lets write the main() function for our little script. Here's the code for it:

```
def main():
    for tinyurl in map(make_tiny, sys.argv[1:]):
	print(tinyurl)
```

So what are we doing here? We are getting the user input by using `sys.argv`. We have not limited ourself to only one url as an input instead we are saying that give us as many urls as you want, we will crush them and make them tiny. What `sys.argv[1:]` does is that it leaves the first two arguments (counting starts from 0) and takes all the rest of the arguments and produces a list of those arguments. For example if you type:

```
$ python script.py url1 url2 url3
```

`sys.argv[1:]` will leave `python` and `script.py` and will produce the following list:

```
[url1,url2,url3]
```

Wait! what is that `map()` function over there? Most beginners will feel confused as most of them have never used map. `map()` is a simple way of looping over a list and passing it to a function one by one. The `map()` function above there is equivalent to:

```
def main():
    urls = sys.argv[1:]
    for url in urls:
        tinyurl = make_tiny(url)
        print tinyurl
```

I hope the above code example cleared away any confusions about map() function. 

## Add finishing touches

Now lets wrap up our code. The only thing left is this:

```
if __name__ == '__main__':
    main()
```

Add this to the end of your code. This tells us whether the script was executed independently from the shell or was it called by another script. This is pretty handy if you want to use this script later in any other project. 

 **Finally:**
  
So here's the complete script:

```
from __future__ import with_statement
import contextlib
try:
	from urllib.parse import urlencode
except ImportError:
	from urllib import urlencode
try:
	from urllib.request import urlopen
except ImportError:
	from urllib2 import urlopen
import sys

def make_tiny(url):
	request_url = ('http://tinyurl.com/api-create.php?' + 
	urlencode({'url':url}))
	with contextlib.closing(urlopen(request_url)) as response:
		return response.read().decode('utf-8')

def main():
	for tinyurl in map(make_tiny, sys.argv[1:]):
		print(tinyurl)

if __name__ == '__main__':
	main()
```

Considering that you have saved this script as url_shortener.py you have to run it like this from the shell:

```
$ python url_shortener.py url1 url2 url3
```

If you want to save these tinyurls into a txt file then issue this command:

```
$ python url_shortener.py url1 > urls.txt
```

I hope you liked today's post. This script can work on [python 2 and python 3 both][2]. It was primarily aimed at two kind of audience. Firstly those who are learning python and want to learn how to make a simple yet useful script and those who want to learn how to make a url shortener in python. Do share your view in the comments bellow and stay tuned for the next post. If you want regular dose of python tips and tutorials delivered to your doorstep then consider following my blog.

## You might also like:
  
- [5 quality screencasts worth watching][3]
- [Packaging and distributing your python libraries][4]
- [10 inspirations for your next python project][5]

 [1]: http://www.tinyurl.com
 [2]: http://freepythontips.wordpress.com/2013/07/30/make-your-programs-compatible-with-python-2-and-3-at-the-same-time/
 [3]: http://freepythontips.wordpress.com/2013/08/02/5-quality-screencasts-worth-watching/
 [4]: http://freepythontips.wordpress.com/2013/08/01/packaging-and-distributing-your-python-libraries/
 [5]: http://freepythontips.wordpress.com/2013/08/01/10-inspirations-for-your-next-python-project/