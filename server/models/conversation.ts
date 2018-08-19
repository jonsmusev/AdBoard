import * as mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: []
 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
