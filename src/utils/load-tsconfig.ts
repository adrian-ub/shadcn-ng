import path from 'node:path'
import { loadConfig } from 'unconfig'

export interface TsConfig {
  compilerOptions: {
    baseUrl: string
    paths: { [key: string]: string[] }
  }
}

export async function loadTsConfig(cwd: string): Promise<{ config: TsConfig, sources: string[], dependencies?: string[] }> {
  return loadConfig<TsConfig>({
    cwd,
    stopAt: path.parse(cwd).dir,
    sources: [
      {
        files: ['tsconfig'],
        transform(code) {
          const codeWithoutComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '')
          return codeWithoutComments
        },
      },
    ],
  })
}
