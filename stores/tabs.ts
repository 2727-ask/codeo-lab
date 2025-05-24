import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import type { Tab } from '~/interfaces/Tab';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabs: [] as Tab[],
    activeTabId: null as string | null,
  }),

  actions: {
    // Add a new tab (default: untitled)
    addTab(tab?: Partial<Tab>) {
      const newTab: Tab = {
        id: uuid(),
        title: 'Untitled',
        content: '',
        language: 'plaintext',
        isDirty: false,
        ...tab,
      };

      this.tabs.push(newTab);
      this.setActiveTab(newTab.id);
    },

    // Close a tab by ID
    closeTab(tabId: string) {
      const index = this.tabs.findIndex((t) => t.id === tabId);
      if (index === -1) return;

      // If closing the active tab, switch to the next one
      if (this.activeTabId === tabId) {
        const nextTab = this.tabs[index + 1] || this.tabs[index - 1];
        this.activeTabId = nextTab?.id || null;
      }

      this.tabs.splice(index, 1);
    },

    // Set the active tab
    setActiveTab(tabId: string) {
      if (this.tabs.some((t) => t.id === tabId)) {
        this.activeTabId = tabId;
      }
    },

    // Update tab content and mark as dirty
    updateTabContent(tabId: string, content: string) {
      const tab = this.tabs.find((t) => t.id === tabId);
      if (!tab) return;

      tab.content = content;
      tab.isDirty = true;
    },

    // Save tab (clear dirty state)
    saveTab(tabId: string, path?: string) {
      const tab = this.tabs.find((t) => t.id === tabId);
      if (!tab) return;

      tab.isDirty = false;
      if (path) {
        tab.path = path;
        tab.title = path.split('/').pop() || 'Untitled';
      }
    },
  },

  getters: {
    // Get the active tab's full data
    activeTab(state): Tab | null {
      return state.tabs.find((t) => t.id === state.activeTabId) || null;
    },

    // Check if any tabs have unsaved changes
    hasUnsavedChanges(state): boolean {
      return state.tabs.some((t) => t.isDirty);
    },
  },
});