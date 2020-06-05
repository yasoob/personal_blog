---
title: Controlling Your System Using Alexa (Tutorial)
author: yasoob
type: post
date: 2018-02-15T18:25:26+00:00
url: /2018/02/15/controlling-your-system-using-alexa-tutorial/
timeline_notification:
  - 1518719139
publicize_twitter_user:
  - yasoobkhalid
publicize_linkedin_url:
  - 'https://www.linkedin.com/updates?discuss=&scope=327033389&stype=M&topic=6369969781277290496&type=U&a=Gnxc'
categories:
  - python
tags:
  - alexa
  - alexa python
  - alexa tutorial
  - amazon alexa
  - aws lambda
  - lambda alexa

---
Hi guys! I hope you are all doing fine. I have started working on a small compilation of projects which you can do under 24 hours. I will be publishing these projects in the form of tutorials on my blog. This is the first project and I hope you will enjoy doing it. Keep these two things in mind:

* You don’t need an actual Alexa to follow this tutorial. Amazon provides an online simulator which you can use
* I will be omitting the instructions on how to get a virtual environment up and running just so that I can keep this tutorial concise and to the point. You should use a virtualenv and execute all of these `pip` instructions in a virtualenv.

I did this project at [BrickHack 4][1]. This was the very first time I was using Alexa. I had never been in its proximity before. I wanted to develop such a skill which was not available online and which contained a certain level of twists so that it wasn’t boring. In the end I settled on an idea to control my system using Alexa. The main idea is that you can tell Alexa to carry out different commands on your system remotely. This will work even if your system/computer is in your office and you and your Alexa are at home. So without any further ado lets get started.

## 1. Getting Started

If this is your very first time with Alexa I would suggest that you follow this [really helpful tutorial][2] by Amazon and get your first skill up and running. We will be editing this very same skill to do our bidding. At the time of this writing the tutorial linked above allowed you to tell Alexa your favourite color and Alexa will remember it and then you can ask Alexa about your favourite color and Alexa will respond with the saved color.

We need a way to interface Alexa from our system. So that we can remotely control our system. For that we will use [ngrok][3]. Ngrok allows you to expose your local server to the internet. Go to [this link][4] and you can read the official install instructions. Come back after you are sure that ngrok is working.

Now we also need to open urls from AWS-Lambda. We can use urllib for that but I prefer to use `requests` so now I will show you how you can use requests on AWS-lambda.

1. Create a local folder for your AWS-lambda code
2. Save the code from `lambda_function.py` to a `lambda_function.py` file in the local folder
3. Install the `requests` library in that folder using pip: `pip install -t .`
4. Create a zip of the directory and upload that zip to AWS-Lambda

After the above steps your local directory should look something like this:

    $ ls
    certifi                chardet-3.0.4.dist-info    lambda_function.py        urllib3
    certifi-2018.1.18.dist-info    idna                requests            urllib3-1.22.dist-info
    chardet                idna-2.6.dist-info        requests-2.18.4.dist-info
    

You can find the upload zip button on AWS-lambda:![][5]

Now you can use requests on AWS-lambda. Now just to test whether we did everything correctly, edit the code in `lambda_function.py` and change the following lines:

![][6]

Replace these lines with this:

```
def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    html = requests.get('http://ip.42.pl/raw')
    speech_output = "Welcome to the Alexa Skills Kit sample. " \
                    "Your AWS-lambda's IP address is "\
                    html.text()\
                    " Please tell me your favorite color by saying, " \
                    "my favorite color is red"
    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.
    reprompt_text = "Please tell me your favorite color by saying, " \
                    "my favorite color is red."
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

```

We also need to import requests in our `lambda_function.py` file. To do that add the following line at the very top of the file:

    import requests
    

Now zip up the folder again and upload it on AWS-lambda or edit the code for this file directly online. Now try asking Alexa to run your skill and Alexa should greet you with AWS-lambda’s public IP address.

Now lets plan out the next steps and then we can decide how we want to achieve them. Here is what I have in mind:

1. We will have a server running on our system
2. We will ask Alexa to send a certain command from a list of pre-determined commands to our system
3. The request will go to AWS-lambda
4. AWS-lambda will open a specific url corresponding to a certain command
5. Our local server will execute the command based on the url which AWS-lambda accessed

So naturally the next step is to get a server up and running. I will be using Python/Flask for this purpose.

## <a id="2_Creating_a_boilerplate_Flask_project_80"></a>**2. Creating a boilerplate Flask project**

The [Flask website][7] provides us with some very basic code which we can use as our starting point.

    from flask import Flask
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    

Save the above code in a `app.py` file. Run the following command in the terminal:

    $ Flask_APP=app.py flask run
    

This will tell the `flask` command line program about where to find our flask code which it needs to serve. If everything is working fine, you should see the following output:

     * Running on http://localhost:5000/
    

If things don’t work the first time, try searching around on Google and you should be able to find a solution. If nothing works then write a comment and I will try to help you as much as I can.

## <a id="3_Creating_Custom_URL_endpoints_107"></a>**3. Creating Custom URL endpoints**

Firstly, lets make our Flask app accessible over the internet and after that is done we will create custom URL endpoints. In order to do that we will need to run our `Flask` app in one terminal tab/instance and `ngrok` in the other.

I am assuming that your flask app is running currently in one terminal. Open another terminal and type the following:

    ./ngrok http 5000
    

Make sure that you run this above command in the folder where you placed the ngrok binary. If everything is working perfectly you should see the following output:

    ngrok by @inconshreveable                                                                                                                                         (Ctrl+C to quit)
    
    Session Status                online                                                                                                                                              
    Account                       Muhammad Yasoob Ullah Khalid (Plan: Free)                                                                                                           
    Version                       2.2.8                                                                                                                                               
    Region                        United States (us)                                                                                                                                  
    Web Interface                 http://127.0.0.1:4040                                                                                                                               
    Forwarding                    http://example.ngrok.io -> localhost:5000                                                                                                          
    Forwarding                    https://example.ngrok.io -> localhost:5000                                                                                                         
    
    Connections                   ttl     opn     rt1     rt5     p50     p90                                                                                                         
                                  0       0       0.00    0.00    0.00    0.00
    

This means that every request to `http://example.ngrok.io` will be routed to your system and locally running `app.py` file will cater to all of the requests. You can test this by opening `http://example.ngrok.io` in a browser session and you should be greeted with this:

    Hello World!
    

This confirms that till now everything is going according to plan. Now we’ll move on and create a custom url endpoint. Open up your `app.py` file in your favourite text editor and add in the following piece of code:

    @app.route('/command', methods=['GET'])
    def handle_command():
        command = request.args.get('command','')
        return command
    

Here we are using a different module (`request`) from the flask package as well so we need to add an import at the very top. Modify `from flask import Flask` to `from flask import Flask, request`.

Now restart `app.py` which was running in the terminal. The above piece of code simply takes the query parameters in the URL and echoes them back to the caller. For instance if you access: `http://localhost:5000/command?command=This is amazing`you will get `This is amazing` as the response. Let’s test whether everything is working fine by modifying our AWS-lambda code and making use of this endpoint.

## <a id="4_Testing_the_endpoint_with_Alexa_153"></a>**4. Testing the endpoint with Alexa**

Open up `lambda_function.py` and again modify the previously modified code to reflect the following changes:

```
def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    html = requests.get('http://example.ngrok.io/command?command=working')
    speech_output = "Welcome to the Alexa Skills Kit sample. " \
                    "Your ngrok instance is "\
                    html.text()\
                    " Please tell me your favorite color by saying, " \
                    "my favorite color is red"
    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.
    reprompt_text = "Please tell me your favorite color by saying, " \
                    "my favorite color is red."
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

```

Make sure that you modify `example.ngrok.io` to your own endpoint which ngrok provides you with. Now save this code to AWS-lambda and ask Alexa to use the Color Picker skill (the skill which we have been working with since the beginning). Alexa should respond with something along the lines of:

    Welcome to the Alexa skills kit sample. Your ngrok instance is working. 
    Please tell me your favourite color by saying, "My favourite color is red".
    

If you get this response its time to move on and make some changes to the Alexa skill from the [Amazon developer dashboard][8]. Open the dashboard and navigate to the skill which you created while following the Amazon 5 min skill development tutorial. Now we will change the name of the skill, its invocation name and the interaction model.

* Change the Skill name and invocation name to anything which you find satisfying:![][9]
* Change the intent schema on the next page to this:

```
{
  "intents": [
    {
      "slots": [
        {
          "name": "Command",
          "type": "LIST_OF_COMMANDS"
        }
      ],
      "intent": "MyCommandIsIntent"
    },
    {
      "intent": "WhatsMyCommandIntent"
    },
    {
      "intent": "AMAZON.HelpIntent"
    }
  ]
}
```

* Change the **Custom Slot Types** to this:

```
Type: LIST\_OF\_COMMANDS

Values:

    shutdown
    sleep
    restart
    using
``` 

![][10]

* Replace the sample utterances by these:

```
MyCommandIsIntent send the {Command} command
MyCommandIsIntent send {Command} command
```    

Now edit your `lambda_function.py` as well and replace every instance of `Color` with `Command`. The file should look something like this after making the required changes:

https://gist.github.com/yasoob/f98b17f67b48081e8828fe90d9d6aab6

Most of the changes are self-evident. Please go through the code. The main addition/change which I made are the following lines in the `set_command_in_session` function:

    html = requests.get('http://example.ngrok.io/command?command='+favorite_command)
    speech_output = "I sent the " + \
                    html.text() + \
                    " command to your system." \
                    "Let me know if you want me to send another command."
    

What this does is that after recognizing that the user has asked it to send a command to the system, it accesses the specific custom endpoint which we created. The whole command flow will work something like this:

    User:  Alexa open up System Manager
    Alexa: Welcome to the Alexa Skills Kit sample. Your ngrok instance is working. 
           Please tell me what command I should send to your system
    
    User:  Send the shutdown command
    Alexa: I sent the shutdown command to your system. Let me know if you want me to send another command.
    
    User:  Thank You
    Alexa: Your last command was shutdown. Goodbye
    

Boom! Your Alexa side of the program is complete. Now we just need to edit the custom URL endpoint to actually carry out these commands. I will not be doing that. Instead I will be adding voice output for these commands so that we know the commands are working. Edit the `app.py` file to reflect the following changes:

    from flask import Flask, request
    import vlc
    
    app = Flask(__name__)
    
    @app.route("/")
    def hello():
        return "Hello World!"
    
    @app.route('/command', methods=['GET'])
    def handle_command():
        command = request.args.get('command','')
        p = vlc.MediaPlayer(command+".mp3")
        p.play()
        return command
    

Now before you are able to run this code you need to do two things.The first one is to install the `libvlc` Python bindings. This is required to run `.mp3` files in Python. There are a couple of other ways as well but I found this to be the easiest. You can install these bindings by running the following pip command:

    pip install python-vlc
    

The other thing you need to do is to create an mp3 file for every different command which you want to give through Alexa. These are two of the files which I made:

* [Sleep][11]
* [Shutdown][12]

Now place these mp3 files in the same directory as `app.py`. Restart `app.py` , upload all of your AWS-lambda specific code online and try out your brand new custom Alexa Skill!

## Issues which you might face

The ngrok public url changes whenever you restart ngrok so make sure that the url in your `lambda_function.py` file is upto-date.

## <a id="Further_Steps_495"></a>Further Steps

Congrats on successfully completing the Alexa custom Skill development project! You now know the basics of how you can create custom Alexa skills and how you can make a localhost server available on the internet. Try to mix and match your ideas and create some entirely different skills! I know about someone who made story reading skills for Alexa. You could ask Alexa to read you a specific kind of story and Alexa would do that for you. Someone else made a skill where Alexa would ask you about your mood and then based on your mood it will curate a custom Spotify playlist for you.

Let me share some more instructions about how you would go about doing the latter project. You can extract the `Intent` from the voice input. This is similar to how we extracted the `Command` from the input in this tutorial. Then you can send that Intent to IBM Watson for sentiment analysis. Watson will tell you the mood of the user. Then you can use that mood and the Spotify API to create a playlist based on that specific mood. Lastly, you can play the custom generated playlist using the Spotify API.

 [1]: https://brickhack.io/
 [2]: https://developer.amazon.com/alexa-skills-kit/alexa-skill-quick-start-tutorial
 [3]: https://ngrok.com
 [4]: https://ngrok.com/download
 [5]: https://i.imgur.com/uuWhYwv.png
 [6]: https://i.imgur.com/KmFk6Y2.png
 [7]: http://flask.pocoo.org/
 [8]: https://developer.amazon.com/login.html
 [9]: https://i.imgur.com/DKsRvnA.png
 [10]: https://i.imgur.com/ZKyg5qK.png
 [11]: https://soundcloud.com/m-yasoob-khalid/sleep?in=m-yasoob-khalid/sets/commands-for-alexa-project
 [12]: https://soundcloud.com/m-yasoob-khalid/shutdown?in=m-yasoob-khalid/sets/commands-for-alexa-project