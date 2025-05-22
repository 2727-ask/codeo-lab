<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMyApplicationStore } from '~/stores/application'
import { SideBarEnum } from '~/enums/SideBarEnum'
import fileSystem from './fileSystem.vue'
import globalSearch from './globalSearch.vue'

const store = useMyApplicationStore()
const { currentSideBarItem } = storeToRefs(store)

const componentsMap = {
  [SideBarEnum.FILESYSTEM]: fileSystem,
  [SideBarEnum.SEARCH]: globalSearch
}

const currentComponent = computed(() => componentsMap[currentSideBarItem.value] || fileSystem)
</script>