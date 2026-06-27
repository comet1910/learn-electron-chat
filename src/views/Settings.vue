<template>
  <div class="h-full p-8 max-w-lg">
    <h2 class="text-lg font-semibold mb-6">应用设置</h2>

    <div class="space-y-6">
      <!-- 语言设置 -->
      <div>
        <label class="block text-sm font-medium mb-2">语言</label>
        <SelectRoot v-model="selectedLanguage" @update:modelValue="onLanguageChange">
          <SelectTrigger
            class="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            class="z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          >
            <SelectGroup>
              <SelectItem
                v-for="lang in languages"
                :key="lang.value"
                :value="lang.value"
                class="relative flex cursor-pointer select-none items-center px-3 py-2 text-sm outline-none hover:bg-green-50 focus:bg-green-50"
              >
                <SelectItemText>{{ lang.label }}</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </div>

      <!-- 字体大小设置 -->
      <div>
        <label class="block text-sm font-medium mb-2">字体大小</label>
        <NumberFieldRoot
          v-model="fontSizeValue"
          :min="10"
          :max="24"
          :step="1"
          @update:modelValue="onFontSizeChange"
        >
          <div class="flex items-center gap-2">
            <NumberFieldDecrement
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              -
            </NumberFieldDecrement>
            <NumberFieldInput
              class="w-20 rounded-md border border-gray-300 px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <NumberFieldIncrement
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              +
            </NumberFieldIncrement>
            <span class="text-sm text-gray-500">px</span>
          </div>
        </NumberFieldRoot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
} from 'radix-vue'
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from 'radix-vue'
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]

const selectedLanguage = ref(configStore.language)
const fontSizeValue = ref(configStore.fontSize)

function onLanguageChange(value: string) {
  configStore.setLanguage(value as 'zh' | 'en')
}

function onFontSizeChange(value: number) {
  configStore.setFontSize(value)
}

onMounted(() => {
  selectedLanguage.value = configStore.language
  fontSizeValue.value = configStore.fontSize
})
</script>
