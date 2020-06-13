---
title: "Investigating SSH connection issue in SONiC"
date: 2020-05-26T02:11:18-04:00
draft: false
categories: ["programming", "sysadmin", "internship"]
teaser: 'SONiC is an open source network device operating system developed by Microsoft. In this article, I talk about an SSH connectivity issue I encountered on SONiC and how I was able to debug it and find the root cause.'
---

Hi guys! :wave: During my internship at Microsoft I am working on an automated testing pipeline for configuration files for Microsoft's fleet of network devices across Azure Data Centers. The current goal is to test the configurations for [SONiC](https://azure.github.io/SONiC/) based devices. SONiC is an open-source Linux based operating system for network devices.

This article will talk about an issue I encountered with SSH in SONiC devices and how I investigated the root cause. This wasn't a bug with the OS itself but it is still a fun story about how I did the investigation.

Currently, Microsoft uses two different types of configuration files for SONiC based switches. One is an XML based `minigraph` file and the other is the JSON based `config_db`. SONiC can load both of them and I believe both files have feature parity. SONiC has [deprecated the XML based approach](https://github.com/Azure/SONiC/wiki/Configuration#config-load-and-save) but some companies still rely on the `minigraph` files. I assume that Microsoft is in the process of moving to JSON based configuration but just because there are thousands of configuration files, the process is taking some time. This is important background information because the difference between these files led to the issue I ran into.

The testing for these configuration files is done by spinning up a Docker container and running SONiC within that container using [QEMU](https://www.qemu.org/). I got the production `minigraph.xml` and `config_db.json` files for a specific network device and was under the impression that both of these were functionally the same. I launched SONiC and loaded the `minigraph` file. Everything worked fine. I could SSH into the SONiC box and run different SONiC commands. Then I loaded the `config_db` file and SSH stopped working. This is what OpenSSH said:

```bash
OpenSSH_7.2p2 Ubuntu-4ubuntu2.8, OpenSSL 1.0.2g  1 Mar 2016
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: /etc/ssh/ssh_config line 19: Applying options for *
debug1: Connecting to 11.0.0.3 [11.0.0.3] port 22.
debug1: connect to address 11.0.0.3 port 22: Connection timed out
ssh: connect to host 11.0.0.3 port 22: Connection timed out
```

The way we run SONiC on QEMU, there are two methods to connect to a SONiC box, SSH and telnet. Even though SSH stopped working in my case, I could still telnet into the SONiC box. This was crucial otherwise I would have been completely locked out of the box. I telnet'ed into the box and checked the current running configuration. I couldn't find anything useful. I also wasn't looking particularly closely either because if the `minigraph` and `config_db` files are supposed to serve a similar purpose (provide config to SONiC) and belonged to the same network device then surely they would be the same!

The first step was to check whether the `ssh` daemon was even running on SONiC and listening on port 22. I quickly confirmed that it was running and listening on the aforementioned port. I ran `sudo netstat -tulnp` on SONiC and go this output:

```bash
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      392/sshd
```

**Command glossary:**

- `-t` lists TCP sockets 
- `-u` lists UDP sockets
- `-l` display listening server sockets
- `-n` display numerically + don't resolve hostnames (meaning 127.0.0.1 won't convert to localhost in output)
- `-p` display the program/PID working on that socket

The next step was to figure out if there was any firewall rule blocking the incoming or outgoing packets on port 22. This seemed the only other plausible hypothesis I could come up with. I ran the `sudo iptables -L -v -n` command and got this output:

```bash
 pkts bytes target     prot opt in     out     source               destination
   --truncated--
   31  1860 DROP       tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
```

**Command glossary:**

- `-L` list all the rules (when no particular chain name is provided)
- `-v` verbose mode
- `-n` numeric output of addresses and ports

This was interesting. There was a rule dropping the packets on port 22. To make sure this rule was causing the packet drop I tried connecting to SONiC using SSH again and saw the `pkt` count increase. Perfect! I found out what was stopping me from using SSH. I stopped at this point and instead of trying to remove this rule and making SSH work I decided to figure out why this rule existed in the first place.

I ran SONiC in a fresh container using `minigraph` and found that there were no `iptables` rules listed. Where were these coming from? I talked to my team and found out that even though `minigraph` and `config_db` files are interchangeable, and that both of the files that I used belonged to the same production network device, the files differed in some ways. 

The `config_db` file contained [ACL](https://en.wikipedia.org/wiki/Access-control_list) rules which the `minigraph` file didn't. I didn't see them on a first pass because the `config_db` file was around 3000+ lines and it is easy to skip *ACL* among a huge wall of text. This is why when I ran SONiC using `minigraph` it didn't block the SSH connections. Whereas the `config_db` file had a default ACL rule to drop all packets and then some whitelist rules to accept packets from certain IPs. The default rule with the highest priority in the `config_db` file was this:

```
"MGMT_ONLY|DEFAULT_RULE": {
      "ETHER_TYPE": "2048",
      "PACKET_ACTION": "DROP",
      "PRIORITY": "1"
 }
```

Just to make sure that the ACL section of the `config_db` was introducing these `iptables` rules I scrubbed the ACL property from the `config_db` file and loaded that into SONiC. SSH started working again!

I hope you enjoyed this short guided tour of one of the issues I encountered during my internship so far. I learned a lot while solving this issue. I had never delved deeper into `iptables` or even the `ip addr` command for that matter, let alone SONiC (I didn't discuss the `ip` command in this article. It is used to set up IPs on the device and I might cover that in a future post). I am loving the helpful and collaborative culture at Microsoft so far and I get a feeling that my colleagues genuinely want me to succeed. Keeping fingers crossed and hoping for even better next weeks at Microsoft :slightly_smiling_face:

See you guys in the next post! :wave: :heart: 

**Further reading:**

- [How to use the `ip` command in Linux](https://www.howtogeek.com/657911/how-to-use-the-ip-command-on-linux/)
- [SONiC homepage](https://azure.github.io/SONiC/)
- [HOSTINGER `iptables` tutorial](https://www.hostinger.com/tutorials/iptables-tutorial)