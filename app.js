const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 3000

/* 
! TODO 
* - .env-fil för "secretKey"
* - Dela isär koden till en route för users och en för notes
* - Dela upp koden till en MVC-struktur
* - Koppla ihop med databasen
? - Ordna centraliserad felhantering
? - Ordna centraliserad datavalidering
*/

// ! Använder CORS bara för att kunna testa med Swagger
app.use(cors())
app.use(express.json())

// TODO DB för users (vi använder samma till allt? )
const users = [
  { id: 1, username: 'mattias', password: 'losen' },
  { id: 2, username: 'user', password: 'password' },
]

// TODO DB för att spara alla notes
let notes = []

// Middleware för att verifiera JWT
// TODO Fixa .env-fil för att hantera "secretKey"
const verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  console.log(token)
  if (!token) return res.sendStatus(401)

  token = token.slice(7)

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) return res.sendStatus(403)
    req.user = decoded
    next()
  })
}

//TODO Ta bort denna när allt är klart
//TEST
app.get('/', (req, res) => {
  console.log(req)
  res.send('Svar')
})

// USERS
app.post('/api/user/signup', (req, res) => {
  const { username, password } = req.body
  // TODO Verifiera datan
  // TODO Koppla upp mot databasen
  const newUser = { id: users.length + 1, username, password }
  users.push(newUser)
  //TODO Borde vi svara med en färsk JWT direkt
  // - störigt att behöva logga in precis när man skapat sitt konto
  res.status(200).json({ message: 'User created successfully' })
})

app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body
  // TODO Detta måste vi göra på riktig med databasen
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) return res.status(400).json({ message: 'Invalid credentials' })
  // TODO använd .env nedan
  jwt.sign({ username }, 'secretKey', (err, token) => {
    if (err) return res.status(500).json({ message: 'Internal server error' })
    res.status(200).json({ jwt: token })
  })
})

//NOTES
app.get('/api/notes', verifyToken, (req, res) => {
  // TODO Koppla ihop med databasen
  res.status(200).json(notes)
})

app.post('/api/notes', verifyToken, (req, res) => {
  const newNote = req.body
  // TODO Koppla ihop med databasen
  // Låt databasen skapa edited o created-tider och ID
  newNote.id = notes.length + 1
  notes.push(newNote)
  res.status(200).json(newNote)
})

app.put('/api/notes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id)
  const updatedNote = req.body

  // TODO Verifiera datan
  // TODO Koppla ihop med databasen

  const index = notes.findIndex((note) => note.id === id)
  if (index === -1) return res.status(404).json({ message: 'Note not found' })
  notes[index] = updatedNote
  res.status(200).json(updatedNote)
})

app.delete('/api/notes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id)

  // TODO Koppla ihop med databasen
  const index = notes.findIndex((note) => note.id === id)
  if (index === -1) return res.status(404).json({ message: 'Note not found' })
  notes.splice(index, 1)
  res.status(200).json({ message: 'Note deleted successfully' })
})

app.get('/api/notes/search/:searchString', verifyToken, (req, res) => {
  const searchString = req.params.searchString

  // TODO Koppla ihop med databasen och skapa en sökfunktion
  const filteredNotes = notes.filter((note) =>
    note.title.includes(searchString)
  )
  res.status(200).json(filteredNotes)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
