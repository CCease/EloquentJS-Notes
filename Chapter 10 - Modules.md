# [Chapter 10 - Module](https://eloquentjavascript.net/10_modules.html)

## Modules
Module - A piece of program that specifies which other pieces it relies on and which functionality it provides for other modules to use(its interface).

>Just putting your JavaScript code into different files does not satisfy these requirements. The files still share the same global namespace. They can, intentionally or accidentally, interfere with each other’s bindings. And the dependency structure remains unclear.

## Packages
A package is a chunk of code that can be distributed (copied and installed). It may contain one or more modules and has information about which other packages it depends on. Also usually comes with documentation.

### NPM
NPM is:
1. An online service where one can download (and upload) packages 
2. A program (bundled with Node.js) that helps you install and manage them.

## Improvised Modules
No built-in module system in JS until 2015, so people design their own module system.


```JavaScript cmd="node"
const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]; },
    number(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday
```
Good : Isolation, to a certain degree
Drawback: Does not declare dependencies

## Evaluating Data As Code
There are several ways to take data (a string of code) and run it as part of the current program.

`eval` is a special operator that execute a string in the **current** scope. (Bad idea because it breaks some of the properties that scopes normally have, uch as it being easily predictable which binding a given name refers to.)

```JavaScript cmd="node"
const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
console.log(x);
// → 1
```

Another way, use function constructor. Take a string containing a comma-separated list of arguments and a string containing the function body. It wraps the code in a function value so that it gets its own scope and won’t do odd things with other scopes.

```JavaScript cmd="node"
let plusOne = Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

## CommonJS
The most widely used approach to bolted-on JavaScript modules is called CommonJS modules. Node.js uses it and is the system used by most packages on NPM.

CommonJS use the require function to load the module and returns its interface.

Below is example, it uses 2 packages from NPM, `ordinal` to convert numbers to strings like "1st" and "2nd". `date-names` to get English names for weekdays and months.

```javascript cmd="node"
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};
```
```javascript cmd="node"
const {formatDate} = require("./format-date");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th
```

A defination of require in most minimal form:


readFile is a made-up function that reads a file and returns its contents as a sring.

```javascript cmd="node" 
require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let module = {exports: {}};
    require.cache[name] = module;
    let wrapper = Function("require, exports, module", code);
    wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}
```

require.cache is the cache to keep the already loaded modules.

It first check if a module is loaded or not if not then load it.

Wrapper function use code as function body and use require, exports, and module as parameters. The result of function wrapper will change the value in require.cache[name].exports.

By defining require, exports, and module as parameters for the generated wrapper function (and passing the appropriate values when calling it), the loader makes sure that these bindings are available in the module’s scope.

```JavaScript cmd="node"
const {parse} = require("ini");

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

## ECMAScript Modules
JavaScript own different module system, ECMAScript.(From 2015)

Use import keyword instead of calling a function. Similarly, export is use to export things.
```JavaScript cmd="node"
const {parse} = require("ini");

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```
Import imports binding, not value.

## Building and Bundling
Many extensions are use to convert chosen JS to plain old JS or past version of JS to be able to run on old browsers.

**Bundlers** - A tool use to roll a programs into a single big file before they publish into the web to increase program efficient.

**Minifiers** - A tool that take a JS program and make it smaller by automatically removing comments and whitespace, renaming bindings, and replacing pieces of code with equivalent code that take up less space.

What discuss here is just to let reader aware the JavaScript code we run is often not the code as it was written.

## Modular Design
Aspect of Module design:
1. Ease to use.(After you forgor what you did you still can pick it up.) Just like JSON and INI, use once remember easily.

2. Ease which something can be composed with other code. (INI file reader that read file from disk cant use in a scenario where ini comes from other source.)

>Relatedly, stateful objects are sometimes useful or even necessary, but if something can be done with a function, use a function. Several of the INI file readers on NPM provide an interface style that requires you to first create an object, then load the file into your object, and finally use specialized methods to get at the results. This type of thing is common in the object-oriented tradition, and **it’s terrible.** Instead of making a single function call and moving on, you have to perform the ritual of moving your object through various states. And because the data is now wrapped in a specialized object type, all code that interacts with it has to know about that type, creating unnecessary interdependencies.

Points 
1. If something can be done with function, use function.

2. When an array suffices, use array, dont define new data structures. (eg graph in [chapter 7](https://eloquentjavascript.net/07_robot.html) no obvious way to represent, so use object which properties hold arrays of string.)

Some barrier to composition is various packeges are using different data structure to describe similar things, Therefore, if you want to design for composability, find out what data structures other people are using and, when possible, follow their example.

## Summary

Modules provide structure to bigger programs by separating the code into pieces with clear interfaces and dependencies. The interface is the part of the module that’s visible from other modules, and the dependencies are the other modules that it makes use of.

Because JavaScript historically did not provide a module system, the CommonJS system was built on top of it. Then at some point it did get a built-in system, which now coexists uneasily with the CommonJS system.

A package is a chunk of code that can be distributed on its own. NPM is a repository of JavaScript packages. You can download all kinds of useful (and useless) packages from it.


## Exercise
Skipped, [this part](https://eloquentjavascript.net/10_modules.html#h_TcUD2vzyMe) on the book.

Exercise about

thinking If you were to write that project as a modular program, what modules would you create? Which module would depend on which other module, and what would their interfaces look like?

Which pieces are likely to be available prewritten on NPM? Would you prefer to use an NPM package or write them yourself?

and

Write a CommonJS module, based on the example from Chapter 7, that contains the array of roads and exports the graph data structure representing them as roadGraph.

and

Can you see how it handles cycles? What would go wrong when a module in a cycle does replace its default exports object?