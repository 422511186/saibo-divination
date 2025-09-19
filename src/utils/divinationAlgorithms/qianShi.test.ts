import { performQianShiDivination } from './qianShi';

describe('签诗算卦算法测试', () => {
  // 测试数据完整性
  test('签诗数据完整性测试', () => {
    // 这个测试会验证数据完整性，通过调用算法函数间接测试
    expect(() => {
      performQianShiDivination();
    }).not.toThrow();
  });

  // 测试签诗数量
  test('签诗数量测试', () => {
    // 通过检查是否能正常调用函数来间接验证数据完整性
    const result = performQianShiDivination();
    expect(result).toHaveProperty('poem');
    expect(result).toHaveProperty('interpretation');
    
    // 验证签诗对象结构
    expect(result.poem).toHaveProperty('number');
    expect(result.poem).toHaveProperty('title');
    expect(result.poem).toHaveProperty('content');
    expect(result.poem).toHaveProperty('explanation');
    expect(result.poem).toHaveProperty('meaning');
    
    // 验证签诗编号在合理范围内
    expect(result.poem.number).toBeGreaterThanOrEqual(1);
    expect(result.poem.number).toBeLessThanOrEqual(100);
  });

  // 测试随机性
  test('签诗抽签随机性测试', () => {
    // 多次抽取并检查是否得到不同的结果
    const results: number[] = [];
    for (let i = 0; i < 20; i++) {
      const result = performQianShiDivination();
      results.push(result.poem.number);
    }
    
    // 检查是否至少有一些不同的结果（随机性测试）
    const uniqueResults = [...new Set(results)];
    expect(uniqueResults.length).toBeGreaterThan(1);
  });

  // 测试解释功能
  test('签诗解释功能测试', () => {
    const result = performQianShiDivination("我的感情运势如何？");
    
    // 检查解释是否包含必要的信息
    expect(result.interpretation).toContain('您抽到的是');
    expect(result.interpretation).toContain('签诗内容');
    expect(result.interpretation).toContain('签诗解释');
    expect(result.interpretation).toContain('寓意');
    
    // 检查是否包含具体的签诗信息
    expect(result.interpretation).toContain(result.poem.title);
    expect(result.interpretation).toContain(result.poem.content);
  });

  // 测试边界条件
  test('签诗边界条件测试', () => {
    // 测试不传参数的情况
    expect(() => {
      performQianShiDivination();
    }).not.toThrow();
    
    // 测试传入问题参数的情况
    expect(() => {
      performQianShiDivination("这是一个测试问题");
    }).not.toThrow();
  });
});