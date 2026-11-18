// Challenge 3: The Active User Extractor
// Scenario: You fetched a list of users from a database, but the UI only needs to display the full names of users who currently have an active subscription.Goal: Write a function that takes an array of user objects and returns a new array of strings containing only the full names of the isActive: true users.

// Boilerplate & Test Cases:

const users = [
  { firstName: "Alice", lastName: "Smith", isActive: true },
  { firstName: "Bob", lastName: "Jones", isActive: false },
  { firstName: "Charlie", lastName: "Brown", isActive: true }
];

function getActiveUserNames(usersArray) {
  return usersArray
    .filter(user => user.isActive) // 1. Keep only active users (no need for === true)
    .map(user => `${user.firstName} ${user.lastName}`); // 2. Transform them into strings
}

console.log(getActiveUserNames(users)); 

// Challenge 4: The Inventory Tally
// Scenario: A user just clicked "checkout," and you have an array of the item IDs they added to their cart. You need to count how many of each item they bought so you can generate a receipt.Goal: Write a function that takes an array of strings and returns an Object where the keys are the item names and the values are the counts.

// Boilerplate & Test Cases:

const cart = ["apple", "banana", "apple", "orange", "banana", "apple"];

function tallyCartItems(itemArray) {
  return itemArray.reduce((freq, elem) => {
    // If freq[elem] exists, add 1. If it's undefined, fallback to 0 and add 1.
    freq[elem] = (freq[elem] || 0) + 1; 
    return freq;
  }, {}); // The {} here is the starting value for 'freq'
}

console.log(tallyCartItems(cart));