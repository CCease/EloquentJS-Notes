[Chapter 11 - Asynchronous Programming](https://eloquentjavascript.net/11_async.html)

Comparision of synchronous and asynchronous

![Comparision of synchronous and asynchronous](https://eloquentjavascript.net/img/control-io.svg)

In a synchronous programming model, things happen one at a time. When you call a function that performs a long-running action, it returns only when the action has finished and it can return the result. This stops your program for the time the action takes.

An asynchronous model allows multiple things to happen at the same time. When you start an action, your program continues to run. When the action finishes, the program is informed and gets access to the result (for example, the data read from disk).

## Crow Tech

**The author describe a concept of crow tech ? Not really sure what is it refering to ... directly quote this section from book.**

>Most people are aware of the fact that crows are very smart birds. They can use tools, plan ahead, remember things, and even communicate these things among themselves.

>What most people don’t know is that they are capable of many things that they keep well hidden from us. I’ve been told by a reputable (if somewhat eccentric) expert on corvids that crow technology is not far behind human technology, and they are catching up.

>For example, many crow cultures have the ability to construct computing devices. These are not electronic, as human computing devices are, but operate through the actions of tiny insects, a species closely related to the termite, which has developed a symbiotic relationship with the crows. The birds provide them with food, and in return the insects build and operate their complex colonies that, with the help of the living creatures inside them, perform computations.

>Such colonies are usually located in big, long-lived nests. The birds and insects work together to build a network of bulbous clay structures, hidden between the twigs of the nest, in which the insects live and work.

>To communicate with other devices, these machines use light signals. The crows embed pieces of reflective material in special communication stalks, and the insects aim these to reflect light at another nest, encoding data as a sequence of quick flashes. This means that only nests that have an unbroken visual connection can communicate.

>Our friend the corvid expert has mapped the network of crow nests in the village of Hières-sur-Amby, on the banks of the river Rhône. This map shows the nests and their connections:

>![A network of crow nests in a small village](https://eloquentjavascript.net/img/Hieres-sur-Amby.png)

>In an astounding example of convergent evolution, crow computers run JavaScript. In this chapter we’ll write some basic networking functions for them.

## Callbacks

One way to achieve asynchrroonous programming is to let function accept a callback function as second argument. The acion is started and when it finishes, the call back function is called with the result.

For example this setTimeout function will wait a given number of milliseconds and calls a function.


```JavaScript 
setTimeout(() => console.log("Tick"), 500);
```

[Syntax](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout): (3rd is used in above example.)
```JavaScript
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);
var timeoutID = scope.setTimeout(function[, delay]);
var timeoutID = scope.setTimeout(code[, delay]);
```
Other part read [here](https://eloquentjavascript.net/11_async.html#p_qrVbRBjxbB), not really understand. @.@ 

## Promises
Promise - A class provided by JavaScript. A promise is an asynchronous action that may complete at some point and produce a value. It can notify anyone wo is interested when its value is available. 

### [Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
Return a ```promise``` object that is resolve(determine, solve) with a given value. (Wrap the value in a promise.)
```JavaScript cmd="node"
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

### [Promise.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
then() returns a ```promise```. It takes up to 2 arguments: callback functions for the success and failure cases of the ```promise```.

Syntax : ```p.then(onFulfilled[, onRejected]);```

#### Return Value

>Once a ```Promise``` is fulfilled or rejected, the respective handler function (```onFulfilled``` or ```onRejected```) will be called asynchronously (scheduled in the current thread loop). The behaviour of the handler function follows a specific set of rules. If a handler function:

> - returns a value, the promise returned by ```then``` gets resolved with the returned value as its value.
doesn't return anything, the promise 
> - returned by ````then```` gets resolved with an undefined value.
> - throws an error, the promise returned by ```then``` gets rejected with the thrown error as its value.
> - returns an already fulfilled promise, the promise returned by ```then``` gets fulfilled with that promise's value as its value.
> - returns an already rejected promise, the promise returned by ```then``` gets rejected with that promise's value as its value.
> - returns another pending promise object, the resolution/rejection of the promise returned by ```then``` will be subsequent to the resolution/rejection of the promise returned by the handler. Also, the resolved value of the promise returned by ```then``` will be the same as the resolved value of the promise returned by the handler.

### Promises Constructor

Syntax: ```new Promise((resolve, reject) => {})```
```JavaScript cmd="node"
function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, "enemies")
  .then(value => console.log("Got", value));
```
Both parameter is optional.

The ```Promise()``` take a function as argument and immediately call it.

It is same as regular functions, they both take input as arguments and return their output. The only difference is that the output may not be available yet.
>The Promise constructor is primarily used to wrap functions that do not already support promises.


## Failure
Regular JS code will fail, so do asynchronous conptations.

>Promises make this easier. They can be either resolved (the action finished successfully) or rejected (it failed). Resolve handlers (as registered with then) are called only when the action is successful, and rejections are automatically propagated to the new promise that is returned by then. And when a handler throws an exception, this automatically causes the promise produced by its then call to be rejected. So if any element in a chain of asynchronous actions fails, the outcome of the whole chain is marked as rejected, and no success handlers are called beyond the point where it failed.

Resolving a promise provides value, rejecting one provides reason. When an exception in a handler function causes the rejection, the exception value is the reason. When the handler returns a promise that is rejected, that rejection flows into the next promise.

There is a ```Promise.reject``` function that creates a new, immediately rejected promise.

###[Promise.catch()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
>The catch() method returns a Promise and deals with rejected cases only.

```JavaScript cmd = "node"
const promise1 = new Promise((resolve, reject) => {
  throw 'Uh-oh!';
});

promise1.catch((error) => {
  console.error(error);
});
// expected output: Uh-oh!
```

The chains of promise values created by calls to ```then``` and ```catch``` can be seen as a pipeline through which asynchronous values or failures move.

## Networks are Hard
Connection between network might be unstable and cause the message never to be sent or never received, so we need TimeOut to let the function retry multiple times and give up after a couple of milliseconds.

Here is a timeout code which execute the function 3 times before it gives up after 250ms.
```JavaScript cmd="node"
class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}
```

Next is the [defineRequestType](https://eloquentjavascript.net/11_async.html#c_38THPHvc7d) but wrapped.
```JavaScript cmd="node"
function requestType(name, handler) {
  defineRequestType(name, (nest, content, source,
                           callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response),
              failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}
```
>Note that the call to handler had to be wrapped in a try block to make sure any exception it raises directly is given to the callback. This nicely illustrates the difficulty of properly handling errors with raw callbacks—it is easy to forget to properly route exceptions like that, and if you don’t do it, failures won’t get reported to the right callback. Promises make this mostly automatic and thus less error-prone.

## Collections of Promises

### [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
Promise.all() returns a single ```Promise``` that fulfills when all of the promises passed as an iterable(example array) contains no promises **or** when the itarable contains promises that have been fulfilled **and** non-promises that have been returned. 
>It returns a promise that waits for all of the promises in the array to resolve and then resolves to an array of the values that these promises produced (in the same order as the original array). If any promise is rejected, the result of Promise.all is itself rejected.

```JavaScript cmd="node”
requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  }); //If reject false, if resolve true(in the array.)
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
    //If result[i] = true, take this element, if result[i] = false,
    //dont take this elemtn. See below for some example.
  });
}
```
gg spend so much time here
```JavaScript cmd="node"
let one = [true,false,true,false];
let two = [true,true,false,true];

function test(variable){
  let result = variable;
  let abc = [`one`,`two`,`three`,`four`];
  return abc.filter((avc,i)=>result[i])
}

console.log(test(one));
console.log(test(two));
```