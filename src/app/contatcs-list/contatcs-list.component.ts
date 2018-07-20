import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../Contact';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-contatcs-list',
  templateUrl: './contatcs-list.component.html',
  styleUrls: ['./contatcs-list.component.css']
})
export class ContatcsListComponent implements OnInit {

  @Input() user;
  @Output() onSelectContact = new EventEmitter();
  public conversations = {};

  constructor(private chatService: ChatService) {
    this.conversations = chatService.conversations;
  }

  ngOnInit() {
  }

  selectContact(contact: Contact) {
    this.onSelectContact.emit(contact);
    this.chatService.markRead(contact.username);
  }
  isBlocked(contact: string) {
    return this.chatService.isBlocked(contact);
  }
  stateClass(contact: string) {
    let colorClass = ""
    if (this.isBlocked(contact))
      colorClass += "w3-border-red";
    else if (this.isOnline(contact)) {
      colorClass += "w3-border-green"
    }
    else
      colorClass += "w3-border-blue";
    if (contact == this.chatService.contact.username) {
      colorClass += " w3-gray";
    }
    return colorClass;
  }


  isOnline(contact: string) {
    return this.chatService.isOnline(contact);
  }

  isReady(){

    this.conversations = this.chatService.getConversations();
    return this.chatService.isReady();
  }
  getConversations(){
    return this.chatService.getConversations();
  }


}
