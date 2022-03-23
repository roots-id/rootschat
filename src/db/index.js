import rwLogo from '../assets/LogoOnly1024.png'
import perLogo from '../assets/smallBWPerson.png'

export const currentTime = new Date().getTime();

//import Realm from "realm";

export const members1 = [
    {
      displayName: "jim",
    },
]

//const DIDs = [
//createDID("testDid1",1), createDID("testDid2",2), createDID("testDid3",3), createDID("testDid4",4)
//]

export const channels = [
    {
      id: 0,
      joined: true,
      members: members1,
      name: "Channel 1",
      title: "Achievements Example",
      type: "DIRECT",
    },
    {
      id: 1,
      joined: true,
      members: [],
      name: "Channel 2",
      title: "Bartender Example",
      type: "PUBLIC",
    },
    {
      id: 2,
      joined: true,
      name: "Channel 3",
      title: "Reputation Example",
      type: "OTHER",
    },
    {
      id: 3,
      joined: false,
      name: "Channel 4",
      title: "Revoked Credential Example",
      type: "DIRECT",
    },
];

//https://lh5.googleusercontent.com/bOG9vTJDA73jNwAtwm1ioc__Nr1Ch199Xo-4R9xFgJW_hsMsNwef2WQCwm-8_c9d3B8zF7vSEF5E-nLIMOOaZJlPz_dKAo-j_s102ddaNla0iiywfT2fAljxrsdrkxDllg=w1280
//https://lh5.googleusercontent.com/iob7iL2ixIzrP24PvQVJjpnmt3M2HvJIS7E3mIg2qWRMIJIlnIo27qjAS4XL9tC3ZwhZ78sbpwygbK2hDjx-8z2u_WaunTLxpEFgHJngBljvF8VvJ3QoAiyVfjEmthEEWQ=w1280
export const rootsLogo = rwLogo;
export const personLogo = perLogo;

export const users = [
    {
        id: "RootsWalletBot1",
        displayName: "RootsWallet",
        displayPictureUrl: rootsLogo,
    },
    {
        id: "TestUser1",
        displayName: "TestUser",
        displayPictureUrl: personLogo,
    },
];

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
          user: users[0],
    },
    {
      body: "DID created",
      type: "status",
          createdTime: currentTime+987,
          user: users[0],
    },
    {
      body: "DID created",
      type: "status",
          createdTime: currentTime+988,
          user: users[0],
    },
    {
      body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=1f4f19f2016c4468777da24a5656b9b009550a601192960e22f1233af4e8b3ef",
      type: "blockchainUri",
          createdTime: currentTime+989,
          user: users[0],
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
            user: users[0],
    },
    {
      body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
      type: "blockchainUri",
          createdTime: currentTime+991,
          user: users[0],
    },
    {
      body: "Credential issued",
      type: "status",
          createdTime: currentTime+992,
          user: users[0],
    },
    {
      body: "Valid credential.",
      type: "status",
          createdTime: currentTime+993,
          user: users[0],
    },
    {
      body: "Credential exported",
      type: "status",
          createdTime: currentTime+994,
          user: users[0],
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
          user: users[0],
    },
    {
      body: "Credential imported",
      type: "status",
          createdTime: currentTime+996,
          user: users[0],
    },
    {
      body: "Valid credential.",
      type: "status",
          createdTime: currentTime+997,
          user: users[0],
    },
    {
      body: "https://explorer.cardano-testnet.iohkdev.io/en/transaction?id=0ce00bc602ef54dfc52b4106bebcafb72c2447bdf666cd609d50fd3a7e9d2474",
      type: "blockchainUri",
          createdTime: currentTime+998,
          user: users[0],
    },
    {
      body: "Credential revoked",
      type: "status",
          createdTime: currentTime+999,
          user: users[0],
    },
    {
      body: "Invalid credential.",
      type: "status",
    createdTime: currentTime+1000,
    user: users[0],
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
      user: users[0],
    },

    {
      id: "message2",
      body: "{subject: you,issuer: RootsWallet,credential: Opened RootsWallet}",
      type: "jsonCredential",
      createdTime: currentTime+1000,
      user: users[0],
    },
    {
      id: "message3",
      body: achievementIntroMsg+"Clicked Example!",
      type: "text",
      createdTime: currentTime+2000,
      user: users[0],
    },
    {
      id: "message4",
      body: "{subject: you,issuer: RootsWallet,credential: Clicked Example}",
      type: "jsonCredential",
      createdTime: currentTime+3000,
      user: users[0],
    },
];
export const comingSoonMsgs = [
    {
      id: "message1",
      body: "Coming Soon....",
      type: "text",
      createdTime: currentTime,
      user: users[0],
    },
];

export const channelsMessages = []
channelsMessages[channels[0].id] = achievementMsgs;
channelsMessages[channels[1].id] = comingSoonMsgs;
channelsMessages[channels[2].id] = comingSoonMsgs;
channelsMessages[channels[3].id] = walCommandsMsgs;