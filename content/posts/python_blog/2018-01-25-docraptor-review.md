---
title: DocRaptor review
author: yasoob
type: post
date: 2018-01-26T01:51:59+00:00
url: /2018/01/25/docraptor-review/
timeline_notification:
  - 1516931522
publicize_twitter_user:
  - yasoobkhalid
categories:
  - Sponsored
tags:
  - docraptor

---
Hi everyone, I was recently contacted by the folks at DocRaptor telling me about their service so I decided to take it for a test drive and see for myself what it actually is.

DocRaptor provides you with an API to generate PDF and XLS files from HTML and CSS files. Today we will take a look at how we can use it to generate the PDF for a payment receipt.

## <a id="Step_1_Install_the_Required_Dependencies_4"></a>Step 1: Install the Required Dependencies

We need to install the `docraptor` package.

    pip install --upgrade docraptor
    

We also need to signup for a trial on [DocRaptor][1].

## <a id="Step_2_Test_Document_Generation_15"></a>Step 2: Test Document Generation

Try running the sample code to make sure that everything is working:

```

import docraptor

docraptor.configuration.username = "******************"
# docraptor.configuration.debug = True

doc_api = docraptor.DocApi()

with open('test.html', 'r') as f:
    test_html = f.read()

response = doc_api.create_doc({
  "test": True,                                                   # test documents are free but watermarked
  "document_content": str(test_html),    # supply content directly
  # "document_url": "http://docraptor.com/examples/invoice.html", # or use a url
  "name": "docraptor-python.pdf",                                 # help you find a document later
  "document_type": "pdf",                                         # pdf or xls or xlsx
  # "javascript": True,                                           # enable JavaScript processing
  # "prince_options": {
  #   "media": "screen",                                          # use screen styles instead of print styles
  #   "baseurl": "http://hello.com",                              # pretend URL when using document_content
  # },
})


with open('test.pdf', 'wb') as f:
    f.write(response)
```

If the above code works without any errors then you should have a `test.pdf` file in the working directory. You can check out the official Python docs on <a href="https://docraptor.com/documentation/python" target="_blank" rel="noopener noreferrer">DocRaptor&#8217;s website</a>.

Now let’s move on and actually create a simple receipt HTML template and use that to generate a receipt.

## <a id="Step_3_Creating_a_Custom_Template_49"></a>Step 3: Creating a Custom Template

Now we can go ahead and code up a template from scratch but what if I told you that DocRaptor already provides you with some templates which you can customize and quick start your pdf generation journey?

Let’s customize a [DocRaptor template][2]. This is the code for a receipt template which DocRaptor has on its website:

https://gist.github.com/yasoob/b3fbdfef05e3e12d24c9d73985c41646
  
Let’s customize it to reflect the Python Tips brand.

https://gist.github.com/yasoob/ff6d9681081bfb7f7dc6862f9a3a5c91
  
I customized the logo, header, footer and table data and also added a “Paid” stamp below the total amount. I had to make only minimal changes in the template and now I have a really beautiful receipt template which I can use to generate PDFs.

Now run the Python code again but this time change the

```
"test": True
```

to

```
"test": False
```

If everything works fine you should end up with a similar PDF:

![Image](/wp-content/uploads/2018/01/screen-shot-2018-01-25-at-8-27-40-pm.png)

The usefulness of DocRaptor comes in when you have to generate tons of PDF files on the fly without utilizing a lot of your own system’s resources.

In a future post we will take a look at using Python to generate PDFs and you will see how tedious it can get. I don&#8217;t really have any need to generate so many PDFs so I can&#8217;t comment on whether DocRaptor is expensive or worth-it but it sure is a convenient service.

If you have read this far then please go ahead and give DocRaptor a try. You can avail a 10% discount by emailing [DocRaptor support][3] and mentioning this blog post.

Stay tuned for more posts in the future!

 [1]: https://docraptor.com/
 [2]: https://docraptor.com/try_it_out
 [3]: mailto:support@docraptor.com