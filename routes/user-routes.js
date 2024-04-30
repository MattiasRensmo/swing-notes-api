const express = require('express')
const router = express.Router()

//BaseURL '/api/user'
router.post('/signup', (req, res) => {
  const { username, password } = req.body
  // TODO Verifiera datan
  // TODO Koppla upp mot databasen
  const newUser = { id: users.length + 1, username, password }
  users.push(newUser)
  //TODO Borde vi svara med en färsk JWT direkt
  // - störigt att behöva logga in precis när man skapat sitt konto
  res.status(200).json({ message: 'User created successfully' })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  // TODO Detta måste vi göra på riktig med databasen
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  jwt.sign({ username }, process.env.JWT_SECRET, (err, token) => {
    if (err) return res.status(500).json({ message: 'Internal server error' })
    res.status(200).json({ jwt: token })
  })
})

module.exports = router
