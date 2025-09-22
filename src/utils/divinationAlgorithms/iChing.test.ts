import { performIChingDivination, hexagrams } from './iChing';

describe('易经算卦算法测试', () => {
  // 测试数据完整性
  test('易经卦象数据完整性测试', () => {
    // 检查是否包含64卦
    expect(hexagrams.length).toBe(64);
    
    // 检查每卦是否包含必要字段
    hexagrams.forEach((hexagram, index) => {
      expect(hexagram).toHaveProperty('number');
      expect(hexagram).toHaveProperty('name');
      expect(hexagram).toHaveProperty('chineseName');
      expect(hexagram).toHaveProperty('description');
      
      // 检查编号是否连续
      expect(hexagram.number).toBe(index + 1);
      
      // 检查字段类型
      expect(typeof hexagram.number).toBe('number');
      expect(typeof hexagram.name).toBe('string');
      expect(typeof hexagram.chineseName).toBe('string');
      expect(typeof hexagram.description).toBe('string');
    });
  });

  // 测试卦象生成正确性
  test('易经卦象生成正确性测试', () => {
    const result = performIChingDivination();
    
    // 检查返回结构
    expect(result).toHaveProperty('hexagram');
    expect(result).toHaveProperty('yao');
    expect(result).toHaveProperty('changingLines');
    expect(result).toHaveProperty('interpretation');
    
    // 检查爻位数量
    expect(result.yao.length).toBe(6);
    expect(result.changingLines.length).toBe(6);
    
    // 检查爻位值是否正确（2表示阳爻，3表示阴爻）
    result.yao.forEach(yao => {
      expect([2, 3]).toContain(yao);
    });
    
    // 检查变爻值是否正确（布尔值）
    result.changingLines.forEach(changingLine => {
      expect(typeof changingLine).toBe('boolean');
    });
    
    // 检查卦象是否在有效范围内
    expect(result.hexagram.number).toBeGreaterThanOrEqual(1);
    expect(result.hexagram.number).toBeLessThanOrEqual(64);
  });

  // 测试解释功能
  test('易经解释功能测试', () => {
    const result = performIChingDivination();
    
    // 检查解释是否包含必要的信息
    expect(result.interpretation).toContain('您得到的是第');
    expect(result.interpretation).toContain('卦');
    
    // 检查是否包含卦象名称
    expect(result.interpretation).toContain(result.hexagram.chineseName);
    expect(result.interpretation).toContain(result.hexagram.name);
  });

  // 测试变爻处理
  test('易经变爻处理测试', () => {
    // 进行多次测试以检查变爻处理
    for (let i = 0; i < 10; i++) {
      const result = performIChingDivination();
      
      // 检查变爻数量（应该在0-6之间）
      const changingCount = result.changingLines.filter(Boolean).length;
      expect(changingCount).toBeGreaterThanOrEqual(0);
      expect(changingCount).toBeLessThanOrEqual(6);
      
      // 如果有变爻，解释中应该提到
      if (changingCount > 0) {
        expect(result.interpretation).toContain('变爻');
      }
    }
  });

  // 测试边界条件
  test('易经边界条件测试', () => {
    // 测试不传参数的情况
    expect(() => {
      performIChingDivination();
    }).not.toThrow();
  });
});