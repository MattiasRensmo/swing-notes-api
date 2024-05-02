const db = require('../db/database')
const bcrypt = require('bcryptjs')

exports.createUser = async (username, password) => {
  const existingUser = await db.find({ username })
  if (existingUser.length > 0) throw new Error('User already exists!')

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    type: 'user',
    username: username,
    password: hashedPassword,
  }

  return db.insert(user)
}

exports.findUser = async (username) => {
  return await db.findOne({ username })
}
