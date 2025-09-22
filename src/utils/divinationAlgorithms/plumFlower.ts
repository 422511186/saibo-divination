// 梅花易数算法实现
import { getHexagramByNumber, getHexagramInterpretation } from '../../data/hexagrams'

// 梅花易数结果接口
export interface PlumFlowerResult {
  upperYao: number[]
  lowerYao: number[]
  hexagramNumber: number
  hexagramName: string
  hexagramImage: string
  interpretation: string
}

// 执行梅花易数占卜
export function performPlumFlowerDivination(firstNumber: number, secondNumber: number): PlumFlowerResult {
  // 生成上卦的三个爻
  const upperYao = [
    firstNumber % 3 === 0 ? 1 : 0,
    Math.floor(firstNumber / 10) % 3 === 0 ? 1 : 0,
    Math.floor(firstNumber / 100) % 3 === 0 ? 1 : 0
  ]
  
  // 生成下卦的三个爻
  const lowerYao = [
    secondNumber % 3 === 0 ? 1 : 0,
    Math.floor(secondNumber / 10) % 3 === 0 ? 1 : 0,
    Math.floor(secondNumber / 100) % 3 === 0 ? 1 : 0
  ]
  
  // 计算卦象编号
  const upperBinary = upperYao.map(y => y.toString()).join('')
  const lowerBinary = lowerYao.map(y => y.toString()).join('')
  const hexagramBinary = upperBinary + lowerBinary
  const hexagramNumber = parseInt(hexagramBinary, 2) + 1
  
  // 获取卦象信息
  const hexagram = getHexagramByNumber(hexagramNumber)
  
  // 生成卦象图像（爻位表示）
  const hexagramImage = generateHexagramImage(upperYao, lowerYao)
  
  // 获取卦象解读
  const interpretation = getHexagramInterpretation(hexagramNumber)
  
  return {
    upperYao,
    lowerYao,
    hexagramNumber,
    hexagramName: hexagram ? hexagram.chineseName : `第${hexagramNumber}卦`,
    hexagramImage,
    interpretation
  }
}

// 生成卦象图像
function generateHexagramImage(upperYao: number[], lowerYao: number[]): string {
  const getYaoSymbol = (yao: number) => {
    return yao === 1 ? '━━━━━' : '━ ━ ━'
  }
  
  // 上卦
  const upperTrigram = upperYao.map(yao => getYaoSymbol(yao)).join('\n')
  
  // 下卦
  const lowerTrigram = lowerYao.map(yao => getYaoSymbol(yao)).join('\n')
  
  return `${upperTrigram}\n${lowerTrigram}`
}