---
title: Misconceptions about Skype local database
author: yasoob
type: post
date: 2014-04-19T12:11:25+00:00
url: /2014/04/19/misconceptions-about-skype-local-database/
publicize_facebook_url:
  - https://facebook.com/509724922449953_649363655152745
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/ZQxxDqln5x
categories:
  - python
tags:
  - protect skype
  - python skype
  - skype local database
  - skype local db

---
Hi there guys. Recently I wrote an article with the name of "[I didn’t know Skype stores your data in a local database without a password!](http://freepythontips.wordpress.com/2014/04/19/i-didnt-know-skype-stores-your-data-in-a-local-database/)". After publishing that article I got a lot of response from people like you and I came to know that it is not a vulnerability. It is so because the database is stored in the "appdata" directory which can only be accessed by the administrator which means that only an administrator account can open it. If you want someone else to use your computer just make a guest account which will restrict their level of access to the main directories only (this excludes the appdata directory). If you want to see your Skype logs then simply log in to your Skype account rather than going the complex way of accessing the local database.

However the tool ([SkypeFreak](http://osandamalith.github.io/SkypeFreak/)) which I posted about in the previous post can be used as a **post reconnaissance** tool which means that if you hack into a computer then you can use the tool to access the Skype data without knowing the password.

At last I would like to apologize all of you about any misconceptions which my previous post might have made in your mind. You can safely discard those misconceptions as my mistake.

**Source:** [Previous post](http://freepythontips.wordpress.com/2014/04/19/i-didnt-know-skype-stores-your-data-in-a-local-database/)