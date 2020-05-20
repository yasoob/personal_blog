---
title: "Setting Up Passwordless SSH and Alias For Remote Login"
date: 2020-05-20T19:29:32-04:00
draft: false
categories: ["programming", "devops"]
---

Hi lovely people! :wave: Long time! If you guys are wondering what I have been up-to, don't worry. I am doing well and currently in the process of writing a life update post. Till then enjoy this short tutorial. By the end of this tutorial you will be able to ssh into a remote machine without typing in its IP or the password in your terminal. This is extremely helpful when you are working with remote machines most of the time.


Setting up Passwordless SSH
----------------------------

- Check if you already have a key-pair generated on your machine or not:

```
$ ls ~/.ssh
```

If you have a bunch of files in there then chances are you already have a key generated on your system. I had the following files in there:

```
id_rsa
id_rsa.pub
known_hosts
```

If the output shows an empty folder then you need to generate a new key. Skip the next step if you already have a key generated. 

- Generate an SSH key on the host machine:

```
$ ssh-keygen
```

It will prompt you to type in a passphase. I left it empty for a truly passwordless experience.

- Copy the public part of the key to the remote server

If you chose the default values and simply pressed enter while running `ssh-keygen` then your public key is most probably stored in `~/.ssh/id_rsa.pub`. We need to append the contents of this file to the `~/.ssh/authorized_keys` file on the remote server. 

This can be done in a one line command: 

```
$ cat ~/.ssh/id_rsa.pub | ssh user@remote-host "cat >> ~/.ssh/authorized_keys"
```

It will prompt you for the password of your remote machine which you are trying to ssh into. Enter that and you should be done. 

Noe the next time you try ssh'ing into the remote machine you will not have to type in your password. It will automatically log you in.

Creating alias for remote host
-------------------------------

Instead of typing the ip address of the remote host each time we want to ssh into it, we can set-up an easy to remember alias. In order to do that we need to create a new file (if it doesn't already exist) `~/.ssh/config`. 

```
$ touch ~/.ssh/config
```

Now open this file and add the following content to it:

```
Host alias
    User yasoob
    HostName remote_host_ip
    Port 22
```

Modify alias to whatever you want to call this server. I prefer calling mine `home` or `work` if there is only one home or work server. Replace `remote_host_ip` with the ip of the remote server and if you use a custom port replace 22 with that. If you use the default ssh port then you can skip that last line.

Once you save these changes you can ssh into the remote server by just running:

```
$ ssh alias
```

I hope you enjoyed the article. I will let you go with some fun reading material:

- [My SSH server knows who you are | Hacker News](https://news.ycombinator.com/item?id=10004678)
- [How SSH got port number 22](https://www.ssh.com/ssh/port)
- [ssh-agent explained](https://smallstep.com/blog/ssh-agent-explained/)

Take care and stay safe :heart: :wave: