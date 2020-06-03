---
title: "SONiC load vs reload headache"
date: 2020-06-03T00:20:25-04:00
draft: false
categories: ["internship", "microsoft", "sonic"]
---

Another day and yet another article about a problem I encountered during my internship and how I managed to solve it. This article is regarding [SONiC](https://github.com/Azure/SONiC) as well. I will talk about how there are fundamentally two different ways for loading a configuration in SONiC and how that difference caused me so much pain :cry:

It was a regular, fun day and I was running SONiC image in a virtual machine on my Ubuntu 18.04 host machine. I was trying to verify if SONiC was loading a configuration file successfully and wasn't encountering any issues during the process. I got a sample [`config_db.json`](https://github.com/Azure/SONiC/blob/gh-pages/doc/config_db.json) file and got started.

After launching a SONiC VM I telnet'ed into it:

```
Last login: Tue Jun  2 19:31:21 UTC 2020 on ttyS0

You are on
  ____   ___  _   _ _  ____
 / ___| / _ \| \ | (_)/ ___|
 \___ \| | | |  \| | | |
  ___) | |_| | |\  | | |___
 |____/ \___/|_| \_|_|\____|

-- Software for Open Networking in the Cloud --

Unauthorized access and/or use are prohibited.
All access and/or use are subject to monitoring.

Help:    http://azure.github.io/SONiC/

**************
Running DEBUG image
**************
/src has the sources
/src is mounted in each docker
/debug is created for core files or temp files
Create a subdir under /debug to upload your files
/debug is mounted in each docker
```

Then I copied a functional `config_db.json` file into this SONiC VM at `/etc/sonic/config_db.json` and tried loading it in:

```
$ config load
```

According to the output of `config -h` in SONiC VM:

```
load                   Import a previous saved config DB dump file.
```

Well, that sounded perfectly fine to me. I was trying to load a previously saved config DB dump file. But there was a problem. After running this `load` command I tried checking out the `runningconfiguration` of my SONiC VM. There was an issue. It had certain properties that were not part of the `config_db.json` file I loaded. Even more alarming was the fact that it was introducing some BGP neighbors which weren't there in the `config_db.json` I loaded.

If I remember correctly the BGP neighbors were more or less similar to these ([I took these from the actual SONiC docs](https://github.com/Azure/SONiC/wiki/Configuration#redis-and-json-schema)):

```
"BGP_NEIGHBOR": {
    "10.0.0.57": {
        "rrclient": "0", 
        "name": "ARISTA01T1", 
        "local_addr": "10.0.0.56", 
        "nhopself": "0", 
        "holdtime": "10", 
        "asn": "64600", 
        "keepalive": "3"
    }, 
    "10.0.0.59": {
        "rrclient": "0", 
        "name": "ARISTA02T1", 
        "local_addr": "10.0.0.58", 
        "nhopself": "0", 
        "holdtime": "10", 
        "asn": "64600", 
        "keepalive": "3"
    },
}
```



It took me a long time to figure out why this was happening. I cataloged the config differences I observed between the `config_db.json` and `runningconfiguration` and got in touch with a SONiC maintainer inside Microsoft. I was pretty confident about my approach but after I shared these differences he asked me how I was loading the new config. When I told him about the `load` command he cut me halfway and told me the issue. I was using `load` whereas I should have been using `reload`. 

My immediate reaction:

<img src="/images/mind_blown.gif" alt="Mind Blown" style="width: 100%; margin-bottom: 20px;"/>

According to the output of `config -h` in SONiC VM

```
reload                Clear current configuration and import a previously saved config DB dump file. 
```

The important bit to note here is `Clear current configuration`. What was happening in my case was that SONiC was loading the newly passed in config DB dump on top of what it already had in memory. By default it was launching with some BGP neighbors and they weren't getting reset via the `load` command. 

Needless to say, when I used the `reload` command almost all of the differences between `config_db.json` and `runningconfiguration all` went away. Now I am one happy coconut and can move on to more fun stuff :smile: 

In retrospect, I could have solved this problem a lot quicker if I had compared the `runningconfiguration` of a default SONiC VM with the output I was getting after loading a config DB dump. That way I would have figured out where the BGP neighbors were coming from. I could have also just read the SONiC command manual a bit more thoroughly. Kids, always read the friggin manual!

I hope you learned a thing or two from my experience. I will try to keep you guys posted about all sorts of issues I encounter. Stay safe and goodbye!:heart: :wave: 