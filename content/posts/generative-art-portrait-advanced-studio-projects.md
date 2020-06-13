---
title: "Making Generative Portraits Using Processing"
date: 2020-02-05T13:35:26-05:00
draft: false
categories: ["generative-art", "processing", "algorithmic-art", "portrait"]
teaser: 'Do you know what generative algorithms are? I talk about how I used generative algorithms and Processing to make portraits for my advanced studio projects class.'
---

Hi everyone! :wave: Haven't talked to you guys for a while. Hope things are going well on your end. Last semester I was studying abroad in Budapest but now I am back at Colgate. I had the time of my life traveling all over Europe and meeting/staying with interesting people. I will try to write an article about that soon. Till then sit tight and enjoy this article about generative art.

I am taking an advanced studio projects class at Colgate. For this class, I had the opportunity to pick whatever medium I wanted to focus on. I was slightly confused between picking up drawing (scribble art) and digital (generative) art. I have been focusing on both for a while now so it was hard to figure out which one I wanted to spend my whole semester on. The anxiety was real! You can see some of my scribble art and generative art below.

![Scribble Art](/images/generative-art-project/breaking-bad.jpg)


<video controls loop src="/images/processing/art11.mp4" width="50%" style="margin: 0 auto; display: block; margin-bottom: 50px;" autoplay="true" />

<video controls loop src="/images/processing/art10.mp4" width="50%" style="margin: 0 auto; display: block; margin-bottom: 50px;" autoplay="true" />

Instead of deciding to pick up one of these I decided to challenge myself by picking both! I asked myself, is it possible to come up with an algorithm that can generate scribble art from a source image? Early research suggested that it was doable and for the first assignment I settled on working with generative scribble art for this class.

I searched around and found some resources. I haven't worked with processing too much. I have spent only a month or two at max exploring the program so it was a nice opportunity to get to know the program better as well.

A useful resource was [this](https://discourse.processing.org/t/curve-density-over-an-image/3210/12). [Jason](https://stirman.net/) shared high-level details for the algorithm he was using to make portraits like this:

![Stirman Portrait](https://aws1.discourse-cdn.com/standard10/uploads/processingfoundation1/original/2X/d/db5e48f76c42d6fdc7e78339cb0f35baeb37ac25.png)

The other night I sat down and decided to come up with an algorithm for this (inspired by Jason's algorithm) and this is the output I got:

![Source Image](/images/generative-art-project/marilyn.jpg)

![Output Image](/images/generative-art-project/marilyn-output.jpg)

If you re-run the algorithm it will produce a slightly different output (this is where the term generative comes in):

<video controls loop src="/images/generative-art-project/output.mp4" width="100%" style="margin: 0 auto; display: block; margin-bottom: 50px;" autoplay="true" />

My algorithm varies slightly from Jason's algorithm in the way it generates scribbles outside the main portrait. I like these kinds of scribbles so I explicitly tried to add them in at random locations.

This is just the very basic version of the algorithm. There are a bunch of things I want to change:

1. Make sure there are fewer scribbles over "white" areas in the source image
1. Vary the weight of the scribbles
1. Maybe try different colors
1. Reduce the total number of scribbles

By the end of this semester, I also plan on making a plotter so that I can add more "physical" touch to my generative art pieces. Currently, it feels very detached from me as an artist and I think making a plotter will help change that and will also indulge the "engineer" side of me.

If you have any ideas/improvements/suggestions I am all ears :smile: I will see you in the next article! :heart: 