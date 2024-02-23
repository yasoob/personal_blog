---
title: "Running Go code from Elixir Using Web Assembly"
date: 2024-02-23T00:39:55-08:00
draft: false
categories: [elixir, programming]
teaser: "In this article, I will show you how to compile Go code to target WASI and run it from an Elixir host. You will also learn how to pass data to Go and get a response back using pipes."
---

I was working on an Elixir project recently and one particular open source package that I wanted to make use of was written in Go. I searched for different ways to interface with Go code from Elixir. I know that it is fairly trivial to interface Rust code from Elixir using a NIF but there isn't anything similar for Go that I came across. Most of my research led me towards using Ports and I was about to give in before realizing that WASI (WebAssembly System Interface) is also an option. I had been hearing about Web Assembly for a while now and this was as good of a moment as any to give it a try. I also came across [Wasmex](https://github.com/tessi/wasmex) which seemed like a good option to run WASI binaries in Elixir. [Philipp Tessenow](https://github.com/tessi) (creator of wasmex) was instrumental in getting this whole thing to work and guiding me to the final working solution so thanks tessi!

There were a few things I needed to figure out:

1. How to compile Go code to WASI
2. How to run a WASI binary in an Elixir host
3. How to pass data into the WASI binary
4. How to get data out of the WASI binary

Let's go through them one by one.

## 1. How to compile Go code to WASI

This one was easy. Some quick Google-fu informed me that I need to use `tinygo` as it supports WASI as an output target. The main Go compiler also added WASM support but as far as I know, it doesn't currently compile to the WASI target. 

This is the sample Go code that I used for testing this whole setup:

```text
package main

import "fmt"

func main() {}

//export greet
func greet() {
  fmt.Println("Hello world")
}
```

And I used the following command to compile the code to WASI:

```bash
$ tinygo build -o main.wasm -scheduler=none --no-debug -target wasi main.go
```

Tinygo uses comments to guide the compiler regarding which functions need to be exported to a WASI host. One such comment is `// export greet` in the code above. This will export the `greet` function and we can call it from the WASI host (Elixir/Wasmex). There are also some annotations you can add to tell tinygo to import a function from the WASI host but I am not going to be using that here. We also need to add an empty `main` function for the code to work.

You can play around with the `tinygo` flags in the `build` command I shared above. I found this combination of flags to generate the smallest WASI/WASM binary.

## 2. How to run a WASI binary in an Elixir host

This one was also fairly easy to figure out. Once you have `wasmex` installed as a mix dependency, you can run a WASI binary like this:

```
binary = File.read!("./native/main.wasm")
{:ok, pid} = Wasmex.start_link(%{bytes: binary, wasi: true}) 
Wasmex.call_function(pid, "greet", [])
```

## 3. How to pass data into the WASI binary

Now I had to figure out how to pass data into the WASI binary. This one was a bit tricky as there are a couple of ways to go about this. The two most famous ones are passing data in via `stdin` or copying data to some shared WASI memory. You can also parametrize your functions and take direct arguments like this:

```
func add(a, b int32) int32 {
	return a + b
}
```

However, this doesn't work with strings. WASI specification currently does not support string inputs. Because I wanted to pass some strings as input, I couldn't simply parametrize my function like this. 

I tried to make use of WASI memory and pass input through that method using a bunch of [different tutorials](https://k33g.hashnode.dev/wasi-communication-between-nodejs-and-wasm-modules-with-the-wasm-buffer-memory) but wasn't able to get anywhere. I was getting [all sorts of errors](https://github.com/tessi/wasmex/issues/521) and because I was new to the world of Web Assembly I decided to opt for the path of least resistance and ended up using pipes.

Here is how you can pass binary input to Go using pipes:

```
binary = File.read!("./native/main.wasm")
{:ok, stdin_pipe} = Wasmex.Pipe.new()
wasi = %Wasmex.Wasi.WasiOptions{args: [], stdin: stdin_pipe}
{:ok, pid} = Wasmex.start_link(%{bytes: binary, wasi: wasi})

Wasmex.Pipe.write(stdin_pipe, "Hello world!")
Wasmex.Pipe.seek(stdin_pipe, 0)
{:ok, []} = Wasmex.call_function(pid, :greet, [])
```

This code will put `"Hello world"` in the `stdin` pipe that you can read from the Go side in your `greet` function like this:

```
func greet() {
    // Here data will contain "Hello world"
    data, _ := io.ReadAll(os.Stdin)
}
```

## 4. How to get data out of the WASI binary

Similar to how you use a `stdin` pipe, you can make use of a `stdout` pipe. Let's first modify the Go code to output the greeting to `stdout`:

```
import "fmt"

func greet() {
    data, _ := io.ReadAll(os.Stdin)
    fmt.Println("👋 Data from Elixir:", string(data))
}
```

Now, let's make use of the `stdout` pipe:

```
binary = File.read!("./native/main.wasm")
{:ok, stdout_pipe} = Wasmex.Pipe.new()
{:ok, stdin_pipe} = Wasmex.Pipe.new()
wasi = %Wasmex.Wasi.WasiOptions{args: [], stdout: stdout_pipe, stdin: stdin_pipe}
{:ok, pid} = Wasmex.start_link(%{bytes: binary, wasi: wasi})

# Put data in stdin pipe
Wasmex.Pipe.write(stdin_pipe, "Yasoob here!")
Wasmex.Pipe.seek(stdin_pipe, 0)

# Call the greet function
{:ok, []} = Wasmex.call_function(pid, :greet, [])

# Read data from stdout
Wasmex.Pipe.seek(stdout_pipe, 0)
IO.puts(Wasmex.Pipe.read(stdout_pipe))
```

This should print `👋 Data from Elixir: Yasoob here!` on the screen.

## Conclusion

I had fun learning about Web Assembly and figuring out that it is not too hard to call Go code from Elixir using WASI. I am pretty sure there must be some caveats to this approach as the complexity of the Go code increases but for most basic use cases this is a perfect solution. I haven't benchmarked the memory usage of this solution but that is not a concern for my project at this stage. If push comes to shove, I can always go forward with a Ports-based solution.

This small endeavor made me realize that even if Elixir doesn't have a relevant library or package, I can look towards Go as well and interface Go from Elixir. Rust was always an option via Rustler but now Go is also a viable option if something doesn't exist in Rust either (as was the case in my project).

I hope this article helps those who are trying to do something similar :smile: