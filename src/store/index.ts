import * as AsyncStore from './AsyncStore'
import * as CachedStore from './CachedStore'
//TODO move this into AsyncStore so they can work together?
import * as SecureStore from 'expo-secure-store';
import { logger } from '../logging'

//indexed by chat name
const messages = {}
const userDisplays: {
    id: string,
    displayName: string,
    displayPictureUrl: string} = {};
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

export function createUserDisplay(userAlias: string, userName: string, userPicUrl: string) {
    userDisplays[userAlias] = {
        id: userAlias,
        displayName: userName,
        displayPictureUrl: userPicUrl,
    }
    logger("store - Created User Display w/ alias",userAlias," = ",JSON.stringify(userDisplays[userAlias]))
    return true;
}

export function getUserDisplay(userAlias: string) {
    logger("store - Getting user display",userAlias," = ",JSON.stringify(userDisplays[userAlias]),"....")
    return userDisplays[userAlias]
}

export async function hasChat(chatAlias: string) {
    if(!CachedStore.hasChat(chatAlias)) {
        const hasChat = await AsyncStore.hasChat(chatAlias)
        if(hasChat) {
            logger("store - Has chat in store",chatAlias);
            return true;
        } else {
            logger("store - Does not have chat",chatAlias);
            return false;
        }
    }
    else{
        logger("store - Has chat in cache",getChat(chatAlias));
        return true;
    }
}

export function getChat(chatAlias) {
    const chatDecorJson = CachedStore.getChat(chatAlias);
    if (!chatDecorJson || chatDecorJson == null) {
        logger('store - no cached chat found',chatAlias)
        return;
    } else {
        logger('store - cached chat found',chatDecorJson)
        return chatDecorJson;
    }
}

export function getChats() {
    const chats = CachedStore.getChats();
    if (!chats || chats == null || chats.length <= 0) {
        logger('store - no cached chats found')
        return chats;
    } else {
        logger('store - cached chats found',chats)
        return chats;
    }
}

export async function restoreChats(chatAliases: string[]) {
    if(!chatAliases || chatAliases == null || chatAliases.length <= 0) {
        logger("store - No aliases to restore",chatAliases)
        return true;
    } else {
        try {
            const allRestored = await chatAliases.reduce(async (previousStatus,chatAlias) => {
                logger("store - restoring",chatAlias)
                const chatDecorJson = await AsyncStore.getChat(chatAlias)
                if(!chatDecorJson || chatDecorJson == null) {
                    logger("store - No chat found", chatAlias)
                    previousStatus = previousStatus && false;
                    return previousStatus
                } else {
                    logger("store - putting restored chat in cache",chatAlias,":",chatDecorJson)
                    const result = CachedStore.storeChat(chatAlias,chatDecorJson)
                    previousStatus = previousStatus && result;
                    return previousStatus
                }
            },true);
            logger("were all chats restored",allRestored)
            return allRestored;
        } catch (error) {
            logger("store - getting chat from storage failed",error)
            return false;
        }
    }
}


export async function saveChat(chatAlias: string, chatDecorJson: string) {
    if(await hasChat(chatAlias)) {
        logger("store - Chat already exists.  Not adding",chatAlias)
        return false
    } else {
        await storeChat(chatAlias, chatDecorJson);
        logger("store - Chat added",chatAlias,":",chatDecorJson)
        return true
    }
}

async function storeChat(chatAlias: string, chatDecorJson: string) {
    const errMsgs = [];
    errMsgs.push("store - can't store chat "+chatAlias);
    errMsgs.push("chat "+chatDecorJson);
    if(chatDecorJson) {
        try {
            if(await AsyncStore.storeChat(chatAlias,chatDecorJson)) {
                CachedStore.storeChat(chatAlias,chatDecorJson)
                logger('store - cache stored chat',chatDecorJson)
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

export function getMessages(chatAlias: string, startFromMsgId: string) {
    if(!messages[chatAlias]) {
        messages[chatAlias]=[]
    }

    let chMsgs = messages[chatAlias]
    logger("store - Getting chat",chatAlias,chMsgs.length,"messages")

    if(startFromMsgId) {
        for(i = 0; i < chMsgs.length; i++) {
            if(chMsgs[i]["id"] === startFromMsgId) {
                if(i < chMsgs.length-1) {
                    return chMsgs.slice(i+1,chMsgs.length)
                } else {
                    return []
                }
            }
        }
    }

    return chMsgs;
}

export function addMessage(chatAlias: string, message: string) {
    logger("store - Adding",JSON.stringify(message),".... to chat",chatAlias)
    messages[chatAlias].push(message)
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