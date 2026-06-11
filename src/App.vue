<template>
  <div class=" flex items-center justify-between h-screen">
    <div class=" w-[300px] bg-gray-200 h-full border-r border-gray-300">
      <!-- 添加窗口滑动 -->
      <div class="h-[90%] overflow-y-auto"> 
        <RouterLink to="">
        <ConversationList :items="items"/>
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
            bg-green-50 text-green-700 hover:bg-green-700 border border-green-700 hover
            h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]"
        >
          <Icon icon="radix-icons:gear"  class="mr-2" ></Icon>
          应用设置
        </button>
      </RouterLink>
      </div>
    </div>
    <div class="h-full flex-1 flex ">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Icon} from '@iconify/vue'
import { ConversationProps , ProviderProps } from './types'
import ConversationList from './components/ConversationList.vue';
import ProviderSelect from './components/ProviderSelect.vue';
import MessageInput from './components/MessageInput.vue';
const selectedModel = ref('')
const items: ConversationProps[] = [
  { id: 1, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用1', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 2, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 3, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 4, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用，你的说法很请正确，理解的很不错', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 5, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用1', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 6, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 7, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 8, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用，你的说法很请正确，理解的很不错', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 9, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用1', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 10, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 11, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},
  { id: 12, selectedModel: 'GPT-3.5-Turbo', title: '什么是光合作用，你的说法很请正确，理解的很不错', createdAt: '2024-07-03', updatedAt:'2024-07-03',providerId:1},

]

const providers: ProviderProps[] = [
    {
        id: 1,
        name: '文心一言',
        desc: '文心一言 百度出品的大模型',
        models: ['ERNIE-4.0-8K', 'ERNIE-3.5-8K', 'ERNIE-Speed-8K'],
        avatar: 'https://qph.cf2.poecdn.net/main-thumb-pb-3004-50-jougqzjtwfqfyqprxbdwofvnwattmtrg.jp',
        createdAt: '2024-07-03',
        updatedAt: '2024-07-03'
    },
    {
        id: 2,
        name: '通义千问',
        desc: '通义千问',
        // https://help.aliyun.com/zh/dashscope/developer-reference/api-details?spm=a2c4g.11186623.0.
        models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
        avatar: 'https://qph.cf2.poecdn.net/main-thumb-pb-3004-50-jougqzjtwfqfyqprxbdwofvnwattmtrg.jp',
        createdAt: '2024-07-03',
        updatedAt: '2024-07-03'
    }
]

console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>