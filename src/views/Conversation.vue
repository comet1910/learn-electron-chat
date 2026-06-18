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

    const conversationStore = useConversationStore()
  const route = useRoute()
  const filteredMessages = ref<MessageProps[]>([])
  
  let conversationId = ref(parseInt(route.params.id as string ) )
  const initMessageId = parseInt(route.query.init as string)
  let lastQuestion = ''
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

      const newMessageId = await db.messages.add(createdData)
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
            content: lastQuestion         // 用户的提问内容
        })
    }
}
  }

  watch(() => route.params.id, async (newId: string) => {
    conversationId.value = parseInt(newId)
   
    filteredMessages.value = await db.messages.where({ conversationId:conversationId.value }).toArray()
})

  onMounted(async () => {
   
    filteredMessages.value = await db.messages.where({ conversationId:conversationId.value }).toArray()
    if(initMessageId){
      const lastMessage = await db.messages.where({ conversationId :conversationId.value}).last()
      lastQuestion = lastMessage?.content || ''
      await creatingInitialMessage()
    }
   window.electronAPI.onUpdateMessage( async (streamData) => {
    console.log('stream',streamData)
    const { messageId, data } = streamData; // 解构出消息 ID 和数据包
    // 1. 从数据库中查找当前正在更新的消息对象
    const currentMessage = await db.messages.where({ id: messageId }).first();

    if (currentMessage) {
        // 2. 构造需要更新的数据对象
        const updatedData = {
            // 将新收到的 AI 回复片段追加到原有内容后面
            content: currentMessage.content + data.result,
            // 根据是否结束来更新状态：如果是结尾则 'finished'，否则继续 'streaming'
            status: data.is_end ? 'finished' : ('streaming' as MessageStatus),
            updatedAt: new Date().toISOString() // 更新时间戳
        };

        // 3. 持久化保存：更新 IndexedDB 中的记录
        await db.messages.update(messageId, updatedData);

        // 4. 响应式更新：在内存数组中找到对应项并替换，以触发 UI 刷新
        const index = filteredMessages.value.findIndex(item => item.id === messageId);
        if (index !== -1) {
            filteredMessages.value[index] = { ...filteredMessages.value[index], ...updatedData };
        }
    }


   })
  })

  </script>