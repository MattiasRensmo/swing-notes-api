const {
  getAllNotes,
  createNote,
  updateNote,
  findUsersNoteById,
  deleteNote,
  findNoteByTitle,
} = require('../models/notes-models')

exports.getNotes = async (req, res) => {
  try {
    const notes = await getAllNotes(req.user.username)
    res.status(200).json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

exports.createNote = async (req, res) => {
  try {
    const newNote = { ...req.body, createdBy: req.user.username }
    const createdNote = await createNote(newNote)

    res.status(200).json(createdNote)
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte spara lappen' })
  }
}

exports.editNote = async (req, res) => {
  const id = req.params.id
  const idExists = await findUsersNoteById(id, req.user.username)
  if (!idExists) return res.status(404).json({ error: 'Ogiltigt id' })

  try {
    const { title, text } = req.body
    const editedNote = await updateNote(id, { title, text })

    return res.status(200).json(editedNote)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Kunde inte spara ändring' })
  }
}

exports.deleteNote = async (req, res) => {
  const id = req.params.id
  try {
    const removed = await deleteNote(id, req.user.username)
    if (removed === 0)
      return res.status(404).json({ error: 'Hittade inget att radera' })
    return res.status(200).json({ message: `Raderade ${removed} inlägg` })
  } catch (error) {}
  return res.status(500).json({ error: 'Kunde inte radera' })
}

exports.searchNotes = async (req, res) => {
  try {
    const query = req.params.searchString
    const found = await findNoteByTitle(query, req.user.username)
    //Om vi inte hittar något får användaren en tom
    //array tillbaka. Bättre än ett felmeddelande.
    return res.status(200).json(found)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Hittade inget' })
  }
}
