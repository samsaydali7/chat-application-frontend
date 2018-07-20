import { Contact } from "./Contact";
export class User{
    public username;
    public fullname;
    public email;
    public yearOfBirth;
    public pin;
    public privacy;
    public contacts:Contact[] = [];
    public contactsRequests =[];
    public profileImage;
    public blockedContacts = [];
    public privateKey
}