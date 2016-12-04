Sequenz
=======

Sequenz.js is a super tiny library that will help you handle arrays, objects, numbers, etc., with
**lazy engine** and **cherry-picking**!

Motivation
----------

Nowadays, most popular JavaScript utility libraries uses **chaining** to bundle a group of data
transformations. However, as Izaak Schroeder once mentioned ([here](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba#.69nr9odxl)),
it might not be a good design though.

It's true that chaining style makes lazy evaluation easy to implement, but it also causing the size
of JavaScript bundle file to be large, as unused APIs are also included. Although Lodash did
provide fp package for cherry-picking, lazy evaluation cannot be provided at the same time.

Sequenz.js is designed to have both:

+ A built in **lazy engine**.

  Transformation of data only requires minimum cost with lightning speed.

+ Designed for **cherry-picking**

  ES6 module, zero dependencies and no API on prototype.

  Using module bundler with tree-shaking feature (such as [Rollup](http://rollupjs.org/)), only
  required APIs will be imported to your project, making the size of library neglectable.

+ Similar API as those popular libraries, but **FP** style

  The API provided here is designed to be similar to [Lodash](https://lodash.com/),
  [Underscore](http://underscorejs.org/) and [Lazy.js](http://danieltao.com/lazy.js/), making
  learning as easy as possible.

Installation
------------

Examples
--------

Benchmark
----------
