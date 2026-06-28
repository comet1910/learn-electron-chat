import Dexie, { type EntityTable } from 'dexie'
import { providers } from './testData'
import { ProviderProps, ConversationProps, MessageProps, ModelConfig } from './types'

export const db = new Dexie('vChatDatabase') as Dexie & {
    providers: EntityTable<ProviderProps, 'id'>;
    conversations: EntityTable<ConversationProps, 'id'>;
    messages: EntityTable<MessageProps, 'id'>;
    modelConfigs: EntityTable<ModelConfig, 'id'>;
}

db.version(1).stores({
    providers: '++id, name',
    conversations: '++id, providerId',
    messages: '++id, conversationId'
})

db.version(2).stores({
    modelConfigs: '++id, name'
})

export const initProviders = async () => {
    const count = await db.providers.count()
    if (count === 0) {
        db.providers.bulkAdd(providers)
    }
}