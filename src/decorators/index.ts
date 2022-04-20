import { logger } from '../logging';

export const DECORATOR_TYPE_CHAT = "chat"
export const DECORATOR_TYPE_USER = "user"

export function createChat(chatAlias: string, messages: string[], titlePrefix?: string) {
    const chat = {
         id: chatAlias,
         published: false,
         title: titlePrefix+chatAlias,
         messages: messages,
    }
    logger("decorators - created chat decorator w/keys",Object.keys(chat))
    return chat;
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