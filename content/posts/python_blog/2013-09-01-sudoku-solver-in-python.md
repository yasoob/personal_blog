---
title: Simple Sudoku solver in python
author: yasoob
type: post
date: 2013-08-31T20:43:16+00:00
url: /2013/09/01/sudoku-solver-in-python/
publicize_twitter_user:
  - yasoobkhalid
publicize_reach:
  - 'a:3:{s:7:"twitter";a:1:{i:4182103;i:50;}s:2:"fb";a:1:{i:4182098;i:19;}s:2:"wp";a:1:{i:0;i:41;}}'
categories:
  - python
tags:
  - online sudoku
  - sudoku
  - sudoku solver
  - tutorial

---
Hi there pythonistas! We all know that Sudoku is a great game. Some of us even bet on this game but did you know that you can use python to make a Sudoku solver? In this post I am going to share with you a Sudoku solver written in python. 

From now on you will win all Sudoku challenges. However let me tell you that I am not the original writer of this script. I stumbled over this script on stack-overflow. So without wasting any time let me share the script with you:

```
import sys

def same_row(i,j): return (i/9 == j/9)
def same_col(i,j): return (i-j) % 9 == 0
def same_block(i,j): return (i/27 == j/27 and i%9/3 == j%9/3)

def r(a):
  i = a.find('0')
  if i == -1:
    sys.exit(a)

  excluded_numbers = set()
  for j in range(81):
    if same_row(i,j) or same_col(i,j) or same_block(i,j):
      excluded_numbers.add(a[j])

  for m in '123456789':
    if m not in excluded_numbers:
      r(a[:i]+m+a[i+1:])

if __name__ == '__main__':
  if len(sys.argv) == 2 and len(sys.argv[1]) == 81:
    r(sys.argv[1])
  else:
    print 'Usage: python sudoku.py puzzle'
    print '  where puzzle is an 81 character string 
             representing the puzzle read left-to-right,
             top-to-bottom, and 0 is a blank'
```

Hey there wait! let me share with you a shorter obfuscated version of the same Sudoku solving script. However this short version of Sudoku solver is a lot slower but I think that I should share it with you just to show you that even in python obfuscated code can be written. So here is the shorter obfuscated version:

```
def r(a):i=a.find('0');~i or exit(a);[m
in[(i-j)%9*(i/9^j/9)*(i/27^j/27|i%9/3^j%9/3)or a[j]for
j in range(81)]or r(a[:i]+m+a[i+1:])for m in'%d'%5**18]
from sys import*;r(argv[1])
```

If you liked this post about Sudoku solver then don't forget to share this on twitter and facebook. If you want to get regular updates then don't forget to follow our blog.