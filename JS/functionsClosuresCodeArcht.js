function createTicketGenerator(){
  // 1. Create a variable here to hold the count (e.g., let count = 0)
  let count = 1
  // 2. Return a new function
  return function () {
	  // 3. Inside that returned function, increment the count and return it
	  return count++;
  }
}

const getNextTicket = createTicketGenerator();

console.log(getNextTicket()); // Expected: 1
console.log(getNextTicket()); // Expected: 2
console.log(getNextTicket()); // Expected: 3

class Player{
    #name = "";
    #score = 0;
  // 1. Add a constructor(name) that sets this.name and this.score
  constructor(name) {
	    this.#name = name;
	    this.#score = 0;
	}
  // 2. Add an addPoints(points) method
  addPoints(points) {
	  this.#score += points
  }
  // 3. Add a getScoreboard() method
  getScoreboard() {
	  return `Name: ${this.#name}, Score: ${this.#score}`;
  }
}

// Test cases
const player1 = new Player("Mario");
player1.addPoints(50);
player1.addPoints(25);
console.log(player1.getScoreboard()); // Expected: "Name: Mario, Score: 75"

const player2 = new Player("Luigi");
console.log(player2.getScoreboard()); // Expected: "Name: Luigi, Score: 0"