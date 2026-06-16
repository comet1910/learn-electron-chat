<template>
  <div class="message-input w-full shadow-sm border rounded-lg border-gray-300 flex items-center">
    <!-- 高亮部分 -->
    <input class="outline-none border-0 flex-1 bg-white focus:ring-0" type="text" v-model="model" />
    <Button icon-name="radix-icons:paper-plane" @click="onCreate" :disabled="disabled">
      发送
    </Button>
  </div>
</template>

<script lang="ts" setup>
import Button from './Button.vue'

defineProps<{
  disabled?: boolean;
}>()

const emit = defineEmits<{
  create: [value: string]
}>()

// Vue 3.4+ 的响应式语法糖
const model = defineModel<string>()

const onCreate = () => {
  if (model.value && model.value.trim() !== '') {
    emit('create', model.value)
  }
}
</script>