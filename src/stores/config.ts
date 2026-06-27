import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppConfig } from '../types'
import i18n from '../i18n'

export const useConfigStore = defineStore('config', () => {
  const language = ref<'zh' | 'en'>('zh')
  const fontSize = ref(14)
  const loaded = ref(false)

  async function loadConfig() {
    const config = await window.electronAPI.getConfig()
    language.value = config.language
    fontSize.value = config.fontSize
    loaded.value = true
    i18n.global.locale.value = config.language
    applyFontSize()
  }

  async function setLanguage(lang: 'zh' | 'en') {
    language.value = lang
    i18n.global.locale.value = lang
    await persist()
  }

  async function setFontSize(size: number) {
    fontSize.value = size
    applyFontSize()
    await persist()
  }

  function applyFontSize() {
    document.documentElement.style.fontSize = `${fontSize.value}px`
  }

  async function persist() {
    await window.electronAPI.setConfig({
      language: language.value,
      fontSize: fontSize.value,
    })
  }

  return { language, fontSize, loaded, loadConfig, setLanguage, setFontSize }
})
