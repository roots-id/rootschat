//import {createRealmContext} from '@realm/react';
//export const WalletRealmContext = createRealmContext({
//  schema: [Wallet],
//});

import Realm from "realm";
import { WALLET_SCHEMA } from "./Schemas"

const config = {
    inMemory: true,
    schema: [WALLET_SCHEMA],
    schemaVersion: 2,
}
const realm = new Realm(config)

export default function saveRealmWallet(walJson) {
    realm.write(() => realm.create(WALLET_SCHEMA.name,walJson,'all'))
}

export function getRealmWallet(walName) {
const wallets = realm.objects(WALLET_SCHEMA.name);
console.log(`The lists of wallets are: ${wallets.map((wallet) => wallet.name)}`);
// filter for all tasks with a status of "Open"
const namedWallets = wallets.filtered("_id = "+walName);
    if(namedWallets && namedWallets.length>0) {
        return namedWallets[0]
    } else {
        console.log("Could not get named wallet:",walName)
    }
}