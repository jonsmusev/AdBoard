import Conversation from '../models/conversation';
import Message from '../models/message';
import User from '../models/user';
import Conversation1 from '../models/conversation1'

export default class ChatController {


  //Получить список диалогов
  getConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.user._id })
      .select('_id')
      .exec((err, conversations) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        // Set up empty array to hold conversations + most recent message
        const fullConversations = [];
        conversations.forEach((conversation) => {
          Message.find({ conversationId: conversation._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
              path: 'author',
              select: 'profile.firstName profile.lastName'
            })
            .exec((err, message) => {
              if (err) {
                res.send({ error: err });
                return next(err);
              }
              fullConversations.push(message);
              if (fullConversations.length === conversations.length) {
                return res.status(200).json({ conversations: fullConversations });
              }
            });
        });
      });
  };


  // Получить диалог
  getConversation = function (req, res, next) {
    Message.find({ conversationId: req.params.conversationId })
      .select('createdAt body author')
      .sort('-createdAt')
      .populate({
        path: 'author',
        select: 'profile.firstName profile.lastName'
      })
      .exec((err, messages) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }
        return res.status(200).json({ conversation: messages });
      });
  };


  // Создать диалог
  newConversation = function (req, res, next) {
    if (!req.params.recipient) {
      res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
      return next();
    }

    if (!req.body.composedMessage) {
      res.status(422).send({ error: 'Please enter a message.' });
      return next();
    }

    const conversation = new Conversation({
      participants: [req.user._id, req.params.recipient]
    });

    conversation.save((err, newConversation) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      const message = new Message({
        conversationId: newConversation._id,
        body: req.body.composedMessage,
        author: req.user._id
      });

      message.save((err, newMessage) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        return res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
      });
    });
  };


  // Послать сообщение
  sendReply = function (req, res, next) {
    const reply = new Message({
      conversationId: req.params.conversationId,
      body: req.body.composedMessage,
      author: req.user._id
    });

    reply.save((err, sentReply) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }

      return res.status(200).json({ message: 'Reply successfully sent!' });
    });
  };

  //
  //
  // *** Тестовый блок ***
  //
  //

  // Тестовое сообщение, отправка
  sendTestMessage = function (req, res, next) {
    const reply = new Message({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      isRead: 'true',
      timestamp: req.body.timestamp,
      messageContent: req.body.messageContent,
    });

    reply.save((err, sentReply) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }



      /*Conversation1.findOneAndUpdate(
        {targetId : "5bb38b927dc3870287fed262"},
        {$set: {lastMessage:
              {messageContent: 'записано в базу с сервера',
                senderId: 'user',
                timestamp: '1542499004524'}
        }},
        function (err, doc) {
          if (err) {
            res.send({ error: err });
            return next(err);
          }
        }
        );*/

      console.log("попытка записать в бд сообщение: " + reply);
      //console.log("попытка записать в диалог: " + req.body.conversationId);
      return res.status(200).json({ message: 'Reply successfully sent!' });
    });


    Conversation1.findOneAndUpdate(
    {
      hostId : req.body.senderId,
      targetId : req.body.receiverId,
     },
     {
       hostId : req.body.senderId,
       targetId : req.body.receiverId,
       lastMessage: reply,
       unreadCount: 0,
     },
     {
       upsert: true
     },
      function (err, conversation) {
        if (err) {res.send({ error: err }); return next(err);}
        /*
        conversation.lastMessage = reply;
        conversation.save(function (err, doc) {
          if (err) {
            res.send({ error: err });
            return next(err);
          }
        });
        */
        //console.log('В БД записан диалог ' + conversation);
      });

    Conversation1.findOneAndUpdate(
      {
        targetId : req.body.senderId,
        hostId : req.body.receiverId
      },
      {
        hostId : req.body.receiverId,
        targetId : req.body.senderId,
        lastMessage: reply,
        $inc: {
          unreadCount: 1,
        }
      },
      {
        upsert: true
      },
      function (err, conversation) {
        if (err) {res.send({ error: err }); return next(err);}
        /*
        conversation.lastMessage = reply;
        conversation.save(function (err, doc) {
          if (err) {
            res.send({ error: err });
            return next(err);
          }
        });
        */
        //console.log('В БД записан зеркальный диалог ' + conversation);
      });

  };

  // Тестовый диалог, получение
  getTestConversation = function (req, res, next) {
    Message.find({ conversationId: req.params.conversationId })
      .select('timestamp messageContent senderId')
      .sort('-timestamp')
      .populate({
        path: 'author',
        select: 'profile.firstName profile.lastName'
      })
      .exec((err, messages) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }
        console.log(messages);
        return res.status(200).json({ conversation: messages });
      });
  };

  getTestNewConversation = function (req, res,next) {
    Conversation.find({ participants: { "$all": [req.query.userId1, req.query.userId2]} })
      .exec ((err, conversation) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }
        //Проверка существует ли диалог
        if (conversation != "") {
          Message.find({ conversationId: conversation[0]._id })
            .select('timestamp messageContent senderId conversationId')
            .sort('-timestamp')
            .exec((err, messages) => {
              if (err) {
                console.log({error: err});
                return (err);
              }
              console.log('getMessages returned ' + messages);
              return res.status(200).json({conversation: messages, conversationId: conversation[0]._id });
            })
        }else {
          console.log('Диалог не существует');
          const conversation = new Conversation({
            participants: [req.query.userId1, req.query.userId2]
          });

          conversation.save((err, newConversation) => {
            if (err) {
              res.send({error: err});
              return next(err);
            }
            console.log('Диалог создан' + newConversation);
            return res.status(200).json({conversationId: newConversation._id});
          })
        }
      })
  }

  getTestConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.query.userId })
//      .select('participants')
      .populate('user')
      .exec((err, conversations) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        // Set up empty array to hold conversations + most recent message
        console.log(conversations);
        const fullConversations = [];
        conversations.forEach((conversation, i=0) => {
          let sender = {};
          conversation.participants.forEach((participant) => {
            if (participant != req.query.userId && participant !== undefined) {
              sender = ( participant );
              console.log ('username changed to' + sender);
            }
          });
          Message.find({ conversationId: conversation._id })
            .sort('-timestamp')
            .limit(1)
            .populate({
              path: 'user',
              select: 'username'
            })
            .exec((err, message) => {
              if (err) {
                res.send({ error: err });
                return next(err);
              }
              if (message.length != 0) {
                message[0].senderId = sender;
                console.log(message[0]);
                fullConversations.push(message[0]);
              }
              i++;
              if (i === conversations.length) {
                return res.status(200).json({ conversations: fullConversations });
              }
            });
        });
      });
  };

  async getMessages(hostId, targetId) {
    console.log('ChatController.getMessages received ' + targetId);
    //return ['хуй'];

    return await Message.find({ $or: [ {senderId: targetId, receiverId: hostId}, {senderId: hostId, receiverId: targetId}]})
      .select('timestamp messageContent senderId')
      .sort('timestamp')
      .exec((err, messages) => {
        if (err) {
          console.log({error: err});
          return (err);
        }
        //console.log('getMessages returned ' + messages);
        //return ['хуй'];
      });

  }

}

