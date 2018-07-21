import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './User';
import { Contact } from './Contact';
import { Observable } from 'rxjs/Observable';
import * as dateformat from 'dateformat';
import * as localforage from 'localforage';
import { EncryptionService } from './encryption.service';

@Injectable()
export class ChatService {
  private socketUrl;
  private url = "https://warm-castle-70578.herokuapp.com/";
  public socket;
  private userInfo = {};
  public user: User = new User();
  public contact: Contact = new Contact();
  public isloged = false;
  public searchResult: any[] = [];
  public conversations = {

    /*
      sender{
        read{
          date1:{
            sender:
            type:,
            message:,
            status: => wait , sent , read
          }
        }
        unread{
          date:{
            sender:
            type:,
            message:,
            status: => wait , sent , read
          }
        },
        lastMessage, new =>{
          writer ,
          type ,
          messge (if text)
        }
        unreadCount
      }
    
    */
  }
  public conv;

  public convReady = false;
  private messageQueue = [];
  private stateQueue = [];
  private readMarkQueue = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private enc:EncryptionService
  ) {
    //localforage.clear()
  }

  public logIn(userInfo):Observable<any> {
    this.userInfo = userInfo;
    return this.http.post(`${this.url}login`, userInfo);
  }

  public loginSeuccsess(responce){
    this.user.username = responce['username'];
    this.user.fullname = responce['fullname'];
    this.user.email = responce['email'];
    this.user.contacts = responce['contacts'];
    this.user.pin = responce['pin'],
    this.user.privacy = responce['privacy'];
    this.user.blockedContacts = responce['blockedContacts'];
    this.user.yearOfBirth = responce['yearOfBirth'];
    this.user.profileImage = responce['profileImage'];
    this.user.privateKey = responce['privateKey'];
    this.user.contactsRequests = responce['contactsRequests'];
    this.isloged = true;
    this.connect();
    this.router.navigate(['/main']);
  }
  public signup(userInfo):Observable<any> {
    return this.http.post(`${this.url}signup`, userInfo);
  }
  public search(data) {
    if (data.username != "") {
      this.http.post(`${this.url}search2`, data).subscribe((responce: any[]) => {
        this.searchResult = responce;
      });
    }
    else {
      this.searchResult = [];
    }
  }


  public webSafe64(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  public connect() {
    //this.user = user;
    this.searchResult = [];
    this.socketUrl = `${this.url}?username=${this.user.username}`;
    this.socket = io(this.socketUrl);
    this.initConversations();
    this.socket.on('chat', (data) => {
      /*var mes = data.message;
      if(data.type != "text"){
        data.message = this.webSafe64(mes);
        var res = mes.substring(0,7);
        console.log(res);
        if(res == "unsafe:"){
          res.splice(7,res.length);
          data.message = res;
        }
      }*/
      if(data.type == 'text'){
        data.message = this.enc.decrypt(data.message,this.user.privateKey);
      }
      this.addMessageToConversation(data.sender, data.date, data);
    });
    this.socket.on('sent', (data) => {
      this.markStatus(data, "sent");
    });
    this.socket.on('read', (data) => {
      this.markStatus(data, 'read');
    });
    this.socket.on('readNotes', (notes) => {
      var arr = Array.from(notes);
      arr.forEach(note => {
        this.markStatus(note, 'read');
      });
    });
    this.socket.on('messages', (messages: any[]) => {
      messages.forEach((data) => {
        if(data.type == 'text'){
          data.message = this.enc.decrypt(data.message,this.user.privateKey);
        }
        this.addMessageToConversation(data.sender, data.date, data);
      });
    });
    this.socket.on('status', (data) => {
      var index = this.findIndexOfContact(data.username);
      this.user.contacts[index].status = data.status;
      this.user.contacts[index].lastSeen = data.lastSeen;

    });
    this.socket.on('addContact2', (data) => {
      this.user.contactsRequests.push(data);
    });
    this.socket.on('deleteContact', (data) => {
      var index = this.findIndexOfContact(data.username);
      this.user.contacts.splice(index, 1);
      delete this.conversations[data.username];
      this.saveConv();
    });
    this.socket.on('deleteContactAKN', (data) => {
      var index = this.findIndexOfContact(data.deletedContact);
      this.user.contacts.splice(index, 1);
      delete this.conversations[data.deletedContact];
      this.saveConv();
    });
    this.socket.on('acceptContact', (data: Contact) => {
      ///a tooast should go here!
      this.user.contacts.push(data);
      this.conversations[data.username] = {
        read: {

        },
        unread: {

        },
        lastMessage: "no nessages yet",
        unreadCount: 0
      }
      this.saveConv();
    });
    this.socket.on('acceptContactAKN', (data: Contact) => {
      var index = this.findIndexOfRequest(data.username);
      this.user.contactsRequests.splice(index, 1);
      this.user.contacts.push(data);
      this.conversations[data.username] = {
        read: {

        },
        unread: {

        },
        lastMessage: "no nessages yet",
        unreadCount: 0
      }
      this.saveConv();
    });
    this.socket.on('declineContactAKM', (data) => {
      var index = this.findIndexOfRequest(data.username);
      this.user.contactsRequests.splice(index, 1);
    });
    this.socket.on('blockContactAKM', (data) => {
      this.user.blockedContacts.push(data.blockedContact);
    });
    this.socket.on('unBlockContactAKM', (data) => {
      var index = this.user.blockedContacts.indexOf(data.unBlockedContact);
      this.user.blockedContacts.splice(index, 1);
    });
    this.socket.on('profileImage', (data) => {
      var index = this.findIndexOfContact(data.username);
      this.user.contacts[index].profileImage = data.profileImage;
    });
    this.socket.on('userProfileImage', (data) => {
      this.user.profileImage = data.profileImage;
    });
    this.socket.on('resetPINAKN', (data) => {
      if (data.ok) {
        this.user.pin = data.PIN;
      }
    });
    this.socket.on('setPrivacyAKN', (data) => {
      if (data.ok) {
        this.user.privacy = data.privacy;
      }
    });
  }
  public sendMessage(message) {
    let encMessage = JSON.parse(JSON.stringify(message));
    if(message.type == 'text'){
      encMessage.message = this.enc.encrypt(encMessage.message,this.user.contacts[this.findIndexOfContact(message.reciver)].publicKey);
    } 
    this.socket.emit('chat', encMessage);
    this.socket.send();
    this.addMessageToConversation(message.reciver, message.date, message);
  }
  public sendReadNotes(message) {
    this.socket.emit('read', message);
  }
  public setProfileImage(profileImage: string) {
    let data = {
      username: this.user.username,
      profileImage: profileImage
    }
    this.socket.emit('profileImage', data);
  }

  public addMessageToConversation(sender: string, date, data) {

    if (this.convReady) {
      if (data.type == "text") {
        this.conversations[sender].lastMessage = `${data.sender}: ${data.message}`;
      }
      else if (data.type == "image") {
        this.conversations[sender].lastMessage = `${data.sender}: image`;
      }
      else if (data.type == "video") {
        this.conversations[sender].lastMessage = `${data.sender}: video`;
      }
      else if (data.type == "audio") {
        this.conversations[sender].lastMessage = `${data.sender}: audio`;
      }
      else if (data.type == "application" || data.type == "textfile") {
        this.conversations[sender].lastMessage = `${data.sender}: file`;
      }
      if (sender == this.user.username || sender == this.contact.username) {
        if (data.sender == this.contact.username) {
          this.sendReadNotes(data);
        }
        this.conversations[sender].read[date] = {
          sender: data.sender,
          message: data.message,
          type: data.type,
          status: 'wait'
        }
      }
      else {
        this.conversations[sender].unreadCount = parseInt(this.conversations[sender].unreadCount) + 1;
        this.conversations[sender].unread[date] = {
          sender: sender,
          message: data.message,
          type: data.type
        }
      }
      this.saveConv();
    } else {
      var obj = {
        sender: sender,
        date: date,
        data: data
      }
      this.messageQueue.push(obj);
    }
  }

  public saveConv() {
    this.conv[this.user.username] = this.conversations;
    localforage.setItem('conversations', this.conv);
  }
  public emptyConv() {
    let arr: Contact[] = this.user.contacts;
    arr.forEach((contact: Contact) => {
      this.conversations[contact.username] = {
        read: {

        },
        unread: {

        },
        lastMessage: "no nessages yet",
        unreadCount: 0
      }
    });
  }
  public cheqNewCntacts(){
    let arr = this.user.contacts;
    arr.forEach((contact: Contact) => {
      if(!this.conversations.hasOwnProperty(contact.username)){
        console.log(contact.username);
        this.conversations[contact.username] = {
          read: {
  
          },
          unread: {
  
          },
          lastMessage: "no nessages yet",
          unreadCount: 0
        }
      }
    });
    this.saveConv();
  }
  public emptyConv2() {
    let arr: Contact[] = this.user.contacts;
    let con = {}
    arr.forEach((contact: Contact) => {
      con[contact.username] = {
        read: {

        },
        unread: {

        },
        lastMessage: "no nessages yet",
        unreadCount: 0
      }
    });
    this.conversations = con;
  }
  public Ready() {
    this.cheqNewCntacts();
    this.convReady = true;
    this.messageQueue.forEach((message) => {
      this.addMessageToConversation(message.sender, message.date, message.data);
    });
    this.readMarkQueue.forEach((contact) => {
      this.markRead(contact);
    });
    this.stateQueue.forEach((state) => {
      this.markStatus(state.data, state.status);
    });
  }
  public isReady() {
    return this.convReady;
  }
  public getConversations() {
    return this.conversations;
  }
  public initConversations() {
    this.emptyConv();
    localforage.getItem('conversations', (err, conv) => {
      if (err) {
        this.emptyConv2();
        this.conv = {}
        this.saveConv();
        this.Ready();

      } else {
        this.conv = conv;
        if (this.conv == null) {
          this.emptyConv2();
          this.conv = {}
          this.saveConv();
          this.Ready();
        }
        else {
          try {
            this.conversations = conv[this.user.username];
            if (this.conversations == undefined) {
              throw err;
            }
            this.Ready();
          } catch (e) {
            this.emptyConv2();
            this.saveConv();
            this.Ready();
          }
        }
      }
    });
  }

  public markRead(contact) {
    if (this.convReady) {
      var unReadKeys = Object.keys(this.conversations[contact].unread);
      this.conversations[contact].unreadCount = 0;
      unReadKeys.forEach((key) => {
        let message = (this.conversations[contact].unread)[key];
        (this.conversations[contact].read)[key] = (this.conversations[contact].unread)[key];
        message.reciver = this.user.username;
        message.date = key;
        this.sendReadNotes(message);
        delete (this.conversations[contact].unread)[key];
      });
      this.saveConv();
    } else {
      this.readMarkQueue.push(contact);
    }
  }

  public markStatus(data, status: string) {
    if (this.convReady) {
      ((this.conversations[data.reciver].read)[data.date]).status = status;
      this.saveConv();
    } else {
      var state = {
        data: data,
        status: status
      }
      this.stateQueue.push(state);
    }
  }

  public blockContact(contact: string) {
    let data = {
      username: this.user.username,
      blockedContact: contact
    };
    this.socket.emit('blockContact', data);
  }

  public isBlocked(user: string) {
    let bool: boolean = false;
    let arr: any[] = this.user.blockedContacts;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == user) {
        bool = true;
        break;
      }
    }
    return bool;
  }

  public unBlockContact(contact) {
    let data = {
      username: this.user.username,
      unBlockedContact: contact
    };
    this.socket.emit('unblock', data);
  }

  public getSearchResult() {
    return this.searchResult;
  }

  public addContact(data: any) {
    this.socket.emit('addContact2', data);
  }
  public addContactByPIN(pin: string) {
    var data = {
      username: this.user.username,
      pin: pin
    };
    this.socket.emit('addContactByPIN', data);
  }
  public deleteContact(contact: string) {
    let data = {
      username: this.user.username,
      deletedContact: contact,
    }
    this.socket.emit('deleteContact', data);
  }

  public acceptContact(contact: string) {
    let data = {
      username: contact,
      addedContact: this.user.username
    };
    this.socket.emit("acceptContact", data);
  }

  public declineContact(contact: string) {
    let data = {
      username: contact,
      addedContact: this.user.username
    };
    this.socket.emit("declineContact", data);
  }

  public updateInfo() {
    this.logIn(this.userInfo);
  }

  private findIndexOfContact(contact: string): number {
    for (var i = 0; i < this.user.contacts.length; i++) {
      if (this.user.contacts[i].username == contact)
        return i;
    }
    return -1;
  }
  private findIndexOfRequest(username: string): number {
    for (var i = 0; i < this.user.contactsRequests.length; i++) {
      if (this.user.contactsRequests[i].username == username)
        return i;
    }
    return -1;
  }
  public isOnline(contact: string) {
    var index = this.findIndexOfContact(contact);
    switch (this.user.contacts[index].status) {
      case 'online':
        return true;
      case 'offline':
        return false;
      default:
        return false;
    }
  }
  public getContact(contact: string): Contact {
    let index = this.findIndexOfContact(contact);
    return this.user.contacts[index];
  }
  public getStatus(contact: string) {
    let con = this.getContact(contact);
    if (con.status == 'online') {
      return 'Online';
    }
    else {
      return 'Last seen on ' + dateformat(con.lastSeen, "dddd, h:MM TT");
    }
  }
  public setPrivacy(privacy: string) {
    var data = {
      username: this.user.username,
      privacy: privacy
    };
    this.socket.emit("setPrivacy", data);
  }
  public setPassword(oldPassword: string, newPassword: string) {
    var data = {
      username: this.user.username,
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    this.socket.emit("setPassword", data);
  }
  public resetPIN() {
    var data = {
      username: this.user.username,
    };
    this.socket.emit("resetPIN", data);
  }

  public logout(){
    localStorage.clear();
    this.socket.disconnect();
  }

}
