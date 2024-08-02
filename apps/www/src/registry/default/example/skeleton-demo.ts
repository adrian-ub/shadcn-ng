import { Component } from "@angular/core";

import { UbSkeletonDirective } from "@/registry/default/ui/skeleton.directive";

@Component({
  standalone: true,
  imports: [UbSkeletonDirective],
  template: ` <div class="flex items-center space-x-4">
    <div ubSkeleton class="h-12 w-12 rounded-full"></div>
    <div class="space-y-2">
      <div ubSkeleton class="h-4 w-[250px]"></div>
      <div ubSkeleton class="h-4 w-[200px]"></div>
    </div>
  </div>`,
})
export class SekeletonDemoComponent {}

export default SekeletonDemoComponent;
