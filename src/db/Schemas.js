//const keyMaster0 =
//{
//    keyId: "master0",
//    didIdx: 0,
//    keyType: 0,
//    keyIdx: 0,
//    privateKey: "1dac8028572c5e6850a947afda078c89b65ac14f06ce942a29d7eed91cbc4adf",
//    publicKey: "04eec30982663533959864ab0bb12154e6e35e109235fad3e06dd17ee40447c62a9655f0ad759c509e9efce6b619c61e7691b79204e5d2b0229511e3f1bdd699fd",
//    revoked: false,
//}

export const KeyPair = {
    name: "KeyPair",
    properties: {
        keyId: "string",
        didIdx: "int",
        keyType: "int",
        keyIdx: "int",
        privateKey: "string",
        publicKey: "string",
        revoked: "bool"
    }
}

//const did1 =
//{
//    alias: "didAlias1",
//    didIdx: 0,
//    uriCanonical: "did:prism:395f25c458441548db42ca4265036b6e73a524b79c685f7414bdecc668aaf9f2",
//    uriLongForm: "did:prism:395f25c458441548db42ca4265036b6e73a524b79c685f7414bdecc668aaf9f2:Cr8BCrwBEjsKB21hc3RlcjAQAUouCglzZWNwMjU2azESIQPuwwmCZjUzlZhkqwuxIVTm414QkjX60-Bt0X7kBEfGKhI8Cghpc3N1aW5nMBACSi4KCXNlY3AyNTZrMRIhAlhoA5dlc3j-hpuw0E8VVpbIm6GXap8OKkiscX3I1Sj5Ej8KC3Jldm9jYXRpb24wEAVKLgoJc2VjcDI1NmsxEiEDs5FhS45G7aObgQbHDM2tzVQ8va946012QeN070i5WbQ",
//    operationHash: "",
//    keyPairs: [
//        keyMaster0,
//        keyIssuer0,
//        keyRevocation0,
//    ]
//}
export const Did = {
    name: "Did",
    properties: {
        alias: "string",
        didIdx: "int",
        uriCanonical: "string",
        uriLongForm: "string",
        operationHash: "string",
        keyPairs: "KeyPair[]",
    }
}

//    claim: {
//        content: "{\"name\": \"RootsWallet\",\"degree\": \"law\",\"date\": \"2022-04-04 09:10:04\"}",
//        subjectDid: didLong,
//    },
export const Claim = {
    name: "Credential",
    properties: {
        content: "string",
        subjectDid: "string",
    }
}

//const cred = {
//    alias: credAlias,
//    issuingDidAlias: chat.id,
//    claim: {
//        content: "{\"name\": \"RootsWallet\",\"degree\": \"law\",\"date\": \"2022-04-04 09:10:04\"}",
//        subjectDid: didLong,
//    },
//    verifiedCredential: {
//        encodedSignedCredential: "",
//        proof: {
//            hash: "",
//            index: -1,
//            siblings: [],
//        },
//    },
//    batchId: "",
//    credentialHash: "",
//    operationHash: "",
//    revoked: false,
//}
export const Credential = {
    name: "Credential",
    properties: {
        alias: "string",
        issuingDidAlias: "",
        claim: "Claim",
        verifiedCredential: "Credential",
        batchId: "string",
        credentialHash: "string",
        operationHash: "string",
        revoked: false,
    }
}

//        mnemonic: "string[]",
//        passphrase: "string",
//        dids: "Did[]",
//        importedCredentials: "Credential[]",
//        issuedCredentials: "Credential[]",
export const WALLET_SCHEMA = {
    name: "Wallet",
    properties: {
        _id: "string",

    },
    primaryKey: "_id",
}