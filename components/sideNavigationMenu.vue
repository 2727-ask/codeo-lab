<template>
  <div>
    <UNavigationMenu collapsed orientation="vertical" :items="items"/>
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
import { SideBarEnum } from '~/enums/SideBarEnum';
const store = useMyApplicationStore()
const items = ref([
  [
    {
      label: 'Files',
      value: String(SideBarEnum.FILESYSTEM),
      icon: 'i-lucide-files',
      open: true,
      onSelect: () => onSelectItem(items.value[0][0]),
      active: store.currentSideBarItem === SideBarEnum.FILESYSTEM,
    } as NavigationMenuItem,
    {
      label: 'Search',
      icon: 'i-lucide-search',
      value: String(SideBarEnum.SEARCH),
      open: true,
      onSelect: () => onSelectItem(items.value[0][1]),
      active: store.currentSideBarItem === SideBarEnum.SEARCH,
    } as NavigationMenuItem
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      badge: '3.8k',
    } as NavigationMenuItem,
    {
      label: 'Help',
      icon: 'i-lucide-circle-help',
      disabled: true
    } as NavigationMenuItem
  ]
]) as Ref<NavigationMenuItem[][]>



function onSelectItem(item: NavigationMenuItem) {
  // Only handle items with a value (enum)
  if (item.value !== undefined) {
    store.setCurrentSideBarItem(item.value as unknown as SideBarEnum)
    // Update active state
    items.value.forEach(group => {
      group.forEach(i => {
        i.active = i.value === item.value
      })
    })
  }
}
</script>

<style>

</style>