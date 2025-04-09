import { Component, computed, input } from '@angular/core'

import { cn } from '~/lib/utils'

@Component({
  selector: 'svg[logoIcon]',
  host: {
    'viewBox': '0 0 256 256',
    '[class]': 'classComputed()',
    'xmlns': 'http://www.w3.org/2000/svg',
  },
  template: `<svg:rect width="256" height="256" fill="none"></svg:rect>
  <svg:line
    x1="208"
    y1="128"
    x2="128"
    y2="208"
    fill="none"
    stroke="url(#paint1_linear_1284_572)"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="32"></svg:line>

  <svg:line
    x1="192"
    y1="40"
    x2="40"
    y2="192"
    fill="none"
    stroke="url(#paint3_linear_1284_572)"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="32"></svg:line>

  <svg:defs xmlns="http://www.w3.org/2000/svg">
    <svg:linearGradient
      xmlns="http://www.w3.org/2000/svg"
      id="paint1_linear_1284_572"
      x1="45.4927"
      y1="198.353"
      x2="209.607"
      y2="120.339"
      gradientUnits="userSpaceOnUse"
    >
      <svg:stop stop-color="#E40035"></svg:stop>
      <svg:stop offset="0.24" stop-color="#F60A48"></svg:stop>
      <svg:stop offset="0.352" stop-color="#F20755"></svg:stop>
      <svg:stop offset="0.494" stop-color="#DC087D"></svg:stop>
      <svg:stop offset="0.745" stop-color="#9717E7"></svg:stop>
      <svg:stop offset="1" stop-color="#6C00F5"></svg:stop>
    </svg:linearGradient>
    <svg:linearGradient
      xmlns="http://www.w3.org/2000/svg"
      id="paint3_linear_1284_572"
      x1="45.4927"
      y1="198.353"
      x2="209.607"
      y2="120.339"
      gradientUnits="userSpaceOnUse"
    >
      <svg:stop stop-color="#E40035"></svg:stop>
      <svg:stop offset="0.24" stop-color="#F60A48"></svg:stop>
      <svg:stop offset="0.352" stop-color="#F20755"></svg:stop>
      <svg:stop offset="0.494" stop-color="#DC087D"></svg:stop>
      <svg:stop offset="0.745" stop-color="#9717E7"></svg:stop>
      <svg:stop offset="1" stop-color="#6C00F5"></svg:stop>
    </svg:linearGradient>
  </svg:defs>`,
})
export class LogoIcon {
  class = input('')
  protected classComputed = computed(() => cn('size-6', this.class()))
}
