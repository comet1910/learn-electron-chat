import {defineStore} from 'pinia'
import { ConversationProps } from '../types'
import {db} from '../db'

export interface ConversationStore {
  items: ConversationProps[];
  selectedId:number;
}

export const useConversationStore = defineStore('conversation', {
  state: (): ConversationStore => ({
    items: [],
    selectedId: -1,
  }),
  actions:{
    async fetchConversations(){
        const items = await db.conversations.toArray()
        this.items = items
    },
    async createConversation(createdData: Omit<ConversationProps, 'id'>) {
        // 1. 将数据存入数据库，并获取自动生成的 ID
        const newCid = await db.conversations.add(createdData)
        // 2. 将该新会话添加到当前组件/Store 的内存列表中
        this.items.push({
            id: newCid,
            ...createdData
        })
        // 3. 返回新创建的 ID
        return newCid
    }
  },
  getters:{
    totalNumber : (state) => state.items.length,
    getConversationById: (state) => (id:number) =>{
        return state.items.find(item => item.id === id)
    }
  }

})