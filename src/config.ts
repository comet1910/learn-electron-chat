import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { AppConfig } from './types'

const CONFIG_FILE = 'config.json'

const defaultConfig: AppConfig = {
  language: 'zh',
  fontSize: 14
}

export async function loadConfig(): Promise<AppConfig> {
  const configPath = path.join(app.getPath('userData'), CONFIG_FILE)
  try {
    const data = await fs.readFile(configPath, 'utf-8')
    return { ...defaultConfig, ...JSON.parse(data) }
  } catch {
    return { ...defaultConfig }
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  const configPath = path.join(app.getPath('userData'), CONFIG_FILE)
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8')
}
