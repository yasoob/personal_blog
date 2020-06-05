---
title: Connecting to Sqlite databases
author: yasoob
type: post
date: 2013-07-31T19:48:33+00:00
url: /2013/08/01/connecting-to-sqlite-databases/
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:7;}s:2:"fb";a:1:{i:4182098;i:15;}s:2:"wp";a:1:{i:0;i:3;}}'
publicize_twitter_user:
  - yasoobkhalid
tagazine-media:
  - 'a:7:{s:7:"primary";s:0:"";s:6:"images";a:0:{}s:6:"videos";a:0:{}s:11:"image_count";i:0;s:6:"author";s:8:"38253445";s:7:"blog_id";s:8:"55796613";s:9:"mod_stamp";s:19:"2013-07-31 19:58:41";}'
categories:
  - python
tags:
  - connect
  - database
  - delete
  - insert
  - update

---
Hi there fellas. Today i am going to teach you how to use sqlite databases with python. This post will cover the basics of making and using a sqlite database with python using the sqlite3 library. Okay lets get started. Firstly if you are using python 2.5 or greater then you will have sqlite3 installed otherwise you will have to install it.

## Creating and connecting to a database

So how do you make a database in python using the sqlite3 library? It's pretty simple. Just follow the code below and you will be able to make it out on your own.

```
#!/usr/bin/python

import sqlite3

# If the database is already created then this
# code will connect to it instead of making a new one
conn = sqlite3.connect('test.db')

print "Created database successfully"
```

So was that difficult? I hope not. So lets continue. The next thing is to make tables in our database. So how do you go about doing it? Just follow me.

## Making tables in a database

```
import sqlite3
 
conn = sqlite3.connect("test.db")

<a href="http://freepythontips.wordpress.com/2013/07/28/the-with-statement/">with</a> conn:
    cursor = conn.cursor()
 
    # create a table
    cursor.execute("""CREATE TABLE books
               (title text, author text)""")
```

In the above code we made a table with the name of book. It has the following fields: title and author. Both of these fields have the data type of text. First of all we made a database with the name of test.db and after that we made a cursor object which allows us to interface with our database and execute queries. So what now. We have created a database and made a table. Now we have to insert some data in our table. Lets continue.

## Inserting data to the database

```
# insert some data
cursor.execute("INSERT INTO books VALUES ('Pride and Prejudice', 'Jane Austen')")
 
# save data to database
conn.commit()
 
# insert multiple records using the more secure "?" method
books = [('Harry Potter', 'J.K Rowling'),
          ('The Lord of the Rings', 'J. R. R. Tolkien'),
          ('The Hobbit','J. R. R. Tolkien')]
cursor.executemany("INSERT INTO books VALUES (?,?)", books)
conn.commit()
```

So in the above code i showed you two ways to put some data into the database. The first method is to execute a single query and the second method is to execute multiple queries in the same time. In the second method we could have used the string substitution `%s` but it is known to be potentially dangerous and can lead to SQL Injection. So whats left now? Removing and updating the data? No problem i will cover that as well. Just examine the code below.

## Updating data in the database

```
import sqlite3
 
conn = sqlite3.connect("test.db")

<a href="http://freepythontips.wordpress.com/2013/07/28/the-with-statement/">with</a> conn:
    cursor = conn.cursor()
 
    sql = """
        UPDATE books 
        SET author = 'Yasoob' 
        WHERE author = 'J.K Rowling'
    """
    cursor.execute(sql)
```

In the above code we updated our record by replacing J.K Rowling with Yasoob. Take a look at the below code for deleting the records. 

## Deleting records from the database

```
import sqlite3
 
conn = sqlite3.connect("test.db")

<a href="http://freepythontips.wordpress.com/2013/07/28/the-with-statement/">with</a> conn:
    cursor = conn.cursor()
 
    sql = """
        DELETE FROM books
        WHERE author = 'Yasoob'
    """
    cursor.execute(sql)
```

In the above code we deleted the record of those books whose writer was 'Yasoob'. Now i am going to show you how to display data from the table. It is easy. Just a few lines of code.

## Displaying data from the database

```
import sqlite3

conn = sqlite3.connect('test.db')
print "Opened database successfully";

cursor = conn.execute("SELECT title, author  from books")
for row in cursor:
   print "Title = ", row[0]
   print "Author = ", row[1], "\n"

print "Operation done successfully";
conn.close()
```

In the above code we opened our database file and displayed the records on the screen. Do you know that we could have also done:

```
conn = sqlite3.connect(':memory:')
```

So what is this code doing? The `:memory:` is a special name which creates the database in the ram and lets you execute any query. Lastly I would like to tell you about sqlalchemy which is a database library for python and takes care of a lot of things for you. It does all the escaping for you so you won't have to mess with the annoyances of converting embedded single quotes into something that SQLite will accept. It's a part of my [previous blog post][1] as well.

So now goodbye to you all. I hope you liked reading today's post as much as i enjoyed writing it. Stay tuned for my next post.

For further reading i suggest the [zetcode database tutorial][2].

 [1]: http://freepythontips.wordpress.com/2013/07/30/20-python-libraries-you-cant-live-without/
 [2]: http://zetcode.com/db/sqlitepythontutorial/