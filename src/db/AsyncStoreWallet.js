import AsyncStorage from '@react-native-async-storage/async-storage';
import { WALLET_SCHEMA } from "./Schemas"

export async function storeWallet(walName,walJson) {
    try {
        console.log('AsyncWallet - start storing wallet',walName)
        await AsyncStorage.setItem(walName, walJson)
        return true;
    } catch(error) {
        console.error("AsyncWallet - Could not store async wallet,",error)
        return false;
    }
    return false;
}

export async function getWallet(walName) {
  try {
    const walJson = await AsyncStorage.getItem(walName)
    if(walJson !== null) {
      console.log("AsyncWallet - Replace previous wallet",walJson)
    }
    return walJson;
  } catch(e) {
    console.error("AsyncWallet - Could not store async wallet,",error)
    return null;
  }
  return null;
}