import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../logging'

export async function getDecorator(alias: string) {
  try {
    const decoratorJson = await AsyncStorage.getItem(alias)
    if(!decoratorJson || decoratorJson == null) {
        logger("AsyncStore - no decorator found for name",alias)
        return null;
    } else {
        logger("AsyncStore - decorator found",alias)
        return decoratorJson
    }
  } catch(e) {
    console.error("AsyncStore - Could not get async decorator",alias,error)
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

export async function hasDecorator(alias: string) {
    const decoratorJson = await getDecorator(alias)
    const hasDecorator = !(!decoratorJson || decoratorJson == null);
    if(hasDecorator) {
        logger("AsyncStore - has decorator",alias,decoratorJson)
    } else {
        logger("AsyncStore - no decorator found",alias)
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

export async function storeDecorator(alias: string, decoratorJson: string) {
    try {
        logger('AsyncStore - start storing decorator',alias)
        const oldDecorator = await AsyncStorage.setItem(alias, decoratorJson)
        if(oldDecorator && oldDecorator !== null) {
          logger("AsyncStore - Replace previous decorator",alias,oldDecorator)
        }
        return true;
    } catch(error) {
        console.error("AsyncStore - Could not store async decorator",alias,error)
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