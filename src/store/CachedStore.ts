import { logger } from '../logging'

let cachedChats: {
     [id: string]: string,
     [published: string]: bool,
     [title: string]: string,
     [messages: string]: string[]
 } = {}; = {};


let cachedWallets: { [walName: string]: string } = {};

export function getChat(chatName: string) {
    const chatJson = cachedChat[chatName]
    logger("CachedStore - ",chatName,"in cache is",chatJson)
    return chatJson;
}

export function getWallet(walName: string) {
    const walJson = cachedWallets[walName]
    logger("CachedStore - ",walName,"in cache is",walJson)
    return walJson;
}

export function hasChat(chatAlias: string) {
    const chatJson = getChat(chatAlias)
    const hasChat = !(!chatJson || chatJson == null);
    if(hasChat) {
        logger("CachedStore - has chat",chatJson)
    } else {
        logger("CachedStore - no chat found for alias",chatAlias)
    }
    return hasChat;
}

export function hasWallet(walName: string) {
    const walJson = getWallet(walName)
    const hasWal = !(!walJson || walJson == null);
    if(hasWal) {
        logger("CachedStore - has wallet",walJson)
    } else {
        logger("CachedStore - no wallet found")
    }
    return hasWal;
}

export async function status() {
    logger("CachedStore - wallets:",Object.keys(cachedWallets))
    logger("CachedStore - chats:",Object.keys(cachedChats))
}

export function storeChat(chatAlias: string, chatJson: string) {
    try {
        logger("CachedStore - storing chat",chatAlias,":",chatJson)
        const oldChat = cachedChats[chatAlias]
        cachedChats[chatAlias] = chatJson
        if(oldChat && oldChat !== null) {
            logger("CachedStore - Replace previous chatJson",oldChat)
        }
        return true;
    } catch(error) {
        console.error("CachedStore - Could not store chat",error)
        return false;
    }
    return false;
}

export function storeWallet(walName: string,walJson: string) {
    try {
        logger("CachedStore - storing wallet",walName,":",walJson)
        const oldWallet = cachedWallets[walName]
        cachedWallets[walName] = walJson
        if(oldWallet && oldWallet !== null) {
          logger("CachedStore - Replace previous wallet",oldWallet)
        }
        return true;
    } catch(error) {
        console.error("CachedStore - Could not store wallet",error)
        return false;
    }
    return false;
}