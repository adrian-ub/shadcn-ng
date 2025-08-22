import type { OnDestroy, OnInit } from '@angular/core'

import { Component } from '@angular/core'
import { ProgressDirective } from '@/registry/new-york/ui/progress'

@Component({
  standalone: true,
  selector: '[progress-demo-new-york]',
  imports: [ProgressDirective],
  template: `<div ubProgress [progress]="progress" class="w-[60%]"></div>`,
})
export default class ProgressDemoNewYork implements OnInit, OnDestroy {
  progress = 10
  intervalId!: number

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
