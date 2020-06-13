---
title: "Golang: Check if a key exists in map"
date: 2019-06-18T18:55:05-04:00
draft: false
categories: ["programming", "golang"]
teaser: 'I have been working with Golang quite a lot. This is my first time working with it professionally. I share some methods for checking key existance in maps in Golang.'
---

Hi people! I am working at [ASAPP](https://www.asapp.com/) and a lot of my work involves writing Golang code. This is the first time I am working with Golang full-time. I picked up a couple of tricks from my colleagues and mentors here and would like to share them with you. 

In this particular post, I will talk about the empty struct. There was a scenario where I wanted to check if two slices contained the same elements or not. Go doesn't provide an easy way to do this. As far as I know, there is no API for slices which provide us a way to do something like this:

```golang
mySlice := []string{"Yasoob", "Ali", "Ahmed"}
mySlice.contains("Yasoob")
```

This is a gross simplification of the actual problem I had to address but the basic idea is the same. Now we can loop over the whole slice and check if a value exists by doing something like this:

```golang
var flag bool
for _, val := range mySlice{
    if val == "Yasoob"{
        flag = true
    }
}
```

But this doesn't scale really well. What if we have thousands of entries in the slice and we have to check for existence every second? In the worst case scenario, we will have to loop over the whole slice each time.

In such a scenario we can use a map instead of a slice. The sole reason for using them is that the [lookup is a lot faster](https://stackoverflow.com/questions/29677670/what-is-the-big-o-performance-of-maps-in-golang). Now you might be asking that what should we map these strings to? And the answer is an empty struct! The reason being that an [empty struct doesn't take up any space!](https://dave.cheney.net/2014/03/25/the-empty-struct) This way we will not get a lot of extra space consumption overhead. 

So now we can rewrite the code like this:

```golang
myMap := map[string]struct{}{
    "Yasoob": struct{}{},
    "Ali":    struct{}{},
}
_, ok := myMap["Yasoob"]
if ok{
    fmt.Println("exists!")
}
```

The way it works is that a map provides a very good API for checking if a key exists or not. It gives two return values. The first is the value mapped to the key and the second is a boolean which tells us whether the key exists in the map or not. 

The `_` in the code above gets assigned the value mapped with the key "Yasoob". We don't care about the value as it is just an empty struct so we just discard it by assigning it to `_`. We do, however, care about whether the key was found or not. That is why we have a variable called "ok". If the key was found then ok will get a bool value of `true` and if the key wasn't found then it will get a value of `false`. Simple eh? 

Now you have a nice way to check if something exists or not in a lot less time!