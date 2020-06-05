---
title: Implementing Email Sending Functionality in a Django App
author: yasoob
type: post
date: 2016-01-27T19:58:03+00:00
url: /2016/01/28/implementing-email-sending-functionality-in-a-django-app/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - django
  - django email
  - email using django
  - python django mailing

---
Hi there folks! Recently I was doing a task for fossasia which required me to make a Django web app which allowed users to submit their email addresses and receive a welcome email in return. I was able to complete the project in a couple of hours. Most of the time was spent in making the UI look good. I am going to show you how you can easily make a similar app.
  
For the sake of this tutorial we will be using Gmail.

## 1.Setup the project

First of all we need to start a django project. We can start one on our Desktop by typing the following command in the terminal:

    $ django-admin startproject gci_email
    

Now let’s `cd` into the newly created project and move on:

    $ cd gci_email
    

## 2.Creating a new app

Now we need to make a new app. You can do that by running the following command:

    $ python manage.py startapp send_email
    

The above command creates a `send_email` directory inside our project with a couple of files in it.

## 3.Modify the project settings

Now let’s just quickly go ahead and modify the project settings a little bit. In this step we will add our app and all our email sending related info to the `settings.py` file. Open the `settings.py` file which is available in the `gci_email` folder and add the following content to it:

    EMAIL_USE_TLS = True
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_HOST_USER = 'Your gmail email'
    EMAIL_HOST_PASSWORD = 'Your gmail password'
    DEFAULT_FROM_EMAIL = 'Your name'
    DEFAULT_TO_EMAIL = 'Your email'
    

In the `INSTALLED_APPS` section of your `settings.py` file you need to add the following entry to the `INSTALLED_APPS` list:

    'send_email.apps.SendEmailConfig'
    

Now the [settings.py][1] file should contain the following modified `INSTALLED_APPS` list:

    INSTALLED_APPS = [
        'send_email.apps.SendEmailConfig',
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
    ]
    

Let’s add the static files related variables to our `settings.py` file as well:

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    STATIC_ROOT = 'staticfiles'
    STATIC_URL = '/static/'
    STATICFILES_DIRS = (
        os.path.join(BASE_DIR, 'static'),
    )
    

## 4.Creating urls

Modify the `urls.py` file in `gci_email` folder to look something like this:

    from django.conf.urls import url, include
    from django.contrib import admin
    
    urlpatterns = [
        url(r'^admin/', admin.site.urls),
        url(r'^', include('send_email.urls')),
    ]
    

Now create a `urls.py` file in `send_email` folder as well and add the following content to it:

    from django.conf.urls import url
    
    from . import views
    
    urlpatterns = [
        url(r'^$', views.index, name='index'),
        url(r'^success', views.success, name='success'),
    ]
    

## 5.Adding Views

Now it’s time to edit the views. Go to the `views.py` file in `send_email` directory and modify it to look something like this:

    from django.shortcuts import render
    from django.http import HttpResponse
    import django
    from django.conf import settings
    from django.core.mail import send_mail
    
    
    def index(request):
        return render(request, 'index.html')
    
    
    def success(request):
        email = request.POST.get('email', '')
        data = """
    Hello there!
    
    I wanted to personally write an email in order to welcome you to our platform.\
     We have worked day and night to ensure that you get the best service. I hope \
    that you will continue to use our service. We send out a newsletter once a \
    week. Make sure that you read it. It is usually very informative.
    
    Cheers!
    ~ Yasoob
        """
        send_mail('Welcome!', data, "Yasoob",
                  [email], fail_silently=False)
        return render(request, 'success.html')
    

## 6.Adding templates

Now we need to create a `templates` dir in the `send_email` folder and create 2 files in it. Namely, `index.html` and `success.html`.

You need to create a form in the `index.html` file with an input fild of name email. The `success.html` file does not need any special content.

That’s it! Now you can first create migrations, then apply them and finally run your project. Just key in the following commands:

    $ python manage.py makemigrations
    $ python manage.py migrate
    $ python manage.py runserver
    

I have deployed a sample app over [here][2] and the code for this project is available on [GitHub][3].

Cheers!

 [1]: http://settings.py
 [2]: https://email-django.herokuapp.com/
 [3]: https://github.com/yasoob/email_django