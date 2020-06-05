---
title: Python Sorted Collections
author: yasoob
type: post
date: 2016-04-24T05:57:47+00:00
url: /2016/04/24/python-sorted-collections/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - dicts
  - list
  - preserve order in python
  - python order
  - sorted collection
  - sortedcollections

---
Hey folks! This is a guest post by Grant Jenks. Let's give him a warm welcome and get right on into what he has to say. 🙂

Hello all! I'm [Grant Jenks][1] and I'm guest-posting about one of my favorite topics: Python Sorted Collections.

Python is a little unusual regarding sorted collection types as compared with other programming languages. Three of the top five programming languages in the [TIOBE Index][2] include sorted list, sorted dict or sorted set data types. But neither Python nor C include these. For a language heralded as "batteries included" that's a little strange.

The reasoning is a bit [circular][3] but boils down to: the standard library covers most use cases, for everything else there's PyPI, the Python Package Index. But PyPI works only so well. In fact, some peculiarities of the Python community make PyPI's job quite difficult. For example, Python likes Monty Python references which many find unusual or obscure. And as Phil Karlton would point out, naming things is hard.

## collections.OrderedDict

As an aside, it's worth noting [`collections.OrderedDict`][4] in the Python standard library. OrderedDict maintains the order that items were added to the dictionary. Sometimes that order is sorted:

```
>>> from collections import OrderedDict
>>> letters = [('a', 0), ('b', 1), ('c', 2), ('d', 3)]
>>> values = OrderedDict(letters)
>>> print(values)
OrderedDict([('a', 0), ('b', 1), ('c', 2), ('d', 3)])
>>> print(list(values.keys()))
['a', 'b', 'c', 'd']
```

We can continue editing this OrderedDict. Depending on the key we add, the order may remain sorted.

```
>>> values['e'] = 4
>>> print(list(values.keys()))
['a', 'b', 'c', 'd', 'e']
```

But sort order won't always be maintained. If we remove an existing key and add it back, then we'll see it appended to the end of the keys.

```
>>> del values['a']
>>> values['a'] = 0
>>> print(list(values.keys()))
['b', 'c', 'd', 'e', 'a']
```

Ooops! Notice now that 'a' is at the end of the list of keys. That's the difference between ordered and sorted. While OrderedDict maintains order based on insertion order, a SortedDict would maintain order based on the sorted order of the keys.

## SortedContainers

A few years ago I set out to select a sorted collections library from PyPI. I was initially overwhelmed by the options. There are many data types in computer science theory that can be used and each has various tradeoffs. For example, Red-Black Trees are used in the Linux Kernel but Tries are often more space efficient and used in embedded systems. Also B-Trees work very well with a huge number of items and are commonly used in databases.

What I really wanted was a pure-Python solution that was fast-enough. Finding a solution at the intersection of those requirements was really tough. Most fast implementations were written in C and many lacked benchmarks or documentation.

I couldn’t find the right answer so I built it: [Sorted Containers][5]. The right answer is pure-Python. It’s Python 2 and Python 3 compatible. It’s fast. It’s fully-featured. And it’s extensively tested with 100% coverage and hours of stress. SortedContainers includes [SortedList][6], [SortedDict][7], and [SortedSet][8] implementations with a familiar API.

```
>>> from sortedcontainers import SortedList, SortedDict, SortedSet
>>> values = SortedList('zaxycb')
>>> values[0]
'a'
>>> values[-1]
'z'
>>> list(values)  # Sorted order is automatic.
['a', 'b', 'c', 'x', 'y', 'z']
>>> values.add('d')
>>> values[3]
'd'
>>> del values[0]
>>> list(values)  # Sorted order is maintained.
['b', 'c', 'd', 'x', 'y', 'z']
```

Each of the `SortedList`, `SortedDict`, and `SortedSet` data types looks, swims, and quacks like its built-in counterpart.

```
>>> items = SortedDict(zip('dabce', range(5)))
>>> list(items.keys())  # Keys iterated in sorted order.
['a', 'b', 'c', 'd', 'e']
>>> items['b']
2
>>> del items['c']
>>> list(items.keys())  # Sorted order is automatic.
['a', 'b', 'd', 'e']
>>> items['c'] = 10
>>> list(items.keys())  # Sorted order is maintained.
['a', 'b', 'c', 'd', 'e']
```

Each sorted data type also plays nicely with other data types.

```
>>> keys = SortedSet('dcabef')
>>> list(keys)
['a', 'b', 'c', 'd', 'e', 'f']
>>> 'c' in keys
True
>>> list(keys | 'efgh')
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
>>> list(keys & 'cde')
['c', 'd', 'e']
>>> list(keys & 'yzab')
['a', 'b']
```

## Bonus Features

In addition to the familiar API of the built-ins, maintaining sorted order affords efficient opportunities for searching and indexing.

  * You can very quickly and efficiently lookup the presence or index of a value. What would previously require a linear scan is now done in logarithmic time.

```
>>> import string
>>> values = SortedList(string.lowercase)
>>> 'q' in values
True
>>> values.index('r')
17
```

  * You can slice containers by index or by value. Even mappings and sets support numeric indexing and iteration.

```
>>> items = SortedDict(zip(string.lowercase, range(26)))
>>> list(items.irange('g', 'j'))
['g', 'h', 'i', 'j']
>>> items.index('g')
6
>>> items.index('j')
9
>>> list(items.islice(6, 10))
['g', 'h', 'i', 'j']
```

  * Mappings also support numeric indexing using a [Pandas-like iloc](http://pandas.pydata.org/pandas-docs/version/0.17.0/generated/pandas.DataFrame.iloc.html) interface.

```
>>> items.iloc[0]
'a'
>>> items.iloc[5]
'f'
>>> items.iloc[:5]
['a', 'b', 'c', 'd', 'e']
>>> items.iloc[-3:]
['x', 'y', 'z']
```

Using these features, you can easily duplicate the advanced features found in Pandas DataFrame indexes, SQLite column indexes, and Redis sorted sets.

## Performance

On top of it all, performance is very good across the API and faster-than-C implementations for many methods. There are extensive benchmarks comparing [alternative implementations][9], [load-factors][10], [runtimes][11], and [simulated workloads][12]. SortedContainers has managed to unseat the decade-old incumbent "blist" module and convinced authors of alternatives to [recommend][13] SortedContainers over their own package.

## Implementation

How does it work? I'm glad you asked! In addition to the [implementation details][14], I'll be giving a talk at PyCon 2016 in Portland, Oregon on [Python Sorted Collections][15] that will get into the gory details. We'll see why benchmarks matter most in claims about performance and why the strengths and weakness of modern processors affect how you choose your data structures. It's possible to write fast code in pure-Python!

Your feedback on the project is welcome!

 [1]: http://www.grantjenks.com/
 [2]: http://www.tiobe.com/tiobe_index
 [3]: http://stackoverflow.com/a/5958960/232571
 [4]: https://docs.python.org/2/library/collections.html#collections.OrderedDict
 [5]: http://www.grantjenks.com/docs/sortedcontainers/
 [6]: http://www.grantjenks.com/docs/sortedcontainers/sortedlist.html
 [7]: http://www.grantjenks.com/docs/sortedcontainers/sorteddict.html
 [8]: http://www.grantjenks.com/docs/sortedcontainers/sortedset.html
 [9]: http://www.grantjenks.com/docs/sortedcontainers/performance.html
 [10]: http://www.grantjenks.com/docs/sortedcontainers/performance-load.html
 [11]: http://www.grantjenks.com/docs/sortedcontainers/performance-runtime.html
 [12]: http://www.grantjenks.com/docs/sortedcontainers/performance-workload.html
 [13]: http://www.grantjenks.com/docs/sortedcontainers/index.html#testimonials
 [14]: http://www.grantjenks.com/docs/sortedcontainers/implementation.html
 [15]: https://us.pycon.org/2016/schedule/presentation/1885/