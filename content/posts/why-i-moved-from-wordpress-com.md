---
title: " Why I Moved Away From Wordpress.com"
date: 2020-06-08T00:57:04-04:00
draft: true
categories: ['wordpress','migration']
---

Hi everyone! :wave: Quite a few of you got directed to this website from my old [Python Tips](https://pythontips.com/?theme_preview=true) blog. The old blog was Wordpress based and I recently moved everything to Hugo. I am still in the process of figuring certain things out but so far everything has been working out perfectly. I alluded to this post for a while and told you all that I will write down my reasoning for why I moved away from Wordpress.com. 

## WordAds vs custom ads

Wordpress allows you to use WordAds to earn money from Ads. It was quite nice to have a side-income but there were a lot of major issues with it. If you open up the developer tools and monitor the background requests which WordAds make you will be scared. I know I was. The image below shows just a small chunk of these requests. 

![Word Ads queries](/images/why-exit-wordpress/image-20200607154745632.png)

I was more worried about the privacy implications than the performance implications of this. I am willing to trust [Automattic](https://automattic.com/) but not the other ad companies they partner with. I am not against ads because they help people like myself to publish free content but I am against tracking users this deeply. 

There needs to be a middle ground and I think [Carbon Ads](https://www.carbonads.net/) provides that. There is a reason [Read The Docs](https://docs.readthedocs.io/en/stable/advertising/ethical-advertising.html) and [Coding Horror](https://blog.codinghorror.com/) uses them. I was routinely reached out by someone from their team to convince me to use their ad service on Python Tips. I couldn't do that on Wordpress.com because I was locked into using WordAds for my free account. Well, not anymore! 

The next step for me is to get back to the Carbon Ads folks and get their "ethical" ads running on my website.

## CSS and HTML customizations

Wordpress.com allows you to customize certain aspects of your website but as soon as you want to add additional CSS you are told to buy the Premium Plan. I wasn't really willing to do that. This caused me some issues with how the code was listed on the website. For example on the original [Wordpress.com](https://freepythontips.wordpress.com/2019/09/18/filtering-closing-pull-requests-on-github-using-the-api/?theme_preview=true) website I couldn't reduce the font-size of code and neither could I use syntax highlighting. I did have the option to embed GitHub gists but they were also terribly rendered.

![image-20200607154944376](/images/why-exit-wordpress/wordpress-code-listing.png)

Over the years I made my peace with the fact that the code on my website wasn't going to be beautifully rendered. But lately, I started to feel guilty. I thought to myself that if I don't like reading code listings which have a huge font and aren't syntax highlighted then how can I expect other people to do it? The only way to get rid of that guilt was to either pay for Wordpress premium or host the website somewhere else. I ended up opting for the second option and decided to ditch Wordpress completely.

Now the code listings look cleaner and more readable. 

![image-20200607155018113](/images/why-exit-wordpress/blog-code-listing.png)

And as a bonus, I also enabled the option for dark mode on the website. So whenever a visitor turns on the dark mode, the color of the whole page, as well as the code listings, changes.

![image-20200607155044802](/images/why-exit-wordpress/blog-dark-code.png)





## Performance (Lighthouse score)

Over at wordpress.com, I had very little control over the performance of my website. The inner nerd in me wasn't happy with that. Just look at these Lighthouse scores for the Desktop version of the Wordpress blog (mobile version results were just a tad bit better in terms of performance).

![Lighthouse pythontips](/images/why-exit-wordpress/lighthouse-pythontips.png)

I couldn't go and hack the theme my Wordpress.com blog was using. Even with the basic premium package of Wordpress.com, there are a lot of restrictions regarding what one can and can not do. By moving away from Wordpress.com and converting the blog into a more clutter-free theme I was able to churn the following scores. It's not perfect but it is a lot better than what I had with Wordpress. 

![lighthouse yasoob.me](/images/why-exit-wordpress/lighthouse-yasoob.me.png)

## Google Analytics vs Custom Analytics

With the basic version of Wordpress, I was locked into using the default analytics provided by Wordpress. These were more than enough for my needs but they were blocked by my mainly tech-literate audience. I don't blame them. I also block trackers using UBlock Origin. Just like ads, I am not against tracking either but only as long as it is done in an ethical and privacy-preserving way.

With no way to set up custom analytics on Wordpress.com, I had to figure out another way and the only course of action I could think of was to move away. I ended up setting up a custom [Shynet](https://github.com/milesmcc/shynet/) instance. It allows me to ethically track of important analytics. And just because the analytics endpoint is hosted at my domain and not on the domain of any well-known analytics company, the ad blockers don't block it. I have set this up for the [Intermediate Python](http://book.pythontips.com/) website as well and the difference is stark. At one point Google reported 18 active users whereas Shynet reported 40+ active users. Hopefully, after a week of testing, I will disable Google Analytics on my websites.

And it only helps that Shynet has a gorgeous UI.

![Shy net UI](/images/why-exit-wordpress/shynet.png)

## Moving away from Python

This one has little to do with why I moved away from Wordpress but more so with why I changed the domain to yasoob.me. The simple answer is that I could have potentially let the domain stay the same: `pythontips.com`. I could continue blogging at that domain but I haven't been working with Python extensively over the last couple of months. This means that I wasn't always particularly excited to write Python targeted content and if the content wasn't targeted towards Python then I didn't want to publish it on **Python** tips. It's not like I wasn't 

I didn't write any new Python post since [September 18, 2019](https://yasoob.me/2019/09/18/filtering-closing-pull-requests-on-github-using-the-api/) and that made me feel guilty. Every single night before going to bed I used to think about thousands of people who had subscribed to my blog and were waiting for new content. I felt as if I was letting all of my readers down even though I hadn't made them any commitments. Consolidating all of my content at my [personal website](https://yasoob.me) meant that I could continue pushing out new content but I didn't have to focus only on Python. 

## Allowing users to fix mistakes

Everyone who writes technical (or almost any kind) content knows that even a slight oversight will inadvertently lead to mistakes in the code listings. It has happened to me in the past and there are two things I can do.

1. Wait for a reader to comment on the post and point out the mistake
2. Let the readers edit the content itself 

Wordpress didn't allow me this kind of control. I could only opt for option 1 and edit the article myself. I wanted to let people make changes to the article and fix mistakes - even add more details if required. Hosting the articles on [GitHub](https://github.com/yasoob/personal_blog) and generating the website from that means that I can do this now. Every single post on this blog has a "source" button right next to the title which takes you to it's GitHub page.

![GitHub source](/images/why-exit-wordpress/github-source-btn.png)

## What I miss from Wordpress.com

I dearly miss the auto publicizing feature of Wordpress. I didn't have to pay Wordpress.com to set up direct email subscriptions for new posts for readers. Now with a static blog, I don't have that. There are options though. I can use Mailchimp and set up [RSS to email](https://mailchimp.com/features/rss-to-email/) but it is super expensive. I have around 4000+ subscribers and Mailchimp wants me to pay $50 per month. Once the subscriber count crosses 5,000 I will have to pay $75 per month. It's too much for hosting a hobby blog and I am not willing to pay it. But I do need to set 

I don't think there is anything else I particularly miss. If I can think of something else I will update this post. I am sure I could have fixed some of these issues by using self-hosted Wordpress but I wanted to try the self-hosted route. 

Well, that's all for today people. I will see you in the next post :heart: :wave: