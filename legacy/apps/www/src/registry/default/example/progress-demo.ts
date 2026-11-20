import type { OnDestroy, OnInit } from '@angular/core'

import { Component } from '@angular/core'
import { ProgressDirective } from '~/registry/default/ui/progress'

@Component({
  standalone: true,
  selector: '[progress-demo-default]',
  imports: [ProgressDirective],
  template: `<div ubProgress [progress]="progress" class="w-[60%]"></div>`,
})
export default class ProgressDemoDefault implements OnInit, OnDestroy {
  progress = 10
  intervalId!: NodeJS.Timeout

  ngOnInit(): void {
    this.intervalId = setTimeout(() => {
      this.progress = 66
    }, 500)
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }
}
