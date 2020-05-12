const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
]; //Collection of Roads.

function buildGraph(edges) {
  let graph = Object.create(null); //Create an empty object
  function addEdge(from, to) { 
    if (graph[from] == null) {
      graph[from] = [to];          //If empty, create first, .push cannot use if graph[from] does not exist.
    } else {
      graph[from].push(to);        //AddB connections indside.
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) { //From = left part of road, to = left part of road
    addEdge(from, to); 
    addEdge(to, from); //A can go B, B can go A. 
  }
  return graph; 
}

const roadGraph = buildGraph(roads); //Build the array of roads.

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels; //An array of parcel, parcel = {place:where the parcel is now,address:destination of the parcel}
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) { //If current location and destination of move is not connected
      return this;//No change, don't move.
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p; //If parcel is not in the location same as robot, do nothing.
        return {place: destination, address: p.address}; //If parcel is at the same locatioon as robot, move the parcel to the place robot are going. 
      }).filter(p => p.place != p.address); //Filter out parcel that are delivered to their destination. 
      return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) { //State = VillageState, robot= a function in this case, memory = undefine
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) { //If all parcel are delivered. 
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);  //action = {direction: nextstep}, robot is function randomRobot() in this case(parameter of this function). 
    state = state.move(action.direction); //Move the robot one step, action.direction is from the robot parameter. 
    memory = action.memory; //Undefined, concept purpose. 
    console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array) { //Accept an array, return a random element in the array.
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) { //return an object -> {direction:next step the robot will go}
  return {direction: randomPick(roadGraph[state.place])}; //Pick a random connected place. Get current place from the parameter state.
}

function randomRobot2(state, memory, step) { //Another function that actually records where the robot goes.
  nextplace = randomPick(roadGraph[state.place]);
  memory["step"+step] = [nextplace];
  return {direction: nextplace, memory}; 
}

VillageState.random = function(parcelCount = 5) { //Generate a village state which its parcels is random. Place always starts at Post Office.
  let parcels = []; 
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};

//runRobot(VillageState.random(), randomRobot); //Run the robot. 

const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function routeRobot(state, memory) {//Memory is the route robot is about to go.
  if (memory.length == 0) {
    memory = mailRoute; 
  }
  return {direction: memory[0], memory: memory.slice(1)}; //Direction = next step, delete that step in memory. 
}

function findRoute(graph, from, to) { //Search one step in every direction, if found, return that route. 
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

/**
 * Write a function compareRobots that takes two robots 
 * (and their starting memory).
 * It should generate 100 tasks and let each of the robots 
 * solve each of these tasks. When done, it should output the average
 * number of steps each robot took per task.
 */
function compareRobots(robot1, memory1, robot2, memory2) {
  tasks = []
  
  for(let task = 0; task < 100; task ++){
    tasks[task] = VillageState.random(); //Random 100 state.
  }
  
  robot1turn = 0;
  robot2turn = 0;
  
  for(let i = 0; i < tasks.length; i++){
    state1 = tasks[i];
    state2 = tasks[i];
  	for(let turn = 0;;turn++){ //Using robot 1 do deliver parcel.
  	  if(state1.parcels.length == 0){
        robot1turn=robot1turn + turn;
        break;
      }
      let action = robot1(state1,memory1);
      state1 = state1.move(action.direction);
      memory1 = action.memory;
  	}
    
    for(let turn2 = 0;;turn2++){ //Using robot 2 to deliver parcel.
  	  if(state2.parcels.length == 0){
        robot2turn=robot2turn + turn2;
        break;
      }
      let action = robot2(state2,memory2);
      state2 = state2.move(action.direction);
      memory2 = action.memory;
  	}
    //console.log(i, robot1turn, robot2turn);
  }
  
  console.log(`Robot 1 takes ${robot1turn/100} turn to complete the tasks, Robot 2 takes ${robot2turn/100} turn to complete the tasks.`)
}

/** Book Example
 * function countSteps(state, robot, memory) {
  for (let steps = 0;; steps++) {
    if (state.parcels.length == 0) return steps;
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

function compareRobots(robot1, memory1, robot2, memory2) {
  let total1 = 0, total2 = 0;
  for (let i = 0; i < 100; i++) {
    let state = VillageState.random();
    total1 += countSteps(state, robot1, memory1);
    total2 += countSteps(state, robot2, memory2);
  }
  console.log(`Robot 1 needed ${total1 / 100} steps per task`)
  console.log(`Robot 2 needed ${total2 / 100}`)
}
 */

compareRobots(efficientRobot, [], lazyRobot, []);

/**
 * Write a robot faster then goalOrientedRobot. 
 */

 function efficientRobot({place, parcels}, route){
  if (route.length == 0) {
    allroutepick = [];
    shorteststepick = 100000;
    shorteststepickindex=0;
    allroutedeliver = [];
    shorteststepdeliver = 100000;
    shorteststepdeliverindex = 0;
    for (let index = 0; index < parcels.length; index++) {
      let parcel = parcels[index];
      if (parcel.place != place) {
      allroutepick.push(findRoute(roadGraph, place, parcel.place));
      } else {
      allroutedeliver.push(findRoute(roadGraph, place, parcel.address));
      } 
    }
    
    //console.log("deliver :",allroutedeliver.length, "pick",allroutepick.length);

    if(allroutepick.length != 0){
      shorteststepick = allroutepick[0].length;
      for (let index = 0; index < allroutepick.length; index++) {
        if(allroutepick[index].length < shorteststepick){
          shorteststepick = allroutepick[index].length;
          shorteststepickindex = index;
        }
      }
    }

    if (allroutedeliver.length != 0) {
      shorteststepdeliver = allroutedeliver[0].length;
      for (let index = 0; index < allroutedeliver.length; index++) {
        if(allroutedeliver[index].length < shorteststepdeliver){
          shorteststepdeliver = allroutedeliver[index].length;
          shorteststepdeliverindex = index;
        }
      }
    }
    
    //console.log("allroutedeliver = ",allroutedeliver, "allroutepick = ", allroutepick);
    //console.log("deliverstep = ",shorteststepdeliver, "pick step = ",shorteststepick);
    if(shorteststepdeliver < shorteststepick){
      //console.log("Entered deliver shorter.")
      route = allroutedeliver[shorteststepdeliverindex];
    }
    else{
      //console.log("Entered pick shorter.")
      route = allroutepick[shorteststepickindex];
    }
  }
  return {direction: route[0], memory: route.slice(1)};
 }

//Version from Book
function lazyRobot({place, parcels},route){
  if (route.length == 0) {
    let routes = parcels.map(parcel => {//get route for every parcel
      if(parcel.place != place){
        return {route: findRoute(roadGraph, place, parcel.place), pickUp:true};
      }
      else{
        return {route: findRoute(roadGraph,place,parcel.address), pickUp:false}
      }
    })
    
    function score({route,pickUp}){
      return (pickUp ? 0.5 : 0) - route.length // -(route.length - (pickUp ? 0.5: 0)) Score higher better
    }
    
    route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
  }
  return {direction: route[0], memory: route.slice(1)}
}


 /**
  * Complete the class PGroup. 
  */

 class PGroup {
  // Your code here
  constructor(inventory) {
    this.inventory = inventory;
  }
  
  add(element) {
    if (!this.has(element)) {
      return new PGroup(this.inventory.concat(element));
    }
    else{console.log("This element already in group.")} 
  }

  delete(element){
    return new PGroup(this.inventory.splice(this.inventory.findIndex(e => {e == element})));
  }

  has(element){
    return this.inventory.includes(element);
  }
}

PGroup.empty = new PGroup([]);
let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false