import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();


// exports.newTowRequest = functions.firestore
// .document('towRequest/{towRequestId}')
// .onWrite(async event => {
//     const data = event.after.data();

//     const userId = data.userId;
    
//     const payload = {
//         notification: {
//             title: 'New Tow Request',
//             body: 'A new tow request nearby your location!',
//         }
//     }

//     const db = admin.firestore()
//     const devicesRef = db.collection('devices');

//     const devices = await devicesRef.get();

//     const tokens = [];

//     devices.forEach(result => {
//         const token = result.data().token;
//         tokens.push(token)
//     })

//     return admin.messaging().sendToDevice(tokens, payload);
// })

exports.newTowRequest = functions.database
.ref('towRequest/{towRequestId}')
.onCreate(async (snap, context) => {
    const data = snap.val();

    const userId = data.userId;
    
    const payload = {
        notification: {
            title: 'New Tow Request',
            body: 'A new tow request nearby your location!',
        }
    }

    const db = admin.firestore()
    const devicesRef = db.collection('devices');

    const devices = await devicesRef.get();

    const tokens = [];

    devices.forEach(result => {
        const token = result.data().token;
        tokens.push(token)
    })

    return admin.messaging().sendToDevice(tokens, payload);
})
