import rwLogo from '../assets/LogoOnly1024.png'
import perLogo from '../assets/smallBWPerson.png'
import apLogo from '../assets/ATALAPRISM.jpeg'
//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;
export const personLogo = perLogo;
export const prismLogo = apLogo;

export const currentTime = new Date().getTime();

export const BLOCKCHAIN_URI_MSG_TYPE = "blockchainUri";

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

const testWallet = {
    _id: "walletname1",
    mnemonic: ["cousin", "then", "airport", "output", "wheel", "peanut", "coach", "nerve", "shadow", "axis", "cloth", "timber"],
    passphrase: "password1",
    dids: [did1],
    importedCredentials: [],
    issuedCredentials: []
}
export function getWallet() {
    return testWallet
}

export const rootsBotDisplay =
{
    id: "RootsWalletBot1",
    displayName: "RootsWallet",
    displayPictureUrl: rootsLogo,
}
export const prismBotDisplay =
{
    id: "PrismBot1",
    displayName: "Atala Prism",
    displayPictureUrl: prismLogo,
}
export const bartenderBotDisplay =
{
    id: "BartenderBot1",
    displayName: "Bartender",
    displayPictureUrl: personLogo,
}
export const userDisplay =
{
    id: did1.alias,
    displayName: "Test User",
    displayPictureUrl: personLogo,
}

export const channels = [
    {
      id: "achievementSecureChannel",
      joined: true,
      members: [rootsBotDisplay.id,userDisplay.id],
      title: "(Faked) Achievements Secure Channel",
      type: "DIRECT",
    },
    {
      id: "exampleBartenderSecureChannel",
      joined: true,
      members: [userDisplay.id,bartenderBotDisplay.id],
      title: "(Coming Soon) Example Bartender Secure Channel",
      type: "PUBLIC",
    },
    {
      id: "exampleRevokedCredentialChannel",
      joined: true,
      members: [rootsBotDisplay.id,userDisplay.id],
      title: "(Faked) Example Credential Revocation Channel",
      type: "DIRECT",
    },
];

//    {
//      id: 2,
//      joined: true,
//      title: "Reputation Example",
//      type: "OTHER",
//    },

export function addChannel(channelJson) {
    if(!channels.includes(channelJson.id)) {
        channels.push(channelJson)
        channelsMessages[channelJson.id] = comingSoonMsgs;
    } else {
        console.log("Channel",channelJson.id,"already exists.  Not creating")
    }
}

export const walCliCommands=[
" ./wal.sh new-wallet holder_wallet -m poet,account,require,learn,misery,monitor,medal,great,blossom,steak,rain,crisp",
"./wal.sh new-did holder_wallet holder_did",
"./wal.sh new-did issuer_wallet issuer_did -i",
"./wal.sh publish-did issuer_wallet issuer_did",
"./wal.sh show-did holder_wallet holder_did",
"./wal.sh issue-cred issuer_wallet issuer_did did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d:Cj8KPRI7CgdtYXN0ZXIwEAFKLgoJc2VjcDI1NmsxEiEDA7B2nZ_CvcIdkU2ovzBEovGzjwZECMUeHUeNo5_0Jug credential_a",
"./wal.sh verify-cred issuer_wallet issued credential_a",
"./wal.sh export-cred issuer_wallet credential_a credential_a.json",
"cat credential_a.json",
"./wal.sh import-cred holder_wallet credential_a credential_a.json",
"./wal.sh verify-cred holder_wallet imported credential_a",
"./wal.sh revoke-cred issuer_wallet credential_a",
"./wal.sh verify-cred issuer_wallet issued credential_a",
]

export const walCliMsgs = [
    {
        body: "wallet created",
        type: "status",
        createdTime: currentTime+986,
        user: rootsBotDisplay,
    },
    {
        body: "DID created",
        type: "status",
        createdTime: currentTime+987,
        user: rootsBotDisplay,
    },
    {
        body: "DID created",
        type: "status",
        createdTime: currentTime+988,
        user: rootsBotDisplay,
    },
    {
        body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=1f4f19f2016c4468777da24a5656b9b009550a601192960e22f1233af4e8b3ef",
        type: BLOCKCHAIN_URI_MSG_TYPE,
        createdTime: currentTime+989,
        user: prismBotDisplay,
    },
    {
        body: JSON.stringify({alias: "holder_did",
            didIdx: 0,
            uriCanonical: "did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d",
            uriLongForm: "did:prism:654a4a9113e7625087fd0d3143fcac05ba34013c55e1be12daadd2d5210adc4d:Cj8KPRI7CgdtYXN0ZXIwEAFKLgoJc2VjcDI1NmsxEiEDA7B2nZ_CvcIdkU2ovzBEovGzjwZECMUeHUeNo5_0Jug",
            operationHash: "",
            keyPairs: [
                {
                    keyId: "master0",
                    didIdx: 0,
                    keyType: 0,
                    keyIdx: 0,
                    privateKey: "9c2a64d860cb86ce0af23787fccd2ad12a73d5e758c706d8567de49dec2ec029",
                    publicKey: "0403b0769d9fc2bdc21d914da8bf3044a2f1b38f064408c51e1d478da39ff426e884c34858bcfa2afbd3cc4e4b1a8d3fc848b74f92360e91729aaf8d77d8207963",
                    revoked: false
                }
            ]
        }),
        type: "jsonDid",
        createdTime: currentTime+990,
        user: prismBotDisplay,
    },
    {
        body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
        type: BLOCKCHAIN_URI_MSG_TYPE,
        createdTime: currentTime+991,
        user: prismBotDisplay,
    },
    {
        body: "Credential issued",
        type: "status",
        createdTime: currentTime+992,
        user: rootsBotDisplay,
    },
    {
        body: "Valid credential.",
        type: "status",
        createdTime: currentTime+993,
        user: rootsBotDisplay,
    },
    {
        body: "Credential exported",
        type: "status",
        createdTime: currentTime+994,
        user: rootsBotDisplay,
    },
    {
      body: JSON.stringify({
                 encodedSignedCredential: "eyJpZCI6ImRpZDpwcmlzbTozYWU4YmFkYzAzMWEzZjU2YjlmYzZiNWEwMmVhNDczNWJmY2RmM2I5ODFkODc4NjBkNWMxNjkzYzBkODA2OGJiIiwia2V5SWQiOiJpc3N1aW5nMCIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7Im5hbWUiOiJBbGljZSIsImRlZ3JlZSI6IkNvbXB1dGVyIFNjaWVuY2UiLCJkYXRlIjoiMjAyMi0wMy0xMCAxNzoxNjo1OCIsImlkIjoiZGlkOnByaXNtOjY1NGE0YTkxMTNlNzYyNTA4N2ZkMGQzMTQzZmNhYzA1YmEzNDAxM2M1NWUxYmUxMmRhYWRkMmQ1MjEwYWRjNGQ6Q2o4S1BSSTdDZ2R0WVhOMFpYSXdFQUZLTGdvSmMyVmpjREkxTm1zeEVpRURBN0IyblpfQ3ZjSWRrVTJvdnpCRW92R3pqd1pFQ01VZUhVZU5vNV8wSnVnIn19.MEUCIQC8WiVfl6nH-DIBdK9SN0SzqYNN49WnuECk77V8-vUIQwIgHLZUkCRivnv7NiIurd2YR5MWjUUIbbKHDJovnbexeNI",
                 proof: {
                     "hash": "bbb3fee220db35c2fc717ca61e0e55e2f670cfb238ff0484ea768dd1aaf23522",
                     "index": 0,
                     "siblings": [
                     ]
                 }
             }),
      type: "jsonCredential",
          createdTime: currentTime+995,
          user: prismBotDisplay,
    },
    {
      body: "Credential imported",
      type: "status",
          createdTime: currentTime+996,
          user: rootsBotDisplay,
    },
    {
      body: "Valid credential.",
      type: "status",
          createdTime: currentTime+997,
          user: rootsBotDisplay,
    },
    {
      body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
      type: BLOCKCHAIN_URI_MSG_TYPE,
          createdTime: currentTime+998,
          user: prismBotDisplay,
    },
    {
      body: "Credential revoked",
      type: "status",
          createdTime: currentTime+999,
          user: rootsBotDisplay,
    },
    {
      body: "Invalid credential.",
      type: "status",
    createdTime: currentTime+1000,
    user: rootsBotDisplay,
    }
]

export var walCommandsMsgs =  walCliMsgs.reduce(function(result, message, index) {
  result.push(message);
  result[index]["command"]=walCliCommands[index];
  result[index]["id"]="walCli"+index
  return result;
}, []);

export const achievementIntroMsg = "You have a new achievement: ";
export const achievementMsgs = [
    {
      id: "message1",
      body: achievementIntroMsg+"Opened RootsWallet!",
      type: "text",
      createdTime: currentTime,
      user: rootsBotDisplay,
    },

    {
      id: "message2",
      body: "{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      type: "jsonCredential",
      createdTime: currentTime+1000,
      user: rootsBotDisplay,
    },
    {
      id: "message3",
      body: achievementIntroMsg+"Clicked Example!",
      type: "text",
      createdTime: currentTime+2000,
      user: rootsBotDisplay,
    },
    {
      id: "message4",
      body: "{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      type: "jsonCredential",
      createdTime: currentTime+3000,
      user: rootsBotDisplay,
    },
];
export const comingSoonMsgs = [
    {
      id: "message1",
      body: "Welcome to your new secure channel!",
      type: "text",
      createdTime: currentTime,
      user: rootsBotDisplay,
    },
];

export const channelsMessages = []
channelsMessages[channels[0].id] = achievementMsgs;
channelsMessages[channels[2].id] = walCommandsMsgs;
channelsMessages[channels[1].id] = comingSoonMsgs;