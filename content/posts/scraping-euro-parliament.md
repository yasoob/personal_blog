---
title: "Scraping Euro Parliament Website Using Python"
date: 2016-01-22T00:53:21-04:00
draft: false
categories: ["programming"]
---

Hi guys! I hope you are fine. In this post I will show you how you can scrape public parliament data from the [European Parliament](http://www.europarl.europa.eu/) website. In the European Parliament Members may pose written and oral questions to the European Institutions. Our task is to extract the answers to these questions.

We will be using Python to accomplish this task. Let’s set up our directory and the `app.py` file.

**Setting up the directories**

Let’s create a virtual environment and a new directory for holding all our python and other related files.

```terminal
$ cd ~/Desktop
$ mkdir scrape-europarl
$ cd scrape-europarl
$ mkdir data
$ virtualenv env
$ source env/bin/activate
```

The `data` directory will contain all the downloaded files. Now let’s create our `app.py` file:


```terminal
$ touch app.py
```

We should also create our `requirements.txt` file for keeping track of all the required libraries.

```terminal
$ touch requirements.txt
```

Now open the `requirements.txt` file and add the following lines to it:

```
requests
lxml
```

Now install the requirements by running:

```
$ pip install -r requirements.txt
```

We are good to go now!

**Modifing the `app.py` file**

First of all we need to import the required modules:

```python
import requests
import lxml.html
import os
```

Now we need a function which can be used to download .pdf and .docx files. This is a generic function which can be used in a lot of projects so you can even save it for later use:

```python
def download_file(file_name, url):
    r = requests.get(url, stream=True)
    with open(file_name, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk:
                f.write(chunk)
    return file_name
```

You need to provide this function a valid filename with a valid extension (e.g .docx | .pdf) and a valid url.

So now we need to find the required endpoints where the data is being served on the euro parliament website. After poking around a bit I found this url: *http://www.europarl.europa.eu/RegistreWeb/search/typedoc.htm?codeTypeDocu=QECR&year=2015&currentPage=*

You can add any page number at the end of the above url. This way you can enumerate all the documents on the website. After researching a bit I got to know that there are a total of **1380** pages. Good, now we can easily open and scrape all the pages. Below is the crux of our `app.py` file:

```python
for i in range(1, 1381):
    url = "http://www.europarl.europa.eu/RegistreWeb/search/typedoc.htm?codeTypeDocu=QECR&year=2015&currentPage={0}".format(i)
    html = lxml.html.parse(url)
    titles = [i.strip() for i in html.xpath("//div[contains(@class, 'notice')]/p[@class='title']/a/text()")]
    docs = [i.strip() for i in html.xpath("//div[contains(@class, 'notice')]/ul/li/a/@href")]
    q_refs = [i.strip() for i in html.xpath("//div[contains(@class, 'notice')]/div[@class='date_reference']/span[2]/text()")]
    for title, doc, q_ref in zip(titles, docs, q_refs):
        file_name = os.path.join(os.getcwd(),'data','-'.join(title.split('/'))+' '+q_ref+'.'+doc.split('.')[-1])
        downloaded_file = download_file(file_name, doc)
        print downloaded_file
```

There is a lot going on here. Let me explain it. Firstly, we open the url using lxml. Then we again use lxml to extract all the *titles*, *docs* and *q_refs* from the html document (We use **xpaths** to achieve this). This returns a Python list. Next we loop over all three lists using a `for` loop and `zip` function. Next we extract the file_name from q_ref and pass the file_name+download link to download_file function. It downloads the file and returns the relative path of the downloaded file. Finally, we print the relative path of the downloaded file.

Now you can run `app.py`:

```python
$ python app.py
```

Congrats! Your scraper is working. I hope you enjoyed this post. Stay tuned for new posts in near future!

**Note:** All of the above code can also be found on [GitHub](https://github.com/yasoob/scrape-europarl/).
