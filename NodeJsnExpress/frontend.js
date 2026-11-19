// ==========================================
// MILESTONE 2 CHALLENGES GO HERE
// ==========================================
// Challenge 2...

// fetch('http://localhost:3000/dashboard', {
//     method: 'GET',
//     headers: {
//         'x-vip-pass':'supersecret'
//     }
// }).then(response=> response.json())
// .then(data=> console.log(data))
// .catch(err=> console.log(err));
// ==========================================
// MILESTONE 3 CHALLENGES GO HERE
// ==========================================
// Challenge 1...

// fetch("http://localhost:3000/books", {
//   method: "POST",
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({}),
// })
//   .then((response) => {
//     // if (response.ok) {
//     // console.log(response)
//     //   response.json().then(data=> console.log(data)
//     //   )
//     // } else {
//     //   throw new Error(`Error from '/books' route`);
//     // }
//     response.json();
//     if(response.error) {
//         throw new Error(response.error);
//     }
//   })
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

async function testCreateBook() {
  try {
    const response = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({ "title": "Dune", "author": "Frank Herbert", "year": 1965 }),
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(`Status ${response.status}: ${data.error}`)
    }
    console.log('Success:', data);

  } catch (error) {
    console.error('Caught error:', error.message);
  }
}
// testCreateBook();

// Challenge 2...

// async function testDeleteBook() {

//     try {
    //         const response = await fetch('http://localhost:3000/books/1',{
//             method: 'DELETE',
//         })
    
//         const data = await response.json();
//         if(!response.ok) {
//             throw new Error(`Status ${data.error}`)
//         }
//         console.log('Success:',data);

//     } catch (error) {
//         console.error('Caught error:', error.message);
//     }

// }

// // testDeleteBook();
async function testPatchBook() {
  try {
    const response = await fetch("http://localhost:3000/books/6aff17200c1da3104b459e95", {
      method: "PATCH",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({ "title": "Atomic Habits", "available": false }),
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(`Status ${response.status}: ${data.error}`)
    }
    console.log('Success:', data);

  } catch (error) {
    console.error('Caught error:', error.message);
  }
}

testPatchBook()