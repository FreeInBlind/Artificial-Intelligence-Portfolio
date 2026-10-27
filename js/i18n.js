/*
  界面文案与语言状态。
  数据文件里的双语字段用 L({ zh, en }) 取值，界面文案用 t('key', { var }) 取值。
  统一规则：除机身铭牌 PHOSPHOR-9、驱动器控制台输出（固定英文系统层）、文件名和语言名“中 / EN”之外，所有文字都随语言切换；英文版不含中文，中文版的装饰标签也已翻译。
  重复文案已清理：页眉微标签（sb.sys / *.eyebrow）、磁盘架与封面下重复的装载提示（hint.* / desk.hint / cover.load）、
  传输小组件（tx.link / tx.you / tx.me）均已随结构一起删除，每条信息在界面上只出现一次。
*/
(function () {
  'use strict';
  var DICT = {
    zh: {
      'doc.title': '作品集 · PHOSPHOR-9',
      'doc.desc': '复古 CRT 显示器风格的 AI 方向个人作品集',
      skip: '跳到屏幕内容',
      noscript: '需要启用 JavaScript 才能运行这台显示器。',
      'ch.1': '身份',
      'ch.2': '档案',
      'ch.3': '信号',
      'nav.ch': '频道',
      power: '电源',
      'sw.fx': '辉光',
      'sw.fx.t': '屏幕辉光与扫描线',
      'sw.motion': '动效',
      'sw.motion.t': '动画效果',
      'knob.aria': '配色旋钮，当前：{name}，点击切换',
      'preset.amber': '琥珀',
      'preset.white': '柔白',
      'preset.moss': '苔绿',
      'lang.aria': '语言开关，当前：中文，点击切换到 English',
      'say.preset': '配色：{name}',
      'say.fx.on': '特效：开',
      'say.fx.off': '特效：关',
      'say.motion.on': '动态：开',
      'say.motion.off': '动态：已减少',
      'say.lang': '语言：中文',
      's1.hello': '你好，我是 ',
      's1.check': '能力自检',
      's1.skip': '跳过',
      's1.cmds': '简介切换',
      's1.portrait': '符号化点阵头像，鼠标靠近时逐渐变清晰',
      'sc.ok': '已掌握',
      'sc.warn': '学习中',
      's2.title': '项目档案',
      's2.cap': '已装载 {n} / 容量 {c}',
      'drive.h': '驱动器 A:',
      eject: '弹出',
      'drive.log': '驱动器日志',
      's1.now': '近况',
      'id.time': '本地时间',
      /* 驱动器状态只有 drive.* 这一组：slot.empty 是槽口里的投入提示，drive.* 是唯一的那条状态说明 */
      'slot.empty': '▼ 拖入磁盘',
      'drive.empty': '点击封面，或点击磁盘架上的磁盘即可装载。',
      'drive.read': '正在读取 {id} …',
      'drive.ready': '{id} 已装载，可在窗口里切换内容层。',
      'drive.blank': '这是空槽：在 data/projects.js 里加一条记录即可装载。',
      'cover.aria': '装载 {id}：{title}',
      'cover.load': '装载',
      'disk.aria': '磁盘 {id}：{title}',
      'disk.blank.aria': '空白磁盘，待写入（槽位 {n}）',
      'disk.blank': '空槽 {n}',
      'desk.h': '磁盘架',
      'tab.overview': '概述',
      'tab.process': '过程',
      'tab.tech': '技术',
      'tab.results': '结果',
      'tab.links': '链接',
      'tabs.aria': '项目内容层',
      's3.title': '发送信号',
      'f.name': '呼号 / 姓名',
      'f.name.ph': '怎么称呼你',
      'f.mail': '回传地址 / 邮箱',
      'f.msg': '信号内容',
      'f.msg.ph': '想聊的项目、合作或问题',
      'tx.send': '发射信号 ▸',
      'tx.sending': '发射中…',
      'tx.again': '再发一次 ▸',
      'tx.scope': '示波器',
      'tx.strength': '信号强度',
      'tx.notes': '频道备注',
      'tx.meter.note': '随表单填写进度实时变化，填满三项即满格。',
      'tx.ready': '发送前检查',
      'f.msg.hint': '写清项目背景、你想要什么、时间范围。',
      'tx.flow.1.t': '投递',
      'tx.flow.1.d': '本表单是演示，不上传内容。',
      'tx.flow.2.t': '阅读',
      'tx.flow.2.d': '工作日 48 小时内读到。',
      'tx.flow.3.t': '回信',
      'tx.flow.3.d': '带上可执行的下一步。',
      'tx.lv.none': '待输入',
      'tx.lv.low': '弱',
      'tx.lv.mid': '中',
      'tx.lv.high': '强',
      'rd.name': '呼号',
      'rd.mail': '回传地址',
      'rd.msg': '信号内容',
      'rd.filled': '就绪',
      'rd.wait': '待填写',
      'err.pre': '无法发射：',
      'err.sep': '；',
      'err.name': '请填写呼号',
      'err.mail': '回传地址格式不正确',
      'err.msg': '信号内容太短',
      'rc.title': '回执 {id}',
      'rc.body': '数据包 {n}/{n} 已送达',
      'rc.poc': 'POC 演示：消息并未发送到任何服务器。',
    },
    en: {
      'doc.title': 'Portfolio · PHOSPHOR-9',
      'doc.desc': 'An AI-focused personal portfolio in the style of a retro CRT monitor',
      skip: 'Skip to screen content',
      noscript: 'JavaScript is required to run this monitor.',
      'ch.1': 'Identity',
      'ch.2': 'Archive',
      'ch.3': 'Signal',
      'nav.ch': 'Channels',
      power: 'Power',
      'sw.fx': 'Glow',
      'sw.fx.t': 'Screen glow and scanlines',
      'sw.motion': 'Motion',
      'sw.motion.t': 'Animations',
      'knob.aria': 'Color knob, current: {name}. Click to switch',
      'preset.amber': 'Amber',
      'preset.white': 'White',
      'preset.moss': 'Moss',
      'lang.aria': 'Language switch, current: English. Click to switch to Chinese',
      'say.preset': 'Color: {name}',
      'say.fx.on': 'Effects: on',
      'say.fx.off': 'Effects: off',
      'say.motion.on': 'Motion: on',
      'say.motion.off': 'Motion: reduced',
      'say.lang': 'Language: English',
      's1.hello': 'Hi, I’m ',
      's1.check': 'Skill check',
      's1.skip': 'Skip',
      's1.cmds': 'Profile sections',
      's1.portrait': 'Pixel-art avatar that sharpens as the cursor approaches',
      'sc.ok': 'Solid',
      'sc.warn': 'Learning',
      's2.title': 'Project archive',
      's2.cap': '{n} of {c} slots used',
      'drive.h': 'Drive A:',
      eject: 'Eject',
      'drive.log': 'Drive log',
      's1.now': 'Recent',
      'id.time': 'Local time',
      /* Drive state lives only in drive.*: slot.empty labels the slot mouth, drive.* is the single status line */
      'slot.empty': '▼ Drop a disk',
      'drive.empty': 'Click a cover, or click a disk on the rack, to load it.',
      'drive.read': 'Reading {id} …',
      'drive.ready': '{id} mounted. Switch sections inside the window.',
      'drive.blank': 'Empty slot: add a record to data/projects.js to fill it.',
      'cover.aria': 'Load {id}: {title}',
      'cover.load': 'Load',
      'disk.aria': 'Disk {id}: {title}',
      'disk.blank.aria': 'Blank disk, empty (slot {n})',
      'disk.blank': 'Empty {n}',
      'desk.h': 'Disk rack',
      'tab.overview': 'Overview',
      'tab.process': 'Process',
      'tab.tech': 'Stack',
      'tab.results': 'Results',
      'tab.links': 'Links',
      'tabs.aria': 'Project sections',
      's3.title': 'Send a signal',
      'f.name': 'Callsign / Name',
      'f.name.ph': 'What should I call you',
      'f.mail': 'Return address / Email',
      'f.msg': 'Message',
      'f.msg.ph': 'A project, a collaboration or a question',
      'tx.send': 'Transmit ▸',
      'tx.sending': 'Transmitting…',
      'tx.again': 'Send another ▸',
      'tx.scope': 'Oscilloscope',
      'tx.strength': 'Signal strength',
      'tx.notes': 'Channel notes',
      'tx.meter.note': 'Tracks how much of the form is filled; all three fields light all ten bars.',
      'tx.ready': 'Pre-send check',
      'f.msg.hint': 'Say what the project is, what you need, and by when.',
      'tx.flow.1.t': 'Send',
      'tx.flow.1.d': 'A demo; nothing is uploaded.',
      'tx.flow.2.t': 'Read',
      'tx.flow.2.d': 'Seen within 48h on weekdays.',
      'tx.flow.3.t': 'Reply',
      'tx.flow.3.d': 'With a concrete next step.',
      'tx.lv.none': 'Idle',
      'tx.lv.low': 'Weak',
      'tx.lv.mid': 'Fair',
      'tx.lv.high': 'Strong',
      'rd.name': 'Callsign',
      'rd.mail': 'Return address',
      'rd.msg': 'Message',
      'rd.filled': 'Ready',
      'rd.wait': 'Waiting',
      'err.pre': 'Cannot transmit: ',
      'err.sep': '; ',
      'err.name': 'enter your name',
      'err.mail': 'the email address looks invalid',
      'err.msg': 'the message is too short',
      'rc.title': 'Receipt {id}',
      'rc.body': '{n}/{n} packets delivered',
      'rc.poc': 'Proof-of-concept demo: nothing is sent to any server.',
    },
  };
  var saved = null;
  try {
    saved = localStorage.getItem('crt.lang');
  } catch (e) {
    /* 忽略 */
  }
  var guess =
    String(navigator.language || 'zh')
      .toLowerCase()
      .indexOf('zh') === 0
      ? 'zh'
      : 'en';
  var lang = saved === 'zh' || saved === 'en' ? saved : guess;
  window.I18N = {
    get lang() {
      return lang;
    },
    set: function (l) {
      lang = l === 'en' ? 'en' : 'zh';
      try {
        localStorage.setItem('crt.lang', lang);
      } catch (e) {
        /* 忽略 */
      }
    },
  };
  window.t = function (k, v) {
    var s = DICT[lang][k] != null ? DICT[lang][k] : DICT.zh[k] != null ? DICT.zh[k] : k;
    if (v) for (var n in v) s = s.split('{' + n + '}').join(v[n]);
    return s;
  };
  window.L = function (x) {
    if (x && typeof x === 'object') return x[lang] != null ? x[lang] : x.zh;
    return x == null ? '' : x;
  };
})();
