// 存储工具函数

// 本地存储键名常量
const STORAGE_KEYS = {
  USER_SETTINGS: 'cyber_fortune_user_settings',
  DIVINATION_HISTORY: 'cyber_fortune_history',
  USER_PREFERENCES: 'cyber_fortune_preferences'
} as const

// 保存数据到localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error('保存数据到localStorage时出错:', error)
  }
}

// 从localStorage读取数据
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) {
      return defaultValue
    }
    return JSON.parse(serializedData)
  } catch (error) {
    console.error('从localStorage读取数据时出错:', error)
    return defaultValue
  }
}

// 从localStorage删除数据
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('从localStorage删除数据时出错:', error)
  }
}

// 清空localStorage
export const clearStorage = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空localStorage时出错:', error)
  }
}

// 保存用户设置
export const saveUserSettings = (settings: any): void => {
  saveToStorage(STORAGE_KEYS.USER_SETTINGS, settings)
}

// 加载用户设置
export const loadUserSettings = (defaultSettings: any): any => {
  return loadFromStorage(STORAGE_KEYS.USER_SETTINGS, defaultSettings)
}

// 保存算卦历史记录
export const saveDivinationHistory = (history: any[]): void => {
  saveToStorage(STORAGE_KEYS.DIVINATION_HISTORY, history)
}

// 加载算卦历史记录
export const loadDivinationHistory = (defaultHistory: any[]): any[] => {
  return loadFromStorage(STORAGE_KEYS.DIVINATION_HISTORY, defaultHistory)
}

// 添加历史记录
export const addHistoryRecord = (record: any): void => {
  const history = loadDivinationHistory([])
  history.unshift(record)
  // 限制历史记录数量为100条
  if (history.length > 100) {
    history.splice(100)
  }
  saveDivinationHistory(history)
}

// 删除历史记录
export const removeHistoryRecord = (id: string): void => {
  const history = loadDivinationHistory([])
  const filteredHistory = history.filter((record: any) => record.id !== id)
  saveDivinationHistory(filteredHistory)
}

// 清空历史记录
export const clearHistory = (): void => {
  saveDivinationHistory([])
}

// 检查localStorage是否可用
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

// 导出存储键名
export { STORAGE_KEYS }