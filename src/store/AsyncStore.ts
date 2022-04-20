import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logging'

export async function getDecorator(alias: string, type: string) {
  try {
    const decoratorJson = await AsyncStorage.getItem(getKey(alias,type))
    if(!decoratorJson || decoratorJson == null) {
        logger("AsyncStore - no decorator found for name",alias,"w/type",type)
        return null;
    } else {
        logger("AsyncStore - decorator found",alias,"w/type",type)
        return decoratorJson
    }
  } catch(e) {
    console.error("AsyncStore - Could not get async decorator",alias,"w/type",type,error)
    return null;
  }
  return null;
}

function getKey(alias: string, type: string) {
    const key = type+alias
    logger("AsyncStore - made key",key)
    return key
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

export async function hasDecorator(alias: string, type: string) {
    const decoratorJson = await getDecorator(alias,type)
    const hasDecorator = !(!decoratorJson || decoratorJson == null);
    if(hasDecorator) {
        logger("AsyncStore - has decorator",alias,"w/type",type,decoratorJson)
    } else {
        logger("AsyncStore - no decorator found",alias,"w/type",type)
    }
    return hasDecorator;
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

export async function storeDecorator(alias: string, type: string, decoratorJson: string) {
    try {
        logger('AsyncStore - start storing decorator',alias,"w/type",type)
        const oldDecorator = await AsyncStorage.setItem(getKey(alias,type), decoratorJson)
        if(oldDecorator && oldDecorator !== null) {
          logger("AsyncStore - Replace previous decorator",alias,"w/type",type,oldDecorator)
        }
        return true;
    } catch(error) {
        console.error("AsyncStore - Could not store async decorator",alias,"w/type",type,error)
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