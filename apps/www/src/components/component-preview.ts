import { Component, computed, input } from '@angular/core';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';

import { examples } from '@/__registry__/examples'

@Component({
    standalone: true,
    selector: 'component-preview',
    imports: [NgComponentOutlet, AsyncPipe],
    template: `
    @let componentRender = this.component() | async;

    @if(!componentRender || !componentRender.default) {
        <div>Loading...</div>
    } @else {
        <ng-container *ngComponentOutlet="componentRender.default"  />
    }
    `
})
export class ComponentPeviewComponent {
    styleName = input<string>();
    nameExample = input<string>();
    examples = examples;

    component = computed(async () => {
        if (!this.styleName() || !this.nameExample()) return null;

        return await examples[this.styleName()!][this.nameExample()!].component();
    });
}
