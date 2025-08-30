import process from 'node:process'

export function expandEnvVars(value: string) {
  return value.replace(/\$\{(\w+)\}/g, (_match, key) => process.env[key] || '')
}

export function extractEnvVars(value: string) {
  const vars: string[] = []
  const regex = /\$\{(\w+)\}/g
  let match: RegExpExecArray | null = regex.exec(value)

  while (match !== null) {
    vars.push(match[1])
    match = regex.exec(value)
  }

  return vars
}
