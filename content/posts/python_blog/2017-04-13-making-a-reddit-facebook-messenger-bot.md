---
title: Making a Reddit + Facebook Messenger Bot
author: yasoob
type: post
date: 2017-04-12T20:31:41+00:00
url: /2017/04/13/making-a-reddit-facebook-messenger-bot/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - facebook bot
  - facebook python
  - facebook reddit
  - fb bot
  - fb messenger api
  - fb messenger bot
  - messenger api

---
Hi guys! I haven't been programming a lot lately because of exams. However, on the past weekend I managed to get a hold of my laptop and crank out something useful. It was a Facebook messenger bot which servers you fresh memes, motivational posts, jokes and shower thoughts. It was the first time I had delved into bot creation. In this post I will teach you most of the stuff you need to know in order to get your bot off the ground.

First of all some screenshots of the final product:

![Img 1](/wp-content/uploads/2017/04/post-1-169x300.jpg)
![Img 2](/wp-content/uploads/2017/04/post-2-169x300.jpg)
![Img 2](/wp-content/uploads/2017/04/post-3-169x300.jpg)
![Img 2](/wp-content/uploads/2017/04/post-4-169x300.jpg)
  
## Tech Stack

We will be making use of the following:

  * <a href="http://flask.pocoo.org/" target="_blank" rel="noopener noreferrer">Flask framework</a> for coding up the backend as it is lightweight and allows us to focus on the logic instead of the folder structure.
  * <a href="https://dashboard.heroku.com/" target="_blank" rel="noopener noreferrer">Heroku</a> &#8211; For hosting our code online for free
  * <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">Reddit</a> &#8211; As a data source because it get's new posts every minute

### **1. Getting things ready**

## Creating a Reddit app

We will be using Facebook, Heroku and Reddit. Firstly, make sure that you have an account on all three of these services. Next you need to create a Reddit application on this [link][1].

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_4_05_45_pm.png)

In the above image you can already see the "motivation" app which I have created. Click on "create another app" and follow the on-screen instructions.

![Img](/wp-content/uploads/2017/04/screen-shot-2017-04-12-at-4-14-47-pm.png)

The about and redirect url will not be used hence it is ok to leave them blank. For production apps it is better to put in something related to your project so that if you start making a lot of requests and reddit starts to notice it they can check the about page of you app and act in a more informed manner.

So now that your app is created you need to save the &#8216;client\_id' and &#8216;client\_secret' in a safe place.

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_4_17_23_pm.png)

One part of our project is done. Now we need to setup the base for our Heroku app.

## Creating an App on Heroku

Go to this [dashboard url][2] and create a new application.

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_4_24_23_pm.png)

On the next page give your application a unique name.

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_4_24_50_pm.png)

From the next page click on "Heroku CLI" and download the latest [Heroku CLI][3] for your operating system. Follow the on-screen install instructions and come back once it has been installed.

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_4_25_30_pm.png)

## Creating a basic Python application

The below code is taken from [Konstantinos Tsaprailis's website][4].

```
from flask import Flask, request
import json
import requests

app = Flask(__name__)

# This needs to be filled with the Page Access Token that will be provided
# by the Facebook App that will be created.
PAT = ''

@app.route('/', methods=['GET'])
def handle_verification():
    print "Handling Verification."
    if request.args.get('hub.verify_token', '') == 'my_voice_is_my_password_verify_me':
        print "Verification successful!"
        return request.args.get('hub.challenge', '')
    else:
        print "Verification failed!"
        return 'Error, wrong validation token'

@app.route('/', methods=['POST'])
def handle_messages():
    print "Handling Messages"
    payload = request.get_data()
    print payload
    for sender, message in messaging_events(payload):
        print "Incoming from %s: %s" % (sender, message)
        send_message(PAT, sender, message)
    return "ok"

def messaging_events(payload):
    """Generate tuples of (sender_id, message_text) from the
    provided payload.
    """
    data = json.loads(payload)
    messaging_events = data["entry"][0]["messaging"]
    for event in messaging_events:
        if "message" in event and "text" in event["message"]:
            yield event["sender"]["id"], event["message"]["text"].encode('unicode_escape')
        else:
            yield event["sender"]["id"], "I can't echo this"


def send_message(token, recipient, text):
    """Send the message text to recipient with id recipient.
    """

    r = requests.post("https://graph.facebook.com/v2.6/me/messages",
        params={"access_token": token},
        data=json.dumps({
            "recipient": {"id": recipient},
            "message": {"text": text.decode('unicode_escape')}
        }),
        headers={'Content-type': 'application/json'})
    if r.status_code != requests.codes.ok:
        print r.text

if __name__ == '__main__':
    app.run()
```

We will be modifying the file according to our needs. So basically a Facebook bot works like this:

  1. Facebook sends a request to our server whenever a user messages our page on Facebook.
  2. We respond to the Facebook's request and store the id of the user and the message which was sent to our page.
  3. We respond to user's message through Graph API using the stored user id and message id.

A detailed breakdown of the above code is available of [this website][4]. In this post I will mainly be focusing on the Reddit integration and how to use the Postgres Database on Heroku.

Before moving further let's deploy the above Python code onto Heroku. For that you have to create a local Git repository. Follow the following steps:

```
$ mkdir messenger-bot
$ cd messenger-bot
$ touch requirements.txt app.py Procfile
```

Execute the above commands in a terminal and put the above Python code into the `app.py` file. Put the following into `Procfile`:

    web: gunicorn app:app 

Now we need to tell Heroku which Python libraries our app will need to function properly. Those libraries will need to be listed in the requirements.txt file. I am going to fast-forward a bit over here and simply copy the requirements from [this post][4]. Put the following lines into _requirements.txt_ file and you should be good to go for now.

```
click==6.6
Flask==0.11
gunicorn==19.6.0
itsdangerous==0.24
Jinja2==2.8
MarkupSafe==0.23
requests==2.10.0
Werkzeug==0.11.10
```

Run the following command in the terminal and you should get a similar output:

```
$ ls
Procfile      app.py     requirements.txt
```

Now we are ready to create a Git repository which can then be pushed onto Heroku servers. We will carry out the following steps now:

  * Login into Heroku
  * Create a new git repository
  * commit everything into the new repo
  * push the repo onto Heroku

The commands required to achieve this are listed below:

```
$ heroku login
$ git init
$ heroku git:remote -a 
$ git commit -am "Initial commit"

$ git push heroku master
...
remote: https://.herokuapp.com/ deployed to Heroku
...

$ heroku config:set WEB_CONCURRENCY=3
```

Save the url which is outputted above after `remote` . It is the url of your Heroku app. We will  need it in the next step when we create a Facebook app.

## Creating a Facebook App

Firstly we need a [Facebook page][5]. It is a requirement by Facebook to supplement every app with a relevant page.

Now we need to register a new app. Go to this [app creation page][6] and follow the instructions below.

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_49_02_pm.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_50_34_pm.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_51_41_pm.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_52_05_pm.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_53_20_pm1.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_54_10_pm1.png)

![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-12_at_9_56_38_pm.png)


Now head over to your app.py file and replace the PAT string on line 9 with the Page Access Token we saved above.

Commit everything and push the code to Heroku.

```
$ git commit -am "Added in the PAT"
$ git push heroku master
```

Now if you go to the Facebook page and send a message onto that page you will get your own message as a reply from the page. This shows that everything we have done so far is working. If something does not work check your Heroku logs which will give you some clue about what is going wrong. Later, a quick Google search will help you resolve the issue. You can access the logs like this:

```
$ heroku logs -t -a
```

**Note: **Only your msgs will be replied by the Facebook page. If any other random user messages the page his messages will not be replied by the bot because the bot is currently not approved by Facebook. However if you want to enable a couple of users to test your app you can add them as testers. You can do so by going to your Facebook app's developer page and following the onscreen instructions.

## Getting data from Reddit

We will be using data from the following subreddits:

* <a href="https://reddit.com/r/GetMotivated/" target="_blank" rel="noopener noreferrer">GetMotivated</a>
* <a href="https://reddit.com/r/Jokes/" target="_blank" rel="noopener noreferrer">Jokes</a>
* <a href="https://reddit.com/r/Memes/" target="_blank" rel="noopener noreferrer">Memes</a>
* <a href="https://reddit.com/r/ShowerThoughts/">ShowerThoughts</a>

First of all let's install Reddit's Python library "<a href="https://praw.readthedocs.io/en/latest/index.html" target="_blank" rel="noopener noreferrer">praw</a>". It can easily be done by typing the following instructions in the terminal:

```
$ pip install praw
```

Now let's test some Reddit goodness in a Python shell. I followed the [docs][7] which clearly show how to access Reddit and how to access a subreddit. Now is the best time to grab the "_client_id_" and "_client_secret_" which we created in the first part of this post.

```
$ python
Python 2.7.13 (default, Dec 17 2016, 23:03:43) 
[GCC 4.2.1 Compatible Apple LLVM 8.0.0 (clang-800.0.42.1)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import praw
>>> reddit = praw.Reddit(client_id='**********',
... client_secret='*****************',
... user_agent='my user agent')

>>> 
>>> submissions = list(reddit.subreddit("GetMotivated").hot(limit=None))
>>> submissions[-4].title
u'[Video] Hi, Stranger.'
```

**Note:** Don't forget to add in your own `client_id` and `client_secret` in place of `****`

Let's discuss the important bits here. I am using _limit=None_ because I want to get back as many posts as I can. Initially this feels like an overkill but you will quickly see that when a user starts using the Facebook bot pretty frequently we will run out of new posts if we limit ourselves to 10 or 20 posts. An additional constraint which we will add is that we will only use the image posts from **GetMotivated** and **Memes** and only text posts from **Jokes** and **ShowerThoughts**. Due to this constraint only one or two posts from top 10 hot posts might be useful to us because a lot of video submissions are also done to GetMotivated.

Now that we know how to access Reddit using the Python library we can go ahead and integrate it into our `app.py`.

Firstly add some additional libraries into our `requirements.txt` so that it looks something like this:

```
$ cat requirements.txt
click==6.6
Flask==0.11
gunicorn==19.6.0
itsdangerous==0.24
Jinja2==2.8
MarkupSafe==0.23
requests==2.10.0
Werkzeug==0.11.10
flask-sqlalchemy
psycopg2
praw
```

Now if we only wanted to send the user an image or text taken from reddit, it wouldn't have been very difficult. In the "_send_message_" function we could have done something like this:

```
import praw
...

def send_message(token, recipient, text):
    """Send the message text to recipient with id recipient.
    """
    if "meme" in text.lower():
        subreddit_name = "memes"
    elif "shower" in text.lower():
        subreddit_name = "Showerthoughts"
    elif "joke" in text.lower():
        subreddit_name = "Jokes"
    else:
        subreddit_name = "GetMotivated"
    ....

    if subreddit_name == "Showerthoughts":
        for submission in reddit.subreddit(subreddit_name).hot(limit=None):
            payload = submission.url
            break
    ...
    
    r = requests.post("https://graph.facebook.com/v2.6/me/messages",
            params={"access_token": token},
            data=json.dumps({
                "recipient": {"id": recipient},
                "message": {"attachment": {
                              "type": "image",
                              "payload": {
                                "url": payload
                              }}
            }),
            headers={'Content-type': 'application/json'})
    ...

```

But there is one issue with this approach. How will we know whether a user has been sent a particular image/text or not? We need some kind of **id** for each image/text we send the user so that we don't send the same post twice. In order to solve this issue we are going to take some help of **Postgresql** and the reddit posts id (Every post on reddit has a special id).

We are going to use a Many-to-Many relation. There will be two tables:

  * Users
  * Posts

Let's first define them in our code and then I will explain how it will work:

```
from flask_sqlalchemy import SQLAlchemy

...
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)

...
relationship_table=db.Table('relationship_table',                            
    db.Column('user_id', db.Integer,db.ForeignKey('users.id'), nullable=False),
    db.Column('post_id',db.Integer,db.ForeignKey('posts.id'),nullable=False),
    db.PrimaryKeyConstraint('user_id', 'post_id') )
 
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255),nullable=False)
    posts=db.relationship('Posts', secondary=relationship_table, backref='users' )  

    def __init__(self, name):
        self.name = name
 
class Posts(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, unique=True, nullable=False)
    url=db.Column(db.String, nullable=False)

    def __init__(self, name, url):
        self.name = name
        self.url = url

```

So the user table has two fields. The _name_ will be the id sent with the Facebook Messenger Webhook request. The _posts_ will be linked to the other table, "Posts". The Posts table has _name_ and _url_ field. "_name_" will be populated by the reddit submission id and the _url_ will be populated by the url of that post. We don't really need to have the "url" field. I will be using it for some other uses in the future hence I included it in the code.

So now the way our final code will work is this:

* We request a list of posts from a particular subreddit. The following code: 
```
reddit.subreddit(subreddit_name).hot(limit=None)
```
returns a generator so we don't need to worry about memory

* We will check whether the particular post has already been sent to the user in the past or not
* If the post has been sent in the past we will continue requesting more posts from Reddit until we find a fresh post
* If the post has not been sent to the user, we send the post and break out of the loop

So the final code of the app.py file is this:

```
from flask import Flask, request
import json
import requests
from flask_sqlalchemy import SQLAlchemy
import os
import praw

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
db = SQLAlchemy(app)
reddit = praw.Reddit(client_id='*************',
                     client_secret='****************',
                     user_agent='my user agent')

# This needs to be filled with the Page Access Token that will be provided
# by the Facebook App that will be created.
PAT = '*********************************************'

quick_replies_list = [{
    "content_type":"text",
    "title":"Meme",
    "payload":"meme",
},
{
    "content_type":"text",
    "title":"Motivation",
    "payload":"motivation",
},
{
    "content_type":"text",
    "title":"Shower Thought",
    "payload":"Shower_Thought",
},
{
    "content_type":"text",
    "title":"Jokes",
    "payload":"Jokes",
}
]
@app.route('/', methods=['GET'])
def handle_verification():
    print "Handling Verification."
    if request.args.get('hub.verify_token', '') == 'my_voice_is_my_password_verify_me':
        print "Verification successful!"
        return request.args.get('hub.challenge', '')
    else:
        print "Verification failed!"
        return 'Error, wrong validation token'

@app.route('/', methods=['POST'])
def handle_messages():
    print "Handling Messages"
    payload = request.get_data()
    print payload
    for sender, message in messaging_events(payload):
        print "Incoming from %s: %s" % (sender, message)
        send_message(PAT, sender, message)
    return "ok"

def messaging_events(payload):
    """Generate tuples of (sender_id, message_text) from the
    provided payload.
    """
    data = json.loads(payload)
    messaging_events = data["entry"][0]["messaging"]
    for event in messaging_events:
        if "message" in event and "text" in event["message"]:
            yield event["sender"]["id"], event["message"]["text"].encode('unicode_escape')
        else:
            yield event["sender"]["id"], "I can't echo this"


def send_message(token, recipient, text):
    """Send the message text to recipient with id recipient.
    """
    if "meme" in text.lower():
        subreddit_name = "memes"
    elif "shower" in text.lower():
        subreddit_name = "Showerthoughts"
    elif "joke" in text.lower():
        subreddit_name = "Jokes"
    else:
        subreddit_name = "GetMotivated"

    myUser = get_or_create(db.session, Users, name=recipient)

    if subreddit_name == "Showerthoughts":
        for submission in reddit.subreddit(subreddit_name).hot(limit=None):
            if (submission.is_self == True):
                query_result = Posts.query.filter(Posts.name == submission.id).first()
                if query_result is None:
                    myPost = Posts(submission.id, submission.title)
                    myUser.posts.append(myPost)
                    db.session.commit()
                    payload = submission.title
                    break
                elif myUser not in query_result.users:
                    myUser.posts.append(query_result)
                    db.session.commit()
                    payload = submission.title
                    break
                else:
                    continue  

        r = requests.post("https://graph.facebook.com/v2.6/me/messages",
            params={"access_token": token},
            data=json.dumps({
                "recipient": {"id": recipient},
                "message": {"text": payload,
                            "quick_replies":quick_replies_list}
            }),
            headers={'Content-type': 'application/json'})
    
    elif subreddit_name == "Jokes":
        for submission in reddit.subreddit(subreddit_name).hot(limit=None):
            if ((submission.is_self == True) and ( submission.link_flair_text is None)):
                query_result = Posts.query.filter(Posts.name == submission.id).first()
                if query_result is None:
                    myPost = Posts(submission.id, submission.title)
                    myUser.posts.append(myPost)
                    db.session.commit()
                    payload = submission.title
                    payload_text = submission.selftext
                    break
                elif myUser not in query_result.users:
                    myUser.posts.append(query_result)
                    db.session.commit()
                    payload = submission.title
                    payload_text = submission.selftext
                    break
                else:
                    continue  

        r = requests.post("https://graph.facebook.com/v2.6/me/messages",
            params={"access_token": token},
            data=json.dumps({
                "recipient": {"id": recipient},
                "message": {"text": payload}
            }),
            headers={'Content-type': 'application/json'})

        r = requests.post("https://graph.facebook.com/v2.6/me/messages",
            params={"access_token": token},
            data=json.dumps({
                "recipient": {"id": recipient},
                "message": {"text": payload_text,
                            "quick_replies":quick_replies_list}
            }),
            headers={'Content-type': 'application/json'})
        
    else:
        payload = "http://imgur.com/WeyNGtQ.jpg"
        for submission in reddit.subreddit(subreddit_name).hot(limit=None):
            if (submission.link_flair_css_class == 'image') or ((submission.is_self != True) and ((".jpg" in submission.url) or (".png" in submission.url))):
                query_result = Posts.query.filter(Posts.name == submission.id).first()
                if query_result is None:
                    myPost = Posts(submission.id, submission.url)
                    myUser.posts.append(myPost)
                    db.session.commit()
                    payload = submission.url
                    break
                elif myUser not in query_result.users:
                    myUser.posts.append(query_result)
                    db.session.commit()
                    payload = submission.url
                    break
                else:
                    continue

        r = requests.post("https://graph.facebook.com/v2.6/me/messages",
            params={"access_token": token},
            data=json.dumps({
                "recipient": {"id": recipient},
                "message": {"attachment": {
                              "type": "image",
                              "payload": {
                                "url": payload
                              }},
                              "quick_replies":quick_replies_list}
            }),
            headers={'Content-type': 'application/json'})

    if r.status_code != requests.codes.ok:
        print r.text

def get_or_create(session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance

relationship_table=db.Table('relationship_table',                            
    db.Column('user_id', db.Integer,db.ForeignKey('users.id'), nullable=False),
    db.Column('post_id',db.Integer,db.ForeignKey('posts.id'),nullable=False),
    db.PrimaryKeyConstraint('user_id', 'post_id') )
 
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255),nullable=False)
    posts=db.relationship('Posts', secondary=relationship_table, backref='users' )  

    def __init__(self, name=None):
        self.name = name
 
class Posts(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, unique=True, nullable=False)
    url=db.Column(db.String, nullable=False)

    def __init__(self, name=None, url=None):
        self.name = name
        self.url = url

if __name__ == '__main__':
    app.run()
```
    
So put this code into app.py file and send it to Heroku.
    
```
$ git commit -am "Updated the code with Reddit feature"
$ git push heroku master
```
    
One last thing is still remaining. We need to tell Heroku that we will be using the database. It is simple. Just issue the following command in the terminal:
    
```
$ heroku addons:create heroku-postgresql:hobby-dev --app <app_name>
```
    
This will create a free hobby database which is enough for our project. Now we only need to initialise the database with the correct tables. In order to do that we first need to run the Python shell on our Heroku server:
    
```
$ heroku run python
```
    
Now in the Python shell type the following commands:

```
>>> from app import db
>>> db.create_all()
```
    
So now our project is complete. Congrats!
    
Let me discuss some interesting features of the code. Firstly, I am making use of the "**quick-replies**" feature of Facebook Messenger Bot API. This allows us to send some pre-formatted inputs which the user can quickly select. They will look something like this:
    
![Img](/wp-content/uploads/2017/04/screen_shot_2017-04-13_at_12_26_21_am.png)

It is easy to display these quick replies to the user. With every post request to the Facebook graph API we send some additional data:
    
```
quick_replies_list = [{
 "content_type":"text",
 "title":"Meme",
 "payload":"meme",
},
{
 "content_type":"text",
 "title":"Motivation",
 "payload":"motivation",
},
{
 "content_type":"text",
 "title":"Shower Thought",
 "payload":"Shower_Thought",
},
{
 "content_type":"text",
 "title":"Jokes",
 "payload":"Jokes",
}]
```
    
Another interesting feature of the code is how we determine whether a post is a text, image or a video post. In the GetMotivated subreddit some images don't have a "_.jpg_" or "_.png_" in their url so we rely on
    
```
submission.link_flair_css_class == 'image'
```
    
This way we are able to select even those posts which do not have a known image extension in the url.
    
You might have noticed this bit of code in the app.py file:
    
```
payload = "http://imgur.com/WeyNGtQ.jpg"
```
    
It makes sure that if no new posts are found for a particular user (every subreddit has a maximum number of "hot" posts) we have at least something to return. Otherwise we will get a variable undeclared error.
    
## Create if the User doesn't exist:
    
The following function checks whether a user with the particular name exists or not. If it exists it selects that user from the db and returns it. In case it doesn't exist (user), it creates it and then returns that newly created user:
    
```
myUser = get_or_create(db.session, Users, name=recipient)
...

def get_or_create(session, model, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        session.add(instance)
        session.commit()
        return instance

```
    
I hope you guys enjoyed the post. Please comment below if you have any questions. I am also starting premium advertising on the blog. This will either be in the form of sponsored posts or blog sponsorship for a particular time. I am still fleshing out the details. If your company works with Python and wants to reach out to potential customers, please email me on yasoob (at) gmail.com.
    
Source: **[You can get the code from GitHub as well][8].**

 [1]: https://www.reddit.com/prefs/apps/
 [2]: https://dashboard.heroku.com/apps
 [3]: https://devcenter.heroku.com/articles/heroku-command-line
 [4]: https://tsaprailis.com/2016/06/02/How-to-build-and-deploy-a-Facebook-Messenger-bot-with-Python-and-Flask-a-tutorial/
 [5]: https://www.facebook.com/pages/create
 [6]: https://developers.facebook.com/apps/
 [7]: https://praw.readthedocs.io/en/latest/getting_started/quick_start.html
 [8]: https://github.com/yasoob/fb-messenger-bot