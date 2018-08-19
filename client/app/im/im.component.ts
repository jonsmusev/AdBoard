import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-im',
  templateUrl: './im.component.html',
  styleUrls: ['./im.component.css']
})
export class ImComponent implements OnInit {

  messages= [];
  user = {};
  conversationId = {};
  isLoading = true;
  sendMessageForm: FormGroup;
  sendMessageControl = new FormControl();

  constructor(
    private auth: AuthService,
    private userService: UserService,
    public toast: ToastComponent,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.sendMessageForm = this.formBuilder.group({
      conversationId: this.conversationId,
      sendMessageControl: this.sendMessageControl,
      user: this.auth.currentUser.username,
      timestamp: Date.now()
    });
  }

  // chat module
  dialogSelect(e) {
    switch (e) {
      case 1 : {
        this.messages = [{messageContent: 'Мама мыла раму', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'Рама мыла маму', senderId: 'avatar3', timestamp: '16:32'} ,
          {messageContent: 'Вася пила рому', senderId: 'avatar7', timestamp: '10:02'}];
        break ;
      }
      case 2 : {
        this.messages = [{messageContent: 'ола мыла олег', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'порт орел маму', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'Вася игорь денис', senderId: 'avatar1', timestamp: '12:32'}];
        break ;
      }
      case 3 : {
        this.messages = [{messageContent: 'текст сообщеня 5', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'текст сообщеня 10', senderId: 'avatar1', timestamp: '12:32' } ,
          {messageContent: 'текст сообщеня 5', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'текст сообщеня 10', senderId: 'avatar1', timestamp: '12:32' } ,
          {messageContent: 'текст сообщеня 5', senderId: 'avatar1', timestamp: '12:32'} ,
          {messageContent: 'текст сообщеня 10', senderId: 'avatar1', timestamp: '12:32' } ,
          {messageContent: 'текст сообщеня 1', senderId: 'avatar1', timestamp: '12:32'}];
        break ;
      }
      case 4 : {
        this.conversationId = '4';
        this.getMessages(e);
        break ;
      }
      case 5 : {
        this.conversationId = '5';
        this.getMessages(e);
        break ;
      }
    }
    console.log('dialogSelected ' + e);
    console.log('currentConversationId = ' + this.conversationId);
  }
  /*
    sendMessage() {
      console.log('button pressed');
      console.log(this.sendMessageForm.value);
      this.messages.push({content: this.sendMessageForm.value.sendMessageControl, avatar: 'avatar3', time: '7:40'});
    }
  */

  sendMessage() {
    this.userService.sendMessage(this.sendMessageForm.value).subscribe(
      res => {
        this.toast.setMessage('item sent successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  getMessages(dialogId) {
    this.userService.getMessages(dialogId).subscribe(
      data =>  {
        this.messages = data.conversation;
      },
      error => console.log(error)
    );
  }
}
