---
title: 'Importing with ctypes in Python: fighting overflows'
author: yasoob
type: post
date: 2017-03-10T11:31:41+00:00
url: /2017/03/10/importing-with-ctypes-in-python-fighting-overflows/
publicize_twitter_user:
  - yasoobkhalid
categories:
  - python
tags:
  - ctypes
  - integer overflows
  - integers
  - overflows
  - python overflow

---
## Introduction

On some cold winter night, we've decided to refactor a few examples and tests for [Python][1] wrapper in [Themis][2], because things have to be not only efficient and useful, but elegant as well. One thing after another, and we ended up revamping Themis error codes a bit.

Internal error and status flags sometimes get less attention than crypto-related code: they are internals for internal use. Problem is, when they fail, they might break something more crucial in a completely invisible way.

Since best mistakes are mistakes which are not just fixed, but properly analyzed, reflected and recorded, we wrote this small report on a completely boring matter: every edge and connection is a challenge. This story is a reflection on a typical issue: different people working on different layers of one large product, and then look around to wipe out the technical debt.

## Strange tests behavior {#strange-tests-behavior}

Anytime we touch Themis wrapper code, we touch the tests because [pesticide paradox][3] in software development is no small problem.

It all started with [Secure Comparator][4] tests:

```
# test.py

from pythemis.scomparator import scomparator, SCOMPARATOR_CODES

secret = b'some secret'

alice = scomparator(secret)
bob = scomparator(secret)
data = alice.begin_compare()

while (alice.result() == SCOMPARATOR_CODES.NOT_READY and
               bob.result() == SCOMPARATOR_CODES.NOT_READY):
    data = alice.proceed_compare(bob.proceed_compare(data))

assert alice.result() != SCOMPARATOR_CODES.NOT_MATCH
assert bob.result() != SCOMPARATOR_CODES.NOT_MATCH
```

This test attempts to run Secure Comparator with a constant secret, this way making sure that comparison ends in a positive result (flag is called `SCOMPARATOR_CODES.MATCH`). If the secret is matched, tests should finish with success.

Secure Comparator can result in neither `SCOMPARATOR_CODES.NOT_MATCH` or `SCOMPARATOR_CODES.MATCH`.

But why the `assert` has to be just a negative comparison if we're testing a feature with boolean state? Checking against non-equality of NOT_MATCH does not automatically mean it matches.

The first reaction is obviously to see if it even works (via [example code][5]). It did.

Here, the verification code tests for equality, thankfully:

```
if comparator.is_equal():
    print("match")
else:
    print("not match")
```

Fine, so the problem touches only tests. Let's rewrite `assert` so that it compares `scomparator.result()` against `SCOMPARATOR_CODES.MATCH` correct expected state:

```
# test.py

...

assert alice.result() == SCOMPARATOR_CODES.MATCH
assert bob.result() == SCOMPARATOR_CODES.MATCH
```

&#8230; and bump into unexpected error:

```
# python test.py

Traceback (most recent call last):
  File "test.py", line 23, in 
    assert alice.result() == SCOMPARATOR_CODES.MATCH
AssertionError
```

A routine fix of testing of absolutely working feature quickly turns into an interesting riddle. We've added variable output for debugging to see what's really going on inside:

```
# test.py

...

print('alice.result(): {}\nNOT_MATCH: {}\nMATCH: {}'.format(
    alice.result(),
    SCOMPARATOR_CODES.NOT_MATCH,
    SCOMPARATOR_CODES.MATCH
))
assert alice.result() == SCOMPARATOR_CODES.MATCH
assert bob.result() == SCOMPARATOR_CODES.MATCH
```

&#8230; and get the completely unexpected:

```
# python test.py

alice.result(): -252645136
NOT_MATCH: -1
MATCH: 4042322160
Traceback (most recent call last):
  File "test.py", line 23, in 
    assert alice.result() == SCOMPARATOR_CODES.MATCH
AssertionError
```

## How come? {#how-come}

![Howcome?](/wp-content/uploads/2017/03/img1.jpg)

```
>>> import sys
>>> sys.int_info
sys.int_info(bits_per_digit=30, sizeof_digit=4)
...
>>> import ctypes
>>> print(ctypes.sizeof(ctypes.c_int))
4   
```

Even though OS, Python and Themis are 64bit, [PyThemis][6] wrapper is made using ctypes, which has 32-bit `int` type.

Accordingly, receiving `0xf0f0f0f0` from C Themis, ctypes expects a 32-bit number but `0xf0f0f0f0` is a negative number. Then Python attempts to convert it to an integer without any bit length limit, and literal `0xf0f0f0f0` (from `SCOMPARATOR_CODES`) turns into `4042322160`.

This is strange. Let's dive a bit into **Themis**:

`src/soter/error.h`:

```
// 

...
/** @brief return type */
typedef int soter_status_t;

/**
 * @addtogroup SOTER
 * @{
 * @defgroup SOTER_ERROR_CODES status codes
 * @{
 */

#define SOTER_SUCCESS 0
#define SOTER_FAIL   -1
#define SOTER_INVALID_PARAMETER -2
#define SOTER_NO_MEMORY -3
#define SOTER_BUFFER_TOO_SMALL -4
#define SOTER_DATA_CORRUPT -5
#define SOTER_INVALID_SIGNATURE -6
#define SOTER_NOT_SUPPORTED -7
#define SOTER_ENGINE_FAIL -8

...

typedef int themis_status_t;

/**
 * @addtogroup THEMIS
 * @{
 * @defgroup SOTER_ERROR_CODES status codes
 * @{
 */
#define THEMIS_SSESSION_SEND_OUTPUT_TO_PEER 1
#define THEMIS_SUCCESS SOTER_SUCCESS
#define THEMIS_FAIL   SOTER_FAIL
#define THEMIS_INVALID_PARAMETER SOTER_INVALID_PARAMETER
#define THEMIS_NO_MEMORY SOTER_NO_MEMORY
#define THEMIS_BUFFER_TOO_SMALL SOTER_BUFFER_TOO_SMALL
#define THEMIS_DATA_CORRUPT SOTER_DATA_CORRUPT
#define THEMIS_INVALID_SIGNATURE SOTER_INVALID_SIGNATURE
#define THEMIS_NOT_SUPPORTED SOTER_NOT_SUPPORTED
#define THEMIS_SSESSION_KA_NOT_FINISHED -8
#define THEMIS_SSESSION_TRANSPORT_ERROR -9
#define THEMIS_SSESSION_GET_PUB_FOR_ID_CALLBACK_ERROR -10
```

`src/themis/secure_comparator.h`:

```
...

#define THEMIS_SCOMPARE_MATCH 0xf0f0f0f0
#define THEMIS_SCOMPARE_NO_MATCH THEMIS_FAIL
#define THEMIS_SCOMPARE_NOT_READY 0

...

themis_status_t secure_comparator_destroy(secure_comparator_t *comp_ctx);

themis_status_t secure_comparator_append_secret(secure_comparator_t *comp_ctx, const void *secret_data, size_t secret_data_length);

themis_status_t secure_comparator_begin_compare(secure_comparator_t *comp_ctx, void *compare_data, size_t *compare_data_length);
themis_status_t secure_comparator_proceed_compare(secure_comparator_t *comp_ctx, const void *peer_compare_data, size_t peer_compare_data_length, void *compare_data, size_t *compare_data_length);

themis_status_t secure_comparator_get_result(const secure_comparator_t *comp_ctx);
```

Now let's see PyThemis side at `src/wrappers/themis/python/pythemis/exception.py`.

All values here correspond to C code, numbers are small and fit any bit length limits:

```
from enum import IntEnum

class THEMIS_CODES(IntEnum):
    NETWORK_ERROR = -2222
    BUFFER_TOO_SMALL = -4
    FAIL = -1
    SUCCESS = 0
    SEND_AS_IS = 1

...
```

What about **Secure Comparator** part? Looking at the `src/wrappers/themis/python/pythemis/scomparator.py`, we see that overall values are fine, but Comparator's value for `SCOMPARATOR_CODES.MATCH` is problematic and becomes negative in 32-bit `int`:

```
...

class SCOMPARATOR_CODES(IntEnum):
    MATCH = 0xf0f0f0f0
    NOT_MATCH = THEMIS_CODES.FAIL
    NOT_READY = 0

... 
```

If we cast it to signed 4 byte number, we receive -252645136 where we expect 4042322160.

![Img 2](/wp-content/uploads/2017/03/img2.jpg)

So the problem is on the seams between C and Python, where our code `0xf0f0f0f0` gets misinterpreted.

## Possible solutions {#possible-solutions}

The whole problem is a minor offense, easy to fix with a clutch, but the whole endeavor was to eliminate technical debt, not create more of it.

- Option 1. Add strong type casting when importing variables via ctypes

Extremely simple clutch. Since we know how `ctypes` acts in this case, we can explicitly make code perceive it as unsigned, then `0xf0f0f0f0` as `int64_t` will be equal to the interpretation of `uint32_t`. To do that, we would simply:

Add either

```
themis.secure_comparator_get_result.restype = ctypes.c_int64
```

or

```
themis.secure_comparator_get_result.restype = ctypes.c_uint
```

into `src/wrappers/themis/python/pythemis/scomparator.py`.

But that looks a bit like an ugly clutch, which additionally requires verifying the correctness of ctypes behavior on 32-bit machine with 32-bit Python.

- Option 2. Change from one byte representation to another

Hack number two. Remove implicit interpretation of hex literal `0xf0f0f0f0` and just give it the right value, in this context `-252645136`. This will fix the problem in Python wrapper, but we still will need additional verification on a 32bit system and keep an eye on it in future.

Not an option if you can avoid it.

- Option 3. Refactor all statuses in C library, never use negative numbers or values near type maximums to avoid overflows. 

The easiest would be the second option: since it's one such error in one wrapper, why even bother? Fix it right away and forget about it. But having problems even once is sometimes enough to see a need for certain standardisation.

We took the third path, and re-thought the principle behind status flags a bit:

  * Never use negative numbers, because -1 in 32bit is `0xffffffff`, in 64bit is `0xffffffffffffffff` and one can easily hit into overflow quite soon.
  * Use small positive numbers for error codes and statuses. Since Themis is supposed to work across many architectures and (theoretically), there might be a weird 9bit kitchen sink processor (they do need more robots to join DoS armies, so have our word, it will happen sooner or later), we decided to limit flag length with (0..127).
  * In Themis part, which is directly facing the wrappers, we've changed `int`s to explicit `int32_t`.

Since changing error code system in C library affects all wrappers, and their error codes should be adjusted accordingly, we've decided to get error codes from C code directly via variable export where possible ([Go][7], [NodeJS][8], [Java][9], [PHP][10]).

After refactoring, error codes in Themis started to look like:

`src/soter/error.h`:

```
...

/** @brief return type */
typedef int soter_status_t;

/**
 * @addtogroup SOTER
 * @{
 * @defgroup SOTER_ERROR_CODES status codes
 * @{
 */

#define SOTER_SUCCESS 0//success code

//error codes
#define SOTER_FAIL          11
#define SOTER_INVALID_PARAMETER     12
#define SOTER_NO_MEMORY         13
#define SOTER_BUFFER_TOO_SMALL      14
#define SOTER_DATA_CORRUPT      15
#define SOTER_INVALID_SIGNATURE     16
#define SOTER_NOT_SUPPORTED         17
#define SOTER_ENGINE_FAIL       18

...

/** @brief return type */
typedef int32_t themis_status_t;

/**
 * @addtogroup THEMIS
 * @{
 * @defgroup SOTER_ERROR_CODES status codes
 * @{
 */

//
#define THEMIS_SUCCESS              SOTER_SUCCESS
#define THEMIS_SSESSION_SEND_OUTPUT_TO_PEER     1

//errors
#define THEMIS_FAIL                     SOTER_FAIL
#define THEMIS_INVALID_PARAMETER            SOTER_INVALID_PARAMETER
#define THEMIS_NO_MEMORY                SOTER_NO_MEMORY
#define THEMIS_BUFFER_TOO_SMALL             SOTER_BUFFER_TOO_SMALL
#define THEMIS_DATA_CORRUPT                 SOTER_DATA_CORRUPT
#define THEMIS_INVALID_SIGNATURE            SOTER_INVALID_SIGNATURE
#define THEMIS_NOT_SUPPORTED                SOTER_NOT_SUPPORTED
#define THEMIS_SSESSION_KA_NOT_FINISHED         19
#define THEMIS_SSESSION_TRANSPORT_ERROR         20
#define THEMIS_SSESSION_GET_PUB_FOR_ID_CALLBACK_ERROR   21

#define THEMIS_SCOMPARE_SEND_OUTPUT_TO_PEER         THEMIS_SSESSION_SEND_OUTPUT_TO_PEER

...
```

`src/themis/secure_comparator.h`:

```
...

#define THEMIS_SCOMPARE_MATCH       21
#define THEMIS_SCOMPARE_NO_MATCH    22
#define THEMIS_SCOMPARE_NOT_READY   0

...
```

&#8230; and, accordingly, in PyThemis:

```
...

class THEMIS_CODES(IntEnum):
    NETWORK_ERROR = 2222
    BUFFER_TOO_SMALL = 14
    FAIL = 11
    SUCCESS = 0
    SEND_AS_IS = 1

...
```

> Note: `NETWORK_ERROR` is PyThemis specific and is not used in C part, so we kept it the way it was.

`src/wrappers/themis/python/pythemis/scomparator.py`:

```
...

class SCOMPARATOR_CODES(IntEnum):
    MATCH = 21
    NOT_MATCH = 22
    NOT_READY = 0

...
```

For example, this is how direct importing of these flags in Go works:

`gothemis/compare/compare.go`:

```
package compare

/*
#cgo LDFLAGS: -lthemis -lsoter

...

const int GOTHEMIS_SCOMPARE_MATCH = THEMIS_SCOMPARE_MATCH;
const int GOTHEMIS_SCOMPARE_NO_MATCH = THEMIS_SCOMPARE_NO_MATCH;
const int GOTHEMIS_SCOMPARE_NOT_READY = THEMIS_SCOMPARE_NOT_READY;
*/
import "C"
import (
    "github.com/cossacklabs/themis/gothemis/errors"
    "runtime"
    "unsafe"
)

var (
    COMPARE_MATCH = int(C.GOTHEMIS_SCOMPARE_MATCH)
    COMPARE_NO_MATCH = int(C.GOTHEMIS_SCOMPARE_NO_MATCH)
    COMPARE_NOT_READY = int(C.GOTHEMIS_SCOMPARE_NOT_READY)
)

...
```

## Results {#results}

After fixing and refactoring, the new `scomparator` class looks like:

```
class SComparator(object):
# the same
....

    def is_compared(self):
        return not (themis.secure_comparator_get_result(self.comparator_ctx) ==
                    SCOMPARATOR_CODES.NOT_READY)

    def is_equal(self):
        return (themis.secure_comparator_get_result(self.comparator_ctx) ==
                SCOMPARATOR_CODES.MATCH)
```

And the new test code, finally refactored to a decent look:

```
import unittest

from pythemis import scomparator

class SComparatorTest(unittest.TestCase):
    def setUp(self):
        self.message = b"This is test message"
        self.message1 = b"This is test message2"

    def testComparation(self):
        alice = scomparator.SComparator(self.message)
        bob = scomparator.SComparator(self.message)
        data = alice.begin_compare()
        while not (alice.is_compared() and bob.is_compared()):
            data = alice.proceed_compare(bob.proceed_compare(data))
        self.assertTrue(alice.is_equal())
        self.assertTrue(bob.is_equal())

    def testComparation2(self):
        alice = scomparator.SComparator(self.message)
        bob = scomparator.SComparator(self.message1)
        data = alice.begin_compare()
        while not (alice.is_compared() and bob.is_compared()):
            data = alice.proceed_compare(bob.proceed_compare(data))
        self.assertFalse(alice.is_equal())
        self.assertFalse(bob.is_equal())    

# python scomparator_test.py 
..
----------------------------------------------------------------------
Ran 2 tests in 0.064s

OK
```

![Test Run](/wp-content/uploads/2017/03/img3.jpg)

## Conclusions {#conclusions}

We love taking the time exploring minor, boring, trivial matters. Apart from willing to give everybody a better Themis experience, we use it every day to build [different][11] [tools][12] and would like to be extremely confident that behind a nice API, which isolates all implementation details we might accidently break, the implementations are correct.

As with any bug, most of the conclusions sound like coming from the [gods of copybook headings][13], once you know them:

  * Use types of explicit sizes (`int16_t`, `int32_t`, `int8_t`) to be less dependent of user architectures.
  * Watch for type overflows in signed types.
  * Try to explicitly test all possible return status flags in tests.
  * `!false` is `true` only in boolean representation. Once you encode it in numbers, don't rely on one-sided evaluation. If you're comparing ints, which represent the two states,- there can be a million reasons why `!false` is actually `kittens`, not `true`. Two mutually exclusive states do not mean your system will not generate N-2 more states because of some error.

**Note: This post was written by the people at Cossack Labs. The original post is <a href="https://www.cossacklabs.com/blog/fighting-ctypes-overflows.html" target="_blank" rel="noopener noreferrer">available here</a>.**

 [1]: https://github.com/cossacklabs/themis/wiki/Python-Howto
 [2]: https://github.com/cossacklabs/themis
 [3]: http://infiniteundo.com/post/87158389858/pesticide-paradox
 [4]: https://github.com/cossacklabs/themis/wiki/Secure-Comparator-cryptosystem
 [5]: https://github.com/cossacklabs/themis/tree/master/docs/examples/python
 [6]: https://pypi.org/project/pythemis/
 [7]: https://github.com/cossacklabs/themis/wiki/Go-HowTo
 [8]: https://github.com/cossacklabs/themis/wiki/NodeJS-Howto
 [9]: https://github.com/cossacklabs/themis/wiki/Java-and-Android-Howto
 [10]: https://github.com/cossacklabs/themis/wiki/PHP-Howto
 [11]: https://www.cossacklabs.com/toughbase/
 [12]: http://www.cossacklabs.com/acra/
 [13]: http://www.kiplingsociety.co.uk/poems_copybook.htm