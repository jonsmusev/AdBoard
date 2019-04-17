import Conversation from '../models/conversation';
import Conversation1 from '../models/conversation1';
import Message from '../models/message';
import User from '../models/user';
import UserController from "./user";
export default class ImController {

  //получение списка диалогов
  getConversationsList = function (req, res, next) {

    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.query.userId })
    //      .select('participants')
      .populate('senderId')
      .exec((err, conversations) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        // Set up empty array to hold conversations + most recent message
        console.log("Ищем все разговоры с пользователем " + req.query.userId);
        console.log("найдены следующие разговоры: " + conversations);
        const fullConversations = [];
        conversations.forEach((conversation, i=0) => {
          let sender = {};
          let displayName = {};
          conversation.participants.forEach((participant) => {
            if (participant != req.query.userId && participant !== undefined) {
              sender = ( participant );
              console.log ('username changed to ' + sender);
              User.findById( sender )
                .exec((err, user) => {
                  if (err) {
                    res.send({ error: err });
                    return next(err);
                  }
                  console.log ('User find: ' + sender);
                  console.log ('finded: ' + user);
                  console.log ('displayName changed to ' + user.username);
                  displayName = user.username;
                });
            }
          });
          Message.find({ conversationId: conversation._id })
            .sort('-timestamp')
            .limit(1)
            /*.populate({
              //path: 'senderId',
              //model: 'User',
              //select: 'username'
            })*/
            .exec((err, message) => {
              if (err) {
                res.send({ error: err });
                return next(err);
              }
              if (message.length != 0) {
                message[0].senderId = displayName;
                console.log("last message: " + message[0]);
                fullConversations.push(message[0]);
              }
              i++;
              if (i === conversations.length) {
                console.log("Список диалогов: " + fullConversations);
                return res.status(200).json({ conversations: fullConversations });
              }
            });
        });
      });
  };

  //получение списка диалогов 2.0
  getConversationsListNew = function (req, res, next) {

    // Only return one message from each conversation to display as snippet
    Conversation1.find({ hostId: req.query.userId })
    //      .select('participants')
      .populate('senderId')
      .exec((err, conversations) => {
        if (err) {
          res.send({ error: err });
          return next(err);
        }

        // Set up empty array to hold conversations + most recent message
        //console.log("Ищем все разговоры пользователя " + req.query.userId);
        //console.log("найдены следующие разговоры: " + conversations);
        return res.status(200).json({ conversations: conversations });
      });
  };

  //получение сообщений или создание пустого диалога
  getConversationNew = function (req, res,next) {
    Conversation1.find({ hostId : req.query.userId1, targetId : req.query.userId2 })
      .exec (async (err, conversation) => {
        if (err) {
          res.send({error: err});
          return next(err);
        }
        //Проверка существует ли диалог
        if (conversation != "") {
          Message.find({conversationId: conversation[0]._id})
            .select('timestamp messageContent senderId conversationId')
            .sort('-timestamp')
            .exec((err, messages) => {
              if (err) {
                console.log({error: err});
                return (err);
              }
              console.log('getMessages returned ' + messages);
              return res.status(200).json({conversation: messages, conversationId: conversation[0]._id});
            })
        } else {

          const conversation = new Conversation1({
            participants: [req.query.userId1, req.query.userId2],
            hostId: req.query.userId1,
            targetId: req.query.userId2,
            targetName: await usernameByID(req.query.userId2),
            lastMessage: {messageContent: "Нет сообщений"}
          });

          conversation.save((err, newConversation) => {
            if (err) {
              res.send({error: err});
              return next(err);
            }
            console.log('Диалог создан' + newConversation);
          })

        }
      })
  }

  getMessagesList = async function (req, res, next) {
    await Message.find({ conversationId: req.params.conversationId })
      .select('senderName timestamp messageContent senderId')
      .sort('timestamp')
      .populate({
        path: 'author',
        select: 'profile.firstName profile.lastName'
      })
      .exec(async (err, messages) => {
        if (err) {
          res.send({error: err});
          return next(err);
        }
        console.log('функция вернула: ' + await usernameByID('5bb389347dc3870287fed25f'));

        return res.status(200).json({conversation: messages});
      });
  };

  sendMessage = function (req, res, next) {};

  usernameByUserId = function (req, res, next) {
    User.find({ id: req})
    console.log(res);
  }

}

async function usernameByID (id) {
  console.log('в функцию передано: ' + id);

  let username = { _id: 'песдец' };

  await User.findOne({ _id : id })
    .select('username')
    .exec((err, user) => {
      if (err) {
        return (err);
      }
      console.log('по запросу ' + id +'из базы данных пришло: ' + user);

      username = user.username;
    });

  //console.log('перед вовзватом из функции username = ' + username ) ;
  return username ;

}
