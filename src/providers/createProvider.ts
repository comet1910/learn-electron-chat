import { BaseProvider } from './BaseProvider'
// import { QianfanProvider } from './QianfanProvider'
import { OpenAIProvider } from './OpenAIProvider'

export function createProvider(providerName: string, apiKey?: string, baseUrl?: string): BaseProvider {
  switch (providerName) {
    case 'qianfan':
    //   return new QianfanProvider(process.env['QIANFAN_ACCESS_KEY'] as string, process.env['QIANFAN_SECRET_KEY'] as string)
    case 'dashscope':
      return new OpenAIProvider(
        apiKey || process.env['ALI_API_KEY'] as string,
        baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
      )
    case 'deepseek':
      return new OpenAIProvider(
        apiKey || process.env['DEEPSEEK_API_KEY'] as string,
        baseUrl || 'https://api.deepseek.com/v1'
      )
    default:
      // For custom models, require apiKey and baseUrl
      if (apiKey && baseUrl) {
        return new OpenAIProvider(apiKey, baseUrl)
      }
      throw new Error(`Unsupported provider: ${providerName}. apiKey and baseUrl are required.`)
  }
}
