export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'CODE' | 'LINK';
  description?: string;
  downloadFilename?: string; // 自定义文件名（含扩展名）

  // 文件下载和元数据字段
  downloadUrl?: string;      // Supabase Storage 公开 URL
  fileSize?: number;         // 文件大小（字节）
  mimeType?: string;         // MIME 类型（application/pdf）
  uploadedAt?: string;       // 上传时间（ISO 8601）
  storagePath?: string;      // Supabase 存储路径（用于删除/更新）
}

export interface Course {
  id: string;
  code: string;
  title: string;
  titleZh: string;
  subtitle: string;
  description: string;
  resources: Resource[];
}

export interface Category {
  id: string;
  code: string;
  title: string;
  courses: Course[];
}

export const categories: Category[] = [
  {
    id: 'econ',
    code: '01',
    title: 'ECON STUDY',
    courses: [
      {
        id: 'political-economy',
        code: 'ECO-101',
        title: 'Political Economy',
        titleZh: '政治经济学',
        subtitle: 'The intersection of politics and economic systems',
        description: '政治经济学，这里特指马克思主义政治经济学，是大陆高校经济学专业的必修课。无意于对这套体系做任何攻击，但客观事实是课程内容与后续严谨的实证/理论分析存在脱钩。更务实的学习路径是：从蒋学模先生的教材入手，继而阅读 Piketty《二十一世纪资本论》，在公平性与资本积累等概念上获得新的实证理解，再过渡到 JPE 等期刊的高质量文章，从而真正发挥这门课的作用。笔者的课堂笔记全部写在蒋学模教材上；如果只是想应付考试，可直接使用下方的核心概念合集、真题和 writing sample；若对政治 + 经济学的交叉问题感兴趣，推荐阅读附录中的 Shaoda Wang 论文，故事扎实、实证严谨。',
        resources: [
          {
            id: 'pe-1',
            title: 'Core Concepts for Exam',
            type: 'CODE',
            description: '蒋学模教材整理的核心概念合集（ZIP）',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/P.E/Core_concepts_for_exam.zip',
            downloadFilename: 'Core_concepts_for_exam.zip',
            mimeType: 'application/zip',
          },
          {
            id: 'pe-2',
            title: 'Fudan 2022 Exam Pack',
            type: 'CODE',
            description: '复旦 2022 原卷、押题卷与样卷合集',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/P.E/Sample_exam.zip',
            downloadFilename: 'Sample_exam.zip',
            mimeType: 'application/zip',
          },
          {
            id: 'pe-3',
            title: 'Course Writing Sample',
            type: 'PDF',
            description: '笔者课程论文写作示例',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/P.E/Sample_paper.pdf',
            downloadFilename: 'Sample_paper.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'pe-4',
            title: 'True Political Economics (Shaoda Wang)',
            type: 'PDF',
            description: 'Policy Centralization 研究，政治 + 经济学的实证案例',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/P.E/policy_centralization_0831.pdf',
            downloadFilename: 'policy_centralization_0831.pdf',
            mimeType: 'application/pdf',
          },
        ]
      },
      {
        id: 'microeconomics',
        code: 'ECO-102',
        title: 'Microeconomics',
        titleZh: '微观经济学',
        subtitle: 'Individual decision-making and market behavior',
        description: '微观经济学的核心观点是：如何将微观主体的决策建模化，在这个过程中，传统的中文微观经济学教学强调图形化的演绎以及基本原理-边际思考-厂商理论的过渡。但复旦的这门课在Prof. Wang的英文授课中强调Intuition和Mathematical Proof，这与众多国内老师所谓的“经济学直觉”不同，Prof. Wang 强调的是真正的Sense of Economics——特别是对于时间、风险等“meta concept”的把握，仔细品读，在未来的Finance、Econ乃至RF中都大有裨益。作者在这里罗列出对自己有所帮助的材料，包括但不限于Prof.Wang的notes，作者自己编写的笔记、以及考试会用到的往年习题与期末考试。',
        resources: [
          {
            id: 'mi-1',
            title: '2022 Final Term Exam',
            type: 'PDF',
            description: '复旦微观经济学 2022 年期末考试真题（DOCX）',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/microeconomics/2022_final_term_exam.docx',
            downloadFilename: '2022_final_term_exam.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          },
          {
            id: 'mi-2',
            title: 'Homework Set Archive',
            type: 'CODE',
            description: '作业整理打包集合（ZIP）',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/microeconomics/Homework%20set.zip',
            downloadFilename: 'Homework set.zip',
            mimeType: 'application/zip',
          },
          {
            id: 'mi-3',
            title: 'Microeconomics Midterm 2022',
            type: 'PDF',
            description: '2022 年微观经济学期中考试 PDF',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/microeconomics/Microeconomics%20Midterm%20Exam%202022.pdf',
            downloadFilename: 'Microeconomics Midterm Exam 2022.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'mi-4',
            title: 'Cheng Wang Notes 2025',
            type: 'PDF',
            description: 'Microeconomics-Fudan-Cheng-Wang-2025 教材 PDF',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/microeconomics/Microeconomics-Fudan-Cheng-Wang-2025.pdf',
            downloadFilename: 'Microeconomics-Fudan-Cheng-Wang-2025.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'mi-5',
            title: "Reed's Notes",
            type: 'PDF',
            description: 'Reed 微观课堂笔记 PDF',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/microeconomics/Reed\'s%20notes.pdf',
            downloadFilename: "Reed's notes.pdf",
            mimeType: 'application/pdf',
          },
        ]
      },
      {
        id: 'macroeconomics',
        code: 'ECO-103',
        title: 'Macroeconomics',
        titleZh: '宏观经济学',
        subtitle: 'Aggregate economic behavior and policy',
        description: '宏观经济学研究国民经济的整体运行规律，包括经济增长、通货膨胀、失业、国际贸易等议题。课程涵盖凯恩斯主义、货币主义、新古典综合等主要学派理论，以及财政政策和货币政策的分析框架。',
        resources: [
          { id: 'ma-1', title: 'Mankiw 宏观经济学精要', type: 'PDF', description: '核心章节总结' },
          { id: 'ma-2', title: 'IS-LM-BP 模型详解', type: 'PDF', description: '开放经济分析框架' },
          { id: 'ma-3', title: '经济增长理论笔记', type: 'PDF', description: 'Solow模型与内生增长' },
        ]
      },
      {
        id: 'corporate-finance',
        code: 'ECO-104',
        title: 'Corporate Finance',
        titleZh: '公司金融',
        subtitle: 'Financial decisions within corporations',
        description: `公司金融，下面特指复旦大学经济学院的公司金融（H）课程，逻辑过于庞大（或者说混乱），事例过于丰富（或者说混乱），作业过于庞杂（或者说混乱）。因此，在第一次听课常常出现（或者说必然出现）听不懂授课老师在说什么的状况。当然，笔者一直秉持学习少于三遍的都属于娱乐的观点，所以给出一下论断：学好很难，学会不难。

总而言之，这门课是一门从微观上对公司的业务全过程跟踪的实务课程，包括基本价值比较方法（这涉及到宏观经济学的跨期比较思想和资产定价问题）、融资方法、估值与财务决策方法（这极大涉及到会计学的相关知识）、营运资本管理以及期权专题。笔者在这里给出自己期末整理的笔记以及 Robert Shiller 在“financial market”这门课的课程笔记，如果你不幸要上公司金融，祝你好运。`,
        resources: [
          {
            id: 'cf-1',
            title: "Reed's Notes",
            type: 'PDF',
            description: 'Reed 的公司金融课堂整理笔记 PDF',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Corporate%20Finance/What%20you%20should%20know%20in%20Corporate%20Finance.pdf',
            downloadFilename: 'What you should know in Corporate Finance.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'cf-2',
            title: "Shiller's Notes",
            type: 'PDF',
            description: 'Robert Shiller “Financial Market” 课程笔记',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Corporate%20Finance/What%20you%20should%20know%20in%20Corporate%20Finance.pdf',
            downloadFilename: 'What you should know in Corporate Finance.pdf',
            mimeType: 'application/pdf',
          },
        ]
      },
      {
        id: 'game-theory-econ',
        code: 'ECO-105',
        title: 'Game Theory',
        titleZh: '博弈论',
        subtitle: 'Strategic interaction and decision theory',
        description: '博弈论可以说是微观经济学的进阶课，按照类型划分：完全信息完美信息静态博弈、完全信息完美信息动态博弈、完全非完美信息动态博弈、完全非完美信息静态博弈、不完全信息静态博弈、不完全信息动态博弈，我们这里只谈到不完全信息静态博弈。如果你看了 Prof. Wang 的 notes，那么你应该对 Moral Hazard 有比较深的体会，也即你对信号博弈的内容会有 "Mechanism" 层级的理解。这里推荐 Hagiu 的一系列论文，故事扎实。博弈论的分析方法在后续建模很有帮助。笔者目前给出了信号博弈的笔记。',
        resources: [
          {
            id: 'gt-1',
            title: 'Should platforms be allowed to sell on their own marketplaces (Slides)',
            type: 'PDF',
            description: 'Presentation slides for the platform-competition topic',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Game%20theory/Should%20platforms%20be%20allowed%20to%20sell%20on%20their%20own%20marketplaces.pdf',
            downloadFilename: 'Should platforms be allowed to sell on their own marketplaces.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'gt-2',
            title: 'Should platforms be allowed to use algorithm',
            type: 'PDF',
            description: '博弈论写作 sample，讨论平台算法使用的机制设计含义',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Game%20theory/Should%20platforms%20be%20allowed%20to%20use%20algorithm.pdf',
            downloadFilename: 'Should platforms be allowed to use algorithm.pdf',
            mimeType: 'application/pdf',
          },
          {
            id: 'gt-3',
            title: 'Signal Game Notes',
            type: 'PDF',
            description: '信号博弈笔记，整理 Moral Hazard/Mechanism 框架',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Game%20theory/Signal%20Game.pdf',
            downloadFilename: 'Signal Game.pdf',
            mimeType: 'application/pdf',
          },
        ]
      },
      {
        id: 'accounting',
        code: 'ECO-106',
        title: 'Accounting',
        titleZh: '会计学',
        subtitle: 'Financial reporting and analysis',
        description: '会计学是商业的语言，课程教授如何编制和分析财务报表。内容包括会计基础原理、资产负债表、利润表、现金流量表的编制与解读，以及财务比率分析方法。',
        resources: [
          { id: 'ac-1', title: '会计分录速查手册', type: 'PDF', description: '常见业务分录汇总' },
          { id: 'ac-2', title: '财务报表分析框架', type: 'PDF', description: '三大报表解读技巧' },
          { id: 'ac-3', title: '会计学期末复习资料', type: 'PDF', description: '知识点与真题' },
        ]
      },
    ]
  },
  {
    id: 'ai',
    code: '02',
    title: 'AI STUDY',
    courses: [
      {
        id: 'programming-basics',
        code: 'CS-101',
        title: 'Programming Basics',
        titleZh: '编程基础',
        subtitle: 'Fundamentals of programming and computational thinking',
        description: '编程基础课程介绍计算机程序设计的核心概念，包括变量、数据类型、控制结构、函数、基本算法等。通过Python语言的实践，培养计算思维和问题解决能力。',
        resources: [
          { id: 'pb-1', title: 'Python 入门教程', type: 'PDF', description: '从零开始学Python' },
          { id: 'pb-2', title: '编程练习题集', type: 'CODE', description: '100道入门练习' },
          { id: 'pb-3', title: '课程项目示例代码', type: 'CODE', description: '小游戏与工具脚本' },
        ]
      },
      {
        id: 'program-design',
        code: 'CS-102',
        title: 'Program Design',
        titleZh: '程序设计',
        subtitle: 'Software design principles and patterns',
        description: '程序设计课程深入探讨软件开发方法论，包括面向对象编程、设计模式、代码重构、软件工程实践等内容。学习如何编写可维护、可扩展的高质量代码。',
        resources: [
          { id: 'pd-1', title: '设计模式精要', type: 'PDF', description: '23种经典设计模式详解' },
          { id: 'pd-2', title: 'OOP 实战项目', type: 'CODE', description: '面向对象编程案例' },
          { id: 'pd-3', title: '代码重构技巧', type: 'PDF', description: '提升代码质量的方法' },
        ]
      },
      {
        id: 'data-structures',
        code: 'CS-103',
        title: 'Data Structures',
        titleZh: '数据结构',
        subtitle: 'Organizing and managing data efficiently',
        description: '数据结构是计算机科学的核心基础，课程涵盖数组、链表、栈、队列、树、图、哈希表等基本数据结构，以及排序、搜索等经典算法。通过理论学习和编程实践掌握数据组织的艺术。',
        resources: [
          { id: 'ds-1', title: '数据结构笔记（C语言版）', type: 'PDF', description: '严蔚敏教材配套' },
          { id: 'ds-2', title: '算法可视化资源', type: 'LINK', description: '在线演示工具集合' },
          { id: 'ds-3', title: 'LeetCode 分类题单', type: 'PDF', description: '按数据结构分类的练习' },
        ]
      },
      {
        id: 'computer-systems',
        code: 'CS-104',
        title: 'Computer Systems',
        titleZh: '计算机系统基础',
        subtitle: 'Understanding how computers work from the ground up',
        description: '计算机系统基础课程从底层视角理解计算机的工作原理，包括数据表示、汇编语言、处理器架构、内存层次、链接与加载、异常控制流等内容。基于CSAPP教材深入理解系统级编程。',
        resources: [
          { id: 'cs-1', title: 'CSAPP 读书笔记', type: 'PDF', description: '深入理解计算机系统精读' },
          { id: 'cs-2', title: 'Lab 实验报告合集', type: 'PDF', description: 'Data/Bomb/Attack Lab' },
          { id: 'cs-3', title: 'x86-64 汇编速查', type: 'PDF', description: '常用指令与寄存器' },
        ]
      },
      {
        id: 'convex-optimization',
        code: 'CS-105',
        title: 'Convex Optimization',
        titleZh: '凸优化',
        subtitle: 'Mathematical optimization for machine learning',
        description: '凸优化在众多大学都是硕士阶段的必修课，但在复旦，这门课被杂糅到了大二的一门所谓"人工智能与数学基础"，这非常不合理。但出于这门课过于重要，以至于在经济学理论建模、机器学习算法优化等领域有基石性的作用，在这里给出笔者学习凸优化的学习资料，来自https://www.stat.cmu.edu/~ryantibs/convexopt/#top=，是cmu的 Machine Learning 10-725，由 Ryan Tibshirani 授课，以及笔者自己根据直觉整理的凸优化笔记。',
        resources: [
          {
            id: 'co-ryan',
            title: 'Ryan Tibshirani Convex Optimization 10-725 合集',
            type: 'CODE',
            description: '课程 notes、作业与 quiz 资料 + 笔者直觉整理的凸优化笔记（ZIP）',
            downloadUrl: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/Convex%20Optimization/Convex%20Optimization%20Ryan.zip',
            downloadFilename: 'Convex Optimization Ryan.zip',
            mimeType: 'application/zip',
          },
        ]
      },
    ]
  },
  {
    id: 'project',
    code: '03',
    title: 'PROJECTS',
    courses: [
      {
        id: 'asset-pricing',
        code: 'PRJ-101',
        title: 'Asset Pricing',
        titleZh: 'Asset Pricing',
        subtitle: 'Theoretical foundations of financial asset valuation',
        description: '资产定价项目深入研究金融资产估值的理论基础，包括CAPM、APT、Fama-French三因子模型等。通过实证分析和Python编程，复现经典资产定价模型并进行因子投资研究。',
        resources: [
          { id: 'ap-1', title: 'Cochrane 资产定价笔记', type: 'PDF', description: '核心章节整理' },
          { id: 'ap-2', title: '因子模型实现代码', type: 'CODE', description: 'Fama-French 因子构建' },
          { id: 'ap-3', title: '项目报告：A股因子投资', type: 'PDF', description: '实证研究报告' },
        ]
      },
      {
        id: 'game-theory-project',
        code: 'PRJ-102',
        title: 'Game Theory Simulation',
        titleZh: 'Game Theory',
        subtitle: 'Computational approaches to strategic interaction',
        description: '博弈论仿真项目将博弈论理论与计算机模拟相结合，通过编程实现各类博弈的求解和仿真。项目包括纳什均衡计算、演化博弈动力学模拟、拍卖机制设计等内容。',
        resources: [
          { id: 'gtp-1', title: '博弈论Python工具库', type: 'CODE', description: 'Nashpy/Gambit 使用教程' },
          { id: 'gtp-2', title: '演化博弈仿真代码', type: 'CODE', description: '复制者动态模拟' },
          { id: 'gtp-3', title: '项目文档与报告', type: 'PDF', description: '理论推导与实验结果' },
        ]
      },
      {
        id: 'y86-cpu',
        code: 'PRJ-103',
        title: 'Y86-64 CPU',
        titleZh: 'Y86-64 CPU',
        subtitle: 'Building a simple processor from scratch',
        description: 'Y86-64 CPU项目是计算机系统课程的核心实践，从零开始设计和实现一个简化的64位处理器。项目涵盖指令集架构设计、流水线实现、控制逻辑、以及使用HDL进行硬件描述。',
        resources: [
          { id: 'y86-1', title: 'Y86-64 指令集参考', type: 'PDF', description: '完整指令编码与语义' },
          { id: 'y86-2', title: '流水线CPU设计文档', type: 'PDF', description: '五级流水线架构详解' },
          { id: 'y86-3', title: 'HCL 实现代码', type: 'CODE', description: 'SEQ/PIPE 处理器实现' },
        ]
      },
    ]
  }
];

export function findCourseById(courseId: string): Course | undefined {
  for (const category of categories) {
    const course = category.courses.find(c => c.id === courseId);
    if (course) return course;
  }
  return undefined;
}

export function findCategoryByCourseId(courseId: string): Category | undefined {
  for (const category of categories) {
    if (category.courses.some(c => c.id === courseId)) {
      return category;
    }
  }
  return undefined;
}
