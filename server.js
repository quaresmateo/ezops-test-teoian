const express = require('express')
const dotenv = require('dotenv').config()
const Message = require('./models/Message')
const mongoose = require('mongoose')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
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
      response.send(messages)
    })
    .catch(error => console.log(error))
})

app.post('/messages', (request, response) => {
  const message = new Message(request.body)
  message
    .save()
    .then(result => {
      io.emit('message', request.body)
      if (checkString(request)) {
        setTimeout(() => {
          io.emit('message', {
            name: 'Bot',
            message: 'Olá!\nSeja bem-vindo a nossa plataforma!',
          })
        }, 1000)
      }

      console.log('Message created')
    })
    .catch(error => console.log(error))
})

/* Socket IO */
io.on('connection', client => {
  console.log('new connection', client.id)
})

app.use(express.static(__dirname + resources))

/* Server */
const server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})

function checkString(request) {
  const words = request.body.message.split(' ')
  return (
    words.includes('oi') ||
    words.includes('ola') ||
    words.includes('hi') ||
    words.includes('hello') ||
    words.includes('hey')
  )
}
