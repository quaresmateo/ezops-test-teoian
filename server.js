const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
const resources = '/resources'

const dbUrl = process.env.DATABASE_URL

dotenv.config()

const server = app.listen(3000, () => {
  console.log('server is running on port', server.address().port)
})

app.use(express.static(__dirname + resources))
