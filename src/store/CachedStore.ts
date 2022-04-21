import { logger, warn } from '../logging'

let cachedDecorators: {[alias: string]: string } = {};
let cachedWallets: { [walName: string]: string } = {};

export function getDecorator(alias: string) {
    const decoratorJson = cachedDecorators[alias]
    logger("CachedStore - get",alias,"in cache is",decoratorJson)
    return decoratorJson;
}

export function getDecorators(regex: RegExp) {
    const keys = Object.keys(cachedDecorators).filter((key) => regex.test(key))
    logger("CachedStore - getting decorators",keys,"w/regex",regex)
    const decorators = []
    if(!keys || keys == null || keys.length <= 0) {
        logger("CachedStore - No decorators found w/regex",regex);
        return decorators;
    } else {
        logger("CachedStore - retrieving # of decorators",keys.length,"w/regex",regex);
        decorators.concat(keys.map(key => cachedDecorators[key]))
        logger("CachedStore - retrieved # of decorators",decorators.length,"w/regex",regex);
        return decorators;
    }
}

export function getWallet(walName: string) {
    const walJson = cachedWallets[walName]
    logger("CachedStore - ",walName,"in cache is",walJson)
    return walJson;
}

export function hasDecorator(alias: string) {
    const decoratorJson = getDecorator(alias)
    const noDecorator = (!decoratorJson || decoratorJson == null);
    if(noDecorator) {
        logger("CachedStore - does not have decorator",alias)
        return false
    } else {
        logger("CachedStore - has decorator",alias,decoratorJson)
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

export function storeDecorator(alias: string, decoratorJson: string) {
    try {
        logger("CachedStore - storing decorator",alias,":",decoratorJson)
        const oldDecorator = cachedDecorators[alias]
        cachedDecorators[alias] = decoratorJson
        if(oldDecorator && oldDecorator !== null) {
            logger("CachedStore - Replace previous decoratorJson",alias,oldDecorator)
        }
        return true;
    } catch(error) {
        console.error("CachedStore - Could not store decorator",alias,error)
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