---
title: Making a Reddit + twitter Bot
author: yasoob
type: post
date: 2013-09-14T14:45:49+00:00
url: /2013/09/14/making-a-reddit-twitter-bot/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - bot
  - python+reddit
  - pytwitter
  - reddit
  - redditpy
  - tutorial
  - twitter

---
Hi there pythonistas. I hope you are all fine. In this post I am going to teach you how we can make a Reddit + Twitter bot. What this bot will do is that it will copy post titles and url from any subreddit that you want and then it will post them to twitter keeping the 140 characters length in mind. 

Firstly let me tell you what Reddit is. Reddit is a social link sharing site where good links are upvoted and bad links are down voted. So lets start.

## Required external libraries
  
- Praw - (Reddidt API wrapper in python) `pip install praw` 
- Requests - (HTTP library) `pip install requests` 
- Tweepy - (Twitter python API) `pip install tweepy`

## First step - Register Yourself
  
So first of all you will have to register an app on http://dev.twitter.com/apps and after registering copy the 

- access token
- access token secret
- consumer key
- consumer secret

You will have to edit the permissions for your app under the settings tab and grant your application read and write permission. So now we are ready to move on.

## Required imports
  
So now lets start writing our script. First of all we will have to import the required libraries and set up some basic variables:

```
import praw
import json
import requests
import tweepy
import time

access_token = 'YOUR ACCESS TOKEN HERE'
access_token_secret = 'YOUR ACCESS TOKEN SECRET HERE'
consumer_key = 'YOUR CONSUMER KEY HERE'
consumer_secret = 'YOUR CONSUMER SECRET HERE'
```

## Initiating connection with Reddit
  
Now we have to initiate connection with Reddit. Lets define a function to do just that.

```
def setup_connection_reddit(subreddit):
    print "[bot] setting up connection with Reddit"
    r = praw.Reddit('yasoob_python reddit twitter bot '
                'monitoring %s' %(subreddit)) 
    subreddit = r.get_subreddit(subreddit)
    return subreddit
```

This method connects with Reddit and gets the subreddit of our choice and then returns that subreddit for us to work further with.

## Getting posts and links from Reddit
  
So now we have to define a function that gets the list of posts and there urls from Reddit for us. So lets just do that as well.

```
def tweet_creator(subreddit_info):
    post_dict = {}
    post_ids = []
    print "[bot] Getting posts from Reddit"
    for submission in subreddit_info.get_hot(limit=20):
        # strip_title function is defined later
        post_dict[strip_title(submission.title)] = submission.url
        post_ids.append(submission.id)
    print "[bot] Generating short link using goo.gl"
    mini_post_dict = {}
    for post in post_dict:
        post_title = post
        post_link = post_dict[post]   
        # the shorten function is defined later        
        short_link = shorten(post_link)
        mini_post_dict[post_title] = short_link 
    return mini_post_dict, post_ids
```

First of all we are declaring a dictionary to hold the post title and link and after that we are making a list to hold the unique ids of every post that we grab. This is used to track which posts we have already grabbed. 

After that we are looping over the posts and appending values to the dictionary and the list. If you use twitter very frequently then you know that how disgusting long links look like so in order to tackle that we are using goo.gl to generate short links for us. That's the next thing we have done in the above function. We loop over the post dict and make a short link for every link and append it to a new dictionary which is `mini_post_dict`. 

## No one likes long links
  
Now lets define a function which will actually shorten the links for us. So here it is:

```
def shorten(url):
    headers = {'content-type': 'application/json'}
    payload = {"longUrl": url}
    url = "https://www.googleapis.com/urlshortener/v1/url"
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    link = json.loads(r.text)['id']
    return link
```

The above function contains a header and a payload which we are going to send to google and after that google will return the short link in the form of json. 

## Twitter hates more than 140 characters
  
If you use twitter regularly then I am sure that you know that twitter does not like tweets that are more than 140 characters. So in order to tackle that lets define a function that will truncate long tweets to short ones.

```
def strip_title(title):
    if len(title) &lt; 94:
        return title
    else:
        return title[:93] + "..."
```

In the above method we will pass a title and the above method will check that whether the title is 93 characters or more. If it is more than 93 characters then it will truncate it and append three dots at its end. 

## Dealing with duplicate posts
  
So now we have started to shape our final script. There is one thing that we have to keep in mind. No one likes duplicate posts so we have to make sure that we do not post same tweets over and over again. 

In order to tackle this issue we are going to make a file with the name of posted_posts.txt. When ever we grab a post from Reddit we will add it's ID to this file and when posting to twitter we will check whether the post with this ID has already been posted or not. 

Lets define two more functions. The first one will write the IDs to file and the second one will check whether the post is already posted or not.

```
def add_id_to_file(id):
    with open('posted_posts.txt', 'a') as file:
        file.write(str(id) + "\n")

def duplicate_check(id):
    found = 0
    with open('posted_posts.txt', 'r') as file:
        for line in file:
            if id in line:
                found = 1
    return found
```

## Make a function for twitter will ya
  
So now lets make our one of the main function. This function is actually going to post to twitter. 

```
def tweeter(post_dict, post_ids):
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)
    for post, post_id in zip(post_dict, post_ids):
        found = duplicate_check(post_id)
        if found == 0:
            print "[bot] Posting this link on twitter"
            print post+" "+post_dict[post]+" #Python #reddit #bot"
            api.update_status(post+" "+post_dict[post]+" #Python #reddit #bot")
            add_id_to_file(post_id)
            time.sleep(30)
        else:
            print "[bot] Already posted"
```

Firstly we setup connection with twitter by using the credentials we defined in the beginning. After that we loop over the `post_dict` and `post_ids`. Then we check for duplicate posting. If it is not previously posted then we post it and add the id of the post in the `posted_posts.txt` file. After posting we wait for 30 seconds so that we do not spam twitter with tweets.

## Wheres the main function bud
  
So lets define our last function. This function will co ordinate with all other functions. Here is the code for that last function:

```
def main():
    subreddit = setup_connection_reddit('python')
    post_dict, post_ids = tweet_creator(subreddit)
    tweeter(post_dict, post_ids)
```

So now we are ready just add this little line at the end as well:

```
if __name__ == '__main__':
    main()
```

This checks whether the script is directly executed or is it imported. If it is directly executed only then the `main()` function is executed.

## Complete code
  
Here is the complete script:

```
import praw
import json
import requests
import tweepy
import time

access_token = 'YOUR ACCESS TOKEN HERE'
access_token_secret = 'YOUR ACCESS TOKEN SECRET HERE'
consumer_key = 'YOUR CONSUMER KEY HERE'
consumer_secret = 'YOUR CONSUMER SECRET HERE'

def strip_title(title):
    if len(title) &lt; 94:
        return title
    else:
        return title[:93] + "..."

def tweet_creator(subreddit_info):
    post_dict = {}
    post_ids = []
    print "[bot] Getting posts from Reddit"
    for submission in subreddit_info.get_hot(limit=20):
        post_dict[strip_title(submission.title)] = submission.url
        post_ids.append(submission.id)
    print "[bot] Generating short link using goo.gl"
    mini_post_dict = {}
    for post in post_dict:
        post_title = post
        post_link = post_dict[post]           
        short_link = shorten(post_link)
        mini_post_dict[post_title] = short_link 
    return mini_post_dict, post_ids

def setup_connection_reddit(subreddit):
    print "[bot] setting up connection with Reddit"
    r = praw.Reddit(&#039;yasoob_python reddit twitter bot &#039;
                &#039;monitoring %s&#039; %(subreddit)) 
    subreddit = r.get_subreddit(subreddit)
    return subreddit

def shorten(url):
    headers = {&#039;content-type&#039;: &#039;application/json&#039;}
    payload = {"longUrl": url}
    url = "https://www.googleapis.com/urlshortener/v1/url"
    r = requests.post(url, data=json.dumps(payload), headers=headers)
    link = json.loads(r.text)[&#039;id&#039;]
    return link

def duplicate_check(id):
    found = 0
    with open(&#039;posted_posts.txt&#039;, &#039;r&#039;) as file:
        for line in file:
            if id in line:
                found = 1
    return found

def add_id_to_file(id):
    with open(&#039;posted_posts.txt&#039;, &#039;a&#039;) as file:
        file.write(str(id) + "\n")

def main():
    subreddit = setup_connection_reddit(&#039;python&#039;)
    post_dict, post_ids = tweet_creator(subreddit)
    tweeter(post_dict, post_ids)

def tweeter(post_dict, post_ids):
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)
    for post, post_id in zip(post_dict, post_ids):
        found = duplicate_check(post_id)
        if found == 0:
            print "[bot] Posting this link on twitter"
            print post+" "+post_dict[post]+" #Python #reddit #bot"
            api.update_status(post+" "+post_dict[post]+" #Python #reddit #bot")
            add_id_to_file(post_id)
            time.sleep(30)
        else:
            print "[bot] Already posted" 

if __name__ == &#039;__main__&#039;:
    main()
```

Save this file with the name of `reddit_bot.py` and make a file with the name of `posted_posts.txt` and then execute the python script from the terminal. Your output will look something like this:

```
yasoob@yasoob:~/Desktop$ python reddit_bot.py
[bot] setting up connection with Reddit
[bot] Getting posts from Reddit
[bot] Generating short link using goo.gl
[bot] Posting this link on twitter
Miloslav Trmač, -1 for Structured Logging http://goo.gl/sF8Xgm #Python #reddit #bot
```

And after some time your `posted_posts.txt` file will look something like this:

```
1mb4y4
1mb867
1mb4hl
1mbh3t
1mbni0
1m9bod
1mbhpt
1mbhnc
1mbcp2
1m9d2t
1maeio
1m9bi5
1m8tgr
1m86e4
1ma5r5
1m8fud
1mdh1t
1mbst4
```

## Goodbye
  
I hope you enjoyed today's post as much as I enjoyed writing it. I hope to see you in future with some more tutorials. Do follow my blog to give me some support and get regular updates. Goodbye till next time.