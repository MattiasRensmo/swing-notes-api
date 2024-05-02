const db = require('../db/database')

exports.getAllNotes = async (uname) => {
  return await db.find({ type: 'note', createdBy: uname })
}

exports.createNote = async (noteContent) => {
  const createdAt = (modifiedAt = new Date())
  const note = { ...noteContent, type: 'note', createdAt, modifiedAt }
  return await db.insert(note)
}

exports.findUsersNoteById = async (id, uname) => {
  return await db.findOne({ _id: id, createdBy: uname })
}

exports.updateNote = async (id, { text, title }) => {
  modifiedAt = new Date()
  const updated = await db.update(
    { _id: id },
    { $set: { title, text, modifiedAt } },
    { returnUpdatedDocs: true }
  )
  return updated[1] //Vi vill bara returnera det nya objektet, som är andra värde i array
}

exports.deleteNote = async (id, uname) => {
  const removed = await db.remove({ _id: id, createdBy: uname })
  return removed
}

exports.findNoteByTitle = async (query, uname) => {
  //Make it a regex obj so 'app' == apple
  const subString = new RegExp(query, 'i')
  const found = db.find({ title: subString, createdBy: uname })
  return found
}
