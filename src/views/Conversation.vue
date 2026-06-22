<template>
    
      <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" >
      <h3 class="font-semibold text-gray-900">{{conversation?.title}}</h3>
      <span class="text-sm text-gray-500" >{{conversation?.updatedAt}}</span>
      </div>
        <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
        <MessageList :messages="filteredMessages" />
        </div>
        <div class="w-[80%] mx-auto h-[15%] flex items-center">
        <MessageInput  />
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

  const messageStore = useMessageStore()
  const conversationStore = useConversationStore()
  const route = useRoute()
  const filteredMessages = computed(() => messageStore.items)
  
  let conversationId = ref(parseInt(route.params.id as string ) )
  const initMessageId = parseInt(route.query.init as string)
  const lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value) )
  const conversation = computed(() => conversationStore.getConversationById(conversationId.value))


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
            content: lastQuestion.value?.content  || ''       // 用户的提问内容
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