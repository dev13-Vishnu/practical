// Challenge 5: The "Dark Mode" Toggle
// Scenario: Your website has a dark mode, controlled by a CSS class called "dark-theme" applied to the <body> tag. You need to make the toggle button actually work.
// Goal: Write a function that grabs the button element by its ID and adds a "click" event listener to it. Every time it is clicked, it should toggle the "dark-theme" class on or off the document.body.

// Boilerplate:

// HTML
// <!-- The HTML on the page -->
    // <body class="light-theme">
    //   <button id="theme-toggle-btn">Switch Theme</button>
    // </body>
// JavaScript
function setupThemeToggle() {
  // 1. Select the button element using its ID
  let button = document.getElementById('theme-toggle-btn')
  // 2. Add an event listener for 'click'
  button.addEventListener('click',
    // 3. Inside the listener, toggle the 'dark-theme' class on document.body
    ()=> {
    // Safely toggles ONLY this specific class on or off
    document.body.classList.toggle('dark-theme');
  })
}

setupThemeToggle();

// Challenge 6: The Dynamic Feed
// Scenario: You have a list of recent comments. Instead of hardcoding them in HTML, you need to use JavaScript to render them onto the screen dynamically.
// Goal: Write a function that takes an array of strings. For every string, create a new <li> element, set its text, and append it to the existing <ul> on the page.

// Boilerplate:

// HTML
// <!-- The HTML on the page -->
// <h3>Recent Comments</h3>
// <ul id="comment-list">
//   <!-- JavaScript should inject <li> tags here -->
// </ul>

const newComments = ["First!", "Great article.", "I disagree with point 2."];

function renderComments(commentsArray) {
  // 1. Select the <ul> element by its ID
  let list = document.getElementById('comment-list');
  
  // 2. Create our invisible, temporary container
  const fragment = document.createDocumentFragment();
  // 3. Loop over commentsArray
  commentsArray.forEach(text => {
      // 4. For each comment, create an <li>, add the text, and append it to the <ul>
    const item = document.createElement('li');
    item.textContent = text;
    // 5. Append to the temporary box, NOT the live DOM
    fragment.appendChild(item);
  });
  // 6. Append the box to the live DOM just once!
  list.appendChild(fragment);
}

renderComments(newComments);