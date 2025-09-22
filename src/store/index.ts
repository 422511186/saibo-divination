// 定义用户设置模型
export interface UserSettings {
  theme: 'dark' | 'light'
  animations: boolean
  notifications: boolean
}

// 定义算卦记录模型
export interface DivinationRecord {
  id: string
  type: string
  question: string
  result: any
  timestamp: number
  interpretation: string
  details: object
}

// 定义算卦类型模型
export interface DivinationType {
  id: string
  name: string
  description: string
  icon: string
  process: string
}