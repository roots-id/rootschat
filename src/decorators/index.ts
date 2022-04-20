import { logger } from '../logging';

export function createChat(chatAlias: string, messages: string[], titlePrefix?: string) {
    const chat = {
         id: chatAlias,
         published: false,
         title: titlePrefix+chatAlias,
         messages: messages,
    }
    logger("decorators - created chat decorator",chat)
    return chat;
}