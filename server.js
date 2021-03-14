const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const resources = '/resources'
const { DB_USER, DB_PASS, DB_LINK, DB_DATABASE } = process.env

/* Database connection */
const dbUrl = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_LINK}/${DB_DATABASE}?retryWrites=true&w=majority`
mongoose
  .connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => console.log('mongodb connected'))

/* Models */
const message = new mongoose.Schema({ name: String, message: String })
const Message = mongoose.model('Message', message)

/* Endpoints */
app.get('/messages', (request, response) => {
  Message.find({}, (error, messages) => {
    response.send(messages)
  })
})

app.post('/messages', (request, response) => {
  const message = new Message(request.body)
  message.save(error => {
    if (error) {
      response.sendStatus(500)
    } else {
      response.sendStatus(200)
    }
  })
})

/* Server */
const server = app.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})

app.use(express.static(__dirname + resources))
