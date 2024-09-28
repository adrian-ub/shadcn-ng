import ComponentPreview from '../component-preview/ComponentPreview.astro'
import ComponentSource from '../component-preview/ComponentSource.astro'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs'
import a from './a.astro'
import Callout from './Callout.astro'
import h1 from './h1.astro'
import h2 from './h2.astro'
import h3 from './h3.astro'
import h4 from './h4.astro'
import h5 from './h5.astro'
import h6 from './h6.astro'
import li from './li.astro'
import LinkedCard from './linked-card.astro'
import ol from './ol.astro'
import p from './p.astro'

import pre from './pre.astro'
import Step from './step.astro'
import StepItem from './step-item.astro'
import ul from './ul.astro'

export const components = {
  a,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  pre,
  ul,
  li,
  ol,
  Step,
  StepItem,
  LinkedCard,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ComponentPreview,
  ComponentSource,
  Callout,
}
