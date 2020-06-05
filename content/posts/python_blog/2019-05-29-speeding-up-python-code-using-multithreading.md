---
title: Speeding up Python code using multithreading
author: yasoob
type: post
date: 2019-05-29T17:44:13+00:00
url: /2019/05/29/speeding-up-python-code-using-multithreading/
timeline_notification:
  - 1559151857
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - concurrent
  - multiprocessing
  - multithreading
  - speed up python
  - threading

---
Hi lovely people! 👋 A lot of times we end up writing code in Python which does remote requests or reads multiple files or does processing on some data. And in a lot of those cases I have seen programmers using a simple `for loop` which takes forever to finish executing. For example:

```
import requests
from time import time

url_list = [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/410",
    "https://via.placeholder.com/420",
    "https://via.placeholder.com/430",
    "https://via.placeholder.com/440",
    "https://via.placeholder.com/450",
    "https://via.placeholder.com/460",
    "https://via.placeholder.com/470",
    "https://via.placeholder.com/480",
    "https://via.placeholder.com/490",
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/510",
    "https://via.placeholder.com/520",
    "https://via.placeholder.com/530",
]

def download_file(url):
    html = requests.get(url, stream=True)
    return html.status_code

start = time()

for url in url_list:
    print(download_file(url))

print(f'Time taken: {time() - start}')
```

**Output:**

```
<--truncated-->
Time taken: 4.128157138824463
```

This is a sane example and the code will open each URL, wait for it to load, print its status code and only then move on to the next URL. This kind of code is a very good candidate for multi-threading.

Modern systems can run a lot of threads and that means you can do multiple tasks at once with a very low over-head. Why don&#8217;t we try and make use of that to make the above code process these URLs faster?

We will make use of the [`ThreadPoolExecutor`](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) from the `concurrent.futures` library. It is super easy to use. Let me show you some code and then explain how it works.

```
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from time import time

url_list = [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/410",
    "https://via.placeholder.com/420",
    "https://via.placeholder.com/430",
    "https://via.placeholder.com/440",
    "https://via.placeholder.com/450",
    "https://via.placeholder.com/460",
    "https://via.placeholder.com/470",
    "https://via.placeholder.com/480",
    "https://via.placeholder.com/490",
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/510",
    "https://via.placeholder.com/520",
    "https://via.placeholder.com/530",
]

def download_file(url):
    html = requests.get(url, stream=True)
    return html.status_code

start = time()

processes = []
with ThreadPoolExecutor(max_workers=10) as executor:
    for url in url_list:
        processes.append(executor.submit(download_file, url))

for task in as_completed(processes):
    print(task.result())


print(f'Time taken: {time() - start}')
```

**Output:**

```
<--truncated-->
Time taken: 0.4583399295806885
```

We just sped up our code by a factor of almost 9! And we didn&#8217;t even do anything super involved. The performance benefits would have been even more if there were more urls.

So what is happening? When we call `executor.submit` we are adding a new task to the thread pool. We store that task in the processes list. Later we iterate over the processes and print out the result.

The `as_completed` method yields the items (tasks) from processes list as soon as they complete. There are two reasons a task can go to the completed state. It has either finished executing or it got cancelled. We could have also passed in a `timeout` parameter to `as_completed` and if a task took longer than that time period, even then as_completed will yield that task.

You should explore multi-threading a bit more. For trivial projects it is the quickest way to speed up your code. If you want to learn, more read the [official docs][1]. They are super helpful.

Have a good day! See you later!

 [1]: https://docs.python.org/3/library/concurrent.futures.html