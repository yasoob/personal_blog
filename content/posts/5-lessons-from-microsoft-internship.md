---
title: "5 Lessons From my Microsoft Internship"
date: 2020-08-13T14:03:01-04:00
draft: false
categories: ['internship','personal']
featured_image: "/images/microsoft-internship/header.png"
teaser: "My Microsoft internship ended on 31st August. I had a wonderful time there and learned a lot of useful tips/lessons. In this article, I share 5 lessons that helped me the most. If you want to improve your internship/job experience make sure you read this."
---

Hi lovely people! :wave: A week ago my internship at Microsoft ended. I am very fortunate to have been able to intern at all this summer, let alone at Microsoft. I learned quite a lot during the summer and was fortunate enough to be a part of an amazing team. I wanted to take a moment and share some important lessons I learned. Some of these are new and some were learned at my previous internship and I learned their importance after applying them at my Microsoft internship. 

### Always make notes

When you are being onboarded for any new role, a lot of new information is thrown your way. Try and make notes about it all. There will be times when you will have to refer back to this information so it is useful to have it in a central place. This can also serve as a useful resource for any other new hire who needs to get on-boarded. You can easily answer most of their questions because you went through the same process and have all the information in a central place. You can also offer helpful suggestions about how to improve the onboarding experience for new hires.

I write notes in a markdown based editor in a single file. I create a new header for each day and also write down my notes for the next day's SCRUM at the end. This file serves as a single source of truth that I can quickly search. This will also help you write a [brag document](https://jvns.ca/blog/brag-documents/). This note-taking habit has been the biggest productivity multiplier for me.

### Find out your resources

After joining a new team try to ask your teammates about what they do and what they are working on. Apart from being a good ice breaker, it gives you some clues about who you can reach out to for questions about some particular piece of code. This is even more important and useful in a remote setting where you can not organically meet new people. Moreover, during an internship (and a job) it is always a good sign if you can unblock yourself without waiting for your mentor/manager to do it for you, and finding out your resources is the first step. 

Be proactive and set up one-on-one coffee chats with your teammates yourself. A useful side effect of this (especially during COVID and everything being remote) is that you start to humanize people and start forming an emotional connection with them. It is really easy to treat people crudely if you don't see them in person and this helps counter that.

### Never make assumptions about library code

This one bit me hard. I was making use of the Azure Batch library in Python and then had to convert some of the code to C#. During the conversion, I started getting a 400 bad request error during a certain step and had no clue what was going wrong. After pulling my hair for a while and enlisting the help of my manager, I found out that both libraries expect arguments in a slightly different order. I had made assumptions that similar methods in both libraries would expect the arguments in the same order but that wasn't entirely true. 

Make sure you don't make API assumptions and rely on IntelliSense (or whatever your IDE provides) instead. It is also extremely useful to specify the argument names even when they are optional. For example, in C# you can do either of this:

```
PrintOrderDetails("Gift Shop", 31, "Red Mug");

// or

PrintOrderDetails(sellerName: "Gift Shop", orderNum: 31, productName: "Red Mug");
```

[Source](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/named-and-optional-arguments)

The second option should always be preferred because it allows anyone to understand what arguments are being passed into a function/method without going to the function definition. It takes a bit longer to be this verbose but just like [Robert C. Martin](https://www.goodreads.com/quotes/835238-indeed-the-ratio-of-time-spent-reading-versus-writing-is) said:

> Indeed, the ratio of time spent reading versus writing is well over 10 to 1. We are constantly reading old code as part of the effort to write new code. ...[Therefore,] making it easy to read makes it easier to write.

### Make sure you understand the overall picture

Whenever you start working on a big enough project, you will have to sit in multiple meetings with different stakeholders. These meetings will involve lengthy discussions about small parts of the project. All of this will often give you a false sense of understanding of the required solution. I experienced it first hand. What I mean by false understanding is that you will think the problem requires solution A whereas, in reality, it requires solution B. This becomes a problem when the solution has to integrate with an already existing system. 

Make sure at the end of each meeting you are still aware of the bigger picture and know how the existing system currently works. This big picture understanding will help you ask more targetted questions and end up with a usable solution.

### Cold messaging works

When you intern or join any company as a full-time employee, you will be scared of cold messaging other people at the company. I know I was. However, when I started reaching out to people and started asking questions, I was pleasantly surprised by how many of them responded. I had remote coffee chats with so many wonderful people and each one taught me something new. I wouldn't have learned so much if I hadn't cold messaged people.

It is easy to forget that everyone is in the same boat. Most of us want to meet new people but only a few of us dare to take that first step. But once you take that first step, the reciprocal effect is pretty amazing. Soon your new acquaintances will help connect you to even more people and you will get to experience the networking magic.

### Conclusion

I would again like to thank all the wonderful people I met at Microsoft. I hope you, dear reader, learned some useful tips from this post. If any of these resonate with you or if you have some other tips please let me know in the comment section below. If enough people show interest, I might try to write a more targeted post about how I got this internship. See you in the next post :heart: