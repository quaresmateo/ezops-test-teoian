const express = require('express')
const dotenv = require('dotenv').config()
const Message = require('./models/Message')
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
  .catch(error => console.log(error))

/* Endpoints */
app.get('/messages', (request, response) => {
  Message.find()
    .then(messages => {
      console.log(messages)
      response.send(messages)
    })
    .catch(error => console.log(error))
})

app.post('/messages', (request, response) => {
  const message = new Message(request.body)
  console.log('body', request.body)
  message
    .save()
    .then(result => console.log('Message created', result))
    .catch(error => console.log(error))
})

/* Server */
const server = app.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})

app.use(express.static(__dirname + resources))
