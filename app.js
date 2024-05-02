const express = require('express')
const app = express()
const cors = require('cors')
// const jwt = require('jsonwebtoken')

// require('dotenv').config()

const user = require('./routes/user-routes')
const notes = require('./routes/notes-routes')

const PORT = process.env.PORT || 3000

// Använder CORS för att kunna testa med Swagger
app.use(cors())
app.use(express.json())

app.use('/api/user', user)
app.use('/api/notes', notes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
