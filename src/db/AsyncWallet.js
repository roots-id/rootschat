import AsyncStorage from '@react-native-async-storage/async-storage';
import { WALLET_SCHEMA } from "./Schemas"

export async function storeAsyncWallet(wal) {
    try {
        console.log('AsyncWallet - start storing wallet',wal._id)
        await AsyncStorage.setItem(wal._id, JSON.stringify(wal))
    } catch(error) {
        console.error("AsyncWallet - Could not store async wallet,",error)
    }
}

export async function getAsyncWallet(walName) {
  try {
    const value = await AsyncStorage.getItem(walName)
    if(value !== null) {
      console.log("Replace previous wallet",value)
    }
  } catch(e) {
    console.error("AsyncWallet - Could not store async wallet,",error)
  }

}