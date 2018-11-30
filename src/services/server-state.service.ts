import { Injectable } from "@angular/core";
import { TransferState, makeStateKey } from '@angular/platform-browser';

let pet_list_state_key = makeStateKey('pet_list_state_key');

@Injectable()

export class ServerStateService {
    constructor(
        private state: TransferState,
    ){}


    getServerState(key: any) {
        return this.state.get(this[key], null as any);
    }

    setServerState(key: any, currentState: any, hashedKey: string, result: any) {
		if (!currentState) {
			this.state.set(key, {} as any);
			currentState = this.state.get(key, null as any);
			currentState[hashedKey] = result;
			this.state.set(key, currentState as any);
		} else {
			currentState[hashedKey] = result;
			this.state.set(key, currentState as any);
		}
	}

	hashString(s: string) {
		var a = 1, c = 0, h, o;
		if (s) {
			a = 0;
			/*jshint plusplus:false bitwise:false*/
			for (h = s.length - 1; h >= 0; h--) {
				o = s.charCodeAt(h);
				a = (a << 6 & 268435455) + o + (o << 14);
				c = a & 266338304;
				a = c !== 0 ? a ^ c >> 21 : a;
			}
		}
		return String(a);
	};
}

