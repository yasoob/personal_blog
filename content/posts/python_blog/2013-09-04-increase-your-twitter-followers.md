---
title: Making a twitter bot in python
author: yasoob
type: post
date: 2013-09-04T16:53:13+00:00
url: /2013/09/04/increase-your-twitter-followers/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:50;}s:2:"fb";a:1:{i:4182098;i:19;}s:2:"wp";a:1:{i:0;i:42;}}'
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-09-04 16:53:13";}'
categories:
  - python
tags:
  - auto follower
  - bot
  - increase
  - increase twitter followers
  - increase your twitter followers
  - tutorial
  - twitter
  - twitter bot

---
Hi there guys. I hope you are fine. In this post I am going to tell you how you can make a twitter auto favouriter or a.k.a Twitter Bot. I am not going to make a twitter follower as it will get you banned quickly if you use it a lot. This post is going to help you to increase your twitter followers organically. 

By organically I mean that your followers will be those who really want to listen to your content. You can either use services on the web to increase your followers inorganically or else you can use this script 😉 

So what affect does favouriting has on the user who's post you favourite? When you favourite someone's post he will get curious as who favourited his post. Then he will visit your profile and will follow you if he likes your tweets. So without wasting any time lets begin.

The basic mechanism or the way of working of our bot will be that you will give it a keyword like "python" and it will search twitter for that keyword. After searching it will start favouriting the tweets from top to bottom.

First of all I am going to use "twitter" module for this project. There are a lot of twitter related modules on PyPI but this module did the trick so I thought to use it (https://pypi.python.org/pypi/twitter/1.10.0). Secondly in order to follow along you will have to make a dev account on twitter and register an application with any name (https://dev.twitter.com/apps). Lets begin by importing the twitter module and initiating connection with twitter using the OAUTH tokens:

```
from twitter import Twitter, OAuth, TwitterHTTPError

OAUTH_TOKEN = 'your oauth token'
OAUTH_SECRET = 'your oauth secret'
CONSUMER_KEY = 'your consumer key'
CONSUMER_SECRET = 'your consumer secret'

t = Twitter(auth=OAuth(OAUTH_TOKEN, OAUTH_SECRET,
            CONSUMER_KEY, CONSUMER_SECRET))
```

So now we have initiated connection with twitter. This is the basic structure of our twitter auto favouriter or a.k.a twitter bot. Now lets move on and define a method which will search for tweets on twitter.

```
def search_tweets(q, count=100):
    return t.search.tweets(q=q, result_type='recent', count=count)
```

So now we have to define a method which will favourite a tweet:

```
def fav_tweet(tweet):
    try:
        result = t.favorites.create(_id=tweet['id'])
        print "Favorited: %s" % (result['text'])
        return result
    # when you have already favourited a tweet
    # this error is thrown
    except TwitterHTTPError as e:
        print "Error: ", e
        return None
```

So now we have a searching method and a favouriting method. Now tell me what is left? Obviously the main code that will drive our whole program is left. So here you go:

```
def auto_fav(q, count=100):
    result = search_tweets(q, count)
    a = result['statuses'][0]['user']['screen_name']
    print a
    success = 0
    for tweet in result['statuses']:
        if fav_tweet(tweet) is not None:
            success += 1
    print "We Favorited a total of %i out of %i tweets" % (success,
          len(result['statuses']))
```

So thats it! We have a complete bot for twitter. This bot currently only favourites tweets based on a keyword. Save this code in a file called twitter_bot.py. Now you can use this bot by typing this in the terminal:

```
$ python

>>> import twitter_bot
>>> twitter_bot.auto_fav('#python','20')
```

The above command will search for 20 latest tweets containing the hashtag "python". After that it will favourite all of those tweets. This bot itself works but I can not gurantee that you will get followers quickly and I can not even gurantee that you will not get banned by twitter for using this a lot. You can use this once in a day. Hopefully I will write a twitter follower bot in the future as well but till then this script is your best bet.

## Complete script


```
from twitter import Twitter, OAuth, TwitterHTTPError

OAUTH_TOKEN = 'your oauth token'
OAUTH_SECRET = 'your oauth secret'
CONSUMER_KEY = 'your consumer key'
CONSUMER_SECRET = 'your consumer secret'

t = Twitter(auth=OAuth(OAUTH_TOKEN, OAUTH_SECRET,
            CONSUMER_KEY, CONSUMER_SECRET))

def search_tweets(q, count=100):
    return t.search.tweets(q=q, result_type='recent', count=count)

def fav_tweet(tweet):
    try:
        result = t.favorites.create(_id=tweet['id'])
        print "Favorited: %s" % (result['text'])
        return result
    # when you have already favourited a tweet
    # this error is thrown
    except TwitterHTTPError as e:
        print "Error: ", e
        return None

def auto_fav(q, count=100):
    result = search_tweets(q, count)
    a = result['statuses'][0]['user']['screen_name']
    print a
    success = 0
    for tweet in result['statuses']:
        if fav_tweet(tweet) is not None:
            success += 1
    print "We Favorited a total of %i out of %i tweets" % (success,
          len(result['statuses']))
```

This is the final result of running this sript:

```
yasoob@yasoob:~/Desktop$ python
Python 2.7.3 (default, Apr 10 2013, 06:20:15) 
[GCC 4.6.3] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import twitter_bot as bot
>>> bot.auto_fav('django',1)
Favorited: Enjoying @freakboy3742’s discussion of cultural naming patterns vis a vis Django users at #DjangoCon
We Favorited a total of 1 out of 1 tweets
>>>
```

I hope you liked todays post. If you have any questions then feel free to comment below and do follow us if you want to get regular updates from our blog. If you want me to write on one specific topic then do tell it to me in the comments below. Stay tuned for my next post.