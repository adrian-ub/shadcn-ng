import { Directive, input } from '@angular/core'

export const separatorClass = 'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'

@Directive({
  selector: 'ubSeparator',
  host: {
    'data-slot': 'separator',
    'class': separatorClass,
    '[attr.data-orientation]': 'orientation',
    '[attr.data-decorative]': 'decorative',
  },
})
export class UbSeparator {
  orientation = input<'horizontal' | 'vertical'>('horizontal')
  decorative = input<boolean>(true)
}
