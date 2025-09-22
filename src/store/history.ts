import { defineStore } from 'pinia'
import type { DivinationRecord } from './index'
import { loadDivinationHistory, addHistoryRecord as addHistoryRecordToStorage, removeHistoryRecord as removeHistoryRecordFromStorage, clearHistory as clearHistoryStorage } from '../utils/helpers/storage'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: loadDivinationHistory([]) as DivinationRecord[]
  }),
  
  actions: {
    addRecord(record: DivinationRecord) {
      this.records.unshift(record)
      addHistoryRecordToStorage(record)
    },
    
    removeRecord(id: string) {
      this.records = this.records.filter(record => record.id !== id)
      removeHistoryRecordFromStorage(id)
    },
    
    clearHistory() {
      this.records = []
      clearHistoryStorage()
    }
  },
  
  getters: {
    recordCount: (state) => state.records.length,
    getRecordsByType: (state) => (type: string) => 
      state.records.filter(record => record.type === type)
  }
})