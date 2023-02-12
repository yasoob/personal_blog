---
title: "How to Efficiently Reorder or Rerank Items in Database"
date: 2023-02-12T23:32:12+05:00
draft: false
categories: ['programming', 'database']
featured_image: "/images/reorder-items/header.png"
teaser: "Ever wondered how Jira and Trello store the order of tasks or issues? How they can efficiently reorder items in the database even when there are a million items? In this article, you will learn all about reordering and/or reranking and how to store the order information in the database to facilitate efficient reordering."
---


I was once thinking about Trello and Jira and wondered how they implemented the sorting functionality in their drag & drop interface. You can have a million items/cards and both of these platforms will allow you to change the order in a simple drag and drop manner and efficiently update their position in the database. 

How could I implement such a system? It was hard to do research on this topic because most queries returned results from blogs that showed how to implement a drag and drop component using [React DnD](https://react-dnd.github.io/react-dnd/) and similar libraries but did not show how to persist the new order in a database. Nevertheless, I kept on searching and was able to read up on 3 different methods and want to share them with you.

## Problem

Let's set up the problem that motivated this research. Imagine you have a list that has associated items. The db models might look something like this:

```python
class List(models.Model):
    name = models.CharField(max_length=100)

class Item(models.Model):
    list = models.ForeignKey(List, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=1)
```

Now imagine you have 10 items and the order goes from 1-10 for these 10 items. For simplicity's sake, this is how they might look like:

```
|order |  name       |
|------|-------------|
| 1    | Item No: 1  |
| 2    | Item No: 2  |
| 3    | Item No: 3  |
| 4    | Item No: 4  |
| 5    | Item No: 5  |
| 6    | Item No: 6  |
| 7    | Item No: 7  |
| 8    | Item No: 8  |
| 9    | Item No: 9  |
| 10   | Item No: 10 |
```

Now, you are are being asked to update the order of the 10th item to 2. The resulting list will look something like this:

```
|order |  name       |
|------|-------------|
| 1    | Item No: 1  |
| 2    | Item No: 10 |
| 3    | Item No: 2  |
| 4    | Item No: 3  |
| 5    | Item No: 4  |
| 6    | Item No: 5  |
| 7    | Item No: 6  |
| 8    | Item No: 7  |
| 9    | Item No: 8  |
| 10   | Item No: 9  |
```

Now the problem is, how can you make this reordering operating efficient? In this nieve example, you will have to re-order each successive item in the database and modify its order. This will lead to 9 total database calls for modifying the order of item 10 from 10 to 2.

For a small list, this brute-force approach might work. At most you will have to update the ordering of all the items between the current order position and the new order position. If this is the solution you want to go ahead with, you can read [this post on the Revsys blog](https://www.revsys.com/tidbits/keeping-django-model-objects-ordered/) on how to implement something like this in Django. However, this solution will not scale so lets look at a few diffrent approaches to fixing this problem.

## Approach 1: Order items in increments of 100

The first approach is to set the initial order value in multiples of 100 (or any other large number). This is how the default ordering will look like:

```
|order |  name       |
|------|-------------|
| 100  | Item No: 1  |
| 200  | Item No: 2  |
| 300  | Item No: 3  |
| 400  | Item No: 4  |
| 500  | Item No: 5  |
| 600  | Item No: 6  |
| 700  | Item No: 7  |
| 800  | Item No: 8  |
| 900  | Item No: 9  |
| 1000 | Item No: 10 |
```

When you have to modify the order of item 10 and move it to position 2, you can simply update the order value to be between 100 and 200. This will result in an order value of 150 for item 10. This will not require any changes to the ordering of the rest of the items as long as the difference between the order value of adjacent items is more than 1.

This is what the newly ordered table will look like:

```
|order |  name       |
|------|-------------|
| 100  | Item No: 1  |
| 150  | Item No: 10 |
| 200  | Item No: 2  |
| 300  | Item No: 3  |
| 400  | Item No: 4  |
| 500  | Item No: 5  |
| 600  | Item No: 6  |
| 700  | Item No: 7  |
| 800  | Item No: 8  |
| 900  | Item No: 9  |
```

This approach allows us to reorder and place 100 items between any 2 items with default ordering before it runs into problems. What would you do when two adjacent items have an order difference of only 1? Let's take a look at the next approach and see how to get around this.

## Approach 2: Order items using a floating number

This approach suggests to ditch integers and start using floating point numbers to keep the order. This will result in such a table structure:

```
|order |  name       |
|------|-------------|
| 1.0  | Item No: 1  |
| 2.0  | Item No: 2  |
| 3.0  | Item No: 3  |
| 4.0  | Item No: 4  |
| 5.0  | Item No: 5  |
| 6.0  | Item No: 6  |
| 7.0  | Item No: 7  |
| 8.0  | Item No: 8  |
| 9.0  | Item No: 9  |
| 10.0 | Item No: 10 |
```

Now when you reorder and move Item no 10 to position 2, it will get an order value of 1.5. You can keep on moving items around and there will always be room to add more items as the order is now a floating point number.

Pretty good approach! This solves the previous issue where we ran out of values to assign to the order key when adjacent values had an order difference of only 1. However, the floats also have a limit. I doubt you will encounter that limit in most typical cases but it is there and it is good to be aware of it. Most databases have their own limit for how big a float can be so I will not go into too much detail. 

There is one more approach that overcomes these limitations.

## Approach 3: Order items using LexoRank

LexoRank is currently used by Jira for ordering and ranking issues. You can read [this article](https://tmcalm.nl/blog/lexorank-jira-ranking-system-explained/) to get some idea of how it works inside Jira from an admin standpoint. 

The word LexoRank can be divided into two parts:

- Lexo: refers to the word lexicographical which basically means alphabetical ordering.
- Rank: refers to the position of Jira issues on a board’s backlog, on a kanban board itself or in the active sprint on a scrum board.

It basically makes use of alphanumeric strings to keep the order. By default, the items might be ordered like this:

```
|order |  name       |
|------|-------------|
| a    | Item No: 1  |
| b    | Item No: 2  |
| c    | Item No: 3  |
| d    | Item No: 4  |
| e    | Item No: 5  |
| f    | Item No: 6  |
| g    | Item No: 7  |
| h    | Item No: 8  |
| i    | Item No: 9  |
| j    | Item No: 10 |
```

If you want to move item 10 to position 2, you can simply append "a" at the end. The updated order will look like this:

```
|order |  name       |
|------|-------------|
| a    | Item No: 1  |
| aa   | Item No: 10 |
| b    | Item No: 2  |
| c    | Item No: 3  |
| d    | Item No: 4  |
| e    | Item No: 5  |
| f    | Item No: 6  |
| g    | Item No: 7  |
| h    | Item No: 8  |
| i    | Item No: 9  |
```

Now if you want to move item 9 to position 3, the updated order might resemble this:

```
|order |  name       |
|------|-------------|
| a    | Item No: 1  |
| aa   | Item No: 10 |
| ab   | Item No: 9  |
| b    | Item No: 2  |
| c    | Item No: 3  |
| d    | Item No: 4  |
| e    | Item No: 5  |
| f    | Item No: 6  |
| g    | Item No: 7  |
| h    | Item No: 8  |
```

This way you can either keep on appending characters at the end of the order value or update one of the characters whenever you want to modify the order. The actual LexoRank implementation is not this simple but uses the same concept. It offsets each new order value and also makes use of buckets. These buckets come into play when individual order values become too long and need to be normalized. You can read [this StackOverflow answer](https://stackoverflow.com/questions/40718900/jiras-lexorank-algorithm-for-new-stories) to get a better sense of how it works.

And that's it! One thing I could have done better while doing this research is to search for "ranking" algorithms on top of "ordering" algorithms. That might have yielded better results much quicker. If this post helps you in any way, please do let me know.

I plan on keeping future articles short and to-the-point so that I can keep writing more often. A long post takes too much time and requires a ton of editing. I will keep writing those as well but I don't want most new ideas to end up on my drafts folder and never see the light of day. One such draft has been open in a separate tab on my laptop for more than 2 months now 🙃 Wish me luck and pray that I stick to this new plan of publishing more frequently.

## Further reading

Here is a list of articles that might help if you want to read more on this topic:

- [Jira's Lexorank algorithm for new stories](https://stackoverflow.com/questions/40718900/jiras-lexorank-algorithm-for-new-stories)
- [Terminology - What does alphanumeric order mean in relation to decimals?](https://cs.stackexchange.com/questions/60530/terminology-what-does-alphanumeric-order-mean-in-relation-to-decimals)
- [LexoRanks — what are they and how to use them for efficient list sorting](https://medium.com/whisperarts/lexorank-what-are-they-and-how-to-use-them-for-efficient-list-sorting-a48fc4e7849f)
- [Keeping Django Models Ordered](https://www.revsys.com/tidbits/keeping-django-model-objects-ordered/)