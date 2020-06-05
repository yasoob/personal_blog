---
title: The Heartbleed bug
author: yasoob
type: post
date: 2014-04-12T08:11:44+00:00
url: /2014/04/12/the-heartbleed-bug/
publicize_facebook_url:
  - https://facebook.com/509724922449953_645600625529048
publicize_twitter_user:
  - yasoobkhalid
publicize_twitter_url:
  - http://t.co/VJ6KUvTw24
categories:
  - python
tags:
  - hacked
  - heartbleed
  - heartbleed bug
  - heatbleed python
  - openssl bug
  - openssl hacked
  - python openssl

---
Hi guys! I haven't been posting a lot recently. There are a couple of problems which have joined up and have kept me away from my computer. I will cover those reasons in the next post. So what this post is about?

Are you a sys-admin or a web master? If you are one then the chances are that you have already heard of the heartbleed bug. But for those who are unaware of this, let me explain. On 7th April a bug was spotted in OpenSSL (Yes that is the same encryption used by companies like Google, Facebook, Yahoo! etc on their websites). This bug allowed any hacker to send some carefully crafted packets to a server using OpenSSL and the server responded with more data than it should. It is a very serious vulnerability.

> The Heartbleed bug allows anyone on the Internet to read the memory of the systems protected by the vulnerable versions of the OpenSSL software. This compromises the secret keys used to identify the service providers and to encrypt the traffic, the names and passwords of the users and the actual content. This allows attackers to eavesdrop on communications, steal data directly from the services and users and to impersonate services and users.

So what does this post has to do with the bug? Well I am going to share two Python scripts with you which will help you test whether a website is vulnerable to this bug or not.

The first script is [heartbleed mass test][1] which checks Alexa top sites for this bug so that you know on which websites you have to update your password. The second one is [this scanner][2] made by Jared Stafford which I think was one of the first scanner. I could not find the original Gist so I created this new one with the same code. Lastly I would also like to mention this [online scanner][3] written by one of my friend Filippo Valsorda. This scanner has the minimum false positives and is written in Go. The source code of this scanner is also available on [GitHub][4].

There is also an [unofficial website][5] with a lot of information regarding this bug and how to fix it. If you have this vulnerability in your website then I urge you to fix it as soon as possible so that sensitive information about your viewers is not leaked. If you are using wrappers written in other languages then I urge you to update them as well as most of them have been patched by now.

If you use a website which is affected by this bug then **do not update your password before this bug has been fixed!** If you update you password before the bug is patched on that website then there are chances that your information can be leaked due to this bug.

Do share your views about this bug in the comments below and follow my blog to get more updates. Stay tuned for the next post.

 [1]: https://github.com/musalbas/heartbleed-masstest
 [2]: https://gist.github.com/anonymous/10522239
 [3]: http://filippo.io/Heartbleed/
 [4]: https://github.com/FiloSottile/Heartbleed
 [5]: http://heartbleed.com