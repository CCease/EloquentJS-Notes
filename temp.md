First line

Section[name] = "Vasilis"

Here section = {name:"Vasilis"}
Next

Section = result[address] = {}
Here 
result = {address:}
section = {address:}

next
section[city]="Tessaloniki"

section = {address:,city:"Tessaloniki"}
?????

```javascript cmd="node"

function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
      console.log("first",section);
      console.log("first",result);
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
      console.log(section);
      console.log(result);
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}


```