import { performTarotDivination, allTarotCards } from './tarot';

describe('塔罗牌算卦算法测试', () => {
  // 测试数据完整性
  test('塔罗牌数据完整性测试', () => {
    // 检查总牌数是否为78张
    expect(allTarotCards.length).toBe(78);
    
    // 检查每张牌是否都有number字段
    allTarotCards.forEach(card => {
      expect(card).toHaveProperty('number');
      expect(typeof card.number).toBe('number');
      expect(card.number).toBeGreaterThanOrEqual(0);
      expect(card.number).toBeLessThan(78);
    });
    
    // 检查是否有重复的编号
    const numbers = allTarotCards.map(card => card.number);
    const uniqueNumbers = [...new Set(numbers)];
    expect(numbers.length).toBe(uniqueNumbers.length);
  });

  // 测试抽牌函数的正确性
  test('塔罗牌抽牌正确性测试', () => {
    // 测试单张牌抽取
    const singleResult = performTarotDivination(undefined, 'single');
    expect(singleResult.cards.length).toBe(1);
    
    // 测试三张牌抽取
    const threeResult = performTarotDivination(undefined, 'three');
    expect(threeResult.cards.length).toBe(3);
    
    // 测试五张牌抽取
    const fiveResult = performTarotDivination(undefined, 'five');
    expect(fiveResult.cards.length).toBe(5);
    
    // 检查抽到的牌是否在原始牌组中
    singleResult.cards.forEach(card => {
      const found = allTarotCards.find(tarotCard => tarotCard.number === card.number);
      expect(found).toBeDefined();
    });
  });

  // 测试随机性
  test('塔罗牌抽牌随机性测试', () => {
    // 多次抽取并检查是否得到不同的结果
    const results: any[] = [];
    for (let i = 0; i < 10; i++) {
      const result = performTarotDivination(undefined, 'three');
      results.push(result.cards.map(card => card.number).sort());
    }
    
    // 检查是否至少有一些不同的结果（随机性测试）
    let hasDifferentResults = false;
    for (let i = 1; i < results.length; i++) {
      if (JSON.stringify(results[i]) !== JSON.stringify(results[0])) {
        hasDifferentResults = true;
        break;
      }
    }
    
    // 由于随机性，10次抽牌很可能至少有两次不同
    // 这个测试可能会偶尔失败，但在大多数情况下应该通过
    expect(hasDifferentResults).toBe(true);
  });

  // 测试逆位牌功能
  test('塔罗牌逆位功能测试', () => {
    // 进行多次测试以确保逆位牌功能正常
    let hasReversed = false;
    let hasUpright = false;
    
    for (let i = 0; i < 50; i++) {
      const result = performTarotDivination(undefined, 'single');
      const card = result.cards[0];
      
      if (card.reversed === true) {
        hasReversed = true;
      } else if (card.reversed === false) {
        hasUpright = true;
      }
      
      if (hasReversed && hasUpright) {
        break;
      }
    }
    
    // 应该既有正位也有逆位的牌
    expect(hasReversed).toBe(true);
    expect(hasUpright).toBe(true);
  });

  // 测试解释功能
  test('塔罗牌解释功能测试', () => {
    const result = performTarotDivination("我的事业运如何？", 'three');
    
    // 检查返回结构
    expect(result).toHaveProperty('cards');
    expect(result).toHaveProperty('interpretation');
    
    // 检查解释是否包含必要的信息
    expect(result.interpretation).toContain('您抽到的塔罗牌是');
    expect(result.interpretation).toContain('过去');
    expect(result.interpretation).toContain('现在');
    expect(result.interpretation).toContain('未来');
    
    // 检查是否包含牌名
    result.cards.forEach(card => {
      expect(result.interpretation).toContain(card.name);
    });
  });
});