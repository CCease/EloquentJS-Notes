#[Chapter 11 - Asynchronous Programming](https://eloquentjavascript.net/11_async.html)

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

## Network Flooding

A network that can only talk to his neighbors greatly limit the usefullness of the network, one solution is to set up a type of request that automatically forwarded to neighbors, neighbors then forward to their neighbors and all people in the network will receive the message.

```JavaScript cmd = "node"
import {everywhere} from "./crow-tech";

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
    //request(nest, target, type, content)
    //Send message, retry 3 times in 250ms. 
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${
               message}' from ${source}`);
  sendGossip(nest, message, source);
});
//requestType is a wrapper for
//defineRequestType that allow
//the handle function to return a promise
//and wires that up to the callback.

//Tell every crow becareful with kid.
sendGossip(bigOak, "Kids with airgun in the park");
```
everywhere is a function that runs code on every nest. In here, nest.state.gossip is created to make sure each nest receive message once.

When nest receive duplicate message, it ignores. When it receives new message, it spread out except the one send it the message.

The request() seems to trigger the requestType() to deal with the request.

## Message Routing

When a node want to talk to only a specific node, use flooding will be a waste of resouces.

```JavaScript cmd = "node"
requestType("connections", (nest, {name, neighbors},
                            source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) ==
      JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});
//If neighbor is found and same, return.
//If neighbor no and not same, set.
function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}
//Run request of connection is every nest.
everywhere(nest => {
  nest.state.connections = new Map;
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});
//Create nest.state.connections in every nest.
```
>The comparison uses JSON.stringify because ==, on objects or arrays, will return true only when the two are the exact same value, which is not what we need here. 

The code aboce created map or graph that are same as in Chapter 7, so a smilar ```findRoute``` function which greatly resembles the ```findRoute``` from Chapter 7 can be use here, but instead of returning the whole route, it just returns the next step. The next step itself will use its current information about the network and decide where it sends he message. About || click [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators).

```JavaScript cmd= "node"
function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
        //via: via||next
        //If via is false or null, via = next
        //else via = via
        //Via is the next step.
      }
    }
  }
  return null;
}
```
With this ```findRoute```, a funtion that can send long-distance messages can be built. If the message is to direct neighbor, send. If message is to far neighbor, it is packaged in an object and send to a neighbor that is closer to the target, using the "route" request type, which will cause that neighbor to repeat the same behavior.

```JavaScript cmd="node"
function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target,
                        nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route",
                   {target, type, content});
  }
}

requestType("route", (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});
```
*If via is a parameter, send to there ? 2 request in routeRequest.
1.```request(nest, target, type, content);```
2.```request(nest, via, "route",
                   {target, type, content})```*
A message can now be send send from bigOak to churchh tower which is four nest away.

```JavaScript cmd="node"
routeRequest(bigOak, "Church Tower", "note",
             "Incoming jackdaws!");
```

>We’ve constructed several layers of functionality on top of a primitive communication system to make it convenient to use. This is a nice (though simplified) model of how real computer networks work.<br>
A distinguishing property of computer networks is that they aren’t reliable—abstractions built on top of them can help, but you can’t abstract away network failure. So network programming is typically very much about anticipating and dealing with failures.

## Async Functions

Information is not store in one storage only, to retrieve a pieve of information, the computer need to consult other computer(computer = nest in this case)until it finds the one has it.

```JavaScript cmd="node"
requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
  return storage(nest, name).then(found => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
                                      sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(nest, source, "storage", name)
        .then(value => value != null ? value : next(),
              next);
      //routeRequest(nest, target, type, content)
    }
  }
  return next();
}
```
>Because connections is a Map, Object.keys doesn’t work on it. It has a keys method, but that returns an iterator rather than an array. An iterator (or iterable value) can be converted to an array with the Array.from function.<br>
Even with promises this is some rather awkward code. Multiple asynchronous actions are chained together in non-obvious ways. We again need a recursive function (next) to model looping through the nests.<br>
And the thing the code actually does is completely linear—it always waits for the previous action to complete before starting the next one. In a synchronous programming model, it’d be simpler to express.<br>
The good news is that JavaScript allows you to write pseudo-synchronous code to describe asynchronous computation. An async function is a function that implicitly returns a promise and that can, in its body, await other promises in a way that looks synchronous.<br>
We can rewrite findInStorage like this:

```JavaScript cmd="node"
async function findInStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;
  //Asume storage(nest.name) return
  //storage if found local.

  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() *
                                    sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let found = await routeRequest(nest, source, "storage",
                                     name);
      //routeRequest(nest, target, type, content)
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error("Not found");
}
```
**Logic in code above is find a random nest from neighbour??? The name parameter which should be the name of the storage is not anywhere in the code above execpt in routeRequest which also does not verify if the storage is at the specific nest (source).**
```JavaScript cmd="node"
findInStorage(bigOak, "events on 2017-12-21")
  .then(console.log);
```

>An ```async``` function is marked by the word ```async``` before the function keyword. Methods can also be made ```async``` by writing ```async``` before their name. When such a function or method is called, it returns a promise. As soon as the body returns something, that promise is resolved. If it throws an exception, the promise is rejected.

In an ```async``` function, keyword ```await``` can be put in front of an expression to wait for a promise to resolve and only then continue the execution of the function. This kind of function is frozen and can be resume at a later time.

>For non-trivial asynchronous code, this notation is usually more convenient than directly using promises. Even if you need to do something that doesn’t fit the synchronous model, such as perform multiple actions at the same time, it is easy to combine await with the direct use of promises.

## Generators

```generator``` functions, bring pause and resume to function. Similar to ```async``` but without promises.

An asterisk(\*) placed after the function (function\*), it becomes a generator. When you call a generator, it **returns an iterator**, which we already saw in Chapter 6.
```JavaScript cmd="node"
function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
// → 3
// → 9
// → 27
```
For a generator function, the function is frozen at its start. Every time ```next``` is call on the iterator, it runs until it hits a ```yield``` expression, which pause and causes the yielded value to become the next value produces by the iterator. The iterator stops when the function returns.

Group class that are written in exercise of Chapter 6 can also be written in generator. Take note that the state a generator saves is local environment, so ```yield```  can only occur directly in the generator function itself.
```JavaScript cmd="node"
Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
};
```
>An async function is a special type of generator. It produces a promise when called, which is resolved when it returns (finishes) and rejected when it throws an exception. Whenever it yields (awaits) a promise, the result of that promise (value or thrown exception) is the result of the await expression.

## The Event Loop

**?????**

