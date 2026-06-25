import { defineStore } from 'pinia'
import { db } from '../db'
import { MessageProps, MessageStatus, UpdatedStreamData } from '../types'

// 1. 定义 Store 的状态类型接口
export interface MessageStore {
    items: MessageProps[] // 消息列表，包含多个 MessageProps 对象
}

// 2. 创建名为 'message' 的 Store
export const useMessageStore = defineStore('message', {
    state: (): MessageStore => {
    return {
        items: [] // 1. 初始化空的消息列表
    }
    },

    actions: {
        // 2. 定义异步方法：根据会话 ID 获取消息
        async fetchMessagesByConversation(conversationId: number) {
            // 3. 查询数据库
            const items = await db.messages.where({ conversationId }).toArray()
            // 4. 更新本地状态
            this.items = items
        },
        // 新建对话
        async createMessage(createdData : Omit<MessageProps, 'id'>){
            const newMessageId = await db.messages.add(createdData)
            this.items.push({id:newMessageId , ...createdData})
            return newMessageId

        },
        //更新message
        async updateMessage(messageId: number, updatedData: Partial<MessageProps>) {
            await db.messages.update(messageId, updatedData)
            const index = this.items.findIndex(item => item.id === messageId)
            if (index !== -1) {
                this.items[index] = { ...this.items[index], ...updatedData }
            }
        }
    },
    getters: {
    // 获取最后对话的message
    getLastQuestion: (state) => (conversationId: number) => {
        return state.items.findLast(item => item.conversationId === conversationId && item.type === 'question')
    },
    //模型生成时不能对话
    isMessageLoading:(state) => {
        return state.items.some(item => item.status === 'loading' || item.status === 'streaming')
    }
}
})