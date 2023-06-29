const express = require('express');
const fetch = require('node-fetch');
const Joi = require('joi');

const app = express();
const port = 3000;

// Define the user schema using Joi
const userSchema = ja.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  // Add more schema validation rules for other properties if needed
});

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/users');
    const users = await response.json();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Search and filter users
app.get('/users/search', async (req, res) => {
  const searchQuery = req.query.q;

  try {
    const response = await fetch('https://dummyjson.com/users');
    const users = await response.json();

    // Validate each user against the schema
    const filteredUsers = users.filter(user => user.username.includes(searchQuery));
    const validatedUsers = filteredUsers.filter(user => userSchema.validate(user).error === undefined);

    res.json(validatedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  try {
    const response = await fetch('https://dummyjson.com/users');
    const users = await response.json();

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = users[userIndex];
    Object.assign(user, updatedUser);
    if (userSchema.validate(user).error !== undefined) {
      res.status(400).json({ error: 'Invalid user data' });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const response = await fetch('https://dummyjson.com/users');
    let users = await response.json();

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
