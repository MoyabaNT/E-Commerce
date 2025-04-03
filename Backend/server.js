const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { auth, db } = require('./firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc } = require('firebase/firestore');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Basic input validation
const validateAuthData = (email, password) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new Error('Invalid or missing email');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
};

// Existing signup endpoint (unchanged)
app.post('/api/signup', async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    validateSignupData(name, surname, email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      name: name.trim(),
      surname: surname.trim(),
      email,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: user.uid,
      email: user.email,
      name: name.trim(),
      surname: surname.trim()
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: error.code || 'unknown_error'
    });
  }
});

// New login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    validateAuthData(email, password);

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Success response
    res.status(200).json({
      message: 'Login successful',
      uid: user.uid,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      error: error.message,
      code: error.code || 'unknown_error'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});