/*
  项目数据：页面完全由这份数据驱动。
  新增项目 = 在 projects 数组里加一条记录，不需要改 HTML / JS。
  capacity 是磁盘架总槽位数，未写入的槽位自动显示为“空白磁盘”。
  封面由 id / year / title / subtitle / color / motif 自动排版成磁盘标签；
  motif 决定封面的点阵图形，必须与项目本身有关，不是填充纹理：
    browser —— 浏览器窗口线框（网站类项目）
    matrix  —— 混淆矩阵（分类实验类项目）
  thumb 可选：填写图片路径后，封面标签里会显示这张图；留空则只显示排版封面，不会出现占位图。
  文案字段写成 { zh, en }；log 是驱动器控制台输出，属于固定的英文系统层，两种语言相同。
*/
window.PORTFOLIO = {
  capacity: 4,
  projects: [
    {
      id: 'P-001',
      title: { zh: '作品集网站', en: 'Portfolio website' },
      subtitle: { zh: '响应式静态站点', en: 'Responsive static site' },
      year: '2026',
      color: '#C48A2C',
      motif: 'browser',
      thumb: '',
      log: [
        'READ TOC ........ 5 entries',
        'CHECKSUM ........ OK',
        'LOAD overview.dat',
        'LOAD process.dat',
        'LOAD stack.dat',
        'LOAD result.dat',
        'LINK table ...... OK',
      ],
      overview: {
        summary: {
          zh: '一个单页作品集，把身份、项目与联系方式做成同一台显示器上的三个频道。',
          en: 'A single-page portfolio that puts identity, projects and contact on three channels of one monitor.',
        },
        bullets: [
          { zh: '无框架的单页结构，语义化 HTML', en: 'One page, no framework, semantic HTML' },
          { zh: '数据文件驱动：加一条记录就多一个项目', en: 'Data-driven: one record adds one project' },
          { zh: '键盘可达：数字键换台，焦点环始终可见', en: 'Keyboard reachable: number keys switch channels' },
        ],
      },
      process: [
        {
          title: { zh: '需求梳理', en: 'Requirements' },
          text: {
            zh: '先定内容：访客要在一分钟内知道我是谁、做过什么、怎么联系。',
            en: 'Content first: a visitor should learn who I am, what I built and how to reach me in a minute.',
          },
        },
        {
          title: { zh: '原型与视觉', en: 'Prototype and visuals' },
          text: {
            zh: '用纸笔画出机身、屏幕与磁盘架的关系，再把这套结构写成 CSS 变量。',
            en: 'Sketch the body, screen and disk rack on paper, then express that structure as CSS variables.',
          },
        },
        {
          title: { zh: '实现与调试', en: 'Build and debug' },
          text: {
            zh: '在 1280 / 1440 / 1680 三种宽度下逐个频道验证，内容不允许溢出玻璃。',
            en: 'Check every channel at 1280, 1440 and 1680 wide; nothing may spill past the glass.',
          },
        },
      ],
      tech: [
        { name: 'HTML5', level: 85 },
        { name: 'CSS', level: 78 },
        { name: 'JavaScript', level: 62 },
      ],
      results: [
        {
          label: { zh: '首屏加载', en: 'First load' },
          value: '1.2s',
          note: { zh: '本地静态文件', en: 'Local static files' },
          bar: 82,
        },
        {
          label: { zh: '可访问性评分', en: 'Accessibility' },
          value: '96',
          note: { zh: 'Lighthouse 审计', en: 'Lighthouse audit' },
          bar: 96,
        },
        {
          label: { zh: '布局断点', en: 'Layout tiers' },
          value: { zh: '3 档', en: '3 tiers' },
          note: { zh: '按屏幕高度反推机身', en: 'Body sized from height' },
          bar: 70,
        },
      ],
      links: [
        { label: { zh: '在线预览', en: 'Live preview' }, href: '#' },
        { label: { zh: '源码仓库', en: 'Source repo' }, href: '#' },
      ],
    },
    {
      id: 'P-002',
      title: { zh: '文本分类小实验', en: 'Text-classification study' },
      subtitle: { zh: '机器学习课程项目', en: 'Machine-learning course project' },
      year: '2025',
      color: '#9A6B2F',
      motif: 'matrix',
      thumb: '',
      log: [
        'READ TOC ........ 5 entries',
        'CHECKSUM ........ OK',
        'LOAD dataset.idx',
        'LOAD model.cfg',
        'LOAD report.dat',
      ],
      overview: {
        summary: {
          zh: '在同一份小数据集上比较几种文本分类方法，并把错误样本逐类归因。',
          en: 'Compare several text-classification methods on one small dataset, then group the errors by cause.',
        },
        bullets: [
          { zh: '朴素贝叶斯基线与线性模型对比', en: 'Naive-Bayes baseline versus a linear model' },
          { zh: '混淆矩阵定位混淆最多的两类', en: 'A confusion matrix to find the worst class pair' },
          { zh: '固定随机种子的可复现实验记录', en: 'Seeded, reproducible experiment log' },
        ],
      },
      process: [
        {
          title: { zh: '数据整理', en: 'Data prep' },
          text: {
            zh: '去重、按 8:2 划分训练与测试集，固定随机种子。',
            en: 'Deduplicate, split 8:2 into train and test, fix the seed.',
          },
        },
        {
          title: { zh: '模型训练', en: 'Training' },
          text: {
            zh: '先跑基线，再换特征与正则强度，逐项记录准确率。',
            en: 'Baseline first, then vary features and regularisation, logging accuracy each time.',
          },
        },
        {
          title: { zh: '误差分析', en: 'Error analysis' },
          text: {
            zh: '把错判样本按类型归类，多数来自极短文本与含否定词的句子。',
            en: 'Group misclassifications by type; most come from very short texts and negations.',
          },
        },
      ],
      tech: [
        { name: 'Python', level: 80 },
        { name: 'scikit-learn', level: 66 },
        { name: 'Jupyter', level: 72 },
      ],
      results: [
        {
          label: { zh: '准确率', en: 'Accuracy' },
          value: '87%',
          note: { zh: '测试集 1,200 条', en: '1,200 test rows' },
          bar: 87,
        },
        {
          label: { zh: '相对基线', en: 'Versus baseline' },
          value: '+9pt',
          note: { zh: '同一切分下比较', en: 'Same split' },
          bar: 60,
        },
      ],
      links: [
        { label: { zh: '实验报告', en: 'Report' }, href: '#' },
        { label: { zh: 'Notebook', en: 'Notebook' }, href: '#' },
      ],
    },
  ],
};
