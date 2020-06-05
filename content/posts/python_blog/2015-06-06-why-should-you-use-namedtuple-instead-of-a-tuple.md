---
title: Why should you use namedtuple instead of a tuple?
author: yasoob
type: post
date: 2015-06-05T19:21:31+00:00
url: /2015/06/06/why-should-you-use-namedtuple-instead-of-a-tuple/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - namedtuple
  - python namedtuple
  - tuples python

---

Hi there guys! You might already be acquainted with tuples. A tuple is a lightweight object type which allows to store a sequence of immutable Python objects. They are just like lists but have a few key differences. The major one is that unlike lists, **you can not change a value in a tuple**. In order to access the value in a tuple you use integer indexes like:

    man = ('Ali', 30)
    print(man[0])
    # Output: Ali
    

Well, so now what are `namedtuples`? They turn tuples into convenient containers for simple tasks. With namedtuples you don't have to use integer indexes for accessing members of a tuple. You can think of namedtuples like dictionaries but unlike dictionaries they are immutable.

    from collections import namedtuple
    
    Animal = namedtuple('Animal', 'name age type')
    perry = Animal(name="perry", age=31, type="cat")
    
    print(perry)
    # Output: Animal(name='perry', age=31, type='cat')
    
    print(perry.name)
    # Output: 'perry'
    

As you can see that now we can access members of a tuple just by their name using a `.`. Let's disect it a little more. A named tuple has two required arguments. They are the tuple name and the tuple field\_names. In the above example our tuple name was 'Animal' and the tuple field\_names were 'name', 'age' and 'cat'.

Namedtuple makes your tuples **self-document**. You can easily understand what is going on by having a quick glance at your code. And as you are not bound to use integer indexes to access members of a tuple, it makes it more easy to maintain your code. Moreover, as **`namedtuple` instances do not have per-instance dictionaries**, they are lightweight and require no more memory than regular tuples. This makes them faster than dictionaries.

However, do remember that as with tuples, **attributes in namedtuples are immutable**. It means that this would not work:

    from collections import namedtuple
    
    Animal = namedtuple('Animal', 'name age type')
    perry = Animal(name="perry", age=31, type="cat")
    perry.age = 42
    
    # Output: Traceback (most recent call last):
    #            File "<stdin>", line 1, in <module>
    #         AttributeError: can't set attribute
    

You should use named tuples to make your code self-documenting. **They are backwards compatible with normal tuples**. It means that you can use integer indexes with namedtuples as well:

    from collections import namedtuple
    
    Animal = namedtuple('Animal', 'name age type')
    perry = Animal(name="perry", age=31, type="cat")
    print(perry[0])
    # Output: perry
    

Last but not the least, you can convert a namedtuple to a dictionary. Like this:

    from collections import namedtuple
    
    Animal = namedtuple('Animal', 'name age type')
    perry = Animal(name="perry", age=31, type="cat")
    perry._asdict()
    # Output: OrderedDict([('name', 'perry'), 
    # ('age', 31), ('type', 'cat')])
    
    

I am sure that you learned a thing or two in today's post! Let me remind you that I am writing a book on Python which would include things like this. If you want to be the first one to know when it comes out then signup to my [mailing list][1]. I also send out a weekly newsletter containing interesting and informative links related to Python which I come across every week. If you have any question then don't hesitate to ask! I love to answer 🙂 You can approach me through Email, Twitter or Facebook. Goodbye!

 [1]: http://github.us3.list-manage1.com/subscribe?u=20b1036063aec6dbf068cc8c0&id=4d261653c5