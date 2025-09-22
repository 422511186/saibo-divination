import { defineStore } from 'pinia'
import type { UserSettings } from './index'

export const useUserStore = defineStore('user', {
  state: () => ({
    settings: {
      theme: 'dark',
      animations: true,
      notifications: true
    } as UserSettings
  }),
  
  actions: {
    updateSettings(newSettings: Partial<UserSettings>) {
      this.settings = { ...this.settings, ...newSettings }
    }
  }
})