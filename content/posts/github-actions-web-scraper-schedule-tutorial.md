---
title: "How to web scrape on Schedule using Github Actions?"
date: 2021-08-04T13:24:54+05:00
draft: false
categories: ['programming', 'python', 'GitHub']
featured_image: "/images/github-actions/hero.png"
teaser: "I recently got to work on a web scraping project that I deployed on GitHub. The scraper runs daily on a schedule and emails the extracted data all for free using GitHub Actions! In this article, I will show you how I developed this project and how you too can make use of GitHub Actions for free."
---

Hi everyone! :wave: It's been a long time since I last posted on this blog. I was busy graduating from college and moving places and that didn't leave enough time for fun new projects. I am still in the middle of it all but recently did a project that gave me a tutorial idea to write about. I was asked to create a web scraper that would scrape a certain website, filter the data and then send an email with that data. I will show you what I was tasked with, how I developed it, and how I deployed it for free using GitHub Actions.

**Note:** You can find the corresponding GitHub repo [here](github.com/yasoob/github-action-scraper-tutorial/)

## Requirements

I was asked if I could write an application that would monitor this [website below](https://ppra.org.pk/) and extract tender information and email only the latest tenders to an email id. I explored the website and quickly agreed. 

![PPRA homepage](/images/github-actions/ppra-homepage.png)

## Plan of Action

I had come across some fun projects by the likes of [Simon Wilson](https://github.com/simonw/package-stats/blob/main/.github/workflows/fetch_stats.yml) and wanted to test out GitHub Actions for myself. What better way to test it out than deploying a working scraper that automatically runs on a schedule and emails the scraped data?

The first step is to download the web page using Python and pull out the table into a more useable data structure. I opted for regex initially and then settled on Pandas for the initial extraction. 

The next step is to email the parsed data. For that, I am going to rely on a [GitHub action created by Dawid Dziurla](https://github.com/marketplace/actions/send-email).

## Installing the required libraries

We will be making use of the following two libraries:

- pandas
- requests

Go ahead and add both of these libraries into a `requirements.txt` file in the root of your project directory/repository and install them if you haven't already. Later on, we will be using this file to install these dependencies in the GitHub Actions execution environment.

## Writing the scraper

This is by far the most time-consuming part of the whole process. However, it is pretty simple once you know what you are doing. The first step is to figure out the URL of the tenders page. The website uses AJAX so going to the tenders page does not change the URL in the address bar. To find the actual URL, we can open up Developer Tools and look at the requests made while navigating to the tenders page.

![Network Manager](/images/github-actions/network-manager.png)

This first URL is the direct URL of the tenders page but it does not have a page number in the URL. For it to use the page number as well we can navigate to the 2nd page of the tenders and take a look at the new request (notice the `PageNo=2` at the end of the URL). We can now follow the pattern of this request to query for however many pages we want.

![Network manager 2](/images/github-actions/network-manager-2.png)

At this point, we can write some Python code to download the page using [requests](https://docs.python-requests.org/en/master/).

```python
import requests as r
html = r.get('https://ppra.org.pk/dad_tenders.asp?PageNo=1')
```

Now that we know how to query for different pages, we need to figure out how to parse the table. I initially tried using regex as for such simple use cases it has always worked out pretty well for me. I know about [this SO answer](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags) but we are parsing a known, limited subset of HTML so it is perfectly fine to use regex for that.

However, regex posed a few issues. It wasn't working exactly the way I wanted it to. I had forgotten about the `re.DOTALL` flag while writing my initial pattern and my regex pattern wasn't working past the `\n` character. Instead of fixing this issue, I decided to give Pandas a try. I had heard that you could easily parse an HTML table using Pandas but I had never tried it so I thought about giving that a try instead. 

My main motivation for taking on new projects is that I get to explore and learn new stuff and then write about it on this blog so I actively try to opt for new methods even if I know the old method works perfectly fine. You will never learn about new and better ways if you don't explore, right?

Using Pandas is extremely straightforward. We can use the following snippet to parse the tables in the document:

```python
import pandas as pd
dfs = pd.read_html(html.text)
```

However, by only supplying the HTML to `read_html` method, Pandas extracts all the tables from the page. In my testing, this resulted in 4 tables.

```python
>>> dfs
[                                                   0
0  Please Click on image to Download/View. Only 1...,                        0                                                  1
0  Tender Closing Date :  Month January  Feburay  March  April  May  Jun...,                   0
0  PPRA Ref No: TSE,             0                                                  1         2                3                      4
0   Tender No                                    Tender  Details  Download  Advertised Date           Closing Date
1   TS455000E  Pakistan Aeronautical Complex, Kamra Procureme...       NaN        30/7/2021   4/8/2021 10:30:00 AM
2   TS454835E  Pakistan State Oil, Karachi Miscellaneous Work...       NaN        30/7/2021    5/8/2021 2:15:00 PM
3   TS453722E  State Life Insurance Corporation of Pakistan, ...       NaN        30/7/2021              24/8/2021
4   TS453262E  Sui Southern Gas Company Limited, Karachi SSGC...       NaN        30/7/2021   23/8/2021 3:00:00 PM
5   TS455691E  National Database and Registration Authority N...       NaN        30/7/2021  16/8/2021 11:00:00 AM
6   TS453260E  Sui Southern Gas Company Limited, Karachi SSGC...       NaN        30/7/2021  23/8/2021 12:30:00 PM
7   TS456503E  National Heritage & Intrigation Division, Isla...       NaN        30/7/2021  24/8/2021 11:00:00 AM
 
...
```

To only extract the table we need, we can tell Pandas to extract the table with the width attribute set to 656. There is only one table in the whole HTML with that specific attribute value so it only results in 1 extracted table.

```
dfs = pd.read_html(html.text, attrs={'width': '656'})
```

```python
>>> dfs
[            0                                                  1         2                3                      4
0   Tender No                                    Tender  Details  Download  Advertised Date           Closing Date
1   TS456131E  Sui Southern Gas Company Limited, Karachi Supp...       NaN        30/7/2021   25/8/2021 3:30:00 PM
2   TS456477E  National Accountability Bureau, Sukkur Service...       NaN        30/7/2021  16/8/2021 11:00:00 AM
3   TS456476E  Sukkur Electric Power Company (SEPCO), Sukkur ...       NaN        30/7/2021  12/8/2021 11:00:00 AM
4   TS456475E  Evacuee Trust Property Board, Multan Services ...       NaN        30/7/2021  17/8/2021 10:00:00 AM
5   TS456474E  Military Engineering Services (Navy), Karachi ...       NaN        30/7/2021  13/8/2021 11:30:00 AM
6   TS456473E  National University of Science and Technology,...       NaN        30/7/2021  17/8/2021 11:00:00 AM
7   TS456490E  Shaikh Zayed Hospital, Lahore Miscellaneous Wo...       NaN        30/7/2021  19/8/2021 11:00:00 AM
8   TS456478E  Ministry of Religious Affairs & Interfaith Har...       NaN        30/7/2021  16/8/2021 11:00:00 AM
9   TS456489E  Cantonment Board, Rawalpindi Services Required...       NaN        30/7/2021  17/8/2021 12:00:00 PM
10  TS456480E  National Bank of Pakistan, Lahore Miscellaneou...       NaN        30/7/2021  16/8/2021 11:00:00 AM
11  TS456481E  National Bank of Pakistan, Lahore Miscellaneou...       NaN        30/7/2021  16/8/2021 11:00:00 AM

...
```

There are still a few issues with this extraction. 

- Pandas isn't able to automatically extract header for our table
- `Advertised Date` column data isn't parsed as a date
- Download column is all `NaN`s

To fix the first issue, we can pass in the `header` parameter to `read_html` and Pandas will make the respective row the header of the table. The second issue can be fixed by passing in `parse_dates` parameter and Pandas will parse the data in the respective column as dates. There are multiple ways to resolve the third issue. I ended up using regex to extract the download links into a list and then assigning that list to the `Download` column in our data frame.

The `read_html` method call looks something like this after fixing the first two issues:

```python
dfs = pd.read_html(html.text, attrs={'width': '656'}, header=0, parse_dates=['Advertised Date'])
```

The regex for extracting the `Download` links and assigning them to the `Download` column looks like this:

```python
download_links = re.findall('<a target="_blank" href="(.+?)"><img border="0" src="images/(?:.+?)"></a>',html.text)
download_links = ["<a href='https://ppra.org.pk/"+link+"' style='display: block;text-align: center;'> <img src='https://ppra.org.pk/images/download_icon.gif'/></a>" for link in download_links]
tender_table = dfs[0]
tender_table['Download'] = download_links
```

The extracted links are relative so we can use list comprehension to prepend the actual URL to the extracted link. I am converting the link into an anchor tag and encapsulating an image with that because of two reasons. Firstly, it would look nice in our final email, and secondly, the table would look similar to what our client is used to seeing on the website so there would be less visual fatigue while looking at the email. 

The client asked me to generate emails with the tenders for the latest date only. The tenders for the latest date sometimes span multiple pages so we can put all the code we have so far into a separate function and then pass in page numbers to that function to extract the tables from a specific page. 

The code with the function looks like this:

```
import requests as r
import pandas as pd
import re

url_template = "https://ppra.org.pk/dad_tenders.asp?PageNo="

def download_parse_table(url):
    html = r.get(url)
    dfs = pd.read_html(html.text, attrs={'width': '656'}, header=0, parse_dates=['Advertised Date'])
    download_links = re.findall('<a target="_blank" href="(.+?)"><img border="0" src="images/(?:.+?)"></a>',html.text)
    download_links = ["<a href='https://ppra.org.pk/"+link+"' style='display: block;text-align: center;'> <img src='https://ppra.org.pk/images/download_icon.gif'/></a>" for link in download_links]
    tender_table = dfs[0]
    tender_table['Download'] = download_links
    return tender_table
```

To put all the extracted tables into one data frame, we need to put them all into a list and use the [`pd.concat` method](https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html). The code for that looks like this:

```
combined_df = []
for index in range(1,8):
    df = download_parse_table(url_template+str(index))
    combined_df.append(df)

combined_df = pd.concat(combined_df)
```



```
>>> combined_df
    Tender No                                    Tender  Details                                           Download Advertised Date           Closing Date
0   TS455000E  Pakistan Aeronautical Complex, Kamra Procureme...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30   4/8/2021 10:30:00 AM
1   TS454835E  Pakistan State Oil, Karachi Miscellaneous Work...  <a href='https://ppra.org.pk/doc/30-7/42pso307...      2021-07-30    5/8/2021 2:15:00 PM
2   TS453722E  State Life Insurance Corporation of Pakistan, ...  <a href='https://ppra.org.pk/doc/30-7/42life30...      2021-07-30              24/8/2021
3   TS453262E  Sui Southern Gas Company Limited, Karachi SSGC...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30   23/8/2021 3:00:00 PM
4   TS455691E  National Database and Registration Authority N...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30  16/8/2021 11:00:00 AM
..        ...                                                ...                                                ...             ...                    ...
25  TS456443E  Civil Aviation Authority, Karachi TENDER NOTIC...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-29  13/8/2021 11:00:00 AM
26  TS454178E  Zarai Taraqiati Bank Ltd (ZTBL), Islamabad Inf...  <a href='https://ppra.org.pk/doc/28-7/ztb287-1...      2021-07-28  10/8/2021 11:00:00 AM
27  TS454566E  Sui Northern Gas Pipelines Limited, Lahore Rel...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-28    1/9/2021 3:30:00 PM
28  TS455579E  Pakistan Ordnance Factories, Wah Cantt Repair ...  <a href='https://ppra.org.pk/doc/28-7/pof287-4...      2021-07-28   4/8/2021 10:20:00 AM
29  TS455365E  Pakistan National Shipping Corporation (PNSC),...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-28  24/8/2021 11:00:00 AM

[210 rows x 5 columns]
```

It looks mostly fine but there is one issue. The index is preserved after the `concat`. I want to reset it so that it goes from 0-209 instead of 0-29 multiple times. This is also easy to acomplish. We just need to modify the `concat` method call like this:

```python
combined_df = pd.concat(combined_df).reset_index(drop=True)
```



```python
>>> combined_df
     Tender No                                    Tender  Details                                           Download Advertised Date           Closing Date
0    TS455000E  Pakistan Aeronautical Complex, Kamra Procureme...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30   4/8/2021 10:30:00 AM
1    TS454835E  Pakistan State Oil, Karachi Miscellaneous Work...  <a href='https://ppra.org.pk/doc/30-7/42pso307...      2021-07-30    5/8/2021 2:15:00 PM
2    TS453722E  State Life Insurance Corporation of Pakistan, ...  <a href='https://ppra.org.pk/doc/30-7/42life30...      2021-07-30              24/8/2021
3    TS453262E  Sui Southern Gas Company Limited, Karachi SSGC...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30   23/8/2021 3:00:00 PM
4    TS455691E  National Database and Registration Authority N...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-30  16/8/2021 11:00:00 AM
..         ...                                                ...                                                ...             ...                    ...
205  TS456443E  Civil Aviation Authority, Karachi TENDER NOTIC...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-29  13/8/2021 11:00:00 AM
206  TS454178E  Zarai Taraqiati Bank Ltd (ZTBL), Islamabad Inf...  <a href='https://ppra.org.pk/doc/28-7/ztb287-1...      2021-07-28  10/8/2021 11:00:00 AM
207  TS454566E  Sui Northern Gas Pipelines Limited, Lahore Rel...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-28    1/9/2021 3:30:00 PM
208  TS455579E  Pakistan Ordnance Factories, Wah Cantt Repair ...  <a href='https://ppra.org.pk/doc/28-7/pof287-4...      2021-07-28   4/8/2021 10:20:00 AM
209  TS455365E  Pakistan National Shipping Corporation (PNSC),...  <a href='https://ppra.org.pk/download.asp?tend...      2021-07-28  24/8/2021 11:00:00 AM

[210 rows x 5 columns]
```

This looks much better!

Next we need to filter this data for the latest date. We can do that using just two lines:

```python
latest_date = combined_df.iloc[0]['Advertised Date']
filtered_df = combined_df[combined_df['Advertised Date'] == latest_date]
```

We first extract the latest date which is the `Advertised Date` of the first item in the table and then filter the rest of the table using that value.

Now we can convert this into an HTML table. Pandas does not create a full HTML document so we need to create one ourselves and then embed the Pandas output in it:

```
html_string = """
    <html>
    <head><title>Latest PPRA Tenders</title></head>
    <body>
            <style>
        table {
            border-collapse: collapse;
            border: 1px solid silver;
        }
        table tr:nth-child(even) {
            background: #E0E0E0;
        }
        </style>
        %s
    </body>
    </html>
"""

table_html = filtered_df.to_html(index=False,render_links=True, justify="center", 
    escape=False, border=4)
with open('ppra.html', 'w') as f:
    f.write(html_string %(table_html))
```

I used the `%s` string interpolation method because I have some `<style>` tags with `{}` braces and it confuses Python if I use the f-strings.

After running what we have so far, the output (`ppra.html`) looks like this:

![Output Table](/images/github-actions/output-table.png)

There is one issue, the `Tender Details` column looks very cluttered. Instead of putting the details data in a single font-weight and on the same line, we need to break it up as they do on the original website. The easiest way to do that is to extract the details using regex and then replace the details in the data frame with the extracted ones.

The regex for details extraction looks something like this:

```
details = re.findall('<td bgcolor="(?:.+?)" width="305">(.+?)</td>', html.text, re.DOTALL)
```

The detail cells have a specific width so we extract the data based on that. We use `re.DOTALL` because the details span multiple lines and we want `.` to match the carriage return (`\r`) and newline character (`\n`) as well. The extracted details contain `\r\n` and we can get rid of them using this list comprehension:

```
details = [detail.replace('\r\n','') for detail in details]
```

Let's assign this details list to our data frame:

```
tender_table["Tender  Details"] = details
```

## Final scraper code

The final scraper code looks like this:

```python
import requests as r
import pandas as pd
import re

url_template = "https://ppra.org.pk/dad_tenders.asp?PageNo="
html_string = """
    <html>
    <head><title>Latest PPRA Tenders</title></head>
    <body>
        <style>
        table {
            border-collapse: collapse;
            border: 1px solid silver;
        }
        table tr:nth-child(even) {
            background: #E0E0E0;
        }
        </style>
        %s
    </body>
    </html>
"""

def download_parse_table(url):
    html = r.get(url)
    details = re.findall('<td bgcolor="(?:.+?)" width="305">(.+?)</td>', html.text, re.DOTALL)
    details = [detail.replace('\r\n','') for detail in details]
    dfs = pd.read_html(html.text, attrs={'width': '656'}, header=0, 
        parse_dates=['Advertised Date'])
    download_links = re.findall(
        '<a target="_blank" href="(.+?)"><img border="0" src="images/(?:.+?)"></a>',
        html.text)
    download_links = ["<a href='https://ppra.org.pk/"+link+"' style='display: block;text-align: center;'> <img src='https://ppra.org.pk/images/download_icon.gif'/></a>" for link in download_links]
    tender_table = dfs[0]
    tender_table['Download'] = download_links
    tender_table["Tender  Details"] = details
    return tender_table

combined_df = []
for index in range(1,8):
    df = download_parse_table(url_template+str(index))
    combined_df.append(df)

combined_df = pd.concat(combined_df).reset_index(drop=True)
latest_date = combined_df.iloc[0]['Advertised Date']
filtered_df = combined_df[combined_df['Advertised Date'] == latest_date]

table_html = filtered_df.to_html(index=False,render_links=True, justify="center", 
    escape=False, border=4)
with open('ppra.html', 'w') as f:
    f.write(html_string %(table_html))
```

## Getting started with Github Action

I am going to keep this intro to GitHub Actions very short. GitHub Actions have a concept of workflows. Actions will execute workflows. These workflows are contained inside the `.github/workflows` folder in the root of the repo and list the steps we want Actions to execute. I went ahead and created a `.github/workflows` folder in my project root and then created a `scrape.yml` file inside the `workflows` folder. GH Actions would make more sense if I show you the complete YAML file and then explain it. 

The contents of the `scrape.yml` file are this:

```
name: Scrape

on:
  schedule:
    - cron: "0 4 * * *"
  workflow_dispatch:

env:
  ACTIONS_ALLOW_UNSECURE_COMMANDS: true

jobs:
  scrape-latest:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2.0.0
        with:
          python-version: '3.7'
      - name: Install requirements
        run: pip install -r requirements.txt
      - name: Run Scraper
        run: python scraper.py
      - name: Set env vars
        run: |
          echo "DATE=$(python -c 'import datetime as dt; print(dt.datetime.now().date())')" >> $GITHUB_ENV
      - name: Send mail
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: ${{secrets.MAIL_USERNAME}}
          password: ${{secrets.MAIL_PASSWORD}}
          subject: Latest PPRA tenders for ${{env.DATE}}
          to: hi@yasoob.me
          from: Automated Email
          ignore_cert: true
          secure: true
          html_body: file://ppra.html
```

We start by naming the Action. In our case, we named it `Scrape`. Next, we tell GitHub when to execute this action. The first time is via a cron schedule and the second is via the online workflow dispatcher. The cron value is similar to the crontab you might have used on Linux. You can use [Crontab Guru](crontab.guru/) to explore crontabs. The one I am using will cause the workflow to run every day at 4 o'clock. This is in UTC. The `workflow_dispatch` is used just for testing. This way we don't have to wait until 4 o'clock just to test it and can trigger the workflow manually using the online interface.

Next, we create an environment variable to which our execution environment will have access. `ACTIONS_ALLOW_UNSECURE_COMMANDS` is required for Python on GitHub due to a bug. I am not sure if it is fixed or not.  Afterward, we install Python, install the requirements and run the scraper. Then we set the `DATE` variable to the current server time. This will be used in the subject of our email. 

For the email sending part, I am using the awesome [`send-email`](https://github.com/marketplace/actions/send-email) action which makes the whole process super simple. I provide it with my Gmail username and password and point it to the generated HTML file and it automatically sends the email.

We also need to make sure we configure the secrets in the repository settings page so that the `send-email` action has access to the `MAIL_USERNAME` and `MAIL_PASSWORD`. 

![GitHub Repository settings](/images/github-actions/github-secret-settings.png)

We can test the execution by pushing everything to GitHub and then going to the Actions tab of the repo. From there we can select our workflow and manually trigger it.

![Github action workflow](/images/github-actions/github-action-workflow.png)

## GitHub Actions Feedback

The Action has been running successfully for a few days now. I have fallen in love with the simplicity of Actions. The only major issue is that you should not use the free version for anything time-sensitive. The action execution is almost always delayed by a few minutes when using the scheduler. For most simple cases it is fine though. I am also not sure if the situation is any different under the paid plan. However, if you dispatch the workflow using the online interface, it mostly gets scheduled for execution right away.

I will use Actions again in the future when I have similar projects. The only thing to keep in mind is that Actions only have a limited amount of free minutes. If you go beyond this limit, you will have to pay and the price varies based on the operating system. The free account is limited to [2000 minutes per month](https://github.com/pricing).

## Conclusion

I hope you all enjoyed this tutorial. You can find the corresponding GitHub repo [here](github.com/yasoob/github-action-scraper-tutorial/). I had a ton of fun working on it. If you have any questions, comments, or suggestions, please feel free to comment below or send me an email (hi @ yasoob.me) or a [tweet](https://twitter.com/yasoob). I do plan on writing about a bunch of other stuff but time is at a premium these days. However, I am hoping the situation would soon change :smile: I will see you in the next article :heart:




