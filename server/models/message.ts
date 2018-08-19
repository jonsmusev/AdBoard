import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: String,
  messageId: String,
  timestamp: Date,
  isRead: Boolean,
  messageContent: String,
  senderId: String,
  receiverId: String
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
