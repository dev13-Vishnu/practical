// ### Challenge 1: The Shopping Cart Calculator
// **Scenario:** You are building the checkout logic for an e-commerce site. You need to calculate the final total of an item after applying a discount and then adding an 8% sales tax to the discounted price.
// **Goal:** Return the final price, rounded to two decimal places. (Hint: look up the JavaScript method for rounding numbers to decimals if you don't know it).

function calculateFinalPrice (originalPrice , discountPercentage) {
    // 1. Calculate the price after the discount
    let discountedPrice = originalPrice - (originalPrice*(discountPercentage/100))
  // 2. Add 8% tax to that new discounted price
  let finalAmount = discountedPrice + discountedPrice * (8/100)
  // 3. Return the final amount
    return finalAmount.toFixed(2);
}

console.log(calculateFinalPrice(100,20));
console.log(calculateFinalPrice(50,0));

// ### Challenge 2: Digital Clock Formatter
// **Scenario:** You are building a smartwatch interface. The hardware gives you the time in a 24-hour format (e.g., 14 for 2:00 PM), but the user wants to see it in a 12-hour format with AM or PM.
// **Goal:** Convert the 24-hour integer into a formatted string.

function formatTime(hour24) {
    // Handle edge cases: 0 should be "12 AM", 12 should be "12 PM"
    // Hours 1-11 should be AM
    if(!Number.isInteger(hour24) || hour24 > 24 || hour24 < 0) {
        return "Invalid Hour.";
    }
    const suffix = hour24 > 12 ? "PM" : "AM";
  // Hours 13-23 should be PM (subtract 12)
  const hour12 = hour24 %12 || 12;
  
  // Return the formatted string (e.g., "2 PM")
  return `${hour12} ${suffix}`
}
// Test Cases:
console.log(formatTime(14)); // Expected: "2 PM"
console.log(formatTime(0));  // Expected: "12 AM"
console.log(formatTime(9));  // Expected: "9 AM"


// Challenge 3: The Retry Protocol (Loops)
// Scenario: A server is trying to connect to a database. It should attempt to connect up to a maximum number of times. If it fails on the 13th attempt, it should immediately stop trying because 13 is unlucky for this specific server.
// Goal: Write a loop that prints the attempt number. Stop the loop entirely if it hits attempt 13, even if the max attempts are higher.

function attemptConnection(maxAttempts) {
  // Create a loop that runs from 1 up to maxAttempts
 
  for( let attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber++) {
  // Inside the loop, console.log("Attempting connection: " + attemptNumber)
        if(attemptNumber === 13) {
            console.log("System failure. Halting.");
            break;
        }
    console.log("Attempting Connection: "+ attemptNumber)
    // If the attemptNumber is 13, console.log("System failure. Halting.") and break the loop.
    }

}

// Test Cases:
attemptConnection(5); 
// Should print attempts 1 through 5.

attemptConnection(20); 
// Should print attempts 1 through 12, then "System failure. Halting.", then stop.

// Challenge 1: The E-Commerce Discount Calculator
// Scenario: You are building the checkout logic for an online store. The store offers discounts based on the total cart value and the customer's loyalty status.Goal: Write a function that calculates the final price after applying the correct discount rules:

// If the user is a "VIP" and spends $100 or more, they get 20% off.

// If the user is a "VIP" and spends less than $100, they get 10% off.

// If the user is a "Regular" customer and spends $100 or more, they get 5% off.

// If the user is a "Regular" customer and spends less than $100, they get no discount (0% off).

// Boilerplate & Test Cases:

function calculateFinalPrice(cartTotal, customerType) {
  // 1. Set a default discount of 0%
  let discountRate = 0; 
  
  // 2. Reassign the rate only if they meet the conditions
  if (customerType === "VIP") {
    discountRate = cartTotal >= 100 ? 0.20 : 0.10; // Ternary operators are great for concise if/else
  } 
  
  if (customerType === "Regular" && cartTotal >= 100) {
    discountRate = 0.05;
  }

  // 3. Do the math and return a Number, not a String
  const finalPrice = cartTotal - (cartTotal * discountRate);
  return finalPrice;
}

// Test cases to check your work
console.log(calculateFinalPrice(120, "VIP"));      // Expected: 96
console.log(calculateFinalPrice(50, "VIP"));       // Expected: 45
console.log(calculateFinalPrice(150, "Regular"));  // Expected: 142.5
console.log(calculateFinalPrice(80, "Regular"));   // Expected: 80

// Challenge 2: The Warehouse Stock Checker
// Scenario: A warehouse manager needs a quick way to know how many items are dangerously low in stock so they can be reordered.Goal: You are given an array of numbers representing the stock levels of various items. Write a loop that counts how many items fall strictly below a given minimum threshold.

// Boilerplate & Test Cases:

function countLowStockItems(stockLevels, minimumThreshold) {
  // filter() creates a new array of only the items that pass the condition. 
  // We then just grab the .length of that new array!
  return stockLevels.filter(item => item < minimumThreshold).length;
}

// Test cases to check your work
console.log(countLowStockItems([50, 12, 100, 4, 8, 45], 15)); // Expected: 3 (because 12, 4, and 8 are below 15)
console.log(countLowStockItems([20, 30, 40, 50], 10));        // Expected: 0
console.log(countLowStockItems([5, 5, 5], 5));                // Expected: 0 (must be *strictly* below)
