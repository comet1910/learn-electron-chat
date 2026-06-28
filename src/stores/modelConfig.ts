import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../db'
import type { ModelConfig } from '../types'
import dayjs from 'dayjs'

export const useModelConfigStore = defineStore('modelConfig', () => {
  const items = ref<ModelConfig[]>([])
  const loading = ref(false)

  async function fetchConfigs() {
    loading.value = true
    items.value = await db.modelConfigs.toArray()
    loading.value = false
  }

  function getConfigByName(name: string): ModelConfig | undefined {
    return items.value.find(c => c.name === name)
  }

  async function saveAll(configs: ModelConfig[]) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const existingIds = configs.filter(c => c.id !== undefined).map(c => c.id!)
    // Delete removed configs
    const all = await db.modelConfigs.toArray()
    for (const item of all) {
      if (!existingIds.includes(item.id!)) {
        await db.modelConfigs.delete(item.id!)
      }
    }
    // Upsert each config
    for (const config of configs) {
      if (config.id) {
        await db.modelConfigs.update(config.id, {
          ...config,
          updatedAt: now,
        })
      } else {
        await db.modelConfigs.add({
          ...config,
          createdAt: now,
          updatedAt: now,
        })
      }
    }
    await fetchConfigs()
  }

  return { items, loading, fetchConfigs, getConfigByName, saveAll }
})
