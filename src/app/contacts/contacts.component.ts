import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../User";
import { ChatService } from "../chat.service";
import { Contact } from '../Contact';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public user:User;
  public contacts:Contact[];
  public selected:string = "Contacts";
  public searchString = '';
  public searchPIN = '';

  constructor(private chatService:ChatService,private router:Router,public sanitizer:DomSanitizer) { 
    this.user = this.chatService.user;
    this.contacts = this.user.contacts;
  }

  ngOnInit() {
    if(this.chatService.isloged ==false){
      this.router.navigate(['/login']);
    }
  }

  public openTab(tabName) {
    this.selected = tabName;
    this.searchString = '';
  }
  public isActive(tab){
    if(this.selected === tab){
      return "showin";
    }
    else{
      return "hid";
    }
  }
  public ifSelected(tab:string){
    if(this.selected == tab){
      return "w3-border-theme2";
    }
    else{
      return "w3-border-theme3";
    }
  }
  public search(){
    let data = {
      username:this.searchString,
      user:this.user.username
    };
    this.chatService.search(data);
  }
  public getSearchResult(){
    if(this.searchString ==""){
      this.chatService.getSearchResult();
      return [];
    }
    return this.chatService.getSearchResult();
  }
  public addContact(addedContact){
    let data = {
      username:this.user.username,
      addedContact:addedContact
    };
    this.chatService.addContact(data);
    this.searchString ="";
  }
  public addUserByPIN(){
    if(this.searchPIN !== this.user.pin){
      this.chatService.addContactByPIN(this.searchPIN);
    }
    this.searchPIN = "";
  }

  public getRequests(){
    return this.user.contactsRequests;
  }
  public getRequestsLength(){
    return this.user.contactsRequests.length;
  }
  public hasRequests(){
    if (this.getRequestsLength()>0)
      return true;
    return false;
  }
  acceptContact(username:string){
    this.chatService.acceptContact(username);
  }
  declineContact(username:string){
    this.chatService.declineContact(username);
  }
  deleteContact(username:string){
    this.chatService.deleteContact(username);
  }
  public isBlocked(contact:string):boolean{
    return this.chatService.isBlocked(contact);
  }
  public blockUser(contact:string) {
    this.chatService.blockContact(contact);
  }
  public unBlockUser(contact:string) {
    this.chatService.unBlockContact(contact);
  }
}
