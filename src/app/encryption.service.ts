import { Injectable } from '@angular/core';
import * as BigInteger from "big-integer";
import * as Forge from "node-forge";

@Injectable()
export class EncryptionService {



  constructor() {
  }


  public encrypt(message: string, key) {
    var StringBuilder = [];
    var messArr = message.split("");
    messArr.forEach((char) => {
      var value = BigInteger(char.charCodeAt(0));
      var cipher = value.modPow(key.e, key.n);
      StringBuilder.push(cipher);
    });
    return StringBuilder.join(" ");
  }
  public decrypt(message: string, key) {
    var result = [];
    var scanner = message.split(" ");
    
    scanner.forEach(element => {
      var plainValue = (BigInteger(element)).modPow(key.d, key.n);
      result.push(String.fromCharCode(plainValue.valueOf()));

    });
    
    return result.join("");
  }

}
