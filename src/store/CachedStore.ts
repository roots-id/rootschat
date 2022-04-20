import { logger } from '../logging'

let cachedDecorators: {[alias: string]: string } = {};
let cachedWallets: { [walName: string]: string } = {};

function getCacheKey(alias: string, type: string) {
    const key = type+alias
    logger("CacheStore - made key",key)
    return key
}

export function getDecorator(alias: string, type: string) {
    const decoratorJson = cachedDecorators[getCacheKey(alias,type)]
    logger("CachedStore - get",alias,"w/type",type,"in cache is",decoratorJson)
    return decoratorJson;
}

export function getDecorators(type: string) {
    //TODO improve identifying type, w/o using startswith
    const keys = Object.keys(cachedDecorators).filter((key) => key.startsWith(type))
    logger("CachedStore - getting decorators",keys,"w/type",type)
    const decorators = []
    if(!keys || keys == null || keys.length <= 0) {
        logger("CachedStore - No decorators found w/type",type);
        return decorators;
    } else {
        logger("CachedStore - # of decorators",keys.length,"w/type",type);
        keys.forEach(alias => {
            logger("CachedStore - getting decorator",alias,"w/type",type);
            decorators.push(cachedDecorators[alias])
        })
        return decorators;
    }
}

export function getWallet(walName: string) {
    const walJson = cachedWallets[walName]
    logger("CachedStore - ",walName,"in cache is",walJson)
    return walJson;
}

export function hasDecorator(alias: string, type: string) {
    const decoratorJson = getDecorator(alias,type)
    const noDecorator = (!decoratorJson || decoratorJson == null);
    if(noDecorator) {
        logger("CachedStore - does not have decorator",alias,"w/type",type)
        return false
    } else {
        logger("CachedStore - has decorator",alias,"w/type",type,decoratorJson)
        return true
    }
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
    logger("CachedStore - decorators:",Object.keys(cachedDecorators))
}

export function storeDecorator(alias: string, type: string, decoratorJson: string) {
    try {
        logger("CachedStore - storing decorator",alias,"w/type",type,":",decoratorJson)
        const oldDecorator = cachedDecorators[getCacheKey(alias,type)]
        cachedDecorators[getCacheKey(alias,type)] = decoratorJson
        if(oldDecorator && oldDecorator !== null) {
            logger("CachedStore - Replace previous decoratorJson",alias,"w/type",type,oldDecorator)
        }
        return true;
    } catch(error) {
        console.error("CachedStore - Could not store decorator",alias,"w/type",type,error)
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