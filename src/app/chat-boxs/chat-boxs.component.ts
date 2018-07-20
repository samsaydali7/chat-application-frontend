import { Component, OnInit, ViewEncapsulation, Output, Input, AfterContentChecked } from '@angular/core';
import { User } from '../User';
import { Contact } from '../Contact';
import { ChatService } from '../chat.service';
import { EncryptionService } from '../encryption.service';
import * as download from "../../assets/js/download.js";
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-chat-boxs',
  templateUrl: './chat-boxs.component.html',
  styleUrls: ['./chat-boxs.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatBoxsComponent implements OnInit, AfterContentChecked {

  @Input() public user: User;
  @Input() public contact: Contact;
  public conversations;
  public message: string = "";
  public file = null;
  private fileType = null;
  public modalImage = "";
  public showModal = false;
  public showFileModal = false;
  public showUploadButton = true;
  public fileNotSupported = false;
  public fileSizeIsLarge = false;
  constructor(private chatService: ChatService, private enc: EncryptionService,public sanitizer:DomSanitizer) {
    this.conversations = chatService.conversations;
  }

  ngOnInit() {

  }

  ngAfterContentChecked() {
    this.scrollChatWindowDown();
  }

  public addMessage() {
    this.message = "";
    this.scrollChatWindowDown();
  }
  public sendMessage() {
    let data = {
      sender: this.user.username,
      reciver: this.contact.username,
      date: (new Date()).toString(),
      type: 'text',
      message: this.message
    }
    this.chatService.sendMessage(data);
    this.addMessage();
  }
  public scrollChatWindowDown() {
    var chatWndow = document.getElementById('chat-window');
    if (chatWndow)
      chatWndow.scrollTop = chatWndow.scrollHeight;
  }
  public getMessagesFromConversations() {
    this.conversations = this.chatService.getConversations();
    var readKeys = Object.keys(this.conversations[this.contact.username].read);
    var unReadKeys = Object.keys(this.conversations[this.contact.username].unread);
    let messages = [];
    readKeys.forEach((key) => {
      let message = (this.conversations[this.contact.username].read)[key];
      message.date = key;
      messages.push(message);
    });
    unReadKeys.forEach((key) => {
      let message = (this.conversations[this.contact.username].unread)[key];
      message.date = key;
      messages.push(message);
    });
    /*
              message:{
            sender:
            status:
            type:,
            message:,
            date
          }
    
    */
    return messages;
  }
  getStatusClass(message) {
    switch (message.status) {
      case 'wait':
        return {
          ' fa-clock-o': true,
          ' fa-check': false,
          'w3-text-teal': false,
        };
      case 'sent':
        return {
          ' fa-clock-o': false,
          ' fa-check': true,
          'w3-text-teal': false,
        };
      case 'read':
        return {
          ' fa-clock-o': false,
          ' fa-check': true,
          'w3-text-indigo': true,
        }
    }
  }

  public blockUser(contact: string) {
    this.chatService.blockContact(contact);
  }
  public unBlockUser(contact) {
    this.chatService.unBlockContact(contact);
  }
  public isBlocked(contact: string) {
    return this.chatService.isBlocked(contact);
  }

  public openModal(message) {
    this.modalImage = message;
    this.showModal = true;
  }

  public openFileModal() {
    this.showFileModal = true;
  }

  public hideModal() {
    this.showModal = false;
  }
  public hideFileModal() {
    this.showFileModal = false;
    this.fileNotSupported = false;
    this.fileSizeIsLarge = false;
    this.file = null;
    this.fileType = null;
    this.showUploadButton = true;

  }
  public isShowModal() {
    if (this.showModal) {
      return " show";
    } else {
      return ' hide';
    }

  }
  public isShowFileModal() {
    if (this.showFileModal) {
      return " show";
    } else {
      return ' hide';
    }
  }
  public showImageFile() {
    if (this.file != null) {
      return true;
    } else {
      return false;
    }
  }

  public sendFile() {
    let data = {
      sender: this.user.username,
      reciver: this.contact.username,
      date: (new Date()).toString(),
      type: this.fileType,
      message: this.file
    }
    this.chatService.sendMessage(data);
    this.hideFileModal();
  }

  public fileUploadChanged(event) {
    var files = event.target.files;
    let srcData;
    this.fileNotSupported = false;
    this.fileSizeIsLarge = false;

    var callBack = (data) => {
      console.log(data);
      this.file = data;
      this.showUploadButton = false;
    }

    if (files.length > 0) {
      var fileToLoad: File = files[0];
      if(!(this.acceptedFile(fileToLoad))){
        return
      }
      var index = fileToLoad.type.indexOf("/");
      var type = fileToLoad.type.substr(0, index);
      if (type == 'text') {
        type = 'textfile';
      }
      this.fileType = type;
      if ((fileToLoad.name.split("."))[1] == "rar" || (fileToLoad.name.split("."))[1] == "zip") {
        this.fileType = "application";
      }
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        srcData = (fileLoadedEvent.target)['result']; // <--- data: base64      this.file = srcData;
        if (type == "application" || type == "textfile") {
          var data = {
            src: srcData,
            name: fileToLoad.name,
            ext: (fileToLoad.name.split("."))[1]
          }
          callBack(data);
        } else if ((fileToLoad.name.split("."))[1] == "rar") {
          srcData = "data:application/x-rar" + (srcData.split(':'))[1];
          var data = {
            src: srcData,
            name: fileToLoad.name,
            ext: "rar"
          }
          callBack(data);
        } else if ((fileToLoad.name.split("."))[1] == "zip") {
          srcData = "data:application/zip" + (srcData.split(':'))[1];
          var data = {
            src: srcData,
            name: fileToLoad.name,
            ext: "zip"
          }
          callBack(data);
        }
        else
          callBack(srcData);
      }
      fileReader.readAsDataURL(fileToLoad);
      event.target.value = null;

    }

  }

  public getStatus(contact: string) {
    return this.chatService.getStatus(contact);
  }

  public iconStyle(type, file) {
    var ext = (file.name.split("."))[1];
    if (type == 'textfile') {
      return "fa fa-file-text-o fa-5x w3-text-grey";
    }
    if (file.ext == 'pdf')
      return "fa fa-file-pdf-o fa-5x w3-text-grey";
    if (ext == "zip" || ext == "rar")
      return "fa fa fa-file-archive-o fa-5x w3-text-grey";
    else
      return "fa fa-file-o fa-5x w3-text-grey";

  }

  public DonloadFile(src, name) {
    download(src, name);
  }

  public acceptedFile(fileToLoad:File):boolean{

    if(fileToLoad.size > 25000000){
      this.fileSizeIsLarge = true;
      return false;
    }
    var index = fileToLoad.type.indexOf("/");
    var type = fileToLoad.type.substr(0, index);
    var ext = (fileToLoad.name.split("."))[1];
    var acceptedTypes = ["text","image","video","audio"];
    var acceptedExt = ["rar","zip","pdf"];

    if(ext.toLocaleLowerCase() == "mkv"){
      this.fileNotSupported = true;
      return false;
    }

    if (acceptedTypes.indexOf(type.toLocaleLowerCase())>-1)
      return true;
    else if(acceptedExt.indexOf(ext.toLocaleLowerCase())>-1)
      return true;
    else{
      this.fileNotSupported = true;
      return false;
    }
      
  }

  public safe(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
