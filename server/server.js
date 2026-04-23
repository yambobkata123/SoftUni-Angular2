const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  customId: {                                          // ✅ renamed from "id" to avoid Mongoose _id clash
    type: String,
    default: function() { return Math.random().toString(36).substr(2, 9); }
  }
});
const User = mongoose.model('User', userSchema);

const workoutSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: Number,
  difficulty: String,
  ownerId: String,
  createdAt: { type: Date, default: Date.now }
});
const Workout = mongoose.model('Workout', workoutSchema);

// Auth Middleware
const authMiddleware = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('=== DECODED JWT ===', decoded); // виж какво има
    
    // ✅ поддържа и стари токени ({ id }) и нови ({ customId })
    req.user = { id: decoded.customId || decoded.id };
    
    console.log('req.user.id:', req.user.id);
    
    next();
  } catch (err) {
    console.error('JWT ERROR:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/api/auth/register', async function(req, res) {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    console.log('Registered user customId:', user.customId); // ✅ debug

    const token = jwt.sign(
      { customId: user.customId },                    // ✅ sign with customId
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ id: user.customId, email: user.email, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'User exists or invalid data' });
  }
});

// Login
app.post('/api/auth/login', async function(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('Logged in user customId:', user.customId); // ✅ debug

    const token = jwt.sign(
      { customId: user.customId },                    // ✅ sign with customId
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ id: user.customId, email: user.email, token });
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Get all workouts
app.get('/api/workouts', async function(req, res) {
  const workouts = await Workout.find();
  const workoutsWithId = workouts.map(w => {
    const workoutObj = w.toObject();
    workoutObj.id = workoutObj._id.toString();
    delete workoutObj._id;
    delete workoutObj.__v;
    return workoutObj;
  });
  res.json(workoutsWithId);
});

// Get workout by id
app.get('/api/workouts/:id', async function(req, res) {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  const workoutObj = workout.toObject();
  workoutObj.id = workoutObj._id.toString();
  delete workoutObj._id;
  delete workoutObj.__v;
  res.json(workoutObj);
});

// Create workout
app.post('/api/workouts', authMiddleware, async function(req, res) {
  try {
    console.log('Creating workout with ownerId:', req.user.id); // ✅ debug

    const workout = new Workout({ ...req.body, ownerId: req.user.id });
    await workout.save();
    const workoutObj = workout.toObject();
    workoutObj.id = workoutObj._id.toString();
    delete workoutObj._id;
    delete workoutObj.__v;
    res.status(201).json(workoutObj);
  } catch (err) {
    res.status(400).json({ error: 'Create failed' });
  }
});

// Update workout
app.patch('/api/workouts/:id', authMiddleware, async function(req, res) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Not found' });
    if (workout.ownerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(workout, req.body);
    await workout.save();
    const workoutObj = workout.toObject();
    workoutObj.id = workoutObj._id.toString();
    delete workoutObj._id;
    delete workoutObj.__v;
    res.json(workoutObj);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete workout
app.delete('/api/workouts/:id', authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ error: 'Not found' });
    }

    console.log('workout.ownerId:', workout.ownerId); // ✅ debug
    console.log('req.user.id    :', req.user.id);     // ✅ debug

    if (workout.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Workout.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});