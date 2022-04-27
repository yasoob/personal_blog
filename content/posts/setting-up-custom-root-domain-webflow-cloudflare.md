---
title: "Setting Up Custom Root Domain using Webflow and Cloudflare"
date: 2022-04-28T03:08:35+05:00
teaser: "Are you trying to set up a custom root domain with Webflow & Cloudflare but it is not working? I recently did the same and faced some issues. Let me save you some time and show you how to set it up. By the end, you will have working redirection from www subdomain to your root domain."
featured_image: '/images/webflow-cloudflare/hero.png'
draft: false
categories: ['no-code', 'webflow', 'dns']
---

Hi everyone! :wave:

I tried Webflow for the first time a few days ago and fell in love with it. I have been programming for a good number of years now and I am fairly comfortable with HTML and CSS but I can't imagine building complex interactions without Webflow anymore. The grass is surprisingly mostly green on the other side :laughing:

## Problem

But you aren't here to listen to my praise for Webflow. You are probably here because you tried to set up a custom root domain with Webflow and it failed. Maybe you also received the "Error too many redirects" error like I did when I was trying to make it work and the Webflow University article wasn't making much sense. Or maybe you were able to get the `www` subdomain routing to work with Webflow but want to set up root domain routing instead. In this post, I will go through a few of the errors I faced and how I was able to fix them and successfully set up root domain routing.

![Too many requests error](/images/webflow-cloudflare/too-many-requests.png)

*Caption:* Error too many redirects

## Setting up a custom domain on Webflow

The very first step is to go to your Webflow project settings and add a new custom domain:

![webflow-custom-domain](/images/webflow-cloudflare/webflow-custom-domain.png)

You will see that Webflow automatically adds the `www` subdomain. At this point you can scroll to the top of the project settings page and publish your website on the new domain you just added:

![webflow-domain-publish](/images/webflow-cloudflare/webflow-domain-publish.png)

Now we need to go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and set up our DNS records. 

## Setting up DNS records on Cloudflare

I am going to use `yasoob.me` as an example domain for this article.

![cloudflare-add-site](/images/webflow-cloudflare/cloudflare-add-site.png)

Go ahead and add the following two CNAME records on the next page:

```
CNAME     @      proxy-ssl.webflow.com
CNAME     www    proxy-ssl.webflow.com
```

The `@` will automatically convert to your root domain once you enter the record. Make sure you set the **Proxy status** to DNS only. Otherwise, the SSL will not work.

![cloudflare-dns-records](/images/webflow-cloudflare/cloudflare-dns-records.png)

This will automatically turn on CNAME flattening as we have a CNAME pointing root to Webflow. 

![cloudflare-cname-flattening](/images/webflow-cloudflare/cloudflare-cname-flattening.png)

If you were receiving the `Too many redirects` error before you started following this guide, chances are that you had also added the `A` records to Cloudflare.  Your configuration might have looked like this:

![cloudflare-wrong-dns](/images/webflow-cloudflare/cloudflare-wrong-dns.png)

This configuration will work fine if you want to have the `www` subdomain as the main website and redirect people from `root` domain to this subdomain. But it will not work if you want to use the root domain as the main website and redirect people from the `www` subdomain to your root domain.

## Marking root domain as default on Webflow

Now we just need to go to project settings on Webflow and mark the root domain as the default website:

![webflow-default-domain](/images/webflow-cloudflare/webflow-default-domain.png)

Sweet! now you just need to wait for a while, let the DNS changes propagate, and then visit the newly published website.

## Bonus

When I was trying to connect Cloudflare with Webflow, I was running `dig` to verify if the DNS changes had successfully propagated. However, once Cloudflare started handling my DNS, I saw the following error in `dig` output:

```
$ dig @1.1.1.1 yasoob.me                                                                                                                  

; <<>> DiG 9.10.6 <<>> @1.1.1.1 yasoob.me
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 34361
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
; OPT=15: 00 16 61 74 20 64 65 6c 65 67 61 74 69 6f 6e 20 61 73 65 63 2e 63 6f 6d 2e 70 6b 2e ("..at delegation yasoob.me.")
; OPT=15: 00 17 5b 32 36 32 30 3a 34 64 3a 34 30 30 30 3a 36 32 35 39 3a 37 70 6b 20 41 ("..[2620:4d:4000:6259:7:2:0:1]:53 rcode=REFUSED for yasoob.me A")
;; QUESTION SECTION:
;yasoob.me.			IN	A

;; Query time: 678 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Thu Apr 28 00:55:18 PKT 2022
;; MSG SIZE  rcvd: 140
```

I thought I had misconfigured Cloudflare. I am not a DNS expert. I know enough to be dangerous but this `REFUSED` error was above my paygrade. 

I tried changing the DNS server I was using to resolve the domain and surprisingly it didn't give the same output:

```
$ dig @8.8.8.8 yasoob.me 

; <<>> DiG 9.10.6 <<>> @8.8.8.8 yasoob.me
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 22014
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;yasoob.me.			IN	A

;; ANSWER SECTION:
yasoob.me.		60	IN	A	52.49.198.28
yasoob.me.		60	IN	A	3.248.8.137
yasoob.me.		60	IN	A	52.212.43.230

;; Query time: 140 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Thu Apr 28 00:55:15 PKT 2022
;; MSG SIZE  rcvd: 72
```

It was also not working in my browser and I was out of ideas. Then the one thing I didn't expect to help, helped. It was ...waiting... 😂 Turns out when they ask to give DNS propagation some time, they aren't saying that for no reason. I waited and the error just vanished. Cloudflare also started returning the correct results as the Google DNS. So I guess what I am trying to say is that for certain errors with DNS, make sure you have waited a while before aimlessly searching for solutions. Maybe the error will resolve itself in due time.

One more thing, if you are trying to set up Google Search Console and Google asks you to put a TXT record in your DNS records, you can use `@` as the host. They don't specify the host when they give you the instructions so I hope this helps you in case you try to figure that out next :smile:

## Conclusion

I hope this article helps save you some time while trying to integrate Cloudflare and Webflow and setting up a custom root domain for the latter. If you have any questions/suggestions/feedback please write them in a comment below or shoot me an email.

Have a good day! :heart: