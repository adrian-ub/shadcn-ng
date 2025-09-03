import { render } from '@analogjs/router/server'
import { App } from './app/app'
import { config } from './app/app.config.server'
import '@angular/platform-server/init'

export default render(App, config)
