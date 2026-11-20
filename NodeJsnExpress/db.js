const mongoose = require('mongoose');

// Swap with your MongoDB Atlas URI if you aren't running MongoDB locally
const MONGO_URI = 'mongodb://127.0.0.1:27017/library_db';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    available: { type: Boolean, default: true },
},
{ timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Seed initial records only if the collection is empty
  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany([
      { title: '1984', author: 'George Orwell', year: 1949, available: true },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, available: true },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', year: 2011, available: false },
    ]);
    console.log('Seeded initial books');
  }
}

module.exports = { connectDB, Book, User };