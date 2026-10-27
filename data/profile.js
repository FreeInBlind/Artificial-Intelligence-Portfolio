/* 个人资料数据（示例内容，请替换成你自己的）。每个文案字段写成 { zh, en }，页面按当前语言取值；两种语言相同的字符串可以直接写成普通字符串。 */
window.PROFILE = {
  name: { zh: '林知远', en: 'Lin Zhiyuan' },
  role: {
    zh: 'AI 方向的学习者与构建者 · 把想法做成能运行的东西',
    en: 'AI learner and builder · turning ideas into things that run',
  },
  facts: [
    { k: { zh: '方向', en: 'Focus' }, v: { zh: '机器学习 / LLM 应用', en: 'ML / LLM apps' } },
    { k: { zh: '在读', en: 'Studying' }, v: { zh: '计算机相关专业', en: 'Computer science' } },
    { k: { zh: '状态', en: 'Status' }, v: { zh: '寻找实习机会', en: 'Open to internships' } },
    { k: { zh: '语言', en: 'Languages' }, v: { zh: '中文 / English', en: 'Chinese / English' } },
  ],
  /* 近况：带月份的真实进展，用来填满信息栏下方的高度。
     每条都必须有日期，否则就退化成了装饰性的标签。 */
  now: [
    { when: '2026.10', what: { zh: '重写这份作品集', en: 'Rewrote this portfolio' } },
    { when: '2026.08', what: { zh: '提示词评测工具 v1', en: 'Prompt-eval tool v1' } },
    { when: '2026.05', what: { zh: '分类实验可复现化', en: 'Made the study reproducible' } },
  ],
  order: ['about', 'skills', 'why-ai'],
  /* 信号页右栏的「频道备注」：说明这个频道适合聊什么、回传到哪里。
     回复时效由备注下方的三步流程交代，这里不再重复一遍。 */
  channel: [
    { k: { zh: '适合聊', en: 'Good for' }, v: { zh: 'AI 方向实习、小项目合作', en: 'AI internships, side projects' } },
    { k: { zh: '也可以', en: 'Also fine' }, v: { zh: '技术问题、代码评审', en: 'Tech questions, code review' } },
    { k: { zh: '回传地址', en: 'Email' }, v: { zh: 'hi@example.com', en: 'hi@example.com' } },
  ],
  /* detail 是自检清单的说明列：定宽单行，中英文都控制在 24 个字符以内，避免被截断 */
  selfcheck: [
    { label: 'Python', detail: { zh: '脚本、数据处理、工具', en: 'Scripts, data, tooling' }, state: 'ok' },
    {
      label: { zh: '机器学习', en: 'Machine learning' },
      detail: { zh: '课程项目与论文复现', en: 'Course projects, papers' },
      state: 'ok',
    },
    {
      label: { zh: '提示词与评测', en: 'Prompting and evals' },
      detail: { zh: '提示词设计与评测', en: 'Prompt design and evals' },
      state: 'ok',
    },
    { label: { zh: 'Web 前端', en: 'Web front end' }, detail: 'HTML / CSS / JavaScript', state: 'ok' },
    {
      label: { zh: '项目经历', en: 'Experience' },
      detail: { zh: '实习与社团经历', en: 'Internship and club work' },
      state: 'ok',
    },
    { label: 'LLM Agent', detail: { zh: '学习中，尚未成体系', en: 'Learning, not systematic' }, state: 'warn' },
  ],
  commands: {
    about: {
      label: { zh: '关于我', en: 'About me' },
      title: { zh: '关于我', en: 'About me' },
      paragraphs: [
        {
          zh: '我是林知远，主攻机器学习与 LLM 应用的学生。习惯先做出一个能跑起来的小东西，再回头补理论。',
          en: 'I’m Lin Zhiyuan, a student working on machine learning and LLM applications. I build something small that runs first, then go back for the theory.',
        },
        {
          zh: '过去一年做过文本分类实验、提示词评测工具，也把这份作品集从零写成静态站点。每个项目都留着记录：怎么想的、哪里踩了坑、数据怎么说。',
          en: 'Last year: a text-classification study, a prompt-evaluation tool, and this portfolio, written from scratch. Each one keeps notes on what broke.',
        },
        {
          zh: '现在在找 AI 方向的实习，想把课堂上的方法放进会出错的真实场景里检验。',
          en: 'I’m looking for an AI internship, to test classroom methods on data that misbehaves.',
        },
      ],
    },
    skills: {
      label: { zh: '技能矩阵', en: 'Skills' },
      title: { zh: '技能矩阵', en: 'Skills' },
      skills: [
        { name: 'Python', level: 80 },
        { name: { zh: '机器学习', en: 'Machine learning' }, level: 60 },
        { name: { zh: '提示词 / 评测', en: 'Prompts / evals' }, level: 70 },
        { name: { zh: '前端', en: 'Front end' }, level: 65 },
        { name: { zh: '数据可视化', en: 'Data viz' }, level: 55 },
      ],
    },
    'why-ai': {
      label: { zh: '为什么是 AI', en: 'Why AI' },
      title: { zh: '为什么是 AI', en: 'Why AI' },
      steps: [
        {
          t: { zh: '好奇', en: 'Curious' },
          d: {
            zh: '第一次看到模型从几十条样本里学出规律，我意识到“规则”也可以由数据长出来。',
            en: 'The first time a model found a pattern in a few dozen samples, I realised rules can grow out of data.',
          },
        },
        {
          t: { zh: '动手', en: 'Build' },
          d: {
            zh: '从文本分类到提示词评测，我用小项目把概念拆开，亲手看它们在哪里失灵。',
            en: 'From text classification to prompt evals, I use small projects to take ideas apart and see where they fail.',
          },
        },
        {
          t: { zh: '落地', en: 'Ship' },
          d: {
            zh: '我想做能被真实使用的工具：先量化它有多可靠，再决定它该做什么。',
            en: 'I want to build tools people really use: measure how reliable they are first, then decide what they should do.',
          },
        },
      ],
    },
  },
};
