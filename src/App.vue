<template>
  <div class=" flex items-center justify-between h-screen">
    <div class=" w-[300px] bg-gray-200 h-full border-r border-gray-300">
      <!-- 添加窗口滑动 -->
      <div class="h-[90%] overflow-y-auto"> 
        <RouterLink to="">
        <ConversationList :items="conversations"/>
        </RouterLink>
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <RouterLink to="/" > 
        <button
          class="shadow-sm inline-flex items-center justify-center
            bg-green-700 text-white hover:bg-green-700/90 border border-green-700
            h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]"
        >
          <Icon icon="radix-icons:chat-bubble" class="mr-2" ></Icon>
          新建聊天
        </button>
      </RouterLink> 
        <RouterLink to="/settings" >
        <button
          class="shadow-sm inline-flex items-center justify-center
            bg-green-50 text-green-700 hover:bg-green-700 border border-green-700 hover:text-white
            h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]"
        >
          <Icon icon="radix-icons:gear"  class="mr-2" ></Icon>
          应用设置
        </button>
      </RouterLink>
      </div>
    </div>
    <div class=" flex flex-col h-full w-full">
      <Button color="purple" plain :loading icon-name="radix-icons:gear" @click="loading = true"> 
        Hello there
      </Button>
      <RouterView />
    </div>
  </div>
</template>



<script setup lang="ts">
import { onMounted ,ref} from 'vue'
import {Icon} from '@iconify/vue'
import { conversations, providers } from './testData'
import { db } from './db'
import ConversationList from './components/ConversationList.vue'
import Button from './components/Button.vue'

const loading = ref(false)

console.log('👋 This message is being logged by "App.vue", included via Vite');

onMounted(async () => {
    //插入数据测试
    // const insertedId = await db.providers.add(providers[0])
    // console.log('insertedId',insertedId)

    //查询测试
    const items = await db.providers.where({id: 1 }).toArray()
    console.log('items',items)

    //更新
    const updatedItem = await db.providers.update(1, { desc: 'updated desc' })
    console.log('updatedItem', updatedItem)

    //删除
    const deletedItem = await db.providers.delete(1)
    console.log('deletedItem', deletedItem)

})
</script>