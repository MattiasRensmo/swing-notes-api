const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = process.env.PORT || 3000
require('dotenv').config()

const user = require('./routes/user-routes')
const notes = require('./routes/notes-routes')

/* 
! TODO 
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
let notesDb = []

//TODO Ta bort denna när allt är klart
//TEST
app.get('/', (req, res) => {
  console.log(process.env.JWT_SECRET)
  res.send('Svar')
})

// USERS
app.use('/api/user', user)

//NOTES
app.use('/api/notes', notes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
