import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class TowRequestsService {
    

    constructor(public db: AngularFireDatabase) {

    }

    getRequest() {
        let user = this.db.list('user');
        return user;
    }

    getTowRequestPickupFlag() {
        let towRequest = this.db.list('towRequest', ref => ref.orderByChild('pickup_flag').equalTo(0));
        return towRequest;
    }

    getTowRequestListFromKey(key) {
        let towRequest = this.db.list('towRequest/'+key);
        return towRequest;
    }

    getTowRequestObjectFromKey(key) {
        let towRequest = this.db.object('towRequest/'+key);
        return towRequest;
    }

    getUserFromKey(key) {
        let user = this.db.object('user/'+key);
        return user;
    }

    updatePickupFlag(key, uid) {
        let pickupFlg = this.db.object('towRequest/'+key);
        pickupFlg.update({ "pickup_flag": 1, "driverId": uid, "status": "tow_assigned"});
    }
}