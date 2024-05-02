const jwt = require('jsonwebtoken')
const { createUser, findUser } = require('../models/user-models')
require('dotenv').config()
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
  const { username, password } = req.body
  try {
    await createUser(username, password)
    res.status(200).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await findUser(username)
  if (!user) return res.status(404).json({ message: 'User not found' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).send({ error: 'Invalid credentials' })
  }

  jwt.sign({ username }, process.env.JWT_SECRET, (err, token) => {
    if (err) return res.status(500).json({ message: 'Internal server error' })
    res.status(200).json({ jwt: token })
  })
}
