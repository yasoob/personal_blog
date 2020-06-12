---
title: "9 Tips For Better Scripting Experience"
date: 2020-06-12T00:17:55-04:00
draft: false
categories: ['python', 'sysadmin', 'programming']
featured_image: '/images/scripting.png'
---

During my day to day work, I have had to do a lot of scripting. This can range from running short tests in Docker containers to running super long processes in Azure Batch service. I have used Bash and Python for these purposes and learned quite a few useful techniques along the way. I am sharing them here in hopes that they might save you some time and you don't have to learn them the "hard" way. 

These tips are not organized in any particular ordering. Sit back, relax and read on :book: 

## Tip 1: Increase terminal history

Sometimes during your experimentation, you realize that the command you ran yesterday was working but you forgot what parameters you passed to it. You remind yourself that you can always press the `up` arrow key in the terminal to go back to that command. But once you start pressing the `up` key you realize that you have run a gazillion commands since then. So you try to do a recursive lookup of the command using `Ctrl + r` but it doesn't show up. This is when you are reminded that the default command history in Ubuntu (and I am assuming other Linux distros) is 1000 lines. You can increase this count to a bigger number by putting this in your `~/.bashrc`:

```
HISTSIZE=1000
HISTFILESIZE=2000
```

You can learn about the different between these two variables in [this StackOverflow answer](https://stackoverflow.com/questions/19454837/bash-histsize-vs-histfilesize).

## Tip 2: Print the arguments to screen

Oftentimes, you will find yourself making use of environment variables. One day your script works and the next day it breaks. You start debugging what went wrong but you can't seem to figure out the root cause. You decide to go back and see what arguments you passed to your script but oh boy you used environment variables and you are not sure what value those variables had when you ran the script. This is when you realize that you should have printed out the value of those variables on the screen so that you could see them in case you break your script.

This tip helped me immensely recently. I was working on a Python script and was passing some commands to a remote system. One of the commands looked something like this:

```
cmd = "docker login -u `echo $DOCKER_USERNAME` -p `echo $DOCKER_PASS`"
```

I wasn't setting up the environment variables and this command was failing with access denied error. When I printed the value of `DOCKER_USERNAME` on screen I realized that there was a typo. If I had only printed the commands on screen from the beginning I would have been able to figure out the issue right away.

## Tip 3: Print execution time

You know that the script you are working on is going to take some time to execute. You run the script in the background and go for a coffee break. You come back and the script still hasn't terminated. You ask yourself how long the script has been running for but you don't know the answer because you forgot to add time to your output.

This is so common that I have decided to make it a habit to add timing function to my script. In Python I use something similar to this:

```
import time

def timestamped_print(msg: str):
    print(f'[{time.asctime(time.gmtime())}] {msg}')
```

Then I replace a regular `print` with `timestamped_print`. It produces an output similar to this:

```
>>> timestamped_print("hi there!")
[Thu Jun 11 19:09:09 2020] hi there!
```

You can also [configure your terminal](https://askubuntu.com/questions/360063/how-to-show-a-running-clock-in-terminal-before-the-command-prompt) to print the current time as part of the prompt.

Using a logger is probably better but when you want to go even more bare-bones then this is super handy.

## Tip 4: Save the script output 

Sometimes you will find yourself working on a system where a one-line change in your script changed some part of the output. You don't pay too much attention to what lines in the output change as long as the script continues working. Then you introduce a *second* change to the script and half the output is correct and half is wrong.

You try scrolling back to the output of the initial run of your script but soon find out that it was a day ago and you can't scroll back that far anymore. This teaches you the importance fo piping the output of your script to a file during the development phase. It is super easy to do:

```
$ command &> output.txt
```

But you say "hey! I want to see the output in the terminal as well!" and I say "use `tee`":

```
$ command | tee /path/to/file
```

`tee` prints the output to screen and pipes it to a file.

Please note that in a previous tip I recommend you print the parameters and environment variables on the screen when running a script. Make sure you don't save any of those to a file which will be version controlled. We don't want your secrets leaking in git history. 

## Tip 5: Keep your scripts in version control

You will be iterating on your old scripts and will be continuously tweaking them. Sometimes you will make a tweak and realize that your change broke everything and a simple `ctrl+z` isn't taking you that far back in history. At this point, you realize how important it is to keep your scripts under version control. You will feel a lot braver while making changes to your scripts now.

I prefer to keep my script on GitHub in a private repo. You get unlimited private repos so I don't know why you would not have your scripts under version control and in a private repo.

You can also put your environment variables in a file called `.env` and then put that in your `.gitignore`. This way you can keep your important variables in one place without putting them in version control.

## Tip 6: Catalogue your experiments

You start writing a script thinking that you will be done after a couple of mins. A couple of minutes later you increase your estimate to a couple of hours and before you know it you have spent more than a day working on the same script. You look at the folder you are working in and you have a bunch of files with super descriptive names:

```
$ ls 
app.py script.py works.py new_try.py
```

You realize that you no longer know what the different files are. This is where you learn a couple of important lessons:

- You should have named your files a bit better
- You should have kept a log of what each file does

The biggest piece of advice is to always work on your projects in a way where even if you have to come back after a year, you can make sense of what is going on. This means two things:

- Give your files a more descriptive name. It might cost you an extra millisecond to type the name right now but it will save you from a lot of headaches down the road.
- If you for some reason need to have multiple files with a similar name at least write down what each file does in a simple `readme.md` file.

## Tip 7: Use `tmux` for SSH

You are working on a remote server and you are connected using SSH. Suddenly your connection drops and a long-running script terminated because of that. You look at yourself in the mirror, cry a bit, and then search online about how to prevent a similar scenario from occurring again. 

You come across [`tmux`](https://github.com/tmux/tmux/wiki/Getting-Started). You acknowledge that it has a slight learning curve but it is going to save you from a lot of similar crappy situations in the future. It can take some time getting used to it but you promise yourself that you will spend some time learning it.

Psst. You can also script `tmux` so that it opens up and runs predefined commands. You can read more about it in [this article](https://www.arp242.net/tmux.html) by Martin.

## Tip 8: Use `-E` to pass environment variables to `sudo`

Sometimes you will want to pass in environment variables to your scripts. You export the variable in the current bash window and the script works fine:

```
$ export VARIABLE=hi
$ python3
...
>>> import os
>>> os.environ['VARIABLE']
'hi'
```

But then you run your script using `sudo` and the script breaks.

```
$ sudo python3
...
>>> import os
>>> os.environ['VARIABLE']
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/lib/python3.8/os.py", line 675, in __getitem__
    raise KeyError(key) from None
KeyError: 'VARIABLE'
```

Your first instinct is to use `sudo export VARIABLE=hi` but you get an error:

```
$ sudo export VARIABLE=hi
sudo: export: command not found
```

Then you curse and reach out to Google and find out about the `-E` flag for `sudo`. You append that right after `sudo` and suddenly your script starts working again:

```
$ sudo -E python3
...
>>> import os
>>> os.environ['VARIABLE']
'hi'
```

The `-E` flag tells `sudo` to preserve the environment variables when switching to `sudo`. Super handy when you want to run a script using `sudo` and still have access to the environment variables.

## Tip 9: Print helpful error messages

You write a 100+ line script without any errors on the first try. Then you modify the script slightly and suddenly it starts to error out. It doesn't print any helpful error messages. You only print a msg when the script starts running and when it stops execution. You bang your head against the wall and question your decisions. If only you had added ample logging right from the beginning you would have been able to figure out the error source pretty easily.

There are multiple ways to add logging to your scripts. In Python, you can use the `logging` module. It provides you simple but powerful options. You can learn more about how to use it from the [official tutorial](https://docs.python.org/3/howto/logging.html). You can also make a [decorator](https://book.pythontips.com/en/latest/decorators.html#logging) to log function calls. There are a million ways to do logging. The only thing that matters is that you actually do it.

Time for a fun annecdote. I was running commands on a remote machine. Theses commands were in a list and looked something like this:

```
commands = [
    'sudo apt-get update',
    'sudo apt-get install docker.io'
    'echo "Done!"'
]
```

Do you see anything wrong with that list? I forgot a `,` at the end of the second list item! Python interpreted the second item as `sudo apt-get install docker.ioecho "done!"`.  This was obviously wrong but it took me a million years to figure out what was happening. 

This is not an exhaustive list. I learned these tips by working on multiple scripts. If you found this article useful please share it with other people. If you have your own tips that you would like to add then feel free to put them in the comments below and/or submit a pull request on GitHub. You can find the GitHub source by clicking on the "source" button right next to the title.

I will see you guys later :wave: :heart: 