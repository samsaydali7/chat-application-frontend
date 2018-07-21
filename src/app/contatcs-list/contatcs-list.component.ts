import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../Contact';
import { ChatService } from '../chat.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contatcs-list',
  templateUrl: './contatcs-list.component.html',
  styleUrls: ['./contatcs-list.component.css']
})
export class ContatcsListComponent implements OnInit {

  @Input() user;
  @Output() onSelectContact = new EventEmitter();
  public conversations = {};

  constructor(private chatService: ChatService,public sanitizer:DomSanitizer) {
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
      colorClass += "w3-border-theme2";
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

  getLMSender(contact:Contact){
    var lastMessage = this.conversations[contact.username].lastMessage;
    if(lastMessage == "no nessages yet")
      return "";
    var arr = lastMessage.split(": ");
    return arr[0]+":";
  }
  getLM(contact:Contact){
    var lastMessage = this.conversations[contact.username].lastMessage;
    if(lastMessage == "no nessages yet")
    return "no nessages yet";
    var arr = lastMessage.split(": ");
    if((<string>arr[1]).length > 37){
      return (<string>arr[1]).substring(0,37) + ".."
    }
    return arr[1];
  }

  isText(string:string){
    if(string == "file"||string == "image" || string == "video"|| string == "audio")
      return false;
    return true;
  }
  isImage(string:string){
    if(string == "image")
      return true;
    return false;
  }
  isVideo(string:string){
    if(string == "video")
      return true;
    return false;
  }
  isAudio(string:string){
    if(string == "audio")
      return true;
    return false;
  }
  isFile(string:string){
    if(string == "file")
      return true;
    return false;
  }


}
