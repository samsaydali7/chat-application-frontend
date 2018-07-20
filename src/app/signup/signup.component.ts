import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public username: string = "";
  public password: string = "";
  public email: string = "";
  public yearOfBirth;
  public fullname: string = "";

  public username_err: boolean = false;
  public fullname_err: boolean = false;
  public password_err: boolean = false;
  public email_err: boolean = false;
  public yearOfBirth_err: boolean = false;

  public exist_err: boolean = false;
  public errorMessage: string = "";

  public validate(): boolean {
    this.username_err = false;
    this.fullname_err = false;
    this.password_err = false;
    this.email_err = false;
    this.yearOfBirth_err = false;
    this.usernameVal();
    this.fullnameVal();
    this.passwordVal();
    this.emailVal();
    this.yearOfBirthVal();
    if (this.username_err || this.fullname_err || this.password_err || this.email_err || this.yearOfBirth_err)
      return false;
    return true;
  }

  private usernameVal() {
    if (this.username == "") {
      this.username_err = true;
      return;
    }
    var arr = this.username.split('');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == " " || arr[i] == "\\" || arr[i] == "`" || arr[i] == "/" || arr[i] == "'" || arr[i] == '"') {
        this.username_err = true;
        return;
      }
    }
  }
  private fullnameVal() {
    if (this.fullname == "") {
      this.fullname_err = true;
      return;
    }
    var arr = this.fullname.split('');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == "\\" || arr[i] == "`" || arr[i] == "/" || arr[i] == "'" || arr[i] == '"') {
        this.fullname_err = true;
        return;
      }
    }
  }
  private emailVal() {
    if (this.email == "") {
      this.email_err = true;
      return;
    }
    var x = this.email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
      this.email_err = true;
    }
  }
  private yearOfBirthVal() {
    if (this.yearOfBirth == undefined) {
      this.yearOfBirth_err = true;
      return;
    }
    if(this.yearOfBirth > 2018 || this.yearOfBirth < 1900){
      this.yearOfBirth_err = true;
      return;
    }
  }
  private passwordVal(){
    if (this.password == "") {
      this.password_err = true;
      return;
    }
    var arr = this.password.split('');
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == " ") {
        this.password_err = true;
        return;
      }
    }
  }

  constructor(private chatService: ChatService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  public signup() {
    if (this.validate()) {
      let data = {
        username: this.username,
        password: this.password,
        email: this.email,
        yearOfBirth: this.yearOfBirth,
        fullname: this.fullname
      };
      this.chatService.signup(data).subscribe((respnce) => {
        if (respnce['ok']) {
          let obj = {
            username:this.username,
            password:this.password
          };
          this.chatService.loginSeuccsess(respnce.login);          
        } else {
          this.exist_err = true;
          this.errorMessage = respnce['message'];
        }
      });
    }
  }
  public fakeUsers() {
    this.http.get('https://randomuser.me/api/?results=100').subscribe((res: any) => {
      var results = res.results;
      for (var i = 0; i < results.length; i++) {
        let data = {
          fullname: results[i].name.first + " " + results[i].name.last,
          username: results[i].login.username,
          password: 12345,
          email: results[i].email,
          yearOfBirth: results[i].dob
        };
        this.chatService.signup(data);
      }
    })
  }

  public cb(profileImage, data) {
    data.profileImage = profileImage;
    this.chatService.signup(data);
  }
  public toDataUrl(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result, data);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

}
