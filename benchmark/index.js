const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;
const lodash = require('lodash');
const lazy = require('lazy.js');
const sequenz = require('../sequenz');

const hugeList = Array.from({ length: 1e5 }).map((_, i) => i);

const mapF = x => x * (Math.pow(2, x % 7)) % 19;
const filterF = x => x % 5 < 3;
const takeNum = 100;
const skipNum = 50;

suite
.add('Lazy', () => {
  lazy(hugeList)
    .map(mapF)
    .drop(skipNum)
    .take(takeNum)
    .filter(filterF)
    .map(mapF)
    .drop(skipNum / 2)
    .take(takeNum / 2)
    .filter(filterF)
    .drop(skipNum / 10)
    .take(takeNum / 10)
    .value();
})
.add('Lodash', () => {
  lodash.chain(hugeList)
    .map(mapF)
    .drop(skipNum)
    .take(takeNum)
    .filter(filterF)
    .map(mapF)
    .drop(skipNum / 2)
    .take(takeNum / 2)
    .filter(filterF)
    .drop(skipNum / 10)
    .take(takeNum / 10)
    .value();
})
.add('Sequenz', () => {
  sequenz.list(
    sequenz.map(mapF),
    sequenz.skip(skipNum),
    sequenz.take(takeNum),
    sequenz.filter(filterF),
    sequenz.map(mapF),
    sequenz.skip(skipNum / 2),
    sequenz.take(takeNum / 2),
    sequenz.filter(filterF),
    sequenz.skip(skipNum / 10),
    sequenz.take(takeNum / 10)
  )(hugeList);
})
.on('cycle', (event) => {
  console.log(event.target.toString());
})
.on('complete', function () {
  console.log(`Fastest is ${this.filter('fastest').map('name')}`);
})
.run({ async: true });
