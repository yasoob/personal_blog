# Personal Blog

Hi everyone! This repo contains the source-code of my personal blog. It is built using Hugo as static website manager and staticman for comments. Netlify remakes the blog on each push to this repo. The perfect static blog setup :heart:

A custom staticman instance is running on Heroku because the public instance had rate-limit issues.

In order to create new posts, just run:

```
hugo new post/post_name.md
``` 

And then just run:

```
hugo serve
```

to see a live build of the blog.

