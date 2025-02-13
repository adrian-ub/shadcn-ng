import type { Alpine } from 'alpinejs'
import focus from '@alpinejs/focus'

export default (Alpine: Alpine): void => {
  Alpine.plugin(focus)
}
