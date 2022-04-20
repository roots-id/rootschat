import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logging'

export async function getChat(chatAlias: string) {
  try {
    const chatJson = await AsyncStorage.getItem(chatAlias)
    if(!chatJson || chatJson == null) {
        logger("AsyncStore - no chat found for name",chatAlias)
        return null;
    } else {
        logger("AsyncStore - chat found",chatAlias)
        return chatJson
    }
  } catch(e) {
    console.error("AsyncStore - Could not get async chat,",error)
    return null;
  }
  return null;
}

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

export async function hasChat(chatAlias: string) {
    const chatJson = await getChat(chatAlias)
    const hasChat = !(!chatJson || chatJson == null);
    if(hasChat) {
        logger("AsyncStore - has chat",chatJson)
    } else {
        logger("AsyncStore - no chat found")
    }
    return hasChat;
}

export async function hasWallet(walName: string) {
    const walJson = await getWallet(walName)
    const hasWal = !(!walJson || walJson == null);
    if(hasWal) {
        logger("AsyncStore - has wallet",walJson)
    } else {
        logger("AsyncStore - no wallet found")
    }
    return hasWal;
}

export async function status() {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch(e) {
    console.error("AsyncStore - Could not get async store status,",error)
  }

  logger("AsyncStore - keys:",keys)
}

export async function storeChat(chatAlias: string,chatJson: string) {
    try {
        logger('AsyncStore - start storing chat',chatAlias)
        const oldChat = await AsyncStorage.setItem(chatAlias, chatJson)
        if(oldChat && oldChat !== null) {
          logger("AsyncStore - Replace previous chat",oldChat)
        }
        return true;
    } catch(error) {
        console.error("AsyncStore - Could not store async chat,",error)
        return false;
    }
    return false;
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