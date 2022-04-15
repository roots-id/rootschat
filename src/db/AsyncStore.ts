import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logging'

export async function getWallet(walName: string) {
  try {
    const walJson = await AsyncStorage.getItem(walName)
    if(!walJson || walJson == null) {
        logger("AsyncStore - no wallet found for name",walName)
        return null;
    } else {
        logger("AsyncStore - wallet found",walName)
        return walJson
    }
  } catch(e) {
    console.error("AsyncStore - Could not get async wallet,",error)
    return null;
  }
  return null;
}

export async function status() {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch(e) {
    console.error("AsyncStore - Could not get async wallet status,",error)
  }

  logger("AsyncStore",keys)
}

export async function storeWallet(walName: string,walJson: string) {
    try {
        logger('AsyncStore - start storing wallet',walName)
        const oldWallet = await AsyncStorage.setItem(walName, walJson)
        if(oldWallet && oldWallet !== null) {
          logger("AsyncStore - Replace previous wallet",oldWallet)
        }
        return true;
    } catch(error) {
        console.error("AsyncStore - Could not store async wallet,",error)
        return false;
    }
    return false;
}