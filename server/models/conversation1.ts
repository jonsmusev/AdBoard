import * as mongoose from 'mongoose';
import User from '../models/user';

const conversationSchema = new mongoose.Schema({

  hostId: String,
  targetId: String,

  lastMessage: {},
  unreadCount: Number,

  conversationSettings:{},

});

const Conversation1 = mongoose.model('Conversation1', conversationSchema);

export default Conversation1;
