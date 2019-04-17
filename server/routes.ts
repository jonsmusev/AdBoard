import * as express from 'express';

import ClassifiedController from './controllers/classified';
import UserController from './controllers/user';
import FilesController from './controllers/files';
import ChatController from './controllers/chat';
import ImController from './controllers/im';


import Classified from './models/classified';
import User from './models/user';
import Conversation from './models/conversation';
import Message from './models/message';



export default function setRoutes(app) {

  const classifiedController = new ClassifiedController();
  const userController = new UserController();
  const filesController = new FilesController();
  const chatController = new ChatController();
  const imController = new ImController();



  // Classifieds
  app.route('/api/classifieds').get(classifiedController.getAll);
  app.route('/api/classifieds/count').get(classifiedController.count);
  app.route('/api/classified').post(classifiedController.insert);
  app.route('/api/classified/:id').get(classifiedController.get);
  app.route('/api/classified/:id').put(classifiedController.update);
  app.route('/api/classified/:id').delete(classifiedController.delete);
  app.route('/api/classifieds/filter/:filter').get(classifiedController.filter);
  app.route('/api/classifieds/:search').get(classifiedController.search);


  // Users
  app.route('/api/login').post(userController.login);
  app.route('/api/users').get(userController.getAll);
  app.route('/api/users/count').get(userController.count);
  app.route('/api/user').post(userController.insert);
  app.route('/api/user/:id').get(userController.get);
  app.route('/api/user/:id').put(userController.update);
  app.route('/api/user/:id').delete(userController.delete);


  // Chat
  app.route('/api/im').get(chatController.getTestConversations);
  app.route('/api/im/new').get(imController.getConversationNew); //было (chatController.getTestNewConversation);
  //app.route('/api/im/:conversationId').get(chatController.getConversation);
  app.route('/api/im/:conversationId').post(chatController.sendReply);
  app.route('/api/im').post(chatController.sendTestMessage);
  app.route('/api/im/:conversationId').get(chatController.getTestConversation);
  app.route('/api/im/:recipient').post(chatController.newConversation);

  //New IM module
  app.route('/api/im2').get(imController.getConversationsListNew);
  app.route('/api/im2').post(imController.sendMessage);
  app.route('/api/im2/:conversationId').get(imController.getMessagesList);


  //Images
//  app.route('/api/files').post(filesController.upload);

}


