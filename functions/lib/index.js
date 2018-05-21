"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.newTowRequest = functions.firestore
    .document('towRequest/{towRequestId}')
    .onWrite((event) => __awaiter(this, void 0, void 0, function* () {
    const data = event.after.data();
    const userId = data.userId;
    const payload = {
        notification: {
            title: 'New Tow Request',
            body: 'A new tow request nearby your location!',
            icon: 'https://ibb.co/bsoZG7'
        }
    };
    const db = admin.firestore();
    const devicesRef = db.collection('devices');
    const devices = yield devicesRef.get();
    const tokens = [];
    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token);
    });
    return admin.messaging().sendToDevice(tokens, payload);
}));
//# sourceMappingURL=index.js.map