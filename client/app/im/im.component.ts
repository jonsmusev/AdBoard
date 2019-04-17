import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { WebsocketService} from "../services/websocket.service";


@Component({
  selector: 'app-im',
  templateUrl: './im.component.html',
  styleUrls: ['./im.component.css']
})
export class ImComponent implements OnInit, OnChanges {

  ioConnection: any;
  users = [];
  messages= [];
  conversations = [];
  conversation = {};
  user = {};
  conversationId = {};
  isLoading = true;
  hideConversations = false;
  sendMessageForm: FormGroup;
  messageContent = new FormControl();
  currentDialogIndex : number ;

  constructor(
    private websocketService: WebsocketService,
    private chat: ChatService,
    private auth: AuthService,
    private userService: UserService,
    public toast: ToastComponent,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.sendMessageForm = this.formBuilder.group({
      conversationId: this.conversationId,
      messageContent: this.messageContent,
      senderId: this.auth.currentUser._id,
      senderName: String,
      timestamp: Date.now()
    });
    this.getConversations(this.auth.currentUser._id);
    this.chat.messages.subscribe(msg => {
      console.log(msg);
    });
    this.initIoConnection();
    this.websocketService.sendAuth(this.auth.currentUser._id);
  }

  ngOnChanges() {}

  // chat module
  dialogSelect(e, i) {
    switch (e) {
      case 1 : {
        this.messages = [{messageContent: 'Мама мыла раму', senderId: 'ava0', timestamp: '1342499004524'} ,
          {messageContent: 'Рама мыла маму', senderId: 'ava0', timestamp: '1352499004524'} ,
          {messageContent: 'Вася пила рому', senderId: 'ava0', timestamp: '1352499004564'}];
        break ;
      }
      case 2 : {
        this.messages = [{messageContent: 'ола мыла олег', senderId: 'ava0', timestamp: '1422499004524'} ,
          {messageContent: 'порт орел маму', senderId: 'ava0', timestamp: '1432499004524'} ,
          {messageContent: 'Вася игорь денис', senderId: 'ava0', timestamp: '1442499004524'}];
        break ;
      }
      default :{
        this.conversationId = e;
        this.currentDialogIndex = i;
        this.getMessages(e);
      }
    }
  }

  sendMessage() {
    this.sendMessageForm.value.senderId = this.auth.currentUser._id;
    this.sendMessageForm.value.receiverId = this.conversationId;
    this.sendMessageForm.value.timestamp = Date.now();
    this.userService.sendMessage(this.sendMessageForm.value).subscribe(
      res => {
        console.log(this.sendMessageForm.value.conversationId);
        this.toast.setMessage('item sent successfully.', 'success');
      },
      error => console.log(error)
    );
    this.chat.sendMsg(this.sendMessageForm.value);
    this.messages.push(this.sendMessageForm.value);
    this.conversations[this.currentDialogIndex].lastMessage = this.sendMessageForm.value;
  }


  getMessages(dialogId) {
    this.chat.getDialog(dialogId);
    /*
    this.userService.getMessages(dialogId).subscribe(
      data =>  {
        this.messages = data.conversation;
      },
      error => console.log(error)
    );
    */
  }

  addMessages(){}

  getConversations(userId) {
    this.userService.getConversations(userId).subscribe(
      data =>  {
        console.log(userId);
        this.conversations = data.conversations;
        console.log(this.conversations);

      },
      error => console.log(error)
    );
  }

  //new conversation block

  newConversationSearch() {
    this.hideConversations = true;
    this.users = [];
    /*
    this.classifiedService.searchClassifieds(this.searchClassifiedsForm.value).subscribe(
    data => this.classifieds = data
    );
    console.log(this.searchClassifiedsForm.value);
    */
  }

  newConversationButton() {
    this.hideConversations = true;
    this.userService.getUsers().subscribe(
      data => this.users = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  newConversationCancel(){
    this.hideConversations = false;
  }

  newConversationStart(userId){
    this.userService.newConversationStart(this.auth.currentUser._id, userId).subscribe(
      data =>  {
        this.messages = data.conversation;
        this.conversationId = data.conversationId;
      },
      error => console.log(error)
    );
  }


  private initIoConnection(): void {
    this.websocketService.initSocket();

    this.ioConnection = this.websocketService.onMessage()
      .subscribe((message: any) => {
        if (this.conversationId == message.senderId)
        {
         this.messages.push(message);
        }

        if (this.conversations.some(conv => conv.targetId == message.senderId)) {
          for (let i = 0; i < this.conversations.length; i++) {
            if (this.conversations[i].targetId == message.senderId) {
              this.conversations[i].lastMessage = message;
              break;
            }
          }
        } else {} //todo добавить отрисовку нового диалога

        console.log('Диалог существует: ' + this.conversations.some(conv => conv.targetId == message.senderId));
        console.log('с сервера в мессенджер получено сообщение: ' + JSON.stringify(message));
      });


    this.ioConnection = this.websocketService.setDialog()
      .subscribe((messages: any) => {
       this.messages = messages;
       console.log('с сервера в мессенджер получено сообщение: ' + JSON.stringify(messages));
      });

  }

}
