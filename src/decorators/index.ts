import { logger } from '../logging';

export const DECORATOR_TYPE_CHAT = "rootsChatType"
export const DECORATOR_TYPE_MESSAGE = "rootsMsgType"
export const DECORATOR_TYPE_CREDENTIAL = "rootsCredentialType"
export const DECORATOR_TYPE_CRED_REQUEST = "rootsCredRequestType"
export const DECORATOR_TYPE_USER = "rootsUserType"

export function createChat(chatAlias: string, titlePrefix?: string) {
    const chat = {
         id: chatAlias,
         published: false,
         title: titlePrefix+chatAlias,
    }
    logger("decorators - created chat decorator w/keys",Object.keys(chat))
    return chat;
}

export function createMessage(idText: string,bodyText: string,statusText: string,timeInMillis: number,userId: string,system?: boolean=false) {
    const msg = {
        id: idText,
        body: bodyText,
        type: statusText,
        createdTime: timeInMillis,
        user: userId,
        system: system,
    }
    logger("decorators - created msg decorator w/keys",Object.keys(msg))
    return msg;
}

export function createUser(userAlias: string, userName: string, userPicUrl: string) {
    const user = {
        id: userAlias,
        displayName: userName,
        displayPictureUrl: userPicUrl,
    }
    logger("decorators - create user decorator w/keys",Object.keys(user))
    return user;
}