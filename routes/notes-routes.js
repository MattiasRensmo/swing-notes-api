const express = require('express')
const router = express.Router()

// Middleware för att verifiera JWT
const verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  console.log(token)
  if (!token) return res.sendStatus(401)
  token = token.slice(7)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    req.user = decoded
    next()
  })
}

//BaseURL '/api/notes'

router.get('/api/notes', verifyToken, (req, res) => {
  // TODO Koppla ihop med databasen
  res.status(200).json(notesDb)
})

router.post('/api/notes', verifyToken, (req, res) => {
  const newNote = req.body
  // TODO Koppla ihop med databasen
  // Låt databasen skapa edited o created-tider och ID
  newNote.id = notesDb.length + 1
  notesDb.push(newNote)
  res.status(200).json(newNote)
})

router.put('/api/notes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id)
  const updatedNote = req.body

  // TODO Verifiera datan
  // TODO Koppla ihop med databasen

  const index = notesDb.findIndex((note) => note.id === id)
  if (index === -1) return res.status(404).json({ message: 'Note not found' })
  notesDb[index] = updatedNote
  res.status(200).json(updatedNote)
})

router.delete('/api/notes/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id)

  // TODO Koppla ihop med databasen
  const index = notesDb.findIndex((note) => note.id === id)
  if (index === -1) return res.status(404).json({ message: 'Note not found' })
  notesDb.splice(index, 1)
  res.status(200).json({ message: 'Note deleted successfully' })
})

router.get('/api/notes/search/:searchString', verifyToken, (req, res) => {
  const searchString = req.params.searchString

  // TODO Koppla ihop med databasen och skapa en sökfunktion
  const filteredNotes = notesDb.filter((note) =>
    note.title.includes(searchString)
  )
  res.status(200).json(filteredNotes)
})

module.exports = router
