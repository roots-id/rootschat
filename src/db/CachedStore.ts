import { logger } from '../logging'

let cachedWallets: { [name: string]: string } = {};

export function getWallet(walName: string) {
    const wal = cachedWallets[walName]
    logger("cachedstore - Got wallet",walName,"from cache",wal)
    return wal;
}

export function hasWallet(walName: string) {
    const wal = getWallet(walName)
    const hasWal = !(!wal || wal == null);
    logger("cachedstore - has wallet",hasWal)
    return hasWal;
}

export function storeWallet(walName: string,walJson: string) {
    try {
        logger("cachedstore - storing wallet",walName)
        const oldWallet = cachedWallets[walName]
        cachedWallets[walName] = walJson
        if(oldWallet && oldWallet !== null) {
          logger("cachedstore - Replace previous wallet",oldWallet)
        }
        return true;
    } catch(error) {
        console.error("cachedstore - Could not store wallet",error)
        return false;
    }
    return false;
}