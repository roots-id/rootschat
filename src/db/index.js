export const DID_ALIAS = "alias";
export const WALLET_DIDS = "dids";

const channels = []
//indexed by channel name
const messages = {}
const userDisplays = {}
const quickReplyResults = {}

const keyMaster0 =
{
    keyId: "master0",
    didIdx: 0,
    keyType: 0,
    keyIdx: 0,
    privateKey: "1dac8028572c5e6850a947afda078c89b65ac14f06ce942a29d7eed91cbc4adf",
    publicKey: "04eec30982663533959864ab0bb12154e6e35e109235fad3e06dd17ee40447c62a9655f0ad759c509e9efce6b619c61e7691b79204e5d2b0229511e3f1bdd699fd",
    revoked: false,
}

const keyIssuer0 =
{
    keyId: "issuing0",
    didIdx: 0,
    keyType: 1,
    keyIdx: 0,
    privateKey: "359a74d4b7a9d98af4ddb699d9790a12585ffa8d60cd5b11b21f5e2e312b45d7",
    publicKey: "0458680397657378fe869bb0d04f155696c89ba1976a9f0e2a48ac717dc8d528f97b79d2fc935752c76e12de7a44c861f7bca8e9ec44ec7472d3f5d11923665e04",
    revoked: false,
}

const keyRevocation0 =
{
    keyId: "revocation0",
    didIdx: 0,
    keyType: 4,
    keyIdx: 0,
    privateKey: "5d42245d47dab93b3c25730235c9c3bd05d9518975e207819fd9eed18bdae59e",
    publicKey: "04b391614b8e46eda39b8106c70ccdadcd543cbdaf78eb4d7641e374ef48b959b4a2cf007e5403c6485708168d643a4322bd70bd081c3a665010e5c076a149d999",
    revoked: false,
}

const did1 =
{
    alias: "didAlias1",
    didIdx: 0,
    uriCanonical: "did:prism:395f25c458441548db42ca4265036b6e73a524b79c685f7414bdecc668aaf9f2",
    uriLongForm: "did:prism:395f25c458441548db42ca4265036b6e73a524b79c685f7414bdecc668aaf9f2:Cr8BCrwBEjsKB21hc3RlcjAQAUouCglzZWNwMjU2azESIQPuwwmCZjUzlZhkqwuxIVTm414QkjX60-Bt0X7kBEfGKhI8Cghpc3N1aW5nMBACSi4KCXNlY3AyNTZrMRIhAlhoA5dlc3j-hpuw0E8VVpbIm6GXap8OKkiscX3I1Sj5Ej8KC3Jldm9jYXRpb24wEAVKLgoJc2VjcDI1NmsxEiEDs5FhS45G7aObgQbHDM2tzVQ8va946012QeN070i5WbQ",
    operationHash: "",
    keyPairs: [
        keyMaster0,
        keyIssuer0,
        keyRevocation0,
    ]
}

const dids={}
dids[did1.alias] = did1

export function getDid(didAlias) {
    return dids[didAlias]
}

let wallet;
//    _id: "walletName1",
//    mnemonic: ["cousin", "then", "airport", "output", "wheel", "peanut", "coach", "nerve", "shadow", "axis", "cloth", "timber"],
//    passphrase: "password1",
//    dids: [did1],
//    importedCredentials: [],
//    issuedCredentials: []
//};

export function getWallet() {
    return wallet;
}

export function saveWallet(wal) {
    wallet = wal;
    console.log("Saved Wallet.")
}

export function createUserDisplay(userAlias, userName, userPicUrl) {
    userDisplays[userAlias] = {
        id: userAlias,
        displayName: userName,
        displayPictureUrl: userPicUrl,
    }
    console.log("Created User Display w/ alias",userAlias," = ",userDisplays[userAlias])
}

export function getUserDisplay(userAlias) {
    console.log("Getting user display",userAlias," = ",userDisplays[userAlias])
    return userDisplays[userAlias]
}

export function newChannel(didAlias, titlePrefix) {
    console.log('Creating a new channel',didAlias)
    let channelJson = {
        id: didAlias,
        joined: true,
        title: titlePrefix + didAlias,
        type: "DIRECT",
    };
    addChannel(channelJson)
    console.log(didAlias,'channel created.')
    return channelJson
}

export function getChannels() {
    return channels
}

export function addChannel(channelJson) {
    if(!channels.includes(channelJson.id)) {
        channels.push(channelJson)
        console.log("Channel",channelJson.id,"added.")
    } else {
        console.log("Channel",channelJson.id,"already exists.  Not adding")
    }
}

export function getMessages(channelId) {
    if(!messages[channelId]) {
        messages[channelId]=[]
    }
    console.log("Getting channel",channelId,"messages",messages[channelId])
    return messages[channelId];
}

export function addMessage(channelId, message) {
    console.log("Adding",message,"to channel",channelId)
    messages[channelId].push(message)
}

export function getQuickReplyResult(replyId) {
    console.log("Getting quick reply result for id",replyId,"=",quickReplyResults[replyId])
    return quickReplyResults[replyId]
}

export function addQuickReplyResult(replyId,result) {
    console.log("Adding quick reply result",replyId,"=",result)
    quickReplyResults[replyId]=result
}