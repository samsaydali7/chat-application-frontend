import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../User';
import { Router } from '@angular/router'
import { Contact } from '../Contact';
@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  public user:User;
  public selectedContact:Contact;

  constructor(private chatService:ChatService,private router:Router) { 
    this.user = this.chatService.user;
  }

  ngOnInit() {
    if(this.chatService.isloged ==false){
      this.router.navigate(['/login']);
    }
  }

  selectContact(contact:Contact){
    this.selectedContact = contact;
    this.chatService.contact = contact;
  }
}
