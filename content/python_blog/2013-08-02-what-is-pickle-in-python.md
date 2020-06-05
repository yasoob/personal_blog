---
title: What is Pickle in python?
author: yasoob
type: post
date: 2013-08-02T03:59:33+00:00
url: /2013/08/02/what-is-pickle-in-python/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:35;}s:2:"fb";a:1:{i:4182098;i:16;}s:2:"wp";a:1:{i:0;i:8;}}'
categories:
  - python
tags:
  - data serialization
  - deserialize
  - pickle
  - serialize

---
Hi there fellas. In this post i am going to tell you about pickle. It is used for serializing and de-serializing a Python object structure. Any object in python can be pickled so that it can be saved on disk. What pickle does is that it “serialises” the object first before writing it to file. Pickling is a way to convert a python object (list, dict, etc.) into a character stream. The idea is that this character stream contains all the information necessary to reconstruct the object in another python script. So lets continue:

- First of all you have to import it through this command:

```
import pickle
```

pickle has two main methods. The first one is `dump`, which dumps an object to a file object and the second one is `load`, which loads an object from a file object.

- Prepare something to pickle:
  
Now you just have to get some data which you can pickle. For the sake of simplicity i will be pickling a python list. So just read the below code and you will be able to figure it out yourself.

```
import pickle

a = ['test value','test value 2','test value 3']
a
# ['test value','test value 2','test value 3']

file_Name = "testfile"
# open the file for writing
fileObject = open(file_Name,'wb') 

# this writes the object a to the
# file named 'testfile'
pickle.dump(a,fileObject)   

# here we close the fileObject
fileObject.close()
# we open the file for reading
fileObject = open(file_Name,'r')  
# load the object from the file into var b
b = pickle.load(fileObject)  
b
# ['test value','test value 2','test value 3']
a==b
# True
```

The above code is self explanatory. It shows you how to import the pickled object and assign it to a variable. So now we need to know where we should use pickling. It is very useful when you want to dump some object while coding in the python shell. So after dumping whenever you restart the python shell you can import the pickled object and deserialize it. But there are other use cases as well which i found on [stackoverflow][1]. Let me list them below.
  
1. saving a program's state data to disk so that it can carry on where it left off when restarted (persistence)`
2. sending python data over a TCP connection in a multi-core or distributed system (marshalling)
3. storing python objects in a database
4. converting an arbitrary python object to a string so that it can be used as a dictionary key (e.g. for caching & memoization).

One thing to note is that there is a brother of pickle as well with the name of cpickle. As the name suggests it is written in c which makes it 1000 times more faster than pickle. So why should we ever use pickle instead of cpickle? Here's the reason:
  
- pickle handles unicode objects
- pickle is written in pure Python, it's easier to debug.

For further reading i suggest the [official pickle documentation][2] or if you want to read more tutorials then check out the [sqlite tutorial][3]. Now we come to the end of today's post. I hope you liked it. Do follow my blog to get regular updates. If you have any suggestions or comments then post them below.

 [1]: http://stackoverflow.com/questions/3438675/common-use-of-pickle-in-python
 [2]: http://docs.python.org/2/library/pickle.html
 [3]: http://freepythontips.wordpress.com/2013/08/01/connecting-to-sqlite-databases/