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
    realm.write(() => realm.create("Wallet",walJson,'all'))
}