// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Firebase } from '@ionic-native/firebase';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { Platform } from 'ionic-angular';

// /*
//   Generated class for the FcmProvider provider.

//   See https://angular.io/guide/dependency-injection for more info on providers
//   and Angular DI.
// */
// @Injectable()
// export class FcmProvider {

//   authId: string;

//   constructor(
//     public firebaseNative: Firebase,
//     public db: AngularFireDatabase,
//     private auth: AngularFireAuth,
//     private platform: Platform
//   ) {}

//   // Get permission from the user
//   async getToken() { 
//     let token;

//       if (this.platform.is('android')) {
//         token = await this.firebaseNative.getToken()
//       } 

//       if (this.platform.is('ios')) {
//         token = await this.firebaseNative.getToken();
//         await this.firebaseNative.grantPermission();
//       } 
      
//       return this.saveTokenToFirebase(token)
//     }

//   private getUserId() {
//     let uid;
//     this.auth.authState.subscribe(auth =>{
//         uid = auth.uid;
//     });
//     return uid;
//   }

//   // Save the token to firestore
//   private saveTokenToFirebase(token) {

//     if (!token) return;

//     const devicesRef = this.db.object('devices/'+token);
  
//     const docData = { 
//       token,
//       userId: this.getUserId()
//     }
  
//     return devicesRef.set(docData)
//   }

//   // Listen to incoming FCM messages
//   // listenToNotifications() {
//   //   return this.firebaseNative.onNotificationOpen()
//   // }

//   private setAuthID(id) {
//     this.authId = id;
//   }

// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FcmProvider {

  constructor(private firebaseNative: Firebase, private afs: AngularFirestore, private platform: Platform, private afAuth: AngularFireAuth) {

  }

  //get permisson from user
  async getToken() {
    let token;

    if(this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }

    return this.saveTokenToDatabase(token);
  }

  private getUserId() {
    let uid;
    this.afAuth.authState.subscribe(auth =>{
        uid = auth.uid;
    });

    return uid;
  }

  //save token to db
  private saveTokenToDatabase(token) {
    if(!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      userId: this.getUserId()
    }

    return devicesRef.doc(token).set(docData);
  }

  //listen to incoming fcm msg
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }
}
