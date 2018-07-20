import { Component } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { ChatService } from './chat.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public message: string;
  public reciver: string;
  public user: string;
  public messages = [];

  constructor(private chatService:ChatService){
    
  }
  public sendMessage() {
    let mess = {
      sender :this.user,
      reciver:this.reciver,
      message:this.message
    }
    this.chatService.sendMessage(mess);
    this.message = '';
  }
}
