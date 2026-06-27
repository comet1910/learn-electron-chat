<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-y-auto space-y-4 pr-1">
      <div
        v-for="provider in providers"
        :key="provider.id"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- 卡片头部 -->
        <button
          class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          @click="toggleExpand(provider.id)"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              :style="{ backgroundColor: providerColor(provider.id) }"
            >
              {{ provider.desc?.charAt(0) || provider.name.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-gray-800">
              {{ provider.desc || provider.name }}
            </span>
          </div>
          <Icon
            :icon="expandedId === provider.id ? 'radix-icons:chevron-up' : 'radix-icons:chevron-down'"
            class="w-5 h-5 text-gray-400 transition-transform"
          />
        </button>

        <!-- 展开的表单 -->
        <div
          v-if="expandedId === provider.id"
          class="px-4 pb-4 pt-1 border-t border-gray-100"
        >
          <div class="space-y-3 mt-3">
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">Access Key</label>
              <input
                type="text"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="abcd"
              />
            </div>
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">Secret Key</label>
              <input
                type="password"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="abcd"
              />
            </div>
            <div class="flex items-center gap-3">
              <label class="text-sm text-gray-600 w-24 text-right shrink-0">BaseUrl</label>
              <input
                type="text"
                class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="abcd"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useProviderStore } from '../stores/provider'
import type { ProviderProps } from '../types'

const providerStore = useProviderStore()
const providers = ref<ProviderProps[]>([])
const expandedId = ref<number | null>(null)

const providerColors = ['#4F46E5', '#0891B2', '#059669', '#D97706']

function providerColor(id: number) {
  return providerColors[(id - 1) % providerColors.length]
}

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function onSave() {
  console.log('save clicked')
}

function onCancel() {
  console.log('cancel clicked')
}

async function fetchProviders() {
  await providerStore.fetchProviders()
  providers.value = providerStore.items
  if (providers.value.length > 0) {
    expandedId.value = providers.value[0].id
  }
}

onMounted(() => {
  if (providerStore.items.length > 0) {
    providers.value = providerStore.items
    expandedId.value = providers.value[0].id
  }
})

defineExpose({ fetchProviders })
</script>
