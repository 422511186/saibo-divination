<template>
  <div class="divination-icons">
    <div class="icons-container">
      <!-- 塔罗牌图标 -->
      <div v-if="type === 'tarot'" class="tarot-icons">
        <h3>塔罗牌图标介绍</h3>
        <div class="icons-grid">
          <div class="icon-item" v-for="card in majorArcanaCards" :key="card.number">
            <div class="icon-card">
              <div class="icon-number">{{ card.number + 1 }}</div>
              <div class="icon-name">{{ card.name }}</div>
              <div class="icon-meaning">{{ card.meaning }}</div>
            </div>
          </div>
        </div>
        <div class="minor-arcana">
          <h4>小阿卡那牌</h4>
          <div class="suit-section" v-for="suit in minorArcanaSuits" :key="suit.name">
            <h5>{{ suit.name }}</h5>
            <div class="suit-icons">
              <div class="icon-item small" v-for="card in suit.cards" :key="card.number">
                <div class="icon-card">
                  <div class="icon-name">{{ card.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 易经图标 -->
      <div v-else-if="type === 'yi-jing'" class="iching-icons">
        <h3>易经八卦图标</h3>
        <div class="bagua-grid">
          <div class="bagua-item" v-for="bagua in baguaSymbols" :key="bagua.name">
            <div class="bagua-card">
              <div class="bagua-symbol">{{ bagua.symbol }}</div>
              <div class="bagua-name">{{ bagua.name }}</div>
              <div class="bagua-meaning">{{ bagua.meaning }}</div>
            </div>
          </div>
        </div>
        <div class="hexagram-examples">
          <h4>六十四卦示例</h4>
          <div class="hexagram-grid">
            <div class="hexagram-item" v-for="hexagram in exampleHexagrams" :key="hexagram.number">
              <div class="hexagram-card">
                <div class="hexagram-symbol">{{ hexagram.symbol }}</div>
                <div class="hexagram-name">{{ hexagram.chineseName }}</div>
                <div class="hexagram-number">第{{ hexagram.number }}卦</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 签诗图标 -->
      <div v-else-if="type === 'qian-shi'" class="qianshi-icons">
        <h3>签诗图标介绍</h3>
        <div class="qiantong-icon">
          <div class="qiantong-illustration">
            <div class="qiantong-body">
              <div class="qiantong-top"></div>
              <div class="qiantong-middle"></div>
              <div class="qiantong-bottom"></div>
            </div>
          </div>
          <div class="qiantong-description">
            <p>签筒是传统抽签工具，通常由竹筒制成，内装多支签条。</p>
            <p>求签者虔诚祈祷后摇动签筒，直到有一支签条跳出，即为所求之签。</p>
          </div>
        </div>
        <div class="qian-examples">
          <h4>签诗示例</h4>
          <div class="qian-grid">
            <div class="qian-item" v-for="qian in exampleQians" :key="qian.number">
              <div class="qian-card">
                <div class="qian-number">第{{ qian.number }}签</div>
                <div class="qian-title">{{ qian.title }}</div>
                <div class="qian-content">{{ qian.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 梅花易数图标 -->
      <div v-else-if="type === 'plum-blossom'" class="plumflower-icons">
        <h3>梅花易数图标介绍</h3>
        <div class="plumflower-illustration">
          <div class="plumflower-image">
            <div class="plum-blossom">
              <div class="petal" v-for="n in 5" :key="n"></div>
              <div class="center"></div>
            </div>
          </div>
          <div class="plumflower-description">
            <p>梅花易数是北宋易学家邵雍所创的占卜方法，以数字和时间为基础，结合易经的卦象理论进行预测。</p>
            <p>其名称来源于"梅花五瓣"，象征着五行相生相克的原理。</p>
          </div>
        </div>
        <div class="number-examples">
          <h4>数字与卦象对应</h4>
          <div class="number-grid">
            <div class="number-item" v-for="item in numberExamples" :key="item.number">
              <div class="number-card">
                <div class="number-value">{{ item.number }}</div>
                <div class="number-trigram">{{ item.trigram }}</div>
                <div class="number-meaning">{{ item.meaning }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  type: string
}>()

// 塔罗牌数据
const majorArcanaCards = ref([
  { number: 0, name: "愚者", meaning: "新的开始，冒险" },
  { number: 1, name: "魔术师", meaning: "创造力，意志力" },
  { number: 2, name: "女祭司", meaning: "直觉，潜意识" },
  { number: 3, name: "皇后", meaning: "丰饶，母性" },
  { number: 4, name: "皇帝", meaning: "权威，结构" },
  { number: 5, name: "教皇", meaning: "传统，精神指导" },
  { number: 6, name: "恋人", meaning: "爱情，和谐" },
  { number: 7, name: "战车", meaning: "意志力，胜利" },
  { number: 8, name: "力量", meaning: "勇气，毅力" },
  { number: 9, name: "隐士", meaning: "内省，指导" },
  { number: 10, name: "命运之轮", meaning: "变化，命运" },
  { number: 11, name: "正义", meaning: "公正，真理" },
  { number: 12, name: "倒吊人", meaning: "牺牲，等待" },
  { number: 13, name: "死神", meaning: "结束，变化" },
  { number: 14, name: "节制", meaning: "平衡，耐心" },
  { number: 15, name: "恶魔", meaning: "束缚，诱惑" },
  { number: 16, name: "塔", meaning: "突然变化" },
  { number: 17, name: "星星", meaning: "希望，灵感" },
  { number: 18, name: "月亮", meaning: "幻觉，恐惧" },
  { number: 19, name: "太阳", meaning: "快乐，成功" },
  { number: 20, name: "审判", meaning: "重生，宽恕" },
  { number: 21, name: "世界", meaning: "完成，成就" }
])

const minorArcanaSuits = ref([
  {
    name: "权杖 (火)",
    cards: [
      { number: 22, name: "权杖Ace" },
      { number: 23, name: "权杖2" },
      { number: 24, name: "权杖3" },
      { number: 32, name: "权杖侍从" },
      { number: 33, name: "权杖骑士" }
    ]
  },
  {
    name: "圣杯 (水)",
    cards: [
      { number: 36, name: "圣杯Ace" },
      { number: 37, name: "圣杯2" },
      { number: 38, name: "圣杯3" },
      { number: 46, name: "圣杯侍从" },
      { number: 47, name: "圣杯骑士" }
    ]
  },
  {
    name: "宝剑 (风)",
    cards: [
      { number: 50, name: "宝剑Ace" },
      { number: 51, name: "宝剑2" },
      { number: 52, name: "宝剑3" },
      { number: 60, name: "宝剑侍从" },
      { number: 61, name: "宝剑骑士" }
    ]
  },
  {
    name: "星币 (土)",
    cards: [
      { number: 64, name: "星币Ace" },
      { number: 65, name: "星币2" },
      { number: 66, name: "星币3" },
      { number: 74, name: "星币侍从" },
      { number: 75, name: "星币骑士" }
    ]
  }
])

// 易经八卦数据
const baguaSymbols = ref([
  { name: "乾", symbol: "☰", meaning: "天，健，创造" },
  { name: "坤", symbol: "☷", meaning: "地，顺，包容" },
  { name: "震", symbol: "☳", meaning: "雷，动，激励" },
  { name: "巽", symbol: "☴", meaning: "风，入，渗透" },
  { name: "坎", symbol: "☵", meaning: "水，陷，危险" },
  { name: "离", symbol: "☲", meaning: "火，丽，光明" },
  { name: "艮", symbol: "☶", meaning: "山，止，稳定" },
  { name: "兑", symbol: "☱", meaning: "泽，悦，喜悦" }
])

const exampleHexagrams = ref([
  { number: 1, chineseName: "乾卦", symbol: "䷀" },
  { number: 2, chineseName: "坤卦", symbol: "䷁" },
  { number: 11, chineseName: "泰卦", symbol: "䷊" },
  { number: 12, chineseName: "否卦", symbol: "䷋" },
  { number: 63, chineseName: "既济卦", symbol: "䷾" },
  { number: 64, chineseName: "未济卦", symbol: "䷿" }
])

// 签诗数据
const exampleQians = ref([
  {
    number: 1,
    title: "第一签",
    content: "天开地辟作良缘，日吉时良万物全"
  },
  {
    number: 10,
    title: "第十签",
    content: "一朝喜色一番新，富贵荣华萃此身"
  },
  {
    number: 50,
    title: "第五十签",
    content: "春风得意马蹄疾，一日看尽长安花"
  },
  {
    number: 100,
    title: "第一百签",
    content: "百岁光阴如过客，一樽浊酒慰风尘"
  }
])

// 梅花易数数据
const numberExamples = ref([
  { number: 1, trigram: "☰", meaning: "乾为天" },
  { number: 2, trigram: "☷", meaning: "坤为地" },
  { number: 3, trigram: "☳", meaning: "震为雷" },
  { number: 4, trigram: "☴", meaning: "巽为风" },
  { number: 5, trigram: "☵", meaning: "坎为水" },
  { number: 6, trigram: "☲", meaning: "离为火" },
  { number: 7, trigram: "☶", meaning: "艮为山" },
  { number: 8, trigram: "☱", meaning: "兑为泽" }
])
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.divination-icons {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba($cyber-panel, 0.5);
  border-radius: 15px;
  border: 1px solid rgba($neon-blue, 0.3);
  animation: fadeIn 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 1.8s;
  opacity: 0;
  will-change: transform, opacity;

  h3, h4, h5 {
    color: $neon-blue;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow: 0 0 8px rgba($neon-blue, 0.5);
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  h4 {
    font-size: 1.4rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h5 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: $neon-purple;
  }

  .icons-container {
    max-width: 100%;
    overflow-x: auto;
  }

  // 塔罗牌样式
  .tarot-icons {
    .icons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .icon-item {
      .icon-card {
        background: rgba($cyber-dark, 0.7);
        border: 1px solid rgba($neon-purple, 0.5);
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba($neon-purple, 0.3);
          border-color: $neon-purple;
        }

        .icon-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: $neon-pink;
          margin-bottom: 0.5rem;
        }

        .icon-name {
          font-size: 1.1rem;
          font-weight: bold;
          color: $neon-blue;
          margin-bottom: 0.5rem;
        }

        .icon-meaning {
          font-size: 0.9rem;
          color: $text-primary;
        }
      }

      &.small {
        .icon-card {
          padding: 0.8rem;

          .icon-name {
            font-size: 1rem;
          }
        }
      }
    }

    .minor-arcana {
      .suit-section {
        margin-bottom: 1.5rem;

        .suit-icons {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.8rem;
        }
      }
    }
  }

  // 易经样式
  .iching-icons {
    .bagua-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .bagua-item {
      .bagua-card {
        background: rgba($cyber-dark, 0.7);
        border: 1px solid rgba($neon-blue, 0.5);
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba($neon-blue, 0.3);
          border-color: $neon-blue;
        }

        .bagua-symbol {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: $neon-yellow;
        }

        .bagua-name {
          font-size: 1.2rem;
          font-weight: bold;
          color: $neon-blue;
          margin-bottom: 0.5rem;
        }

        .bagua-meaning {
          font-size: 0.9rem;
          color: $text-primary;
        }
      }
    }

    .hexagram-examples {
      .hexagram-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .hexagram-item {
        .hexagram-card {
          background: rgba($cyber-dark, 0.7);
          border: 1px solid rgba($neon-blue, 0.5);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba($neon-blue, 0.3);
            border-color: $neon-blue;
          }

          .hexagram-symbol {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: $neon-yellow;
          }

          .hexagram-name {
            font-size: 1.1rem;
            font-weight: bold;
            color: $neon-blue;
            margin-bottom: 0.3rem;
          }

          .hexagram-number {
            font-size: 0.9rem;
            color: $neon-purple;
          }
        }
      }
    }
  }

  // 签诗样式
  .qianshi-icons {
    .qiantong-icon {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }

      .qiantong-illustration {
        flex: 0 0 200px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        .qiantong-body {
          position: relative;
          width: 80px;
          height: 200px;

          .qiantong-top {
            width: 100px;
            height: 20px;
            background: linear-gradient(135deg, #8B4513, #A0522D);
            border-radius: 50px 50px 0 0;
            position: absolute;
            top: -10px;
            left: -10px;
          }

          .qiantong-middle {
            width: 80px;
            height: 150px;
            background: linear-gradient(135deg, #A0522D, #8B4513);
            border-radius: 5px;
            position: absolute;
            top: 10px;
          }

          .qiantong-bottom {
            width: 90px;
            height: 30px;
            background: linear-gradient(135deg, #8B4513, #A0522D);
            border-radius: 0 0 45px 45px;
            position: absolute;
            bottom: 0;
            left: -5px;
          }
        }
      }

      .qiantong-description {
        flex: 1;
        color: $text-primary;
        line-height: 1.6;

        p {
          margin-bottom: 1rem;
        }
      }
    }

    .qian-examples {
      .qian-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }

      .qian-item {
        .qian-card {
          background: rgba($cyber-dark, 0.7);
          border: 1px solid rgba($neon-blue, 0.5);
          border-radius: 10px;
          padding: 1rem;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba($neon-blue, 0.3);
            border-color: $neon-blue;
          }

          .qian-number {
            font-size: 1.1rem;
            font-weight: bold;
            color: $neon-purple;
            margin-bottom: 0.5rem;
          }

          .qian-title {
            font-size: 1.2rem;
            font-weight: bold;
            color: $neon-blue;
            margin-bottom: 0.5rem;
          }

          .qian-content {
            font-size: 0.9rem;
            color: $text-primary;
            font-style: italic;
          }
        }
      }
    }
  }

  // 梅花易数样式
  .plumflower-icons {
    .plumflower-illustration {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
      }

      .plumflower-image {
        flex: 0 0 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;

        .plum-blossom {
          position: relative;
          width: 150px;
          height: 150px;

          .petal {
            position: absolute;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #FFB6C1, #FF69B4);
            border-radius: 50% 0;
            top: 50%;
            left: 50%;
            transform-origin: 0 0;

            &:nth-child(1) { transform: rotate(0deg); }
            &:nth-child(2) { transform: rotate(72deg); }
            &:nth-child(3) { transform: rotate(144deg); }
            &:nth-child(4) { transform: rotate(216deg); }
            &:nth-child(5) { transform: rotate(288deg); }
          }

          .center {
            position: absolute;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .plumflower-description {
        flex: 1;
        color: $text-primary;
        line-height: 1.6;

        p {
          margin-bottom: 1rem;
        }
      }
    }

    .number-examples {
      .number-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .number-item {
        .number-card {
          background: rgba($cyber-dark, 0.7);
          border: 1px solid rgba($neon-blue, 0.5);
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba($neon-blue, 0.3);
            border-color: $neon-blue;
          }

          .number-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: $neon-pink;
            margin-bottom: 0.5rem;
          }

          .number-trigram {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: $neon-yellow;
          }

          .number-meaning {
            font-size: 0.9rem;
            color: $text-primary;
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>