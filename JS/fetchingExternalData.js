// Challenge 7: The Basic Fetch
// Scenario: You are building a user profile page. You need to fetch the user's data from an external server and extract just the information you need.Goal: Write an async function that uses the Fetch API to get data from [https://jsonplaceholder.typicode.com/users/1](https://jsonplaceholder.typicode.com/users/1). Wait for the response, parse the JSON, and return a new object containing only the user's name and email.

// Boilerplate:

// Note the 'async' keyword!
async function getUserProfile() {
  const url = "https://jsonplaceholder.typicode.com/users/1";
  try {
	  // 1. Fetch the data from the url
	  const response = await fetch(url);
	  // 2. Parse the response into JSON
	  const {name, email} = await response.json();
	  
	  // 3. Return an object: { name: "...", email: "..." }
      return {name, email}
	 } catch(err){
		throw Error(err.message)
        // One tiny note: If your fetch fails and goes into the catch block, you console.log the error, but you don't return anything. In JavaScript, a function without a return statement implicitly returns undefined. So, getUserProfile().then(profile => ...) would log undefined. In production, you might want to return a default object like { name: "Unknown", email: "Unknown" } or re-throw the error so the caller knows it failed.
	 }
}

// How we test an async function
getUserProfile().then(profile => console.log(profile));


// Challenge 8: Handling the Sad Path (Errors)
// Scenario: Servers crash, URLs change, and Wi-Fi drops. You need to make sure your app doesn't explode when a network request fails.Goal: Write an async function that tries to fetch data from a broken URL ([https://jsonplaceholder.typicode.com/invalid-url](https://jsonplaceholder.typicode.com/invalid-url)). Wrap your logic in a try/catch block. If the fetch fails (or if the response status is not "ok"), catch the error and return the fallback string: "Error: Could not load data".

// Boilerplate:

async function fetchWithFallback(){
  const badUrl = "https://jsonplaceholder.typicode.com/invalid-url";
	// 1. Set up a try/catch block
	try {
	  // 2. Inside 'try', fetch the badUrl
	  const response = await fetch(badUrl);
	  // 3. Check if response.ok is false. If so, throw an error!
    //   Many beginners assume that if an API returns a 404 Not Found or 500 Internal Server Error, the fetch Promise will automatically "reject" and trigger the catch block. It doesn't. fetch only rejects if the network itself completely fails (like if your Wi-Fi drops). By manually checking !response.ok and throwing an error, you guarantee that HTTP errors are safely routed into your catch block. Excellent work.
	  if(!response.ok) {
		  throw Error('Something went wrong!');
	  }
	} catch (error) {
	  // 4. Inside 'catch', return the fallback string
	  return "Error: Could not load data"
	}
}

fetchWithFallback().then(result => console.log(result));