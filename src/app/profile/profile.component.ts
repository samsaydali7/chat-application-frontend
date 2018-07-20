import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from "../chat.service";
import { User } from "../User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: User;

  private profileImage: string = null;

  public privacy;

  public oldPassword = "";
  public newPassword = "";

  public fileNotSupported:boolean = false

  constructor(private chatService: ChatService ,private router:Router) {
    this.user = chatService.user;
    this.privacy = this.user.privacy;
  }

  ngOnInit() {
    if(this.chatService.isloged ==false){
      this.router.navigate(['/login']);
    }
  }

  public setPassword(){
    this.chatService.setPassword(this.oldPassword,this.newPassword);
  }
  public setPrivacy(){
    this.chatService.setPrivacy(this.privacy);
  }
  public resetPIN(){
    this.chatService.resetPIN();
  }

  public pofileImageUplaod() {
    if(this.profileImage!=null){
      this.chatService.setProfileImage(this.profileImage)
      this.profileImage = null;
    }
  }

  public fileUploadChanged(event) {
    var files = event.target.files;
    let srcData;

    this.fileNotSupported = false;

    var callBack = (data) => {
      this.profileImage = data;
    }

    if (files.length > 0) {
      var fileToLoad = files[0];
      if(!this.acceptedFile(fileToLoad)){
        return;
      }
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        srcData = (fileLoadedEvent.target)['result']; // <--- data: base64      this.profileImage = srcData;
        callBack(srcData);
      }
      fileReader.readAsDataURL(fileToLoad);
      event.target.value = null;

    }
  }

  public isProfileImage():boolean{
    if(this.profileImage!=null){
      return true;
    }
    return false;
  }

  public acceptedFile(fileToLoad:File):boolean{
    var index = fileToLoad.type.indexOf("/");
    var type = fileToLoad.type.substr(0, index);

    if (type == "image")
      return true;
    else{
      this.fileNotSupported = true;
      return false;
    }
      
  }



}
