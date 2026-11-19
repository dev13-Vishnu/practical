const express = require("express");
const { connectDB, Book } = require("./db");
const { default: mongoose } = require("mongoose");
const app = express();

const PORT = 3000;

app.use(express.json());

app.use(logger);
// ==========================================
// MILESTONE 3 CHALLENGES GO HERE
// ==========================================

// Challenge 1 code here...
// let books = [
//   { id: 1, title: "1984" },
//   { id: 2, title: "The Hobbit" }
// ];

// let nextId = 3;

// app.post('/books',(req,res)=> {

//     // console.log(books)

//     const {title} = req.body || {};

//     if(typeof title !== 'string' || !title.trim()) {
//         return res.status(400).json({error: "Title must be a non-empty string"})
//     }

//     const newBook = { id: nextId++, title: title.trim()}
//     books.push(newBook)
//     res.status(201).json(newBook)
// })

// // Challenge 2...

// app.delete('/books/:id',(req,res)=> {
//     const id = Number(req.params.id);
//     if(!Number.isInteger(id) || id <=0) {
//         return res.status(400).json({error: "Invalid book ID"});
//     }
//     const exists = books.some(book=> book.id=== id);
//     if(!exists) {
//         return res.status(404).json({error: 'Book not found'});
//     }
//     books = books.filter(book=> book.id !== id);
//     res.status(200).json({message: "Book Deleted Successfully"})
// })

// ==========================================
// MILESTONE 1 CHALLENGES GO HERE
// ==========================================

// // Challenge 1 code here...
// app.get('/ping',(req, res)=> {
//     res.status(200).json({"message":"Pong"});
// })
// app.get('/brew', (req,res)=> {
//     res.status(418).json({"error":"Refusing to brew coffee in a teapot"})
// })
// // Challenge 2 code here...
// app.get('/users/:username',(req,res)=> {
//     const {username} = req.params
//     res.json({profile:`${username}`, status: 'active'})
// })
// // Challenge 3 code here...
// app.get('/products', (req,res)=> {
//     const category_name = req.query.category
//     if(!category_name) {
//         return res.status(400).json({error: "Category query parameter is required"})
//     }
//     res.status(200).json({filteringBy:category_name})
// })

// ==========================================
// MILESTONE 4 ROUTES GO HERE
// ==========================================
//Challenge 1: Safe Single-Resource Lookup (GET /books/:id)
// Scenario: Your frontend requests /books/:id to load a book's details page. In MongoDB, IDs are 24-character hex strings called ObjectIds. If someone requests /books/123 or /books/not-an-id, passing it straight to Mongoose throws a CastError and triggers a 500 crash instead of telling the client their input was bad.
// Goal:

// Create an async route at GET /books/:id.

// Validate that req.params.id is a valid MongoDB ObjectId before hitting the database. If it isn't, return 400 with { "error": "Invalid book ID" }.

// Fetch the book by ID from MongoDB.

// If no document matches, return 404 with { "error": "Book not found" }.

// Otherwise, return 200 with the book document.

// CHALLENGE 1: Safe Single-Resource Lookup
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  // 1. Validate the ObjectId format BEFORE hitting MongoDB.
  // Passing a malformed string like "/books/123" straight to findById()
  // throws a Mongoose CastError -> 500 Internal Server Error instead of 400.
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  // 2. Always `await` the Mongoose query.
  // Without `await`, `book` is an unresolved Query object (which holds a circular
  // reference to MongoClient and crashes JSON.stringify).
  const book = await Book.findById(id);

  // 3. Valid format !== existing record.
  // A 24-char hex ID that isn't in the DB returns `null`, not an error.
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // 4. Send the matched document.
  res.status(200).json(book);
});


// Challenge 2: Dynamic Query Filtering (GET /books)
// Scenario: Users need to browse the catalog or combine filters in the URL—for example, GET /books?author=orwell&available=true or GET /books?minYear=1940.

// Goal:
// Create an async route at GET /books.

// Build a dynamic MongoDB filter object supporting three optional query parameters (individually or combined):

// author: case-insensitive partial match against the author field. Make sure you verify author is actually a string (in Express, query parameters can sometimes be parsed as arrays or objects if crafted maliciously).

// minYear: returns books published in or after that year. If minYear is provided but isn't a valid integer, return 400.

// available: accepts "true" or "false" (converted to a real boolean). If provided with any other value (like "maybe"), return 400.

// If no query parameters are provided, return all books (200).
// ==========================================
// HELPER: Sanitize User Input for Regex
// ==========================================
// Escapes regex metacharacters (., *, +, ?, ^, $, {, }, (, ), |, [, ], \)
// by prefixing them with a backslash (`\\$&` = backslash + matched character).
// Without this:
// - `?author=[` throws a MongoServerError (invalid regex) -> 500 crash.
// - `?author=.*` acts as a wildcard and leaks unintended records.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==========================================
// CHALLENGE 2: Dynamic Query Filtering
// ==========================================
app.get('/books', async (req, res) => {
  // Extract optional filters from the URL query string (e.g., /books?author=orwell&minYear=1940).
  // Remember: URL query values ALWAYS arrive as strings—or as arrays/objects if a client
  // sends duplicate keys (?author=a&author=b) or nested notation (?author[$ne]=).
  const { author, minYear, available } = req.query;

  // Start with an empty MongoDB filter object.
  // If no query params are supplied, `Book.find({})` cleanly returns all books.
  const filter = {};

  // 1. Optional `author` filter: case-insensitive partial match.
  // Check `!== undefined` FIRST to separate "omitted" from "invalid".
  // If we combined presence + validation into one `if`, bad input like `?author=`
  // would silently skip the filter and return ALL books with 200 OK instead of 400.
  if (author !== undefined) {
    // `typeof author !== 'string'` blocks HTTP Parameter Pollution arrays
    // (`?author=orwell&author=tolkien`) and NoSQL operator objects (`?author[$ne]=`).
    if (typeof author !== 'string' || !author.trim()) {
      return res.status(400).json({ error: 'author must be a non-empty string' });
    }

    // Use MongoDB's `$regex` with `$options: 'i'` for case-insensitive partial search,
    // wrapping the trimmed input in `escapeRegex()` so special characters match literally.
    filter.author = {
      $regex: escapeRegex(author.trim()),
      $options: 'i',
    };
  }

  // 2. Optional `minYear` filter: numeric range match against the schema's `year` field.
  if (minYear !== undefined) {
    // Guard against arrays/objects AND empty/whitespace strings (`?minYear=` or `?minYear=%20`).
    // Crucial JS trap: `Number("")` and `Number("   ")` both return `0`, and
    // `Number.isInteger(0)` is `true`—so we MUST check `!minYear.trim()` before `Number()`.
    if (typeof minYear !== 'string' || !minYear.trim()) {
      return res.status(400).json({ error: 'minYear must be a valid integer' });
    }

    // Parse the query string to a Number, then reject NaN ("abc"), floats ("1940.5"), or Infinity.
    const parsedYear = Number(minYear);
    if (!Number.isInteger(parsedYear)) {
      return res.status(400).json({ error: 'minYear must be a valid integer' });
    }

    // Map the query param `minYear` onto the actual Mongoose schema field `year`,
    // using MongoDB's `$gte` (greater than or equal to) range operator.
    filter.year = { $gte: parsedYear };
  }

  // 3. Optional `available` filter: strict string-to-boolean conversion.
  // Never check `typeof available === 'boolean'` (query params are strings) and
  // never use `Boolean(available)` (the string `"false"` is truthy in JavaScript!).
  if (available !== undefined) {
    if (available === 'true') {
      filter.available = true;
    } else if (available === 'false') {
      filter.available = false;
    } else {
      // Explicitly reject anything else (e.g., "maybe", "1", "", or duplicate arrays).
      return res.status(400).json({ error: 'available must be "true" or "false"' });
    }
  }

  // 4. Execute the dynamically built query against MongoDB.
  // Multiple filters automatically combine with logical AND (e.g., author AND year AND available).
  // In Express 5, any rejected Promise from Mongoose automatically forwards to your
  // 4-argument global error handler without needing a manual try/catch wrapper.
  const results = await Book.find(filter);

  res.status(200).json(results);
});

// Challenge 3: Persistent Creation & Safe Partial Updates (POST /books & PATCH /books/:id)
// Scenario: Librarians need to add new books and later update just a book's title or toggle its available status. Passing req.body directly into a database update is a classic mass-assignment vulnerability (a client could sneak in extra or protected fields), so your API must strictly control what gets written.

// Goal:
// POST /books:

// Validate title (non-empty string), author (non-empty string), and year (valid integer). Return 400 if any fail.

// Insert the new book into MongoDB and return 201 with the saved document (including its MongoDB _id).

// Challenge 3 (Part 1): Persistent Creation

app.post('/books', async (req, res) => {
  // 1. Express 5 guard + Mass-Assignment defense.
  // `req.body || {}` stops a crash if a client omits the JSON body or
  // forgets the `Content-Type: application/json` header.
  // Destructuring ONLY `title`, `author`, and `year` ensures a client cannot
  // inject extra fields (like `_id`, `createdAt`, or an admin flag) into the DB.
  const { title, author, year } = req.body || {};

  // 2. Validate required string fields directly (no `!== undefined` wrapper).
  // Because `title` and `author` are mandatory on creation, checking
  // `typeof ... !== 'string' || !....trim()` catches missing values (`undefined`),
  // wrong types (`null`, numbers, objects/arrays), and whitespace-only strings (`"   "`).
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }

  if (typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'author must be a non-empty string' });
  }

  // 3. Validate `year` as a real JSON integer.
  // Unlike `req.query` (which is always strings), JSON request bodies support
  // native numbers. Checking `typeof year !== 'number'` rejects strings like "1965",
  // booleans, or nulls; `Number.isInteger()` rejects floats (1965.5), `NaN`, and `Infinity`.
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    return res.status(400).json({ error: 'year must be a valid integer' });
  }

  // 4. Create and persist the document via Mongoose.
  // - Save raw `.trim()`med text—NEVER run `escapeRegex()` on stored data,
  //   or names like "J.R.R. Tolkien" will be saved with literal backslashes.
  // - `Book.create()` runs your Mongoose schema validators, applies defaults
  //   (`available: true`), adds `timestamps`, and returns the saved document with its `_id`.
  // - Because you are on Express 5, any rejected Promise (e.g., DB outage) is
  //   automatically forwarded to your 4-argument global error handler.
  const newBook = await Book.create({
    title: title.trim(),
    author: author.trim(),
    year,
  });

  // 5. Return `201 Created` (not `200 OK`) along with the newly saved document
  // so the client immediately gets the DB-generated `_id` and default fields.
  res.status(201).json(newBook);
});

// PATCH /books/:id:

// Validate :id as a valid ObjectId (400 if invalid).

// Build an updates object that only permits title (non-empty string) and/or available (boolean) from req.body.

// If neither field is provided, or if a provided field has the wrong type, return 400.

// Update the document in MongoDB and make sure Mongoose returns the updated document (not the old one before the update) and runs schema validators.

// If no book exists with that ID, return 404.

// Otherwise, return 200 with the updated book document.
// CHALLENGE 3 (Part 2): Safe Partial Updates
// ==========================================
app.patch('/books/:id', async (req, res) => {
  const { id } = req.params;

  // 1. Guard against malformed MongoDB ObjectIds first.
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  // 2. Express 5 guard + Mass-Assignment defense.
  // `req.body || {}` prevents crashes if no JSON body/header was sent.
  // Destructuring ONLY `title` and `available` ensures a client cannot sneak
  // protected or unexpected fields (like `_id` or `createdAt`) into the DB.
  const { title, available } = req.body || {};

  // Build an explicit allow-listed object containing ONLY validated changes.
  const updates = {};

  // 3. Validate optional `title` only if the client actually included it.
  // Checking `!== undefined` lets the client update just `available` without
  // being forced to resend `title`, while still rejecting bad values like `""` or `123`.
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    updates.title = title.trim();
  }

  // 4. Validate optional `available` strictly as a real boolean.
  // Prevents strings like `"false"` (which is truthy in JS!) from sneaking in.
  if (available !== undefined) {
    if (typeof available !== 'boolean') {
      return res.status(400).json({ error: 'available must be a boolean' });
    }
    updates.available = available;
  }

  // 5. Reject empty or irrelevant payloads (e.g., `{}` or `{ "author": "New" }`).
  // If no permitted fields made it into `updates`, stop before touching the DB.
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: 'Provide at least one valid field to update: title or available',
    });
  }

  // 6. Perform an atomic single-trip update in MongoDB.
  // - `{ $set: updates }`: modifies ONLY the keys in `updates`, leaving all other fields intact.
  // - `returnDocument: 'after'`: returns the updated document instead of the old one.
  // - `runValidators: true`: Mongoose skips schema validators on updates by default;
  //   this forces your schema rules (required, trim, types) to run on PATCH too.
  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { $set: updates },
    { returnDocument: 'after', runValidators: true }
  );

  // 7. If no document matched that ID, findByIdAndUpdate returns `null`.
  if (!updatedBook) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json(updatedBook);
});


// ==========================================
// MILESTONE 2 CHALLENGES GO HERE
// ==========================================
// Challenge 1...

// Challenge 2...

// const vipBouncer = (req,res, next)=> {
//         if(req.headers['x-vip-pass'] !== "supersecret") {
//             return res.status(403).json({error:"Access denied"})
//         }
//         next();
//     }
// app.get(
//     '/dashboard',
//     vipBouncer,(req,res)=> {
//         res.json({message: "Welcome to VIP dashboard"})}
// )

// // Challenge 4...
// app.get('/crash',(req,res)=> {
//     throw new Error("Oops!")
// })
// // Challenge 3...

app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found",
  });
});

// Challenge 4...
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

function logger(req, res, next) {
  console.log(`${req.method} and ${req.url}`);
  next();
}
// ==========================================

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log("App is listening in port: 3000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
