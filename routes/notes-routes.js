const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()

const {
  getNotes,
  createNote,
  editNote,
  deleteNote,
  searchNotes,
} = require('../controller/notes-controller')

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  if (!token) return res.sendStatus(401)
  token = token.slice(7)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403)
    req.user = decoded
    next()
  })
}

const verifyNote = (req, res, next) => {
  const body = req.body
  if (!body.hasOwnProperty('title') || !req.body.hasOwnProperty('text'))
    return res.status(400).json({ error: 'Ange både "title" och "text".' })
  if (body.title.length > 50)
    return res.status(400).json({ error: 'Titel är för lång' })
  if (body.text.length > 300)
    return res.status(400).json({ error: 'Texten är för lång' })
  next()
}

//BaseURL '/api/notes'
router.get('/', verifyToken, getNotes)
router.post('/', verifyToken, verifyNote, createNote)
router.put('/:id', verifyToken, verifyNote, editNote)
router.delete('/:id', verifyToken, deleteNote)
router.get('/search/:searchString', verifyToken, searchNotes)

module.exports = router
