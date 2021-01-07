---
title: "How to Prerender React Apps Using Prerender"
date: 2021-01-08T01:29:50+05:00
draft: false
categories: ["Python", "React", "NGINX", "prerender"]
slug: "/how-to-prerender-react-apps-using-prerender-io-seo"
featured_image: '/images/prerender/header.png'
teaser: "I am currently working on a React based app and had to implement prerendering for SEO purposes. In this post, I will show you complete steps for running the prerender.io service on your own server and serve it via NGINX. This will help you improve your app's SEO."
---

Hi everyone! :wave: I have been working on a sports analytics startup and the whole front-end is made using React. I haven't had to work on such a big React project before this and so it brought along some unique challenges. In the past, SEO hasn't been a big issue for the web projects I have worked on. I could always just add relevant data to the meta tags, define the navigation using semantic HTML tags and Google would show the website correctly on its result pages. However, this time, the whole website was being generated using client-side Javascript. On initial load, there is close to nothing on the web page and the navigation becomes available only when JavaScript is executed. 

Even though Google crawler can execute Javascript, it is a better SEO practice to serve it a rendered application instead of relying on it to render the application on its own. Moreover, if the rendering takes longer than some set time, the crawler would simply move on. In this article, I will show you how to get the prerender service up and running on your server and serve it via NGINX to different bots and boost your SEO.

## Looking for a solution

I searched around and found multiple solutions to this problem. [Certain node scripts](https://medium.com/superhighfives/an-almost-static-stack-6df0a2791319) could be run as a post-processing step and they would output a rendered React app. I tried using them but none worked flawlessly without requiring me to tweak the app code significantly. It is easier to incorporate such tools at the start of a project. Adding them later just leads to a lot of pain. I was looking for a plug-and-play solution so I kept looking. 

I soon came across [prerender](https://prerender.io/). This service acts as a middleware between your application and the end-user. It uses Headless Chrome to render HTML. If the end-user is a human, the server will return HTML + JS and the React code will be rendered on the client-side. However, if the end-user is a bot then the server will send the HTML + JS to the prerender service and return the rendered static HTML page to the bot. There are multiple similar services. I could have just as easily used [renderton](https://github.com/GoogleChrome/rendertron) but prerender just seemed more popular so I went ahead with that.

**Note:** It goes without saying that this might not be the most efficient solution but it works for my use case. Your mileage may vary so try at your own risk :smile:

 This is how a typical flow with the prerender service looks like:

![prerender-flow](/images/prerender/prerender-flow.png)

The prerender service will cache the static HTML for a while before requesting a new copy from the server. This method did not require me to change anything on my React app and only required me to make some adjustments to the NGINX server configuration.

This is how my application was being served before prerender came into the mix:

![server-arch](/images/flask-react-login/server-arch.png)

After adding prerender, the flow looked something like this:

![final-flow](/images/prerender/final-flow.png)

## Setting up prerender service

There are two ways you can make use of the prerender service. You can either make use of the [paid hosted service](https://prerender.io/) (contains a free plan as well) or you can run the [open source service](https://github.com/prerender/prerender) on your server and interface with that. I decided to opt for the latter. The first step was to install prerender on the server. It was fairly straightforward to do so using npm:

```
$ npm install prerender
```

The next step was to create a new node script that ran the service. These 3 lines are enough to get the service up and running:

```
const prerender = require('prerender');
const server = prerender();
server.start();
```

Save this code to a `server.js` file and run it using node:

```
$ node server.js
```

At this point you can go ahead and test whether the prerender service is working correctly or not by opening [http://localhost:3000/render/?url=https://google.com/]([http://localhost:3000/render/?url=https://google.com/]). This should display the Google homepage. If the images don't show up correctly, don't worry. The issue will be fixed when we serve the prerender service via NGINX.

## Run prerender on system start

The next step is to run prerender on system start and make sure it keeps running in case of crash or system restart. We will make this happen by creating a systemd service file. I am assuming that you saved the `server.js` file in your home folder. My home folder is `yasoob` but yours might be different so make sure you edit the `WorkingDirectory` path. Create a `prerender.service` file in `/etc/systemd/system` folder with the following contents:

```
[Unit]
Description=Prerender server for bot crawling
After=network.target

[Service]
User=yasoob
WorkingDirectory=/home/yasoob/
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

In this file, we are telling `systemd` to start `server.js` when the network is up and running. The service would launch under the user `yasoob` and the command it needs to run is `/usr/bin/node server.js`. The script would also automatically restart in case of a crash or system restart.

After saving this file, let's make sure `systemd` can recognize it:

```
$ sudo service prerender status

● prerender.service - Prerender server for bot crawling
     Loaded: loaded (/etc/systemd/system/prerender.service; disabled; vendor preset: enabled)
     Active: inactive (dead)
```

Perfect! Now let's start the service and then check the status:

```
$ sudo service prerender start
$ sudo service prerender status

● prerender.service - Prerender server for bot crawling
     Loaded: loaded (/etc/systemd/system/prerender.service; disabled; vendor preset: enabled)
     Active: active (running) since Thu 2021-01-07 19:59:46 UTC; 2s ago
   Main PID: 589168 (node)
      Tasks: 7 (limit: 1137)
     Memory: 41.8M
     CGroup: /system.slice/prerender.service
             └─589168 /usr/bin/node server.js

Jan 07 19:59:46 systemd[1]: Started Prerender server for bot crawling.
```



## Integrating prerender with NGINX

Now that our prerender service is running, we can go ahead and integrate it with NGINX. What we want to do is that the normal user should be sent the normal HTML + JS response but a bot should be sent a response by the prerender service.

The original NGINX configuration file for my React app looked like this:

```
server {
    server_name example.com;
    root /home/yasoob/example/build;
    index index.html;

    location / {
  	    try_files $uri /index.html;
        add_header Cache-Control "no-cache";
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public";
    }

    location /api {
        include proxy_params;
        proxy_pass http://localhost:5000;
    }
}
```

This is a fairly generic configuration file. We add some cache headers to certain path responses and pass the `/api` route traffic to the gunicorn server running on port 5000. Now we just need to make sure that all requests made by a bot are responded to by the prerender service that is running on port 3000. The template file for these changes is [conveniently provided](https://gist.github.com/thoop/8165802) by the prerender folks. I took the same file and tweaked it a bit to make it work for my setup. The major thing I changed in the template was to edit the prerender service URL and remove the proxy header part. As I am using a self-hosted service, I replaced `service.prerender.io` with `127.0.0.1:3000` and because this is our service, we don't need to pass any authentication headers.

The resulting NGINX configuration file looks like this:

```
server {
    server_name shotquality.com;
    root /home/yasoob/shotqenterprise/REACT/build;
    index index.html;

    location / {
  	    try_files $uri @prerender;
        add_header Cache-Control "no-cache";
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public";
    }

    location /api {
        include proxy_params;
        proxy_pass http://localhost:5000;
    }

    location @prerender {
        set $prerender 0;
        if ($http_user_agent ~* "googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|whatsapp") {
            set $prerender 1;
        }
        if ($args ~ "_escaped_fragment_") {
            set $prerender 1;
        }
        if ($http_user_agent ~ "Prerender") {
            set $prerender 0;
        }
        if ($uri ~* "\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|svg|eot)") {
            set $prerender 0;
        }

        if ($prerender = 1) {
            set $prerender "127.0.0.1:3000";
            rewrite .* /$scheme://$host$request_uri? break;
            proxy_pass http://$prerender;
        }
        if ($prerender = 0) {
            rewrite .* /index.html break;
        }
    }
}
```

I removed the SSL support and redirection from this configuration file for the sake of simplicity. 

## Testing NGINX configuration

In order to test whether our NGINX config changes did not break anything, we can run:

```
$ sudo nginx -t
```

If everything seems correct, we can restart NGINX:

```
$ sudo service nginx restart
```

To test whether our service is working the way it is supposed to, we can run the following CURL command:

```
$ curl -A googlebot https://example.com
```

Replace example.com with your React-based app URL and see if the output of this command is different from if you run `curl` without `-A googlebot`. 

If you have reached this step then chances are that your prerender service is working fine. In case there are errors, please write about them in the comments below and I will try to help. 

You all have a wonderful day and a fulfilling new year :) 

## Further study:

- [Understanding Systemd Units and Unit Files](https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files)
- [Why do most systemd examples contain WantedBy=multi-user.target?](https://unix.stackexchange.com/questions/506347/why-do-most-systemd-examples-contain-wantedby-multi-user-target)


