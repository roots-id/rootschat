import * as AsyncStore from './AsyncStore'
import * as CachedStore from './CachedStore'
//TODO move this into AsyncStore so they can work together?
import * as SecureStore from 'expo-secure-store';
import { logger } from '../logging'

const quickReplyResults = {}
const credRequests = {}

export async function status() {
    logger("store - Prompting for status messages")
    await AsyncStore.status();
    CachedStore.status();
}

export function getWallet(walName: string) {
    const walJson = CachedStore.getWallet(walName);
    if (!walJson || walJson == null) {
        logger('store - no cached wallet found')
        return;
    } else {
        logger('store - cached wallet found',walJson)
        return walJson;
    }
}

export async function hasWallet(walName: string) {
    if(!CachedStore.hasWallet(walName)) {
        const hasWallet = await AsyncStore.hasWallet(walName)
        if(hasWallet) {
            logger("store - Has wallet in store",walName);
            return true;
        } else {
            logger("store - Does not have wallet",walName);
            return false;
        }
    }
    else{
        logger("store - Has wallet in cache",getWallet());
        return true;
    }
}

export async function restoreWallet(passphrase: string) {
    try {
        //TODO use keychain for secrets, etc.
        const walName = await SecureStore.getItemAsync(passphrase);
        logger("restoring",walName,"w/passphrase",passphrase)
        if(!walName || walName == null) {
            logger("store - cannot restore wallet w/passphrase", passphrase)
            return false;
        }else {
            const walJson = await AsyncStore.getWallet(walName)
            if(walJson) {
                logger("store - putting restored wallet in cache",walName,":",walJson)
                CachedStore.storeWallet(walName,walJson)
                return true;
            } else {
                logger("store - No wallet found for walName", walName)
                return false;
            }
        }
    } catch (error) {
        logger("store - getting wallet from secure store failed",error)
        return false
    }
}

export async function saveWallet(walName: string, walPass: string, walJson: string) {
    logger("store - Saving wallet",walName,":",walJson)
    if(walJson && walJson.length > 0) {
        try {
            logger("store - Saving wallet to storage",walName,":",walJson)
            //TODO use keychain to encrypt values
            const result = await storeWallet(walName,walPass,walJson)
            if(result) {
                logger("store - successfully saved wallet",walName,":",result)
                return true;
            } else {
                logger("store - failed to save wallet", walName,":",result)
                return false;
            }
        } catch(error) {
            logger("store - could not save wallet",walName,":",walJson,error)
            return false;
        }
    } else {
        logger("store - Could not save wallet",walName,":",walJson)
        return false;
    }
}

async function storeWallet(walName: string, walPass: string, walJson: string) {
    const errMsgs = [];
    errMsgs.push("store - can't store wallet "+walName);
    errMsgs.push("wallet "+walJson);
    if(walJson) {
        try {
            logger('store - secure storing wallet',walName,"w/ pass",walPass)
            await SecureStore.setItemAsync(walPass,walName);
            if(await AsyncStore.storeWallet(walName,walJson)) {
                CachedStore.storeWallet(walName,walJson)
                logger('store - secure stored wallet')
                return true
            } else {
                logger('store - could not store in async store')
                return false
            }
        } catch(error) {
            errMsgs.push(error.message)
            logger(...errMsgs)
            return false;
        }
    } else {
        logger(...errMsgs)
        return false;
    }
}

export async function hasDecorator(alias: string) {
    if(!CachedStore.hasDecorator(alias)) {
        const persisted = await AsyncStore.hasDecorator(alias)
        if(persisted) {
            logger("store - has decorator",alias);
            return true;
        } else {
            logger("store - does not have decorator",alias);
            return false;
        }
    }
    else{
        logger("store - has decorator in cache",getDecorator(alias));
        return true;
    }
}

export function getDecorator(alias: string) {
    const decorJson = CachedStore.getDecorator(alias);
    if (!decorJson || decorJson == null) {
        logger('store - decorator not found in cache',alias)
        return;
    } else {
        logger('store - decorator found in cache',alias,decorJson)
        return decorJson;
    }
}

export function getDecorators(regex: RegExp) {
    const decorators = CachedStore.getDecorators(regex);
    if (!decorators || decorators == null || decorators.length <= 0) {
        logger('store - no cached decorators found')
        return decorators;
    } else {
        logger('store - cached decorators found',decorators.length)
        decorators.forEach(decorator => logger("decorator",decorator))
        return decorators;
    }
}

export async function restoreByRegex(regex: RegExp) {
    logger("store - restoring keys by regex",regex)
    keys = await AsyncStore.getStoredKeys(regex)
    logger("store - restored keys by regex",regex,":\n",keys)
    return restoreDecorators(keys)
}

export async function restoreDecorators(aliases: string[]) {
    if(!aliases || aliases == null || aliases.length <= 0) {
        logger("store - No aliases to restore",aliases)
        return true;
    } else {
        try {
            const allRestored = await aliases.reduce(async (previousStatus,alias) => {
                logger("store - restoring",alias)
                const decorJson = await AsyncStore.getDecorator(alias)
                if(!decorJson || decorJson == null) {
                    logger("store - No decorator found",alias)
                    previousStatus = previousStatus && false;
                    return previousStatus
                } else {
                    logger("store - putting restored decorator in cache",alias,":",decorJson)
                    const result = CachedStore.storeDecorator(alias,decorJson)
                    previousStatus = previousStatus && result;
                    return previousStatus
                }
            },true);
            logger("were all decorators restored",allRestored)
            return allRestored;
        } catch (error) {
            logger("store - getting decorators from storage failed",aliases,error)
            return false;
        }
    }
}


export async function saveDecorator(alias: string, decorJson: string) {
    if(await hasDecorator(alias)) {
        logger("store - decorator already exists.  Not adding",alias)
        return false
    } else {
        return updateDecorator(alias,decorJson);
    }
}

async function storeDecorator(alias: string, decorJson: string) {
    const errMsgs = [];
    errMsgs.push("store - can't store decorator "+alias);
    errMsgs.push("decorator "+decorJson);
    if(decorJson) {
        try {
            if(await AsyncStore.storeDecorator(alias, decorJson)) {
                CachedStore.storeDecorator(alias, decorJson)
                logger('store - cache stored decorator',decorJson)
                return true
            } else {
                logger('store - could not store in async store')
                return false
            }
        } catch(error) {
            errMsgs.push(error.message)
            logger(...errMsgs)
            return false;
        }
    } else {
        logger(...errMsgs)
        return false;
    }
}

export async function updateDecorator(alias: string, decorJson: string) {
    try {
        await storeDecorator(alias, decorJson);
        logger("store - decorator added/updated",alias,"json:",decorJson)
        return true
    } catch(error) {
        console.error("Could not update decorator",alias,decorJson)
        return false
    }
}

export function getQuickReplyResult(replyId: string) {
    logger("store - Getting quick reply result for id",replyId,"=",quickReplyResults[replyId])
    return quickReplyResults[replyId]
}

export function addQuickReplyResult(replyId: string,result: string) {
    logger("store - Adding quick reply result",replyId,"=",result)
    quickReplyResults[replyId]=result
}

export function getCredRequests() {
    return credRequests
}