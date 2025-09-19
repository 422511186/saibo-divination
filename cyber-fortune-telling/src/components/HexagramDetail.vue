<template>
  <div class="hexagram-detail" v-if="hexagram">
    <div class="hexagram-header">
      <h2 class="hexagram-title">
        <span class="hexagram-number">第{{ hexagram.number }}卦</span>
        <span class="hexagram-name">{{ hexagram.chineseName }} ({{ hexagram.name }})</span>
      </h2>
      <div class="hexagram-description">{{ hexagram.description }}</div>
    </div>
    
    <div class="hexagram-content">
      <div class="hexagram-section">
        <h3>卦辞</h3>
        <div class="section-content">{{ hexagram.judgment }}</div>
      </div>
      
      <div class="hexagram-section">
        <h3>象辞</h3>
        <div class="section-content">{{ hexagram.image }}</div>
      </div>
      
      <div class="hexagram-section" v-if="yaoValues && yaoValues.length === 6">
        <h3>六爻详情</h3>
        <div class="yao-details">
          <div 
            v-for="(yao, index) in yaoValues" 
            :key="index"
            class="yao-item"
            :class="{ changing: changingLines && changingLines[index] }"
          >
            <div class="yao-header">
              <span class="yao-position">{{ getYaoPosition(index) }}</span>
              <span class="yao-type">{{ getYaoTypeText(yao) }}</span>
              <span class="yao-changing" v-if="changingLines && changingLines[index]">变爻</span>
            </div>
            <div class="yao-interpretation">{{ getLineInterpretation(hexagram.number, 5 - index) }}</div>
          </div>
        </div>
      </div>
      
      <div class="hexagram-section" v-if="changingLines && changingLines.some(Boolean)">
        <h3>变卦说明</h3>
        <div class="section-content">
          <p>此卦有变爻，表示情况会发生变化。变爻越多，变化越大。</p>
          <p>变爻的位置提示了变化的关键时机和方面。</p>
        </div>
      </div>
    </div>
  </div>
  <div class="hexagram-not-found" v-else>
    未找到对应的卦象信息
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getHexagramByNumber, getLineInterpretation } from '../data/hexagrams';

interface Props {
  hexagramNumber: number;
  yaoValues?: number[];
  changingLines?: boolean[];
}

const props = defineProps<Props>();

const hexagram = computed(() => {
  return getHexagramByNumber(props.hexagramNumber);
});

const getYaoPosition = (index: number) => {
  const positions = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  return positions[index];
};

const getYaoTypeText = (yao: number) => {
  // 2表示阳爻，3表示阴爻
  return yao === 2 ? '阳爻 (━━━━━)' : '阴爻 (━ ━ ━)';
};
</script>

<style scoped lang="scss">
.hexagram-detail {
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 0 20px rgba(188, 19, 254, 0.3);
}

.hexagram-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(188, 19, 254, 0.3);
}

.hexagram-title {
  color: #ff00ff;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.hexagram-number {
  font-weight: bold;
  background: linear-gradient(90deg, #bc13fe, #00f0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hexagram-name {
  font-size: 1.5rem;
}

.hexagram-description {
  color: #00f0ff;
  font-size: 1.1rem;
}

.hexagram-section {
  margin-bottom: 25px;
}

.hexagram-section h3 {
  color: #ff00ff;
  margin-bottom: 12px;
  font-size: 1.3rem;
  border-left: 3px solid #bc13fe;
  padding-left: 10px;
}

.section-content {
  color: #00f0ff;
  line-height: 1.6;
  font-size: 1.1rem;
  padding: 10px 15px;
  background: rgba(8, 8, 16, 0.5);
  border-radius: 5px;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.yao-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.yao-item {
  padding: 15px;
  background: rgba(8, 8, 16, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.yao-item.changing {
  border: 1px solid #ffff00;
  background: rgba(255, 255, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 255, 0, 0.3);
}

.yao-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(188, 19, 254, 0.2);
}

.yao-position {
  color: #00f0ff;
  font-weight: bold;
  font-size: 1.1rem;
}

.yao-type {
  color: #bc13fe;
  font-weight: bold;
}

.yao-changing {
  color: #ffff00;
  font-weight: bold;
  background: rgba(255, 255, 0, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.yao-interpretation {
  color: #00f0ff;
  font-size: 1rem;
  line-height: 1.5;
}

.hexagram-not-found {
  color: #ff00ff;
  text-align: center;
  font-size: 1.2rem;
  padding: 30px;
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid #bc13fe;
  border-radius: 10px;
}
</style>