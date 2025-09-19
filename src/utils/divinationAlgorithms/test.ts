// 测试算卦算法

import { performIChingDivination } from './iChing'
import { performTarotDivination } from './tarot'
import { performQianShiDivination } from './qianShi'

// 测试易经算卦
console.log('=== 测试易经算卦 ===')
const iChingResult = performIChingDivination("我今天的运势如何？")
console.log('卦象:', iChingResult.hexagram)
console.log('爻位:', iChingResult.yao)
console.log('变爻:', iChingResult.changingLines)
console.log('解释:', iChingResult.interpretation)
console.log()

// 测试塔罗牌算卦
console.log('=== 测试塔罗牌算卦 ===')
const tarotResult = performTarotDivination("我应该换工作吗？", "three")
console.log('抽到的牌:', tarotResult.cards)
console.log('解释:', tarotResult.interpretation)
console.log()

// 测试签诗算卦
console.log('=== 测试签诗算卦 ===')
const qianShiResult = performQianShiDivination("我的感情运势如何？")
console.log('签诗:', qianShiResult.poem)
console.log('解释:', qianShiResult.interpretation)