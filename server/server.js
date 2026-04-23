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
  id: { type: String, default: function() { return Math.random().toString(36).substr(2, 9); } }
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

// Middleware for auth
const authMiddleware = function(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/register', async function(req, res) {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ id: user.id, email: user.email, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'User exists or invalid data' });
  }
});

app.post('/api/auth/login', async function(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ id: user.id, email: user.email, token });
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
});

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

app.get('/api/workouts/:id', async function(req, res) {
  const workout = await Workout.findById(req.params.id);
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  const workoutObj = workout.toObject();
  workoutObj.id = workoutObj._id.toString();
  delete workoutObj._id;
  delete workoutObj.__v;
  res.json(workoutObj);
});

app.post('/api/workouts', authMiddleware, async function(req, res) {
  try {
    const workout = new Workout({ ...req.body, ownerId: req.user.id });
await workout.save();
    const workoutObj = workout.toObject();
    workoutObj.id = workoutObj._id.toString();
    delete workoutObj._id;
    delete workoutObj.__v;
    res.status(201).json(workoutObj);
    console.log('Created workout response:', workoutObj);
  } catch (err) {
    res.status(400).json({ error: 'Create failed' });
  }
});

app.patch('/api/workouts/:id', authMiddleware, async function(req, res) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout || workout.ownerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
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

app.delete('/api/workouts/:id', authMiddleware, async function(req, res) {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout || workout.ownerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    await Workout.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`);
});
