// 易经六十四卦算卦算法

import { hexagrams as completeHexagrams, getHexagramInterpretation, getLineInterpretation } from '../../data/hexagrams';

interface Hexagram {
  number: number;
  name: string;
  chineseName: string;
  description: string;
}

// 六十四卦数据
const hexagrams: Hexagram[] = completeHexagrams.map(h => ({
  number: h.number,
  name: h.name,
  chineseName: h.chineseName,
  description: h.description
}));


// 爻位信息
const yaoPositions = [
  "初爻（最下爻）",
  "二爻",
  "三爻",
  "四爻",
  "五爻",
  "上爻（最上爻）"
]

// 抛掷硬币生成爻的方法
const tossCoin = (): number => {
  // 返回值：2表示阳爻（实线），3表示阴爻（虚线）
  // 传统方法是抛三枚硬币，这里简化为随机生成
  return Math.random() > 0.5 ? 2 : 3
}

// 生成六爻卦象
const generateHexagram = (): { 
  hexagram: Hexagram, 
  yao: number[], 
  changingLines: boolean[] 
} => {
  const yao: number[] = []
  const changingLines: boolean[] = []
  
  // 生成六爻
  for (let i = 0; i < 6; i++) {
    const toss1 = tossCoin()
    const toss2 = tossCoin()
    const toss3 = tossCoin()
    
    const sum = toss1 + toss2 + toss3
    
    // 根据三枚硬币的和确定爻的类型
    if (sum === 6) {
      // 老阴爻（变爻）- - o
      yao.push(3)
      changingLines.push(true)
    } else if (sum === 7) {
      // 少阳爻（不变爻）---
      yao.push(2)
      changingLines.push(false)
    } else if (sum === 8) {
      // 少阴爻（不变爻）- -
      yao.push(3)
      changingLines.push(false)
    } else if (sum === 9) {
      // 老阳爻（变爻）--- o
      yao.push(2)
      changingLines.push(true)
    }
  }
  
  // 计算卦象编号
  let binary = ""
  for (let i = 5; i >= 0; i--) {
    binary += yao[i] === 2 ? "1" : "0"
  }
  
  const hexagramNumber = parseInt(binary, 2) + 1
  // 确保能找到对应的卦象，如果找不到则使用乾卦作为默认
  const hexagram = hexagrams.find(h => h.number === hexagramNumber) || hexagrams[0]
  
  return {
    hexagram: hexagram as Hexagram,
    yao,
    changingLines
  }
}

// 解释卦象
const interpretHexagram = (result: ReturnType<typeof generateHexagram>): string => {
  // 获取完整的卦象解释
  const detailedInterpretation = getHexagramInterpretation(result.hexagram.number);
  
  let interpretation = `您得到的是第${result.hexagram.number}卦：${result.hexagram.chineseName}（${result.hexagram.name}）。\n`
  interpretation += detailedInterpretation + "\n\n";
  
  // 检查是否有变爻
  const changingCount = result.changingLines.filter(Boolean).length
  
  if (changingCount > 0) {
    interpretation += `此卦中有${changingCount}个变爻：\n`
    result.changingLines.forEach((isChanging, index) => {
      if (isChanging) {
        interpretation += `- ${yaoPositions[index]}\n`
        // 添加爻辞解释
        interpretation += `  爻辞：${getLineInterpretation(result.hexagram.number, index)}\n`
      }
    })
    interpretation += "\n变爻表示变化和动态，提示您当前情况可能会发生变化。\n"
  } else {
    interpretation += "此卦无变爻，表示情况相对稳定。\n"
  }
  
  return interpretation
}

// 主要的易经算卦函数
export const performIChingDivination = (): {
  hexagram: Hexagram
  yao: number[]
  changingLines: boolean[]
  interpretation: string
} => {
  const result = generateHexagram()
  const interpretation = interpretHexagram(result)
  
  return {
    ...result,
    interpretation
  }
}

// 导出数据供其他模块使用
export { hexagrams, yaoPositions }