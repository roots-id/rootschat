import AsyncStorage from '@react-native-async-storage/async-storage';
import { WALLET_SCHEMA } from "./Schemas"

export async function getWallet(walName) {
  try {
    const walJson = await AsyncStorage.getItem(walName)
    if(!walJson || walJson == null) {
        console.log("AsyncWallet - no wallet found for name",walName)
        return null;
    } else {
        console.log("AsyncWallet - wallet found",walName)
        return walJson
    }
  } catch(e) {
    console.error("AsyncWallet - Could not get async wallet,",error)
    return null;
  }
  return null;
}

export async function status() {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch(e) {
    // read key error
  }

  console.log("AsyncWallet",keys)
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
}

export async function storeWallet(walName,walJson) {
    try {
        console.log('AsyncWallet - start storing wallet',walName)
        const oldWallet = await AsyncStorage.setItem(walName, walJson)
        if(oldWallet && oldWallet !== null) {
          console.log("AsyncWallet - Replace previous wallet",oldWallet)
        }
        return true;
    } catch(error) {
        console.error("AsyncWallet - Could not store async wallet,",error)
        return false;
    }
    return false;
}