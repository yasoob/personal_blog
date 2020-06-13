---
title: "Docker attach vs exec & When to Use What"
date: 2020-06-04T00:00:16-04:00
draft: false
categories: ["sysadmin", "internship", "docker"]
teaser: "I have been working quite a lot with Docker for my current project. If attach & exec have been giving you some trouble then this post will teach you the difference b/w both. You will also learn about when to use what."
---

Hello lovely people! :wave: During my day to day work with [SONiC](https://github.com/Azure/SONiC/) I have to launch new Docker containers and run commands within those containers. I usually have an `ENTRYPOINT` or `CMD` defined in my `Dockerfile` which means that there is always a default process that starts when I run my Docker images. When I started working with Docker I would always use the `attach` command to connect to a running container. 

As an example, my `Dockerfile` usually looks something like this:

```
FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -qy vim

COPY startup.py /startup.py
ENTRYPOINT ["python", "startup.py"]
```

I then build an image based on this `Dockerfile`:

```
sudo docker build -t yasoob/imagename 
```

Then I usually start up a container based on this latest image: 

```
sudo docker run --name container_name -it -d yasoob/imagename:latest
```

At this point, I have two ways to connect to the Docker container. I can either use `attach` or  `exec`. It is important to know the difference.

- `attach` allows you to connect and interact with a container's main process which has `PID 1`
- `exec` allows you to create a new process in the container

This significant difference in the way these both commands run loads to some useful and, oftentimes, problematic side-effects. You can essentially use the `attach` command as a terminal share system. If you are connected to the same Docker container from two different screens or terminal sessions, you can run commands on either one of the terminals and the output will be streamed in real-time to all other connected screens/terminal sessions. Think of this as a poor man's pair programming setup :sweat_smile: 

> PSA: don't actually use this for pair-programming

If you kill the main process the container will terminate.

Whereas, when you use `exec` a new process is started on the Docker container. This is the command you are supposed to use almost always unless you know what you are doing with the `attach` command. I just usually use the `exec` command to launch `bash` within the container and work with that. I use the `attach` command primarily when I quickly want to see the output of the main process (`PID 1`) directly and/or want to kill it.

I am still a beginner when it comes to containers which means that if you know something useful which I might not be aware of please write a comment below! I am learning cool new stuff every day. With that being said, I will see you in the next post! Take care :heart: :wave: