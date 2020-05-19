[Chapter 11 - Asynchronous Programming](https://eloquentjavascript.net/11_async.html)

Comparision of synchronous and asynchronous

![Comparision of synchronous and asynchronous](https://eloquentjavascript.net/img/control-io.svg)

In a synchronous programming model, things happen one at a time. When you call a function that performs a long-running action, it returns only when the action has finished and it can return the result. This stops your program for the time the action takes.

An asynchronous model allows multiple things to happen at the same time. When you start an action, your program continues to run. When the action finishes, the program is informed and gets access to the result (for example, the data read from disk).

## Crow Tech

**The author describe a concept of crow tech ? Not really sure what is it refering to ... directly quote this section from book.**

Most people are aware of the fact that crows are very smart birds. They can use tools, plan ahead, remember things, and even communicate these things among themselves.

What most people don’t know is that they are capable of many things that they keep well hidden from us. I’ve been told by a reputable (if somewhat eccentric) expert on corvids that crow technology is not far behind human technology, and they are catching up.

For example, many crow cultures have the ability to construct computing devices. These are not electronic, as human computing devices are, but operate through the actions of tiny insects, a species closely related to the termite, which has developed a symbiotic relationship with the crows. The birds provide them with food, and in return the insects build and operate their complex colonies that, with the help of the living creatures inside them, perform computations.

Such colonies are usually located in big, long-lived nests. The birds and insects work together to build a network of bulbous clay structures, hidden between the twigs of the nest, in which the insects live and work.

To communicate with other devices, these machines use light signals. The crows embed pieces of reflective material in special communication stalks, and the insects aim these to reflect light at another nest, encoding data as a sequence of quick flashes. This means that only nests that have an unbroken visual connection can communicate.

Our friend the corvid expert has mapped the network of crow nests in the village of Hières-sur-Amby, on the banks of the river Rhône. This map shows the nests and their connections:

![A network of crow nests in a small village](https://eloquentjavascript.net/img/Hieres-sur-Amby.png)

In an astounding example of convergent evolution, crow computers run JavaScript. In this chapter we’ll write some basic networking functions for them.

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

## Failure

## Networks are Hard
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