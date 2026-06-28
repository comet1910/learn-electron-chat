<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto space-y-3 pr-1">
      <!-- 可用模型列表 -->
      <div
        v-for="(provider, index) in providers"
        :key="provider.id"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- 卡片头部 -->
        <div
          class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
          @click="toggleExpand(provider.id)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              :style="{ backgroundColor: cardColor(index) }"
            >
              {{ (provider.desc || provider.name).charAt(0) }}
            </div>
            <div class="min-w-0">
              <div class="text-sm font-medium text-gray-800">
                {{ provider.desc || provider.name }}
              </div>
              <div class="text-xs text-gray-400 truncate">
                {{ provider.models.join(', ') }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 ml-2 shrink-0">
            <span
              v-if="getConfig(provider.name)"
              class="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700"
            >
              已配置
            </span>
            <Icon
              :icon="expandedId === provider.id ? 'radix-icons:chevron-up' : 'radix-icons:chevron-down'"
              class="w-5 h-5 text-gray-400 transition-transform"
            />
          </div>
        </div>

        <!-- 展开的表单 -->
        <div
          v-if="expandedId === provider.id"
          class="px-4 pb-4 pt-1 border-t border-gray-100"
        >
          <div class="space-y-3 mt-3">
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">名称</label>
              <input
                v-model="configForms[provider.name].displayName"
                type="text"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="显示名称"
              />
            </div>
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">API Key</label>
              <div class="flex-1 relative">
                <input
                  v-model="configForms[provider.name].apiKey"
                  :type="showKey[provider.name] ? 'text' : 'password'"
                  class="w-full px-3 py-1.5 pr-8 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="留空则使用环境变量"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  @click="showKey[provider.name] = !showKey[provider.name]"
                >
                  <Icon
                    :icon="showKey[provider.name] ? 'radix-icons:eye-open' : 'radix-icons:eye-none'"
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">BaseUrl</label>
              <input
                v-model="configForms[provider.name].baseUrl"
                type="text"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="defaultUrl(provider.name)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
      <button
        class="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        @click="onCancel"
      >
        取消
      </button>
      <button
        class="px-5 py-2 text-sm rounded-md text-white hover:opacity-90 transition-opacity"
        style="background-color: #5D5FEF"
        @click="onSave"
      >
        保存
      </button>
    </div>

    <AppToast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useProviderStore } from '../stores/provider'
import { useModelConfigStore } from '../stores/modelConfig'
import type { ProviderProps, ModelConfig } from '../types'
import AppToast from './AppToast.vue'

const providerStore = useProviderStore()
const modelConfigStore = useModelConfigStore()
const providers = ref<ProviderProps[]>([])
const expandedId = ref<number | null>(null)
const toastRef = ref<InstanceType<typeof AppToast> | null>(null)

const cardColors = ['#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED']

// Config form state: keyed by provider.name
const configForms = reactive<Record<string, { displayName: string; apiKey: string; baseUrl: string }>>({})
const showKey = reactive<Record<string, boolean>>({})

function cardColor(index: number) {
  return cardColors[index % cardColors.length]
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function getConfig(providerName: string): ModelConfig | undefined {
  return modelConfigStore.getConfigByName(providerName)
}

function defaultUrl(providerName: string): string {
  const urls: Record<string, string> = {
    dashscope: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    deepseek: 'https://api.deepseek.com/v1',
  }
  return urls[providerName] || 'https://api.example.com/v1'
}

function initConfigForms() {
  for (const provider of providers.value) {
    const existing = getConfig(provider.name)
    configForms[provider.name] = {
      displayName: existing?.displayName || provider.desc || provider.name,
      apiKey: existing?.apiKey || '',
      baseUrl: existing?.baseUrl || '',
    }
    if (showKey[provider.name] === undefined) {
      showKey[provider.name] = false
    }
  }
}

async function onSave() {
  const configs: ModelConfig[] = []
  for (const provider of providers.value) {
    const form = configForms[provider.name]
    if (!form) continue
    const existing = getConfig(provider.name)
    configs.push({
      id: existing?.id,
      name: provider.name,
      displayName: form.displayName,
      apiKey: form.apiKey,
      baseUrl: form.baseUrl,
      createdAt: existing?.createdAt || '',
      updatedAt: existing?.updatedAt || '',
    })
  }
  await modelConfigStore.saveAll(configs)
  initConfigForms()
  toastRef.value?.show('保存成功')
}

function onCancel() {
  initConfigForms()
}

async function fetchConfigs() {
  await modelConfigStore.fetchConfigs()
  if (providerStore.items.length === 0) {
    await providerStore.fetchProviders()
  }
  providers.value = providerStore.items
  initConfigForms()
  if (providers.value.length > 0) {
    expandedId.value = providers.value[0].id
  }
}

onMounted(() => {
  if (providerStore.items.length > 0) {
    providers.value = providerStore.items
    initConfigForms()
  }
})

defineExpose({ fetchConfigs })
</script>
