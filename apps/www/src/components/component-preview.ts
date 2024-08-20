import { Component, computed, input } from '@angular/core';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';

@Component({
    standalone: true,
    imports: [NgComponentOutlet, AsyncPipe],
    template: `
    <ng-container *ngComponentOutlet="component() | async"  />
    `
})
export class ComponentPeviewComponent {
    path = input.required<string>();

    protected component = computed(async () => {
        return (await import(/* @vite-ignore */ this.path())).default;
    });
}
