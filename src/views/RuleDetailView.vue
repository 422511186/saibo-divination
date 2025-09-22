<template>
  <div class="rule-detail">
    <!-- 3D背景 -->
    <div class="rule-detail-3d-background">
      <CyberAnimation />
    </div>
    
    <!-- 主要内容 -->
    <div class="content">
      <div class="rule-card">
        <div class="rule-header">
          <div class="rule-icon">{{ ruleData.icon }}</div>
          <h1>{{ ruleData.title }}</h1>
        </div>
        
        <div class="rule-content">
          <div class="rule-description">
            <h2>简介</h2>
            <p>{{ ruleData.description }}</p>
          </div>
          
          <div class="rule-origin">
            <h2>来源</h2>
            <p v-html="ruleData.origin"></p>
          </div>
          
          <div class="rule-history">
            <h2>历史渊源</h2>
            <p v-html="ruleData.history"></p>
          </div>
          
          <div class="rule-principle">
            <h2>原理</h2>
            <p v-html="ruleData.principle"></p>
          </div>
          
          <div class="rule-method">
            <h2>占卜方法</h2>
            <p v-html="ruleData.method"></p>
          </div>
          
          <div class="rule-rules">
            <h2>规则</h2>
            <p v-html="ruleData.rules"></p>
          </div>
          
          <div class="rule-interpretation">
            <h2>解读原则</h2>
            <p v-html="ruleData.interpretation"></p>
          </div>
          
          <div class="rule-icons">
            <h2>图标介绍</h2>
            <DivinationIcons :type="ruleType" />
          </div>
        </div>
        
        <div class="rule-actions">
          <router-link :to="{ name: 'DivinationProcess', params: { type: ruleType } }" class="cyber-button">
            开始占卜
          </router-link>
          <router-link to="/" class="cyber-button secondary">
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CyberAnimation from '../components/CyberAnimation.vue'
import DivinationIcons from '../components/DivinationIcons.vue'

const route = useRoute()
const ruleType = computed(() => route.params.type as string || 'yi-jing')

// 各种占卜类型的规则数据
const ruleData = ref({
  icon: '🔮',
  title: '易经六十四卦',
  description: '易经是中国最古老的占卜经典，包含六十四卦象，每一卦都蕴含着丰富的哲理和预测信息。',
  origin: '易经源于古代先民对自然现象的观察和总结，最初是作为卜筮之书使用。其核心思想是"天人合一"，认为人与自然是一个有机整体，通过观察自然变化可以预测人事吉凶。易经的符号系统由八卦和六十四卦组成，这些符号代表了宇宙万物的基本状态和变化规律。',
  history: '易经，又称《周易》，是中国传统思想文化中自然哲学与人文实践的理论根源，是古代汉民族思想、智慧的结晶，号称"大道之源"。成书于西周时期，历经伏羲、周文王、孔子等圣人的完善和发展，流传至今已有三千多年的历史。',
  principle: '易经的核心原理是阴阳五行学说和八卦理论。阴阳代表宇宙间最基本的对立统一关系，五行（金、木、水、火、土）则描述了万物之间的相生相克关系。八卦（乾、坤、震、巽、坎、离、艮、兑）是阴阳两爻的组合，代表了八种基本自然现象，通过不同的组合形成六十四卦，涵盖了宇宙万物的变化规律。',
  method: '易经占卜通常采用揲蓍草、掷铜钱或随机生成等方式获取卦象。本系统采用随机生成的方式，模拟传统的铜钱卜卦法。用户只需点击开始，系统会自动生成六爻，组成完整的卦象。',
  rules: '易经占卜的基本规则包括：<br>• 每卦由六爻组成，爻分阴阳（阳爻"—"，阴爻"- -"）<br>• 卦象分为本卦和变卦，变爻的存在会产生变卦<br>• 卦辞和爻辞是解读卦象的主要依据<br>• 上爻和第五爻为天位，第二、三爻为人位，初爻和第四爻为地位<br>• 相邻两爻为比，相应两爻为应，比应关系影响卦象解读<br>• 卦中的阴阳平衡、五行生克也是重要考量因素',
  interpretation: '易经卦象的解读需要结合卦辞、爻辞、变爻等多因素。本系统会根据生成的卦象，提供详细的卦辞解释，并结合现代语境给出合理的建议。<br><br>解读原则包括：<br>• 重视变爻的作用<br>• 结合问卜者的具体问题<br>• 从整体卦象分析趋势<br>• 理解卦象的辩证关系'
})

// 根据路由参数设置对应的规则数据
const updateRuleData = () => {
  switch (ruleType.value) {
    case 'tarot':
      ruleData.value = {
        icon: '🃏',
        title: '塔罗牌占卜',
        description: '塔罗牌是一种古老的占卜工具，通过78张牌面的图案和象征意义，揭示过去、现在和未来的联系。',
        origin: '塔罗牌起源于15世纪的欧洲，最初是一种游戏纸牌，后来逐渐发展成为一种占卜工具。最早的塔罗牌出现在意大利，被称为"塔罗奇"(Tarocchi)。塔罗牌的图案融合了多种文化元素，包括古埃及的神秘学、犹太教的卡巴拉、中世纪的炼金术和占星术等。这些元素共同构成了塔罗牌丰富的象征体系。',
        history: '塔罗牌的发展经历了几个重要阶段：15世纪在意大利作为游戏纸牌出现；18世纪法国神秘学家将塔罗牌与古埃及神秘学联系起来；19世纪，神秘学团体"金色黎明"对塔罗牌进行了系统化的研究和改造，形成了现代塔罗牌的基础；20世纪，心理学家荣格将塔罗牌与集体潜意识理论结合，进一步丰富了塔罗牌的解读体系。如今，塔罗牌已成为全球最受欢迎的占卜工具之一。',
        principle: '塔罗牌占卜的原理基于象征主义和同步性理论。每张塔罗牌都包含丰富的象征符号，这些符号能够触发人的潜意识，帮助揭示隐藏的信息。同时，塔罗牌也遵循同步性原则，即抽出的牌面与问卜者的问题之间存在有意义的联系，而非简单的因果关系。塔罗牌分为大阿尔卡那(22张)和小阿尔卡那(56张)，前者代表人生的重要主题和转折点，后者则代表日常生活的具体事务。',
        method: '塔罗牌占卜通常使用特定的牌阵，如三张牌阵(过去-现在-未来)、十字牌阵、凯尔特十字牌阵等。本系统会根据用户的问题类型，选择合适的牌阵进行占卜。用户只需集中注意力思考问题，点击开始，系统会随机抽取相应数量的牌，并按照牌阵位置进行解读。',
        rules: '塔罗牌占卜的基本规则包括：<br>• 牌面正位和逆位有不同的含义<br>• 牌阵中各位置代表不同的时间或主题<br>• 牌与牌之间的相互关系影响整体解读<br>• 大阿尔卡那牌代表重要影响，小阿尔卡那牌代表具体情况<br>• 四种花色(权杖、圣杯、宝剑、星币)分别代表火、水、风、土四种元素<br>• 数字牌(1-10)代表发展的不同阶段，宫廷牌(侍从、骑士、皇后、国王)代表不同的人格特质',
        interpretation: '塔罗牌的解读需要综合考虑牌面图案、象征意义、牌阵位置和牌与牌之间的关系。本系统会提供每张牌的基本含义，并结合牌阵给出整体解读。<br><br>解读原则包括：<br>• 关注直觉和第一印象<br>• 将牌面含义与具体问题联系<br>• 注意牌面之间的互动关系<br>• 考虑正逆位的区别<br>• 从整体牌阵把握主要信息'
      }
      break
    case 'qian-shi':
      ruleData.value = {
        icon: '🎋',
        title: '签诗',
        description: '签诗是中国传统占卜文化的重要组成部分，通常以诗歌形式表达占卜结果，言简意赅却含义深远。',
        origin: '签诗起源于中国古代的占卜术，最早可以追溯到秦汉时期。它融合了中国传统文化中的诗词、哲学和宗教元素，形成了一种独特的占卜形式。签诗最初与道教、佛教寺庙的占卜活动密切相关，后来逐渐普及到民间，成为中国人生活中常用的占卜方式。',
        history: '签诗文化在中国有着悠久的历史，不同地区和寺庙发展出了各具特色的签诗体系。历史上著名的签诗包括观音灵签、吕祖灵签、关帝灵签等，这些签诗集通常包含100首左右的诗歌，每首都有特定的寓意和解释。签诗的内容多取材于历史典故、民间传说和佛教道教经典，体现了中国传统文化的深厚底蕴。',
        principle: '签诗占卜的原理基于"天人感应"和"随机即天意"的理念。古人认为，当人诚心求问时，随机抽取的签诗能够反映天意或神明的启示。签诗中的诗歌往往具有多重含义和象征，能够与问卜者的潜意识产生共鸣，揭示问题的本质和可能的解决方案。签诗的等级划分（上签、中签、下签）则反映了结果的吉凶程度。',
        method: '传统的签诗占卜需要到寺庙中摇签筒，随机抽取一支签。本系统模拟这一过程，通过随机算法生成对应的签诗。用户只需集中注意力思考问题，点击开始，即可获得一支随机的签。系统会根据签的等级和内容，提供相应的解读和建议。',
        rules: '签诗占卜的基本规则包括：<br>• 签诗分为上签、中签、下签三个等级<br>• 每首签诗都有特定的编号和对应的解读<br>• 签诗的内容通常包含典故、比喻和象征<br>• 解读时需要结合问卜者的具体问题<br>• 签诗的吉凶需要辩证查看，凶签也可能包含警示和转机<br>• 同一支签在不同问题下可能有不同的解读',
        interpretation: '签诗的解读需要理解诗歌的字面意思和深层含义，同时结合问卜者的具体问题。本系统会提供签诗的原文、白话文解释以及针对不同问题的建议。<br><br>解读原则包括：<br>• 注意签的等级（上中下）<br>• 理解诗歌中的比喻和象征<br>• 结合具体问题进行灵活解读<br>• 重视行善积德的劝诫<br>• 辩证查看吉凶，关注转机和建议'
      }
      break
    case 'plum-blossom':
      ruleData.value = {
        icon: '🔢',
        title: '梅花易数',
        description: '梅花易数是宋代易学大师邵雍所创的一种占卜方法，以数字和时间为基础，结合易经的卦象理论进行预测。',
        origin: '梅花易数由北宋著名哲学家、易学家邵雍（康节先生）所创，因其取《周易》"数往者顺，知来者逆"之理，又以梅花为喻，故称梅花易数。邵雍是北宋五子之一，与周敦颐、张载、程颢、程颐并称，在易学、哲学、数学等领域都有重要贡献。梅花易数是他将易经理论与数理推演相结合的独创性成果。',
        history: '梅花易数自创立以来，因其简便灵活、不需要复杂工具的特点，深受历代学者和民间术士的喜爱。南宋时期，朱熹对邵雍的易学思想进行了系统整理和推广，使梅花易数得到更广泛的传播。明清时期，梅花易数进一步发展，形成了多种流派和变体，如"梅花心易"、"梅花数术"等，丰富了中国传统占卜文化的内涵。',
        principle: '梅花易数的原理基于易经的象数理论和阴阳五行学说。它认为宇宙万物皆可归于数，通过数字的变化可以推演事物的发展规律。梅花易数特别强调"心易"的概念，即占卜者的心境和直觉在解读过程中起着重要作用。它将时间、空间、数字等因素与易经八卦相结合，通过数理推演和象征解读来预测事物的发展趋势。',
        method: '梅花易数通常通过数字起卦，如通过时间、字数、笔画数等生成卦象。本系统采用随机数生成的方式模拟这一过程，同时保留了传统梅花易数的卦象转换和分析方法。用户只需点击开始，系统会根据随机生成的数字，按照梅花易数的规则转换为对应的卦象，并提供详细的解读。',
        rules: '梅花易数占卜的基本规则包括：<br>• 以数字起卦，奇数为阳爻，偶数为阴爻<br>• 通常取上卦和下卦，组成完整的六爻卦象<br>• 卦象分为体卦和用卦，体卦代表问卜者，用卦代表所问之事<br>• 五行生克关系是解读的重要依据<br>• 动爻的存在表示事物有变化<br>• 卦象的互卦、变卦也是解读的重要参考<br>• 时间因素（年、月、日、时）也会影响卦象的解读',
        interpretation: '梅花易数的解读注重卦象的体用关系、五行生克以及卦气旺衰等因素。本系统会根据生成的卦象，提供详细的卦象分析和运势预测。<br><br>解读原则包括：<br>• 确定体卦和用卦的关系<br>• 分析五行的生克变化<br>• 注意季节和方位因素<br>• 关注动爻的作用和影响<br>• 综合考虑本卦、互卦和变卦的信息<br>• 重视直觉和第一印象'
      }
      break
    default:
      // 默认为易经六十四卦
      ruleData.value = {
        icon: '🔮',
        title: '易经六十四卦',
        description: '易经是中国最古老的占卜经典，包含六十四卦象，每一卦都蕴含着丰富的哲理和预测信息。',
        origin: '易经源于古代先民对自然现象的观察和总结，最初是作为卜筮之书使用。其核心思想是"天人合一"，认为人与自然是一个有机整体，通过观察自然变化可以预测人事吉凶。易经的符号系统由八卦和六十四卦组成，这些符号代表了宇宙万物的基本状态和变化规律。',
        history: '易经，又称《周易》，是中国传统思想文化中自然哲学与人文实践的理论根源，是古代汉民族思想、智慧的结晶，号称"大道之源"。成书于西周时期，历经伏羲、周文王、孔子等圣人的完善和发展，流传至今已有三千多年的历史。',
        principle: '易经的核心原理是阴阳五行学说和八卦理论。阴阳代表宇宙间最基本的对立统一关系，五行（金、木、水、火、土）则描述了万物之间的相生相克关系。八卦（乾、坤、震、巽、坎、离、艮、兑）是阴阳两爻的组合，代表了八种基本自然现象，通过不同的组合形成六十四卦，涵盖了宇宙万物的变化规律。',
        method: '易经占卜通常采用揲蓍草、掷铜钱或随机生成等方式获取卦象。本系统采用随机生成的方式，模拟传统的铜钱卜卦法。用户只需点击开始，系统会自动生成六爻，组成完整的卦象。',
        rules: '易经占卜的基本规则包括：<br>• 每卦由六爻组成，爻分阴阳（阳爻"—"，阴爻"- -"）<br>• 卦象分为本卦和变卦，变爻的存在会产生变卦<br>• 卦辞和爻辞是解读卦象的主要依据<br>• 上爻和第五爻为天位，第二、三爻为人位，初爻和第四爻为地位<br>• 相邻两爻为比，相应两爻为应，比应关系影响卦象解读<br>• 卦中的阴阳平衡、五行生克也是重要考量因素',
        interpretation: '易经卦象的解读需要结合卦辞、爻辞、变爻等多因素。本系统会根据生成的卦象，提供详细的卦辞解释，并结合现代语境给出合理的建议。<br><br>解读原则包括：<br>• 重视变爻的作用<br>• 结合问卜者的具体问题<br>• 从整体卦象分析趋势<br>• 理解卦象的辩证关系'
      }
  }
}

// 初始化时更新数据
updateRuleData()
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss';

.rule-detail {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, variables.$cyber-dark 0%, variables.$cyber-panel 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 3rem;
  }
}

.rule-detail-3d-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.3;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;  // 确保padding不会增加总宽度
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;  // 小屏幕下添加内边距
  }
  
  @media (max-width: 480px) {
    padding: 0 0.25rem;  // 更小屏幕下调整内边距
  }
}

.rule-card {
  background: rgba(variables.$cyber-panel, 0.8);
  border: 2px solid variables.$neon-purple;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(variables.$neon-purple, 0.3);
  backdrop-filter: blur(10px);
  opacity: 0;  // 初始透明度为0
  animation: fadeIn 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;  // 添加卡片渐入动画，使用更平滑的缓动函数
  width: 100%;  // 确保卡片宽度一致
  box-sizing: border-box;  // 确保padding不会增加总宽度
  will-change: transform, opacity;  // 优化渲染性能
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 0.5rem;  // 小屏幕下添加外边距
  }
  
  @media (max-width: 480px) {
    padding: 1rem;  // 更小屏幕下减少内边距
    margin: 0 0.25rem;
  }
}

.rule-header {
  text-align: center;
  margin-bottom: 2rem;
}

.rule-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

.rule-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, variables.$neon-purple, variables.$neon-pink, variables.$neon-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(variables.$neon-pink, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.rule-content {
  margin-bottom: 2rem;
  text-align: justify;  // 添加文本对齐方式
}

.rule-description,
.rule-origin,
.rule-history,
.rule-principle,
.rule-method,
.rule-rules,
.rule-interpretation,
.rule-icons {
  margin-bottom: 2rem;
  animation: fadeIn 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  padding: 0.5rem 0;  // 添加内边距
  width: 100%;  // 确保宽度一致
  will-change: transform, opacity;  // 优化渲染性能
}

.rule-description {
  animation-delay: 0.1s;
}

.rule-description h2 {
  animation-delay: 0.3s;
}

.rule-description p {
  animation-delay: 0.5s;
}

.rule-origin {
  animation-delay: 0.3s;
}

.rule-origin h2 {
  animation-delay: 0.5s;
}

.rule-origin p {
  animation-delay: 0.7s;
}

.rule-history {
  animation-delay: 0.5s;
}

.rule-history h2 {
  animation-delay: 0.7s;
}

.rule-history p {
  animation-delay: 0.9s;
}

.rule-principle {
  animation-delay: 0.7s;
}

.rule-principle h2 {
  animation-delay: 0.9s;
}

.rule-principle p {
  animation-delay: 1.1s;
}

.rule-method {
  animation-delay: 0.9s;
}

.rule-method h2 {
  animation-delay: 1.1s;
}

.rule-method p {
  animation-delay: 1.3s;
}

.rule-rules {
  animation-delay: 1.1s;
}

.rule-rules h2 {
  animation-delay: 1.3s;
}

.rule-rules p {
  animation-delay: 1.5s;
}

.rule-interpretation {
  animation-delay: 1.3s;
}

.rule-interpretation h2 {
  animation-delay: 1.5s;
}

.rule-interpretation p {
  animation-delay: 1.7s;
}

.rule-icons {
  animation-delay: 1.5s;
  margin-bottom: 2rem;
  will-change: transform, opacity;
}

.rule-icons h2 {
  animation-delay: 1.7s;
}

.rule-description h2,
.rule-origin h2,
.rule-history h2,
.rule-principle h2,
.rule-method h2,
.rule-rules h2,
.rule-interpretation h2,
.rule-icons h2 {
  color: variables.$neon-blue;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(variables.$neon-blue, 0.3);
  text-shadow: 0 0 8px rgba(variables.$neon-blue, 0.5), 0 0 15px rgba(variables.$neon-blue, 0.2);
  text-align: left;  // 确保标题左对齐
  letter-spacing: 0.05em;  // 添加字间距
  font-weight: 600;  // 调整字体粗细
  opacity: 0;  // 初始透明度为0
  animation: textFadeIn 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;  // 添加文字渐入动画
  will-change: transform, opacity, filter;  // 优化渲染性能
  
  @media (max-width: 768px) {
    font-size: 1.3rem;  // 小屏幕下调整标题大小
    letter-spacing: 0.03em;  // 小屏幕下调整字间距
  }
}

.rule-content p {
  color: variables.$text-primary;
  line-height: 1.8;
  font-size: 1.05rem;
  text-align: justify;  // 确保段落文本两端对齐
  margin-bottom: 1rem;  // 添加段落间距
  word-wrap: break-word;  // 确保长单词正确换行
  overflow-wrap: break-word;  // 兼容性更好的换行处理
  letter-spacing: 0.03em;  // 添加字间距
  text-shadow: 0 0 5px rgba(variables.$neon-blue, 0.3);  // 添加文字阴影效果
  opacity: 0;  // 初始透明度为0
  animation: textFadeIn 1.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;  // 添加文字渐入动画
  will-change: transform, opacity, filter;  // 优化渲染性能
  
  @media (max-width: 768px) {
    font-size: 1rem;  // 小屏幕下调整字体大小
    line-height: 1.6;  // 小屏幕下调整行高
    letter-spacing: 0.02em;  // 小屏幕下调整字间距
  }
}

.rule-content p + p {
  margin-top: 1rem;
}

.rule-content p strong {
  color: variables.$neon-yellow;
  font-weight: bold;
}

.rule-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(variables.$neon-blue, 0.3);
  animation: fadeIn 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-delay: 1.5s;
  will-change: transform, opacity;  // 优化渲染性能
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.cyber-button {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(90deg, variables.$neon-purple, variables.$neon-blue);
  color: variables.$text-dark;
  font-weight: bold;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(variables.$neon-purple, 0.5);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

.cyber-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(variables.$neon-purple, 0.8);
}

.cyber-button.secondary {
  background: transparent;
  border: 1px solid variables.$neon-blue;
  color: variables.$neon-blue;
  box-shadow: 0 0 15px rgba(variables.$neon-blue, 0.3);
}

.cyber-button.secondary:hover {
  background: rgba(variables.$neon-blue, 0.1);
  box-shadow: 0 5px 20px rgba(variables.$neon-blue, 0.5);
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

@keyframes textFadeIn {
  0% {
    opacity: 0;
    transform: translateY(15px);
    filter: blur(2px);
  }
  50% {
    opacity: 0.7;
    transform: translateY(5px);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>