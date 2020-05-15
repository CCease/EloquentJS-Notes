#Chapter 8 Code chunks

Use VS Code + markdown-enhanced-preview then run the code chunks to see results.

## INI file rules
- Blank lines and lines starting with semicolons are ignored.
- Lines wrapped in [ and ] start a new section.
- Lines containing an alphanumeric identifier followed by an = character add a setting to the current section.
- Anything else is invalid.
```javascript cmd="node"

function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
      //See testing 1.
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]v] = {};
      //Line above is equal to
      //result[match[1]] = {}
      //section = result[match[1]] (section is now refer to result[match[1]])
      //See testing 1 second and third part.
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(parseINI(`
name=Vasilisk
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
```

## Testing 1
a = {}
b = a

b is reference to a
(set b value also set a value)
```javascript cmd="node"
let a = {}
let b = a

b["q"]="qwe" //This mean a["q"]="qwe"
console.log("a=",a);
console.log("b=",b,"\n");

b = a["w"] = {};//b is now reference to a["w"]
console.log("a=",a);
console.log("b=",b,"\n");

b["q"] = {};//This mean a["w"]["q"] = {}
console.log("a=",a);
console.log("b=",b);
```

## Testing 2
b lost its reference here
```javascript cmd="node"
let a = {}
let b = a

b["q"]="qwe"
console.log("a=",a);
console.log("b=",b,"\n");

a["w"] = {};
b = {}; //Here b lost its reference
console.log("a=",a);
console.log("b=",b,"\n");

b["q"] = {};
b["w"] = "asd";
console.log("a=",a);
console.log("b=",b,"\n");
```