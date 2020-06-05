---
title: A FIFA 2018 World Cup SMS bot using Twilio, Heroku and Flask
author: yasoob
type: post
date: 2018-06-25T05:53:07+00:00
url: /2018/06/25/a-fifa-world-cup-sms-bot-using-twilio-heroku-and-flask/
featured_image: /wp-content/uploads/2018/06/artboard-1-1200x529.png
timeline_notification:
  - 1529905993
publicize_twitter_user:
  - yasoobkhalid
publicize_linkedin_url:
  - www.linkedin.com/updates?topic=6416890846989283328
categories:
  - python
tags:
  - fifa bot
  - fifa twilio heroku
  - fifa world cup
  - flask heroku
  - sms bot twilio
  - twilio
  - twilio heroku

---

Hi everyone! I am back with yet another tutorial. Its World Cup season and every other person is rooting for his/her favorite team. I was thinking about the next blog post idea and I thought why not create a project which can help you stay updated with how the world cup is progressing? And along the way, I might be able to teach myself (and you) something new. The end product is this tutorial. The project we are going to be developing is a Twilio application, hosted on Heroku. It is a chat (SMS) bot or sorts. You will be able to send various special messages to this bot and it will respond with the latest World cup updates.

Here are some screenshots to give you some flavor of the final product:

![SMS Bot][1]

## <a id="Step_1_Getting_our_tools_ready_5"></a>Step 1: Getting our tools ready

Let’s begin by setting up the directory structure. There will be four files in total in our root folder:

    Procfile
    app.py
    requirements.txt
    runtime.txt
    

You can quickly create them by running the following command in the terminal:

    $ touch Procfile app.py requirements.txt runtime.txt
    

Don’t worry about these files for now. I will let you know their purpose when we start populating them later on.

Create a new Python virtual environment to work in. If you don’t know what a virtual environment is and why it is useful to use it, check out [this chapter][2] of the Intermediate Python book. You can create the virtual environment by running the following commands in the terminal:

    $ python -m venv env
    $ source env/bin/activate
    

You can deactivate the virtual environment at any time by running:

    $ source deactivate
    

We will be using Python 3.x (I am running 3.6) and the following Python libraries:

    Flask==0.12.2
    twilio==6.14.6
    requests==2.18.4
    python-dateutil==2.6.1
    

Add these four lines in your `requirements.txt` file and run `$ pip install -r requirements.txt`. [Flask][3] is the web development framework we will be using to create our web app. We will be using the twilio library to interface with [Twilio][4] and the [Requests][5] library will help us in consuming web APIs and get latest World Cup information. Dateutil is simply being used to handle date-time.

Why did I mention the specific versions for these libraries? I just started developing this project using the latest libraries and these are the ones which I used. I am listing the version number merely to keep this tutorial somewhat future-proof so that even if future versions of these libraries break backward compatibility, you will know which libraries should work fine with this tutorial. You can find the versions of libraries installed on your system by running `$ pip freeze`.

## <a id="Step_2_Define_the_project_requirements_50"></a>Step 2: Define the project requirements

It is a good idea to list down the features/requirements of our SMS bot. We want it to be able to respond to five different kinds of messages:

  * `today` should return the details of all games happening today
  * `tomorrow` should return the details of all games happening tomorrow
  * `complete` should return the complete group stage details
  * A country code (like `BRA` for Brazil) should return information related to that particular country
  * `list` should return all of the FIFA country codes

Suitable responses for these endpoints are:

* today

```
England vs Panama at 08:00 AM
Japan vs Senegal at 11:00 AM
Poland vs Colombia at 02:00 PM
```

* tomorrow

```
Saudi Arabia vs Egypt at 10:00 AM
Uruguay vs Russia at 10:00 AM
Spain vs Morocco at 02:00 PM
Iran vs Portugal at 02:00 PM
```    

* complete

```
--- Group A ---
Russia Pts: 6
Uruguay Pts: 6
Egypt Pts: 0
Saudi Arabia Pts: 0


--- Group B ---
Spain Pts: 4
Portugal Pts: 4
Iran Pts: 3
Morocco Pts: 0


--- Group C ---
France Pts: 6
Denmark Pts: 4
Australia Pts: 1
Peru Pts: 0


--- Group D ---
Croatia Pts: 6
Nigeria Pts: 3
Iceland Pts: 1
Argentina Pts: 1


--- Group E ---
Brazil Pts: 4
Switzerland Pts: 4
Serbia Pts: 3
Costa Rica Pts: 0


--- Group F ---
Mexico Pts: 6
Sweden Pts: 3
Germany Pts: 3
Korea Republic Pts: 0


--- Group G ---
Belgium Pts: 6
England Pts: 3
Panama Pts: 0
Tunisia Pts: 0


--- Group H ---
Senegal Pts: 3
Japan Pts: 3
Poland Pts: 0
Colombia Pts: 0
```
    

* ARG (Argentina’s FIFA code)

```
--- Past Matches ---
Argentina 1 vs Iceland 1
Argentina 0 vs Croatia 3


--- Future Matches ---
Nigeria vs Argentina at 02:00 PM on 26 Jun
```

* list

```
KOR
PAN
MEX
ENG
COL
JPN
POL
SEN
RUS
EGY
POR
MAR
URU
KSA
IRN
ESP
DEN
AUS
FRA
PER
ARG
CRO
BRA
CRC
NGA
ISL
SRB
SUI
BEL
TUN
GER
SWE
```

Let me also clarify the date/time information. The API provides us with the UTC time. I am going to convert that to my timezone `America/New_york` so that I don’t have to do mental time calculations. This will also provide us with an opportunity to learn how to convert timezones using `dateutil`.

With these requirements in mind, let’s move on.

## <a id="Step_3_Finding_and_exploring_the_FIFA_API_192"></a>Step 3: Finding and exploring the FIFA API

Now we need to find the right API which we can use to receive up-to-date information. I searched around and the best one I found was [this website][6]. The specific endpoints we are interested in are:

```
urls = {'group': 'https://worldcup.sfg.io/teams/group_results',
        'country': 'https://worldcup.sfg.io/matches/country?fifa_code=',
        'today': 'https://worldcup.sfg.io/matches/today',
        'tomorrow': 'https://worldcup.sfg.io/matches/tomorrow'
}
```

Instead of using the country codes endpoint available at [worldcup.sfg.io][7], we will be maintaining a local country code list.

    countries = ['KOR', 'PAN', 'MEX', 'ENG', 'COL', 'JPN', 'POL', 'SEN', 
                'RUS', 'EGY', 'POR', 'MAR', 'URU', 'KSA', 'IRN', 'ESP', 
                'DEN', 'AUS', 'FRA', 'PER', 'ARG', 'CRO', 'BRA', 'CRC', 
                'NGA', 'ISL', 'SRB', 'SUI', 'BEL', 'TUN', 'GER', 'SWE']
    

Normally, I run a Python interpreter to test out APIs before writing final code in a `.py` file. This provides me with a much quicker way to check whether my API handling code is working as expected or not.

I tested out the APIs and this is what I found:

* We can get “today” (& “tomorrow”) information by running the following code: 

```
html = requests.get(urls['today']).json()
for match in html:
    print(match['home_team_country'] + ' vs ' + match['away_team_country'] + ' at ' + match['datetime'] )
```     

* We can get “country” information by running: 

```
html = requests.get(urls['country']+'ARG').json()
for match in html:
    if match['status'] == 'completed':
        print(match['home_team']['country'], 
                match['home_team']['goals'], 
                "vs", match['away_team']['country'], 
                match['away_team']['goals'])
    if match['status'] == 'future':
        print(match['home_team']['country'], "vs", 
                match['away_team']['country'], 
                "at", match['datetime'])
```

* We can get “complete” information by running: 

```
html = requests.get(urls['group']).json()
for group in html:
    print("--- Group " + group['group']['letter']  + " ---")
    for team in group['group']['teams']:
        print(team['team']['country'], "Pts:", team['team']['points'])
```

* And lastly we can get “list” information by simply running: 

```
print('\n'.joing(countries))
```     

In order to explore the JSON APIs, I make extensive use of [JSBeautifier][8]. It helps me find out the right node fairly quickly because of indentation. In order to use this amazing resource, just copy JSON response, paste it on the JSBeautifier website and press “Beautify JavaScript or HTML” button.

![JSBeautifier][9]

Now that we know which API we are going to use and what code we need for extracting the required information, we can move on and start editing the `app.py` file.

## <a id="Step_4_Start_writing_apppy_258"></a>Step 4: Start writing `app.py`

First of all, let’s import the required libraries:

    import os
    from flask import Flask, request
    import requests
    from dateutil import parser, tz
    from twilio.twiml.messaging_response import MessagingResponse
    

We are going to use `os` to access environment variables. In this particular project, we don’t have to use our Twilio credentials anywhere but it is still good to know that you should never hardcode your credentials in any code file. You should use environment variables for storing them. This way even if we publish our project in a public git repo, we won’t have to worry about leaked credentials.

We will be using flask as our web development framework of choice and requests will be used to consume online APIs. Moreover, dateutil will help us parse dates-times from the online API response.

We will be using `MessagingResponse` from the `twilio.twiml.messaging_response` package to create TwiML responses. These are response templates used by Twilio. You can read more about TwiML [here][10].

Next, we need to create the Flask object:

    app = Flask(__name__)
    

Let’s also define our local timezone using the `tz.gettz` method. I will be using `America/New_york` as my time zone but you can use whatever time zone you are in at the moment:

    to_zone = tz.gettz('America/New_York')
    

Our app will only have one route. This is the `/` route. This will accept POST requests. We will be using this route as the “message arrive” webhook in Twilio. This means that whenever someone will send an SMS to our Twilio number, Twilio will send a POST request to this webhook with the contents of that SMS. We will respond to this POST request with a TwiML template and that way we will tell Twilio what to send back to the SMS sender.

Here is the basic hello world code just to test things out:

    @app.route('/', methods=['POST'])
    def receive_sms():
        body = request.values.get('Body', None)
        resp = MessagingResponse()
        resp.message(body or 'Hello World!')
        return str(resp)
    

Lets complete our `app.py` script and test it out:

    if __name__ == "__main__":
        port = int(os.environ.get("PORT", 5000))
        app.run(host='0.0.0.0', port=port)
    

At this point, the complete contents of this file should look something like this:

    import os
    from flask import Flask, request
    import requests
    from dateutil import parser, tz
    from twilio.twiml.messaging_response import MessagingResponse
     
    app = Flask(__name__)
    to_zone = tz.gettz('America/New_York')
    
    @app.route('/', methods=['POST'])
    def receive_sms():
        body = request.values.get('Body', None)
        resp = MessagingResponse()
        resp.message(body or 'Hello World!')
        return str(resp)
        
    if __name__ == "__main__":
        port = int(os.environ.get("PORT", 5000))
        app.run(host='0.0.0.0', port=port)
    

Add the following line to your \`Procfile:

    web: python app.py
    

This will tell Heroku which file to run. Add the following code to the `runtime.txt` file:

    python-3.6.5
    

This will tell Heroku which Python version we want to run our code with.

Lets put this whole directory under version control using git and push the code to Heroku by running the following commands in the terminal:

    git init .
    git add Procfile runtime.txt app.py requirements.txt
    git commit -m "Committed initial code"
    heroku create
    heroku apps:rename custom_project_name
    git push heroku master
    

Replace `custom_project_name` with your favorite project name. This needs to be unique as this will dictate the URL of your web server. After this Heroku will provide you with the public URL of your server. Copy that URL and let’s sign up on Twilio.

## <a id="Step_5_Get_started_with_Twilio_360"></a>Step 5: Get started with Twilio

Go to Twilio and sign up for a free trial account if you don’t have one already.

![Twilio Homepage][11]

At this point Twilio should prompt you to select a new Twilio number. Once you do that you need to go to the Console’s [“number” page][12] and you need to configure the webhook.

![Twilio webhook][13]

Here you need to paste the server address which Heroku gave you. After this, we are done. Now its time to send a message to our Twilio number using our mobile phone and it should echo back whatever we send it.

I tried it out and this is what the response looked like:

![SMS][14]

Now that everything is working as expected we can move forward and make our `app.py` file do something useful.

## <a id="Step_6_Finishing_up_apppy_378"></a>Step 6: Finishing up `app.py`

Let’s complete the `app.py` file with a functional route handler. Rewrite the `receive_sms` function based on this code:

    # ...
    
    urls = {'group': 'https://worldcup.sfg.io/teams/group_results',
            'country': 'https://worldcup.sfg.io/matches/country?fifa_code=',
            'today': 'https://worldcup.sfg.io/matches/today',
            'tomorrow': 'https://worldcup.sfg.io/matches/tomorrow'
    }
    
    #...
    
    @app.route('/', methods=['POST'])
    def receive_sms():
        body = request.values.get('Body', '').lower().strip()
        resp = MessagingResponse()
    
        if body == 'today':
            html = requests.get(urls['today']).json()
            output = "\n"
            for match in html:
                output += match['home_team_country'] + ' vs ' + match['away_team_country'] + \
                " at "+ parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p') +"\n"
    
        elif body == 'tomorrow':
            html = requests.get(urls['tomorrow']).json()
            output = "\n"
            for match in html:
                output += match['home_team_country'] + ' vs ' + match['away_team_country'] + \
                " at "+ parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p') +"\n"
        
        elif body.upper() in countries:
            html = requests.get(urls['country']+body).json()
            output = "\n--- Past Matches ---\n"
            for match in html:
                if match['status'] == 'completed':
                    output += match['home_team']['country'] + " " + \
                              str(match['home_team']['goals']) + " vs " + \
                              match['away_team']['country']+ " " + \
                              str(match['away_team']['goals']) + "\n"
            
            output += "\n\n--- Future Matches ---\n"
            for match in html:
                if match['status'] == 'future':
                    output += match['home_team']['country'] + " vs " + \
                              match['away_team']['country'] + " at " + \
                              parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p on %d %b') +"\n"
        
        elif body == 'complete':
            html = requests.get(urls['group']).json()
            output = ""
            for group in html:
                output += "\n\n--- Group " + group['group']['letter']  + " ---\n"
                for team in group['group']['teams']:
                    output += team['team']['country'] + " Pts: " + str(team['team']['points']) + "\n"
    
        elif body == 'list':
            output = '\n'.join(countries)
        else:
            output = ('Sorry we could not understand your response. '
                'You can respond with "today" to get today\'s details, "tomorrow" ' 
                'to get tomorrow\'s details, "complete" to get the group stage standing of teams or '
                'you can reply with a country FIFA code (like BRA, ARG) and we will send you the '
                'standing of that particular country. For a list of FIFA codes send "list".\n\nHave a great day!')
    
        resp.message(output)
        return str(resp)
    

Most of the code is simple and self-explanatory apart from the date-time parsing:

    parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p on %d %b')
    

Here I am passing `match['datetime']` to the `parser.parse` method. After that I access the `astimezone` method to convert the time to my time zone and finally, I format the time to my liking.

  * `%I` gives us the hour in 12-hour format
  * `%M` gives us the minutes
  * `%p` gives us AM/PM
  * `%d` gives us the date
  * `%b` gives us the abbreviated month (e.g Jun)

You can get details of the rest of the format codes from [here][15].

After adding this code, your complete `app.py` file should look something like this:

    import os
    from flask import Flask, request
    import requests
    from dateutil import parser, tz
    from twilio.twiml.messaging_response import MessagingResponse
     
    app = Flask(__name__)
    to_zone = tz.gettz('America/New_York')
    
    countries = ['KOR', 'PAN', 'MEX', 'ENG', 'COL', 'JPN', 'POL', 'SEN', 
                'RUS', 'EGY', 'POR', 'MAR', 'URU', 'KSA', 'IRN', 'ESP', 
                'DEN', 'AUS', 'FRA', 'PER', 'ARG', 'CRO', 'BRA', 'CRC', 
                'NGA', 'ISL', 'SRB', 'SUI', 'BEL', 'TUN', 'GER', 'SWE']
    
    urls = {'group': 'https://worldcup.sfg.io/teams/group_results',
            'country': 'https://worldcup.sfg.io/matches/country?fifa_code=',
            'today': 'https://worldcup.sfg.io/matches/today',
            'tomorrow': 'https://worldcup.sfg.io/matches/tomorrow'
    }
    
    @app.route('/', methods=['POST'])
    def receive_sms():
        body = request.values.get('Body', '').lower().strip()
        resp = MessagingResponse()
    
        if body == 'today':
            html = requests.get(urls['today']).json()
            output = "\n"
            for match in html:
                output += match['home_team_country'] + ' vs ' + match['away_team_country'] + \
                " at "+ parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p') +"\n"
    
        elif body == 'tomorrow':
            html = requests.get(urls['tomorrow']).json()
            output = "\n"
            for match in html:
                output += match['home_team_country'] + ' vs ' + match['away_team_country'] + \
                " at "+ parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p') +"\n"
        
        elif body.upper() in countries:
            html = requests.get(urls['country']+body).json()
            output = "\n--- Past Matches ---\n"
            for match in html:
                if match['status'] == 'completed':
                    output += match['home_team']['country'] + " " + \
                              str(match['home_team']['goals']) + " vs " + \
                              match['away_team']['country']+ " " + \
                              str(match['away_team']['goals']) + "\n"
            
            output += "\n\n--- Future Matches ---\n"
            for match in html:
                if match['status'] == 'future':
                    output += match['home_team']['country'] + " vs " + \
                              match['away_team']['country'] + " at " + \
                              parser.parse(match['datetime']).astimezone(to_zone).strftime('%I:%M %p on %d %b') +"\n"
        
        elif body == 'complete':
            html = requests.get(urls['group']).json()
            output = ""
            for group in html:
                output += "\n\n--- Group " + group['group']['letter']  + " ---\n"
                for team in group['group']['teams']:
                    output += team['team']['country'] + " Pts: " + str(team['team']['points']) + "\n"
    
        elif body == 'list':
            output = '\n'.join(countries)
        else:
            output = ('Sorry we could not understand your response. '
                'You can respond with "today" to get today\'s details, "tomorrow" ' 
                'to get tomorrow\'s details, "complete" to get the group stage standing of teams or '
                'you can reply with a country FIFA code (like BRA, ARG) and we will send you the '
                'standing of that particular country. For a list of FIFA codes send "list".\n\nHave a great day!')
    
        resp.message(output)
        return str(resp)
    
    
    if __name__ == "__main__":
        port = int(os.environ.get("PORT", 5000))
        app.run(host='0.0.0.0', port=port)
    

Now we just need to commit this code to our git repo and then push it to Heroku:

    git add app.py
    git commit -m "updated the code :boom:"
    git push heroku master
    

Now go ahead and try sending an SMS to your Twilio number.

**Important Notes:**

  * If you don’t receive a response to your SMS you should check your Heroku app logs for errors. You can easily access the logs by running `$ heroku logs` from the project folder
  * Twilio requires you to verify the target mobile number before you can send it any SMS during trial. Make sure you do that.
  * I encountered numerous problems when I was developing this application so don’t feel put off by errors. Embrace them and try solving them with the help of Google and StackOverflow.
  * If you encounter any errors, don’t hesitate to ask me for help via the comments 🙂

You can find the complete code on <a href="https://github.com/yasoob/FIFA-twilio-bot" target="_blank" rel="noopener noreferrer">GitHub</a>. You can further extend the code to implement regular automatic updates for your favourite team. The possibilities are endless! I hope you guys enjoyed the tutorial. If you have any comments/feedback/suggestions please let me know via the comments. Have a great day!

 [1]: https://imgur.com/5RZndAQ.png
 [2]: http://book.pythontips.com/en/latest/virtual_environment.html
 [3]: http://flask.pocoo.org/
 [4]: https://www.twilio.com/
 [5]: http://docs.python-requests.org/en/master/
 [6]: https://worldcup.sfg.io
 [7]: http://worldcup.sfg.io
 [8]: http://jsbeautifier.org/
 [9]: https://imgur.com/ME6Xuxt.png
 [10]: https://www.twilio.com/docs/sms/twiml
 [11]: https://imgur.com/lat4QL4.png
 [12]: https://www.twilio.com/console/phone-numbers/incoming
 [13]: https://imgur.com/0MOFffM.png
 [14]: https://imgur.com/j0iAesv.png
 [15]: http://strftime.org/