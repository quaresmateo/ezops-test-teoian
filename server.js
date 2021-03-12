const express = require('express')

const app = express()

const resources = '/resources'

const server = app.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})

app.use(express.static(__dirname + resources))
