<template>
  <div class="h-full flex flex-col">
    <!-- 顶部 Tab 导航 -->
    <div class="px-8 pt-6">
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-4 py-2.5 text-sm font-medium transition-colors relative -mb-px"
          :class="activeTab === tab.key
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="flex-1 overflow-hidden px-8 py-6">
      <!-- 通用设置 -->
      <div v-if="activeTab === 'general'" class="max-w-lg">
        <div class="space-y-6">
          <!-- 语言设置 -->
          <div>
            <label class="block text-sm font-medium mb-2">{{ $t('app.language') }}</label>
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
            <label class="block text-sm font-medium mb-2">{{ $t('app.fontSize') }}</label>
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

      <!-- 模型设置 -->
      <div v-else-if="activeTab === 'model'" class="h-full max-w-lg">
        <ModelSettingsPanel ref="modelPanelRef" />
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
import ModelSettingsPanel from '../components/ModelSettingsPanel.vue'

const configStore = useConfigStore()

const tabs = [
  { key: 'general', label: '通用设置' },
  { key: 'model', label: '模型设置' },
]

const activeTab = ref('general')
const modelPanelRef = ref<InstanceType<typeof ModelSettingsPanel> | null>(null)

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]

const selectedLanguage = ref(configStore.language)
const fontSizeValue = ref(configStore.fontSize)

function switchTab(key: string) {
  activeTab.value = key
  if (key === 'model') {
    modelPanelRef.value?.fetchProviders()
  }
}

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
