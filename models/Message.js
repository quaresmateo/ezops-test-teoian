const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema(
  { name: String, message: String },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
