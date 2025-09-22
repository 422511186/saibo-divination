// 塔罗牌算卦算法

// 大阿卡那牌（22张）
const majorArcana = [
  { number: 0, name: "愚者", meaning: "新的开始，冒险，自发性", reversed: "鲁莽，缺乏规划" },
  { number: 1, name: "魔术师", meaning: "创造力，意志力，技能", reversed: "操纵，缺乏诚信" },
  { number: 2, name: "女祭司", meaning: "直觉，潜意识，神秘", reversed: "秘密，压抑的直觉" },
  { number: 3, name: "皇后", meaning: "丰饶，母性，繁荣", reversed: "依赖，空虚，不安全感" },
  { number: 4, name: "皇帝", meaning: "权威，结构，控制", reversed: "暴政，僵化，缺乏控制" },
  { number: 5, name: "教皇", meaning: "传统，精神指导，制度", reversed: "反叛，个人信念" },
  { number:  6, name: "恋人", meaning: "爱情，和谐，选择", reversed: "冲突，不和谐的选择" },
  { number: 7, name: "战车", meaning: "意志力，胜利，决心", reversed: "缺乏方向，失控" },
  { number: 8, name: "力量", meaning: "勇气，毅力，控制", reversed: "软弱，缺乏自律" },
  { number: 9, name: "隐士", meaning: "内省，指导，寻求真理", reversed: "孤立，迷失方向" },
  { number: 10, name: "命运之轮", meaning: "变化，命运，转折点", reversed: "不幸，缺乏控制" },
  { number: 11, name: "正义", meaning: "公正，真理，法律", reversed: "不公正，偏见" },
  { number: 12, name: "倒吊人", meaning: "牺牲，等待，新视角", reversed: "停滞，缺乏远见" },
  { number: 13, name: "死神", meaning: "结束，变化，转型", reversed: "抗拒变化，停滞" },
  { number: 14, name: "节制", meaning: "平衡，耐心，调和", reversed: "失衡，过度" },
  { number: 15, name: "恶魔", meaning: "束缚，物质主义，诱惑", reversed: "释放，摆脱束缚" },
  { number: 16, name: "塔", meaning: "突然变化，启示，解放", reversed: "避免灾难，逐渐衰落" },
  { number: 17, name: "星星", meaning: "希望，灵感，宁静", reversed: "绝望，缺乏信心" },
  { number: 18, name: "月亮", meaning: "幻觉，恐惧，潜意识", reversed: "释放恐惧，真相浮现" },
  { number: 19, name: "太阳", meaning: "快乐，成功，活力", reversed: "暂时的挫折，缺乏活力" },
  { number: 20, name: "审判", meaning: "重生，内在召唤，宽恕", reversed: "自我怀疑，拒绝改变" },
  { number: 21, name: "世界", meaning: "完成，成就，旅行", reversed: "不完整，缺乏成就感" }
]

// 小阿卡那牌 - 权杖（14张）
const wands = [
  { number: 22, name: "权杖Ace", meaning: "创造力的新开始，灵感", reversed: "缺乏创造力，延迟" },
  { number: 23, name: "权杖2", meaning: "计划，决策，平衡", reversed: "犹豫不决，计划受阻" },
  { number: 24, name: "权杖3", meaning: "展望未来，合作，扩张", reversed: "延误，缺乏远见" },
  { number: 25, name: "权杖4", meaning: "庆祝，和谐，稳定", reversed: "不稳定，缺乏支持" },
  { number: 26, name: "权杖5", meaning: "冲突，竞争，争论", reversed: "避免冲突，内斗" },
  { number: 27, name: "权杖6", meaning: "胜利，进展，认可", reversed: "失败，缺乏认可" },
  { number: 28, name: "权杖7", meaning: "挑战，坚持，防御", reversed: "放弃，被压倒" },
  { number: 29, name: "权杖8", meaning: "快速行动，进展，自由", reversed: "延误，缺乏方向" },
  { number: 30, name: "权杖9", meaning: "韧性，防御，警惕", reversed: "疲惫，过度防御" },
  { number: 31, name: "权杖10", meaning: "负担，责任，压力", reversed: "无法承担，释放负担" },
  { number: 32, name: "权杖侍从", meaning: "热情，新机会，消息", reversed: "缺乏热情，延迟" },
  { number: 33, name: "权杖骑士", meaning: "能量，冒险，冲动", reversed: "缺乏方向，鲁莽" },
  { number: 34, name: "权杖王后", meaning: "勇气，决心，独立", reversed: "缺乏自信，强势" },
  { number: 35, name: "权杖国王", meaning: "领导力，远见，控制", reversed: "专制，缺乏远见" }
]

// 小阿卡那牌 - 圣杯（14张）
const cups = [
  { number: 36, name: "圣杯Ace", meaning: "新的情感，爱，直觉", reversed: "情感空虚，缺乏爱" },
  { number: 37, name: "圣杯2", meaning: "合作，关系，连接", reversed: "关系破裂，不平衡" },
  { number: 38, name: "圣杯3", meaning: "庆祝，友谊，创造力", reversed: "过度，缺乏庆祝" },
  { number: 39, name: "圣杯4", meaning: "沉思，评估，冷漠", reversed: "接受，觉醒" },
  { number: 40, name: "圣杯5", meaning: "失落，悲伤，失望", reversed: "接受损失，寻找希望" },
  { number: 41, name: "圣杯6", meaning: "怀旧，童年，纯真", reversed: "困在过去，前进" },
  { number: 42, name: "圣杯7", meaning: "选择，幻想，意图", reversed: "混乱，缺乏目标" },
  { number: 43, name: "圣杯8", meaning: "放弃，寻找更深层的意义", reversed: "害怕改变，停滞" },
  { number: 44, name: "圣杯9", meaning: "满足，愿望实现，舒适", reversed: "不满足，过度舒适" },
  { number: 45, name: "圣杯10", meaning: "幸福，和谐，家庭", reversed: "破碎的家庭，不和谐" },
  { number: 46, name: "圣杯侍从", meaning: "新感情，创造力，直觉", reversed: "情绪化，不成熟" },
  { number: 47, name: "圣杯骑士", meaning: "浪漫，魅力，想象力", reversed: "不切实际，情绪波动" },
  { number: 48, name: "圣杯王后", meaning: "情感稳定，关怀，直觉", reversed: "过度敏感，依赖" },
  { number: 49, name: "圣杯国王", meaning: "情感成熟，智慧，支持", reversed: "情绪控制，冷淡" }
]

// 小阿卡那牌 - 宝剑（14张）
const swords = [
  { number: 50, name: "宝剑Ace", meaning: "清晰的思维，突破，决策", reversed: "混乱，缺乏清晰度" },
  { number: 51, name: "宝剑2", meaning: "选择，犹豫，僵局", reversed: "错误的选择，信息不足" },
  { number: 52, name: "宝剑3", meaning: "心碎，悲伤，拒绝", reversed: "愈合，宽恕，开放" },
  { number: 53, name: "宝剑4", meaning: "休息，恢复，退缩", reversed: "停滞，疲惫，压力" },
  { number: 54, name: "宝剑5", meaning: "冲突，争吵，胜利", reversed: "和解，原谅，学习" },
  { number: 55, name: "宝剑6", meaning: "过渡，变化，疗愈", reversed: "停滞，回头，无法前进" },
  { number: 56, name: "宝剑7", meaning: "欺骗，策略，逃避", reversed: "诚实，直面问题" },
  { number: 57, name: "宝剑8", meaning: "限制，束缚，自我限制", reversed: "释放，找到出路" },
  { number: 58, name: "宝剑9", meaning: "焦虑，恐惧，噩梦", reversed: "恐惧消散，希望" },
  { number: 59, name: "宝剑10", meaning: "痛苦的结束，牺牲，转变", reversed: "幸存，改善，恢复" },
  { number: 60, name: "宝剑侍从", meaning: "好奇心，消息，警觉", reversed: "批评，缺乏沟通" },
  { number: 61, name: "宝剑骑士", meaning: "行动，冲动，保卫", reversed: "愤怒，鲁莽，攻击性" },
  { number: 62, name: "宝剑王后", meaning: "清晰，独立，直觉", reversed: "冷酷，严厉，恶意" },
  { number: 63, name: "宝剑国王", meaning: "理性，权威，清晰", reversed: "不公正，冷酷，不一致" }
]

// 小阿卡那牌 - 星币（14张）
const pentacles = [
  { number: 64, name: "星币Ace", meaning: "新机会，繁荣，安全", reversed: "失去机会，不安全感" },
  { number: 65, name: "星币2", meaning: "平衡，优先级，适应", reversed: "失衡，混乱，压力" },
  { number: 66, name: "星币3", meaning: "团队合作，技能，学习", reversed: "缺乏合作，低质量" },
  { number: 67, name: "星币4", meaning: "安全，控制，保守", reversed: "贪婪，过度控制" },
  { number: 68, name: "星币5", meaning: "困难，失业，孤立", reversed: "改善，寻求帮助" },
  { number: 69, name: "星币6", meaning: "慷慨，公平，分享", reversed: "权力不平等，债务" },
  { number: 70, name: "星币7", meaning: "耐心，投资，成长", reversed: "缺乏耐心，短期思维" },
  { number: 71, name: "星币8", meaning: "努力工作，技能，承诺", reversed: "缺乏动力，平庸" },
  { number: 72, name: "星币9", meaning: "独立，休闲，财务安全", reversed: "财务不安全，依赖" },
  { number: 73, name: "星币10", meaning: "财富，家庭，遗产", reversed: "财务困难，家庭问题" },
  { number: 74, name: "星币侍从", meaning: "学习，实践，新机会", reversed: "缺乏经验，不负责任" },
  { number: 75, name: "星币骑士", meaning: "效率，决心，责任感", reversed: "缓慢，懒惰，不可靠" },
  { number: 76, name: "星币王后", meaning: "实用主义，关怀，繁荣", reversed: "自我中心，忽视他人" },
  { number: 77, name: "星币国王", meaning: "成功，稳定，安全感", reversed: "财务不安全，控制欲" }
]

// 组合所有塔罗牌
const allTarotCards = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
]

// 洗牌函数
const shuffleCards = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp;
  }
  return shuffled
}

// 抽取牌组的函数
const drawCards = (count: number, reversedChance: number = 0.3): any[] => {
  const shuffled = shuffleCards(allTarotCards)
  const drawn = shuffled.slice(0, count)
  
  // 为每张牌决定是否为逆位
  return drawn.map(card => ({
    ...card,
    reversed: Math.random() < reversedChance
  }))
}

// 解释牌组
const interpretCards = (cards: any[], question?: string): string => {
  let interpretation = ""
  
  if (question) {
    interpretation += `针对问题: "${question}"\n\n`
  }
  
  interpretation += "您抽到的塔罗牌是：\n\n"
  
  cards.forEach((card, index) => {
    const position = getPositionMeaning(index, cards.length)
    interpretation += `${position}: ${card.name}${card.reversed ? ' (逆位)' : ''}\n`
    interpretation += `含义: ${card.reversed ? card.reversed : card.meaning}\n\n`
  })
  
  return interpretation
}

// 获取位置含义
const getPositionMeaning = (index: number, total: number): string => {
  if (total === 1) return "核心牌"
  if (total === 3) {
    const positions = ["过去", "现在", "未来"]
    return positions[index] || "未知位置"
  }
  if (total === 5) {
    const positions = ["过去", "现在", "未来", "指导建议", "可能结果"]
    return positions[index] || "未知位置"
  }
  return `第${index + 1}张牌`
}

// 主要的塔罗牌算卦函数
export const performTarotDivination = (
  question?: string, 
  spread: 'single' | 'three' | 'five' = 'three'
): {
  cards: any[],
  interpretation: string
} => {
  let cardCount = 1
  switch (spread) {
    case 'single':
      cardCount = 1
      break
    case 'three':
      cardCount = 3
      break
    case 'five':
      cardCount = 5
      break
  }
  
  const cards = drawCards(cardCount)
  const interpretation = interpretCards(cards, question)
  
  return {
    cards,
    interpretation
  }
}

// 导出数据供其他模块使用
export { 
  majorArcana, 
  wands, 
  cups, 
  swords, 
  pentacles, 
  allTarotCards 
}