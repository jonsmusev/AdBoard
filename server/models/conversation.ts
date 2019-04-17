import * as mongoose from 'mongoose';
import User from '../models/user';

const conversationSchema = new mongoose.Schema({
  participants: [{
    ref: 'User',
    type: String
  }]
 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
