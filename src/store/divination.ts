import { defineStore } from 'pinia'
import type { DivinationRecord, DivinationType } from './index'

export const useDivinationStore = defineStore('divination', {
  state: () => ({
    currentResult: null as DivinationRecord | null,
    divinationTypes: [
      {
        id: 'iChing',
        name: '易经六十四卦',
        description: '基于六爻算法实现',
        icon: 'iching-icon',
        process: '抛掷六次硬币生成卦象'
      },
      {
        id: 'tarot',
        name: '塔罗牌',
        description: '78张塔罗牌随机抽取',
        icon: 'tarot-icon',
        process: '洗牌并抽取牌组'
      },
      {
        id: 'qianShi',
        name: '签诗',
        description: '传统签诗随机抽取',
        icon: 'qianshi-icon',
        process: '摇动签筒抽取签诗'
      },
      {
        id: 'plumFlower',
        name: '梅花易数',
        description: '基于数字和时间的算卦方法',
        icon: 'plumflower-icon',
        process: '输入数字生成卦象'
      }
    ] as DivinationType[]
  }),
  
  actions: {
    setResult(result: DivinationRecord) {
      this.currentResult = result
    },
    
    getDivinationTypeById(id: string) {
      return this.divinationTypes.find(type => type.id === id)
    }
  }
})