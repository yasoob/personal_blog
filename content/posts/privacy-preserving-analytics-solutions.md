---
title: "Privacy Preserving Google Analytics Alternatives"
date: 2020-06-13T04:11:51-04:00
draft: false
categories: ['privacy', 'analytics']
featured_image: '/images/privacy-analytics/hero.png'
---

Hi everyone! :wave: Lately I have been restructuring my online presence and that included running this blog using a static site generator. During this process, I decided to also look for privacy-preserving Google Analytics alternatives. When concerned with website analytics, the default solution most people reach out to is Google Analytics but there are [good reasons](https://plausible.io/blog/remove-google-analytics) for not using GA. This post will give you a rundown of the different alternatives I came across during my research. At the end of the post, I also talk about **why** and **why not** to use these alternatives.

## 1. [Plausible Analytics](https://plausible.io/)

Plausible is developed by [Uku Täht](https://twitter.com/ukutaht). As far as I am aware, it started in 2019 and has already gained a lot of traction. The famous [Changelog](https://changelog.com/) podcast has also started [using it](https://github.com/thechangelog/changelog.com/commit/ac64638097bff5e8873b219303848decb420aaf2). The code behind this service is open source and it recently became officially possible to [self-host](https://plausible.io/blog/self-hosted-web-analytics-beta) it. "officially" means that previously the code was open source but there was no guidance for people who wanted to host it themselves. Now there are docs in place and hypothetically if you follow those you will have a working instance of Plausible Analytics up and running.

It is written in Elixir using the Phoenix framework.

The User Interface is gorgeous. I recently decided to try out their service for the [Intermediate Python](httos://book.pythontips.com) book and I thoroughly enjoyed browsing the dashboard.

![Plausible Analytics](/images/privacy-analytics/plausible.png)

### Pricing

Plausible starts with a 30-day unlimited trial and then offers you three options (these options are for if you pay monthly).

![Plausible Pricing](/images/privacy-analytics/plausible-pricing.png)

### Demo

You can see a demo [here](https://plausible.io/plausible.io). 

## 2. [GoatCounter](https://www.goatcounter.com/)

If you are looking for a no-cruft solution that is usable even on a screen-reader then GoatCounter is your best bet. The author, Martin, has [written about](https://www.goatcounter.com/why) the rationale behind this project. His main goal is to keep GoatCounter simple and focused on the core function that is "counting events". It is written in Golang and the source is [available on GitHub](https://github.com/zgoat/goatcounter). The best part is that the author is super quick at responding to issues on GitHub. 

I wouldn't say I am a huge fan of the UI but it is usable and provides you with all the information you need in one cursory look. 

![GoatCounter UI](/images/privacy-analytics/goatcounter.png)

### Pricing

GoatCounter has a pretty generous free plan. If you get less than 100k views per month then you don't have to pay for it. I think this is crucial if we want to promote privacy-preserving Google Analytics alternatives. When people are so used to getting analytics information without paying, it is hard to convert them right away and ask them to pay for the same information. However, I would recommend you to pay for the service if you can afford to do so. The rest of the price plans look something like this.

![Goat Counter Pricing](/images/privacy-analytics/goatcounter-pricing.png)

### Demo

You can see a live demo [here](https://stats.arp242.net/)

## 3. [Fathom Analytics](https://usefathom.com/)

This is another service that has a [dedicated page](https://usefathom.com/google-analytics-alternative) about why they are a better alternative to Google Analytics. I believe they have been in business since 2018 and are profitable. A version of their codebase is open source and available [on GitHub](https://github.com/usefathom/fathom). I say a "version" because their [open source](https://github.com/usefathom/fathom) offering is stripped of major pro features. 

The main source-code is written in GoLang. The authors also talk about using Laravel in certain places but I wasn't able to see Laravel in the official code-base. Maybe I missed something?

The UI is similar to what we saw with Plausible. It is clean and provides you with useful and actionable insights right away. The image below is from the pro version.

![Fathom](/images/privacy-analytics/fathom.png)

### Pricing

There are three tiers just like other platforms. They are a bit expensive compared to the other solutions I have mentioned.

![Fathom Pricing](/images/privacy-analytics/fathom-pricing.png)

### Demo

Normally you can see the demo on [this page](https://app.usefathom.com/share/lsqyv/pjrvs) but at the time of writing this article, the link wasn't working.

## 4. [Simple Analytics](https://simpleanalytics.com/)

I remember seeing the launch post for Simple Analytics on Hacker News. They generated quite a buzz because of their privacy-preserving and cookie-free session tracking method. It is developed by Dave Jansen and Adriaan van Rossum and it has been in business since 2018. As far as I can tell, they have some [open source](https://github.com/simpleanalytics) presense but their core product is not open source.

The UI of the service is super clean. One useful feature which I loved was the availability of a night mode. There is a small crescent icon right next to the logo which you can use to toggle the night mode.

![Simple Analytics Dashboard](/images/privacy-analytics/simpleanalytics-dash.png)

### Pricing

This is the most expensive service on this list. I don't know if they provide anything which Plausible, GoatCounter or Fathom don't provide. I guess the one thing they do provide extra is [the API](https://docs.simpleanalytics.com/api) but I don't know how many people use it. This is the pricing if you pay monthly.

![Simple Analytics pricing](/images/privacy-analytics/simpleanalytics.png)

----------

## Benefits for using Google Analytics alternatives

1. **Cleaner UI** which makes it easy to get useful information at a single glance. The actual Google Analytics dashboard is a mess and most people (even me!) struggle with deciphering what different numbers and dashboards mean. After banging my head against the wall for a bit I can now navigate the dashboard but I always sympathize with new Analytics users.  These alternatives make sure they can cut through the noise and show the data you actually care about.
2. Ability to **add custom domains** so your tracking script is not blocked by ad blockers by default. Google Analytics doesn't support this and their tracking script is blocked by all major ad blockers. This gives an edge to the alternative and they can provide you with more accurate analytics.
3. **Less invasive** of the visitor's privacy. They don't log unnecessary user data. Most of these services don't use cookies either which means that you don't have to show a GDPR notice to your visitors.

## Issues with Google Analytics alternatives

1. Oftentimes they do a **less reliable** job of weeding out bot traffic so the numbers can be slightly less reliable. There is no doubt that Google has been in the business of detecting bot for decades. Their whole business is built around Advertising and they don't want to pay publishers for fake clicks. Therefore, they have decades worth of experience which these companies don't have.
2. You usually **have to pay** for these services. Privacy is expensive. Other than GoatCounter, all other services I mentioned are paid. If you are running a small hobby website then you normally don't want to go out of your way to pay for such a service.
3. **Google can still track your users**. A lot of people talk about using privacy-preserving alternatives because they don't want Google to track them or their visitors. However, most websites use Google fonts and if Google wants, it already has enough data to track you and your visitors. As to whether Google actually uses font requests to track users is another story. 

I tried to layout these alternatives so that other people know what is out there when it comes to **privacy-preserving** analytics solutions. Do you think you will use any of these services? If not then why? I would love to hear your responses in the comments below. Otherwise, I will see you in the nest post! :wave: :heart: