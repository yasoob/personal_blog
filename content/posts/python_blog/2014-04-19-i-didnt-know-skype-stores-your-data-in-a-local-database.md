---
title: I didn’t know Skype stores your data in a local database without a password!
author: yasoob
type: post
date: 2014-04-18T19:07:53+00:00
url: /2014/04/19/i-didnt-know-skype-stores-your-data-in-a-local-database/
publicize_facebook_url:
  - https://facebook.com/509724922449953_648985058523938
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/vBJ65Q11yl
categories:
  - python
tags:
  - get skype data
  - hack skype
  - hack skype id
  - python skype hacker
  - skype
  - skype get data
  - skype hacked

---
Hi guys! How are you? I hope you are doing great. Recently I came to know that Skype (video conferencing software) stores a local database with almost all information of a user who has logged on to skype from that computer. You might be thinking "So what? A lot of apps do that, right?". Yes you are right. This is mostly done to increase speed. It's like caching the content so that whenever you log in again to your account you don't have to wait to see your contacts. It is fine but only to this extent.

I came to know that one can take a look at the local database and extract data from it. Is that scary for you? No? Listen this. If you have some guests at your house and someone from them is a computer freak and asks you to let him use your computer. What will you do? Definitely you will say ok.

Now comes the scary part. That freak can use a simple program called SkypeFreak to connect to the **local Skype database** and get the info regarding your friends, the messages you have sent, the calls you have made and their duration etc, without knowing your password! He can even know about the secret messages which you send to your girlfriend. I guess now that seems scary. Right? Lets move on and see how this SkypeFreak works.

**[SkypeFreak][1]** is a simple Python program written by **[Osanda Malith][2]** for info-sec purposes. He is a security person, not a professional programmer. I recently stumbled on his program and ended up doing a complete rewrite of the source code to make it more readable, shorter and compatible with Python 3. This program contains some carefully crafted database queries which return the data from the database. Some example queries include:

```
SELECT fullname, skypename, city, country,\
datetime(profile_timestamp,'unixepoch') FROM Accounts
```

```
SELECT displayname, skypename, country, city, about,\
phone_mobile,homepage, birthday , datetime(lastonline\
_timestamp,'unixepoch') FROM Contacts;
```

The database can be connected with our Python script using sqlite3 and then we can execute these queries. The only gotcha is that the freak has got to know you Skype username but we all know that the auto complete option in Skype client can help us get that. Lets understand the main working of this program.

In all major OS's **Skype stores the database in a known location without any encryption or password** **(not even a simple one)**. For example on windows it is stored in

```
<$appdata>\Skype\<skype username>\main.db
```

Firstly you tell SkypeFreak about the skype username of the victim. After that SkypeFreak searches the local directories for a folder with that name and finally it lays its hands on the database. Furthermore after connecting to that database SkypeFreak gives you some options like get calls data, get messages data etc. When you utilize any of these commands SkypeFreak prompts you to save this info in a separate text file. That's it! Now you are hacked! The freak can not do much with your Skype account. He only gets the data out of it, not your password which means that you do not have to change your password.

I was myself shocked when I got to know that it's that simple to get Skype data. Microsoft should take some steps to ensure the privacy of user and prevent this type of data falling into wrong hands. They should at least password protect the database so that it is not this much simple to access it. The password can be hard-coded into the application or anything like that. I can no longer trust Microsoft with my sensitive data. If you have any questions, comments or suggestions feel free to comment below.

Last but not the least, follow my blog in order to stay up to date with my new articles. See you later!

**Source:** [SkypeFreak][1]

 [1]: https://github.com/yasoob/SkypeFreak
 [2]: https://twitter.com/OsandaMalith