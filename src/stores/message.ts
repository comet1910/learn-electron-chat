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
        async updateMessage(streamData: UpdatedStreamData) {
            // 1. 解构传入的流式数据包
            const { messageId, data } = streamData;
            // 2. 在当前的内存列表中找到对应的消息对象
            const currentMessage = this.items.find(item => item.id === messageId);
            if (currentMessage) {
                // 3. 构造需要更新的数据对象
                const updatedData = {
                    // 判断是否结束：如果是结尾则标记为 'finished'，否则保持 'streaming'
                    status: data.is_end ? 'finished' : ('streaming' as MessageStatus),
                    // 更新时间戳
                    updatedAt: new Date().toISOString(),
                    ...(!data.is_end && {content:currentMessage.content + data.result})
                };
                // 4. 持久化保存：更新 IndexedDB 中的记录
                await db.messages.update(messageId, updatedData);
                // 5. 响应式更新：找到内存数组中的索引并替换，触发 UI 刷新
                const index = this.items.findIndex(item => item.id === messageId);
                if (index !== -1) {
                    this.items[index] = { ...this.items[index], ...updatedData };
                }
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