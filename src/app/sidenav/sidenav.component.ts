import { Component, OnInit,Input } from '@angular/core';
import { User } from '../User';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() user:User;
   
  constructor(private chatService:ChatService) { }

  ngOnInit() {
  }

  logout(){
    this.chatService.logout();
  }

  getReqestsCount(){

    //return this.user.contactsRequests.length;
    return this.chatService.user.contactsRequests.length;
  }
  getUnreadCount(){
    //{{conversations[contact.username].unreadCount}}
    var contacts = this.chatService.user.contacts;
    var conv = this.chatService.conversations;

    var count = 0;

    contacts.forEach((contact)=>{
      count += conv[contact.username].unreadCount
    })
    return count;
  }

}
