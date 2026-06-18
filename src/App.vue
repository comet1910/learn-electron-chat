<template>
  <div class=" flex items-center justify-between h-screen">
    <div class=" w-[350px] bg-gray-200 h-full border-r border-gray-300">
      <!-- 添加窗口滑动 -->
      <div class="h-[90%] overflow-y-auto"> 
        <RouterLink to="">
        <ConversationList :items="items"/>
        </RouterLink>
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <RouterLink to="/" > 
       <Button icon-name="radix-icons:chat-bubble" class="w-full">
        新建聊天
       </Button>
      </RouterLink> 
        <RouterLink to="/settings" >
        <Button icon-name="radix-icons:gear" plain class="w-full">
          应用设置
        </Button>
      </RouterLink>
       <Button icon-name="radix-icons:chat-bubble" class="w-full" @click="testAdd" >
        测试新增
       </Button>
      </div>
    </div>
    <div class=" flex flex-col h-full w-full">
      <!-- <Button color="purple" plain :loading icon-name="radix-icons:gear" @click="loading = true"> 
        Hello there
      </Button> -->
      <RouterView />
    </div>
  </div>
</template>



<script setup lang="ts">
import { onMounted, computed } from 'vue'

import { db, initProviders } from './db'
import { useConversationStore } from './stores/conversation'
import ConversationList from './components/ConversationList.vue'
import Button from './components/Button.vue'

import {conversations} from './testData'

let index = 0
const conversationStore = useConversationStore()
const items = computed(() => conversationStore.items)
onMounted(async () => {
  await initProviders()
  conversationStore.items = await db.conversations.toArray()
})

//测试新增
const testAdd = () => {
  index++
  conversationStore.items.push(conversations[index])
}
//测试重置
const testReset = () => {
  conversationStore.$reset()
}


</script>