---
title: OCR on PDF files using Python
author: yasoob
type: post
date: 2016-02-24T19:28:57+00:00
url: /2016/02/25/ocr-on-pdf-files-using-python/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - ocr
  - ocr in pdf
  - optical character recognition
  - pdf ocr python
  - python ocr
  - python tesseract
  - tesseract

---
Hi there folks! You might have heard about OCR using Python. The most famous library out there is tesseract which is sponsored by Google. It is very easy to do OCR on an image. The issue arises when you want to do OCR over a PDF document.

I am working on a project where I want to input PDF files, extract text from them and then add the text to the database. I had to search a lot before I stumbled over the final solution. So without wasting any time, lets begin.

## Installing Tesseract

It is very easy to install tesseract on various operating systems. For the sake of simplicity I will be using Ubuntu as an example. In Ubuntu you simply have to run the following command in the terminal:

```
sudo apt-get install tesseract-ocr
```

It will install Tesseract along with the support for three languages.

## Installing PyOCR

Now we need to install the Python bindings for tesseract. Fortunately, there are some pretty nice bindings out there. We will be installing a latest one:

```
pip install git+https://github.com/jflesch/pyocr.git
```

## Installing Wand and PIL

We need to install two other dependencies as well before we can move on. First one is Wand. It is the Python bindings for Imagemagick. We will be using it for converting PDF files to images:

```
pip install wand
```

We will be using PIL as well because PyOCR needs it. You can take a look at the official docs on how to install it on your operating system.

## Warming up

Let's start writing our script. First of all, we will be importing the required libraries:

```
from wand.image import Image
from PIL import Image as PI
import pyocr
import pyocr.builders
import io
```

**Note:** I imported Image from PIL as PI because otherwise it would have conflicted with the Image module from wand.image.

## Get Going

Now we need to get the handle of the OCR library (in our case, tesseract) and the language which will be used by pyocr.

```
tool = pyocr.get_available_tools()[0]
lang = tool.get_available_languages()[1]
```

We used the second language in the `tool.get_available_languages()` because the last time I checked, it was English.

Now we need to setup two lists which will be used to hold our images and final_text.

```
req_image = []
final_text = []
```

Next step is to open the PDF file using wand and convert it to jpeg. Let's do it!

```
image_pdf = Image(filename="./PDF_FILE_NAME", resolution=300)
image_jpeg = image_pdf.convert('jpeg')
```

**Note:** Replace `PDF_FILE_NAME` with a valid PDF file name in the current path.

_wand_ has converted all the separate pages in the PDF into separate image blobs. We can loop over them and append them as a blob into the _req_image_ list.

```
for img in image_jpeg.sequence:
    img_page = Image(image=img)
    req_image.append(img_page.make_blob('jpeg'))
```

Now we just need to run OCR over the image blobs. It is very easy.

```
for img in req_image: 
    txt = tool.image_to_string(
        PI.open(io.BytesIO(img)),
        lang=lang,
        builder=pyocr.builders.TextBuilder()
    )
    final_text.append(txt)
```

Now all of the recognized text has been appended in the _final_text_ list. You can use it in any way you want. I hope this tutorial was helpful for you guys!

If you have any comments and suggestions then do let me know in the comments section below.

Till next time! 🙂

 [1]: http://goo.gl/forms/h97pzDUVr1