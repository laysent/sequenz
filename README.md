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

Using npm:

```bash
npm install --save sequenz-js
```

In Node.js:

```JavaScript
// Load the full build.
// Bundler should be able to remove unused code later using tree-shaking feature.
const sequenz = require('sequenz-js');

// Manual pick used APIs, if bundler does not support tree-shaking
const map = require('sequenz-js/map');
const filter = require('sequenz-js/filter');

// Use API
const list = sequenz.list(
  sequenz.map(x => x + 1),
  sequenz.filter(x => x < 4),
  sequenz.take(2)
)([0, 1, 2, 3, 4]);
```

Benchmark
----------

Current benchmark shows the following result:

> Lazy x 38,431 ops/sec ±3.67% (62 runs sampled)
>
> Lodash x 22,486 ops/sec ±2.01% (72 runs sampled)
>
> Sequenz x 21,987 ops/sec ±2.70% (69 runs sampled)

Using Lodash@4.17.2 and Lazy.js@0.4.2.

Sequenz.js is not the fastest library, as not all optimization can be implemented using pure
functions for lazy evaluation, especially when code size is also put into consideration. Still,
the benchmark shows that the performance of Sequenz.js and Lodash.js are pretty much the same.
