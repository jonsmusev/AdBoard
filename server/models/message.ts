import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({

  senderId: String,
  receiverId: String,

  isRead: Boolean,

  timestamp: Date,
  messageContent: String,
  mediaContent: {},

});

const Message = mongoose.model('Message', messageSchema);

export default Message;
