// 签诗算卦算法

// 签诗数据（这里只列出部分示例，实际应用中可以有100首签诗）
const qianShiPoems = [
  {
    number: 1,
    title: "第一签",
    content: "天开地辟作良缘，日吉时良万物全；若得此签非小可，人行忠正帝王宣。",
    explanation: "此签为上上签，表示天时地利人和，凡事皆吉。求得此签者，将会得到贵人相助，事业顺利，家庭和睦。",
    meaning: "大吉大利，诸事顺利"
  },
  {
    number: 2,
    title: "第二签",
    content: "混沌初分气象开，离藏虎兔未和谐；忽然一日风云会，万里青天白日来。",
    explanation: "此签表示事情起初困难，但终将顺利解决。求得此签者，需耐心等待时机，一旦时机成熟，将会有大的转机。",
    meaning: "先难后易，终将成功"
  },
  {
    number: 3,
    title: "第三签",
    content: "盘古初开日月明，又逢尧舜享太平；三千礼乐由心化，百岁光阴似箭轻。",
    explanation: "此签表示和谐安定，文化繁荣。求得此签者，将会有良好的发展环境，适合从事文化教育相关事业。",
    meaning: "和谐安定，文化繁荣"
  },
  {
    number: 4,
    title: "第四签",
    content: "前路崎岖君莫忧，虽然用力未能休；于今再若生恶意，弄巧成拙枉心机。",
    explanation: "此签表示前路困难，需要努力坚持。求得此签者，应保持正直心态，不可投机取巧，否则会适得其反。",
    meaning: "前路困难，需守正道"
  },
  {
    number: 5,
    title: "第五签",
    content: "枯木逢春再发枝，眼前生意胜当时；若逢君子传佳讯，转祸为祥事事宜。",
    explanation: "此签表示转机将至，枯木逢春。求得此签者，虽然目前处境不佳，但很快会有转机，且会得到贵人相助。",
    meaning: "转机将至，贵人相助"
  },
  {
    number: 6,
    title: "第六签",
    content: "建桥先要水推船，造塔全凭地作基；若问前途何日就，今年之内定无疑。",
    explanation: "此签表示事业需要基础，不能急于求成。求得此签者，应打好基础，循序渐进，今年内必有所成。",
    meaning: "打好基础，循序渐进"
  },
  {
    number: 7,
    title: "第七签",
    content: "春蚕作茧自羁缠，任你逍遥亦偶然；打破织成还再织，重添心事上眉尖。",
    explanation: "此签表示自我束缚，需要解脱。求得此签者，可能被自己的想法所困扰，需要放宽心态，不要过于纠结。",
    meaning: "自我束缚，需要解脱"
  },
  {
    number: 8,
    title: "第八签",
    content: "病如西下夕阳时，百事难为总不宜；若得神明加护佑，返魂还命有施为。",
    explanation: "此签表示目前处境不佳，需要寻求帮助。求得此签者，应诚心祈祷，寻求神明保佑，会有转机。",
    meaning: "处境不佳，寻求帮助"
  },
  {
    number: 9,
    title: "第九签",
    content: "喜鹊檐前报好音，知君千里欲归心；寻人料得中途遇，月出光辉五色明。",
    explanation: "此签表示好消息将至。求得此签者，将会有好消息传来，寻找的人或物也会有所收获。",
    meaning: "好消息将至，所求可得"
  },
  {
    number: 10,
    title: "第十签",
    content: "一朝喜色一番新，富贵荣华萃此身；若问前程何处好，更于云里见麒麟。",
    explanation: "此签表示将有喜事临门，富贵荣华。求得此签者，前程似锦，会有意想不到的好运。",
    meaning: "喜事临门，前程似锦"
  },
  {
    number: 15,
    title: "第十五签",
    content: "行人涉水定安然，舟楫留连作恶缘；若问前程何处好，更须守旧待时迁。",
    explanation: "此签表示目前进展缓慢，需要耐心等待。求得此签者，不宜急进，应保持现状，等待时机。",
    meaning: "进展缓慢，耐心等待"
  },
  {
    number: 20,
    title: "第二十签",
    content: "神明降笔写忠诚，守旧营为百事亨；若问前程何处好，更须进步始能成。",
    explanation: "此签表示需要积极进取。求得此签者，虽然目前情况稳定，但要取得更大成就，需要积极进取。",
    meaning: "积极进取，方能成功"
  },
  {
    number: 25,
    title: "第二十五签",
    content: "天边月白露华清，一点灵光彻太清；若问前程何处好，更须向道始能成。",
    explanation: "此签表示需要修身养性。求得此签者，应注重内在修养，提升自己的品德和能力。",
    meaning: "修身养性，提升自我"
  },
  {
    number: 30,
    title: "第三十签",
    content: "红日当空照世间，不须祈祷自然安；若问前程何处好，更须努力始能成。",
    explanation: "此签表示阳光明媚，诸事顺利。求得此签者，应继续努力，不要松懈，自然能取得成功。",
    meaning: "诸事顺利，继续努力"
  },
  {
    number: 35,
    title: "第三十五签",
    content: "宝剑出匣显威光，斩断情丝理应当；若问前程何处好，更须果断始能成。",
    explanation: "此签表示需要果断决策。求得此签者，面临选择时应果断决策，不可犹豫不决。",
    meaning: "果断决策，斩断纠缠"
  },
  {
    number: 40,
    title: "第四十签",
    content: "绿柳枝头春意浓，花开满树映晴空；若问前程何处好，更须和顺始能成。",
    explanation: "此签表示和谐和顺。求得此签者，应保持和谐的人际关系，和顺处事，自然能取得成功。",
    meaning: "和谐和顺，事业顺利"
  },
  {
    number: 45,
    title: "第四十五签",
    content: "船到江心补漏迟，不如及早整要维；若问前程何处好，更须预防始能成。",
    explanation: "此签表示需要防患未然。求得此签者，应提前做好准备，预防可能出现的问题。",
    meaning: "防患未然，提前准备"
  },
  {
    number: 50,
    title: "第五十签",
    content: "江上渔翁把钓竿，锦鳞游泳水如蓝；若问前程何处好，更须耐性始能成。",
    explanation: "此签表示需要耐心等待。求得此签者，应保持耐心，不可急躁，时机成熟自然会有收获。",
    meaning: "耐心等待，时机成熟"
  },
  {
    number: 55,
    title: "第五十五签",
    content: "石中磨玉始成珍，不历艰辛怎得真；若问前程何处好，更须磨练始能成。",
    explanation: "此签表示需要经历磨练。求得此签者，成功需要经历磨练，不能急于求成。",
    meaning: "经历磨练，方得成功"
  },
  {
    number: 60,
    title: "第六十签",
    content: "云开月出照山川，万派朝宗水接天；若问前程何处好，更须积累始能成。",
    explanation: "此签表示需要积累。求得此签者，成功需要积累，应注重平时的积累和准备。",
    meaning: "注重积累，厚积薄发"
  },
  {
    number: 65,
    title: "第六十五签",
    content: "春风得意马蹄疾，一日看尽长安花；若问前程何处好，更须谨慎始能成。",
    explanation: "此签表示需要谨慎。求得此签者，虽然目前顺利，但应保持谨慎，不可得意忘形。",
    meaning: "顺利时需保持谨慎"
  },
  {
    number: 70,
    title: "第七十签",
    content: "山重水复疑无路，柳暗花明又一村；若问前程何处好，更须坚持始能成。",
    explanation: "此签表示需要坚持。求得此签者，遇到困难时应坚持不放弃，前方会有新的转机。",
    meaning: "坚持不懈，终见转机"
  },
  {
    number: 75,
    title: "第七十五签",
    content: "宝剑锋从磨砺出，梅花香自苦寒来；若问前程何处好，更须奋斗始能成。",
    explanation: "此签表示需要奋斗。求得此签者，成功需要奋斗，应努力拼搏，不可懈怠。",
    meaning: "努力奋斗，方能成功"
  },
  {
    number: 80,
    title: "第八十签",
    content: "海阔凭鱼跃，天空任鸟飞；若问前程何处好，更须自由始能成。",
    explanation: "此签表示需要自由发展。求得此签者，应给予自己足够的自由空间，不要被束缚。",
    meaning: "自由发展，不受束缚"
  },
  {
    number: 85,
    title: "第八十五签",
    content: "山不在高，有仙则名；水不在深，有龙则灵；若问前程何处好，更须内涵始能成。",
    explanation: "此签表示需要注重内涵。求得此签者，应注重内在修养，提升自己的内涵和品质。",
    meaning: "注重内涵，提升品质"
  },
  {
    number: 90,
    title: "第九十签",
    content: "水能载舟，亦能覆舟；若问前程何处好，更须谨慎始能成。",
    explanation: "此签表示需要谨慎处事。求得此签者，应谨慎处理各种关系，不可掉以轻心。",
    meaning: "谨慎处事，防范风险"
  },
  {
    number: 95,
    title: "第九十五签",
    content: "路漫漫其修远兮，吾将上下而求索；若问前程何处好，更须求知始能成。",
    explanation: "此签表示需要不断求知。求得此签者，应保持学习的态度，不断充实自己。",
    meaning: "不断学习，充实自己"
  },
  {
    number: 100,
    title: "第一百签",
    content: "天道酬勤志如钢，千锤百炼终成强；若问前程何处好，更须恒心始能成。",
    explanation: "此签为总结之签，表示成功需要恒心。求得此签者，应保持恒心，坚持不懈，终将成功。",
    meaning: "持之以恒，终将成功"
  }
]

// 根据签号获取签诗
const getQianShiPoem = (number: number) => {
  return qianShiPoems.find(poem => poem.number === number)
}

// 随机抽取签诗
const drawQianShi = (): typeof qianShiPoems[number] => {
  const randomIndex = Math.floor(Math.random() * qianShiPoems.length)
  return qianShiPoems[randomIndex]
}

// 解释签诗
const interpretQianShi = (poem: typeof qianShiPoems[number]): string => {
  return `您抽到的是${poem.title}：\n\n` +
         `签诗内容：${poem.content}\n\n` +
         `签诗解释：${poem.explanation}\n\n` +
         `总体含义：${poem.meaning}`
}

// 主要的签诗算卦函数
export const performQianShiDivination = (question?: string): {
  poem: typeof qianShiPoems[number]
  interpretation: string
} => {
  const poem = drawQianShi()
  const interpretation = interpretQianShi(poem)
  
  return {
    poem,
    interpretation
  }
}

// 导出数据供其他模块使用
export { qianShiPoems }