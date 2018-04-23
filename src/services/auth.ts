import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

	constructor(private afAuth: AngularFireAuth) {

	}

	login(email: string, password: string) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}

	register(email: string, password: string) {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
	}
}