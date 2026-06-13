import type { BootstrapContext } from '@angular/platform-browser'
import { bootstrapApplication } from '@angular/platform-browser'
import { App } from './app/app'
import { config } from './app/app.config.server'

function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(App, config, context)
}

export default bootstrap
