<template>
    
      <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" >
      <h3 class="font-semibold text-gray-900">{{conversation?.title}}</h3>
      <span class="text-sm text-gray-500" >{{conversation?.updatedAt}}</span>
      </div>
        <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
        <MessageList :messages="filteredMessages" />
        </div>
        <div class="w-[80%] mx-auto h-[15%] flex items-center">
        <MessageInput  @create="sendNewMessage" v-model="inputValue" />
        </div>
  </template>
  
  <script lang="ts" setup>
  import {ref,watch , onMounted, computed} from 'vue'
  import  {useRoute} from 'vue-router'
  import MessageInput from '../components/MessageInput.vue'
  import MessageList from '../components/MessageList.vue';

  import {MessageProps , ConversationProps,CreateChatProps,MessageStatus} from '../types'
  import {db} from '../db'
  import {useConversationStore} from '../stores/conversation'
  import {useMessageStore} from '../stores/message'
  import { messages } from 'src/testData.js';

  const inputValue = ref('')
  const messageStore = useMessageStore()
  const conversationStore = useConversationStore()
  const route = useRoute()
  const filteredMessages = computed(() => messageStore.items)

  const sendedMessages = computed(() => filteredMessages.value
        .filter(message => message.status !== 'loading')
        .map(message =>{
          return {
            role: message.type === 'question' ? 'user':'assistant',
            content:message.content
          }
        })
  )
  let conversationId = ref(parseInt(route.params.id as string ) )
  const initMessageId = parseInt(route.query.init as string)
  const lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value) )
  const conversation = computed(() => conversationStore.getConversationById(conversationId.value))
  const sendNewMessage = async (question: string) => {
      if (question) {
          // 1. 生成当前时间的 ISO 格式字符串
          const date = new Date().toISOString()
          // 2. 调用 Store 中的 Action 创建消息
          await messageStore.createMessage({
              content: question,          // 消息内容：即用户的问题
              conversationId: conversationId.value, // 关联的会话 ID（来自响应式变量）
              createdAt: date,            // 创建时间
              updatedAt: date,            // 更新时间（初始时与创建时间相同）
              type: 'question',           // 消息类型：标记为用户提问
          })
          // 3. 执行后续逻辑
          inputValue.value = ''
          creatingInitialMessage()
      }
  }

  const creatingInitialMessage = async () => {
      const createdData: Omit<MessageProps, 'id'> = {
          content: '',
          conversationId:conversationId.value,
          type: 'answer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'loading'
      }

      const newMessageId = await messageStore.createMessage(createdData)
      filteredMessages.value.push({ id: newMessageId, ...createdData })

      if (conversation.value) {
    // 1. 根据当前会话的 providerId 查找对应的服务商配置
    const provider = await db.providers.where({ id: conversation.value.providerId }).first()

    if (provider) {
        // 2. 调用 Electron 暴露的 API，启动聊天任务
        await window.electronAPI.startChat({
            messageId: newMessageId,      // 前端生成的消息 ID（用于后续更新状态）
            providerName: provider.name,  // 服务商名称（如 OpenAI, Anthropic 等）
            selectedModel: conversation.value.selectedModel, // 用户选择的模型（如 gpt-4, claude-3）
            messages:sendedMessages.value
        })
    }
}
  }

  watch(() => route.params.id, async (newId: string) => {
    conversationId.value = parseInt(newId)
    await messageStore.fetchMessagesByConversation(conversationId.value)
})

  onMounted(async () => {
   
    await messageStore.fetchMessagesByConversation(conversationId.value)
    if(initMessageId){
      await creatingInitialMessage()
    }
   window.electronAPI.onUpdateMessage( async (streamData) => {
    console.log('stream',streamData)
    messageStore.updateMessage(streamData)
    


   })
  })

  </script>