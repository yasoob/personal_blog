---
title: Looking Inside Dropbox – whitepaper
author: yasoob
type: post
date: 2013-08-30T09:53:43+00:00
url: /2013/08/30/looking-inside-dropbox-whitepaper/
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:50;}s:2:"fb";a:1:{i:4182098;i:19;}s:2:"wp";a:1:{i:0;i:40;}}'
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - application
  - dropbox
  - hack
  - reverse engineer

---
Hi there folks. We all know that dropbox is made in python. It's website is made with pyramid and it's desktop applications are made with python. The existing Python bytecode reversing techniques are not enough for reversing hardened applications like Dropbox. 

Recently I came accross a whitepaper written by Dhiru Kholia and Przemysław Wegrzyn. This paper presents new and generic techniques, to reverse engineer frozen Python applications, which are not limited to just the Dropbox world. It describes a method to bypass Dropbox's two factor authentication and hijack Dropbox accounts. 

Additionally, generic techniques to intercept SSL data using code injection techniques and monkey patching are presented. The methods presented in this whitepaper are not limited to dropbox.

You can download this whitepaper from [usenix website.][1]

Do share your views after reading this whitepaper and don't hesitate following us in order to get regular updates.

 [1]: https://www.usenix.org/system/files/conference/woot13/woot13-kholia.pdf