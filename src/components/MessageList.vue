<template>
    <div class="message-list">
        <div class="message-item mb-3" v-for="message in messages" :key="message.id">
            <!-- 动态类名：如果是 question，则右对齐 (justify-end) -->
            <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
                <div>
                    <div class="text-sm text-gray-500 mb-2" :class="{ 'text-right': message.type === 'question' }" >
                        {{message.createdAt}}
                    </div>
                    <!-- 提问气泡：绿色背景，白色文字 -->
                    <div class="message-question bg-green-700 text-white p-2 rounded-md" v-if="message.type === 'question'">
                        {{ message.content }}
                    </div>

                    <!-- 回答气泡：灰色背景，深灰文字 -->
                    <div class="message-question bg-gray-200 text-gray-700 p-2 rounded-md" v-else>
                        <template v-if="message.status==='loading' ">
                            <Icon icon="eos-icons:three-dots-loading"></Icon>
                        </template>
                        <template v-else>
                            {{ message.content }}
                        </template> 
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MessageProps } from '../types'
import {Icon} from '@iconify/vue'
// 定义接收的 props，要求传入一个 MessageProps 类型的数组
defineProps<{ messages: MessageProps[] }>()
</script>