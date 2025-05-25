import { defineStore } from 'pinia'
import { SideBarEnum } from '~/enums/SideBarEnum'

export const useMyApplicationStore = defineStore(
  'myApplicationStore',
  {
    state: () => ({ 
      currentSideBarItem: SideBarEnum.FILESYSTEM,
    }),
    getters: {
      getCurrentSideBarItem: (state) => state.currentSideBarItem,
    },
    actions: {
      setCurrentSideBarItem(item: SideBarEnum) {
        this.currentSideBarItem = item
      }
    }
  }
)
