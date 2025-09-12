import Callout from '@/components/Callout.astro'
import CodeTabs from '@/components/CodeTabs.astro'
import ComponentPreview from '@/components/ComponentPreview.astro'
import ComponentsList from '@/components/ComponentsList.astro'
import ComponentSource from '@/components/ComponentSource.astro'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import a from './components/a.astro'
import blockquote from './components/blockquote.astro'
import Button from './components/button.astro'
import code from './components/code.astro'
import figcaption from './components/figcaption.astro'
import figure from './components/figure.astro'
import h1 from './components/H1.astro'
import h2 from './components/H2.astro'
import h3 from './components/H3.astro'
import h4 from './components/H4.astro'
import h5 from './components/H5.astro'
import h6 from './components/H6.astro'
import hr from './components/hr.astro'
import Image from './components/Image.astro'
import img from './components/img.astro'
import li from './components/li.astro'
import LinkedCard from './components/LinkedCard.astro'
import ol from './components/ol.astro'
import p from './components/p.astro'
import pre from './components/pre.astro'
import Step from './components/Step.astro'
import Steps from './components/Steps.astro'
import strong from './components/strong.astro'
import table from './components/table.astro'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs'
import td from './components/td.astro'
import th from './components/th.astro'
import tr from './components/tr.astro'
import ul from './components/ul.astro'

export const mdxComponents = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  strong,
  ul,
  ol,
  li,
  blockquote,
  img,
  hr,
  table,
  th,
  tr,
  td,
  pre,
  figure,
  figcaption,
  code,
  Step,
  Steps,
  Image,
  LinkedCard,
  ComponentPreview,
  ComponentsList,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  CodeTabs,
  ComponentSource,
  Button,
  Callout,
}
