export type WorkMetric = {
  label: "点赞" | "收藏" | "评论" | "分享";
  value: number;
};

type WorkBase = {
  id: string;
  title: string;
  originalTitle: string;
  publishedAt: string;
  format: string;
  capability: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  };
  metrics: readonly WorkMetric[];
  noteUrl: string;
};

export type ImageWork = WorkBase & {
  kind: "image";
};

export type VideoWork = WorkBase & {
  kind: "video";
  video: {
    src: string;
    poster: string;
    label: string;
  };
};

export type HupaiWork = ImageWork | VideoWork;

export const hupaiAccount = {
  name: "虎.派.眼.镜",
  profileUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77",
  followers: "3604粉丝",
  likesAndSaves: "1.7 万获赞与收藏",
  responsibility: "2024.05 至今负责拍摄与运营",
  snapshotDate: "2026-07-27",
} as const;

export const hupaiWorks = [
  {
    id: "66ab4132000000002701f16e",
    title: "林德伯格 全系列干货讲解",
    originalTitle: "林德伯格 | 最新全系列干货讲解🔥",
    publishedAt: "2024-08-01",
    format: "图文干货",
    capability: "以品牌知识拆解建立专业信任，完成选题、拍摄与图文表达。",
    image: {
      src: "/hupai/lindberg-series-evidence.png",
      alt: "林德伯格全系列干货讲解的小红书笔记页面截图",
      width: 1068,
      height: 836,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(100vw - 36px), 46vw",
    },
    metrics: [
      { label: "点赞", value: 127 },
      { label: "收藏", value: 147 },
      { label: "评论", value: 48 },
      { label: "分享", value: 49 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77/66ab4132000000002701f16e?xsec_token=ABEeK9YoIEUOgOkE4q1JH-OKccXDsClT4TRJ5iKOhFNDU=&xsec_source=pc_user",
    kind: "image",
  },
  {
    id: "69a16f6f0000000015038c2e",
    title: "日系 美系 欧系",
    originalTitle: "日系 - 美系 - 欧系，一个多元的眼镜宇宙！",
    publishedAt: "2026-02-27",
    format: "品牌策划图文",
    capability: "用风格对比降低选购门槛，将品牌定位转化为可读、可收藏的内容。",
    image: {
      src: "/hupai/eyewear-universe-cover.webp",
      alt: "日系、美系、欧系眼镜风格对比的小红书笔记封面",
      width: 1080,
      height: 1440,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 28vw",
    },
    metrics: [
      { label: "点赞", value: 81 },
      { label: "收藏", value: 88 },
      { label: "评论", value: 11 },
      { label: "分享", value: 21 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77/69a16f6f0000000015038c2e?xsec_token=ABC4b86owzt-0c7_p14sVnKM-n96xBIIkilpXe_F8N7Fs=&xsec_source=pc_user",
    kind: "image",
  },
  {
    id: "6a4a0ea7000000001702df31",
    title: "林德伯格 6537",
    originalTitle: "客订分享！林德伯格6537+蔡司鎏金膜~",
    publishedAt: "2026-07-05",
    format: "19 秒竖屏短视频",
    capability: "以短视频展示镜架细节与佩戴质感，兼顾产品表达和平台内容节奏。",
    image: {
      src: "/hupai/lindberg-6537-cover.webp",
      alt: "林德伯格 6537 短视频的小红书笔记封面",
      width: 1080,
      height: 1440,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 28vw",
    },
    metrics: [
      { label: "点赞", value: 22 },
      { label: "收藏", value: 9 },
      { label: "评论", value: 10 },
      { label: "分享", value: 2 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77/6a4a0ea7000000001702df31?xsec_token=ABnzVHeGextP6DN1kzXFSpnScK6rFQLXuq4uJk_qLhtSI=&xsec_source=pc_user",
    kind: "video",
    video: {
      src: "/hupai/lindberg-6537-preview.mp4",
      poster: "/hupai/lindberg-6537-cover.webp",
      label: "林德伯格 6537 19 秒竖屏短视频预览",
    },
  },
] as const satisfies readonly HupaiWork[];

export type PersonalWorkMetric = {
  label: "观看" | "评论" | "点赞" | "收藏" | "分享";
  value: number;
};

type PersonalWorkBase = {
  id: "montage" | "angle" | "narrative-montage" | "composition" | "color" | "sound";
  title: string;
  format: string;
  capability: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  };
  metrics: readonly PersonalWorkMetric[];
};

export type VerifiedPersonalWork = PersonalWorkBase & {
  kind: "verified";
  noteUrl: string;
};

export type PersonalWork = VerifiedPersonalWork;

export const personalAccount = {
  name: "白夜下",
  profileUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2",
  followers: "3,336",
  likesAndSaves: "6.7 万",
  publishedNotes: 21,
  positioning: "影视后期 · 视听语言知识",
  snapshotDate: "2026-08-06",
} as const;

export const personalResults = {
  maxViews: "18.2万",
  maxLikes: "8,064",
  maxSaves: "5,274",
} as const;

export const personalWorks = [
  {
    id: "montage",
    kind: "verified",
    title: "表现蒙太奇",
    format: "系列 · 视听语言",
    capability: "独立完成账号定位、系列化选题、剪辑、画面分析与知识表达。",
    image: {
      src: "/personal-xhs/01-montage.webp",
      alt: "白夜下《表现蒙太奇》小红书笔记封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 28vw",
    },
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/647db32c0000000013031980?xsec_token=ABbaHzlJQptzx5VrubvwXml86zehbe6aapWjXRQqYPnmw=&xsec_source=pc_user",
    metrics: [
      { label: "观看", value: 182133 },
      { label: "评论", value: 34 },
      { label: "点赞", value: 8064 },
      { label: "收藏", value: 5274 },
      { label: "分享", value: 772 },
    ],
  },
  {
    id: "angle",
    kind: "verified",
    title: "角度",
    format: "镜头语法",
    capability: "围绕镜头角度的叙事功能，完成内容策划、剪辑与画面分析。",
    image: {
      src: "/personal-xhs/02-angle.webp",
      alt: "白夜下《角度》小红书笔记封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 28vw",
    },
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/643fe1770000000013006cc9?xsec_token=ABBzLeiu105MXIoqKcgKnOV0rJ-MCQoGYlW7tgPQ3VGgQ=&xsec_source=pc_user",
    metrics: [
      { label: "观看", value: 150094 },
      { label: "评论", value: 83 },
      { label: "点赞", value: 6865 },
      { label: "收藏", value: 4546 },
      { label: "分享", value: 545 },
    ],
  },
  {
    id: "narrative-montage",
    kind: "verified",
    title: "叙事蒙太奇",
    format: "剪辑结构",
    capability: "通过时间重组与情节推进，完成知识型内容的系列化表达。",
    image: {
      src: "/personal-xhs/03-narrative-montage.webp",
      alt: "白夜下《叙事蒙太奇》小红书笔记封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 28vw",
    },
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/646b256600000000270020c6?xsec_token=ABDr-5_4PCHKqMb3WHSQAQiBGTi5Q7XW7l-_uO4g1fV5I=&xsec_source=pc_user",
    metrics: [
      { label: "观看", value: 92688 },
      { label: "评论", value: 14 },
      { label: "点赞", value: 3108 },
      { label: "收藏", value: 1957 },
      { label: "分享", value: 277 },
    ],
  },
  {
    id: "composition",
    kind: "verified",
    title: "构图",
    format: "电影视听语言",
    capability: "从画面组织入手，拆解构图如何服务叙事重点。",
    image: {
      src: "/personal-xhs/04-composition.webp",
      alt: "白夜下《构图》系列封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 15vw",
    },
    metrics: [
      { label: "观看", value: 42877 },
      { label: "评论", value: 8 },
      { label: "点赞", value: 1642 },
      { label: "收藏", value: 1069 },
      { label: "分享", value: 135 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/648be41400000000120331f6?xsec_token=ABJ955dld8d1iw9N0tKjikVkdwV0sPZHuHMsMuDb9GF_k=&xsec_source=pc_user",
  },
  {
    id: "color",
    kind: "verified",
    title: "色彩",
    format: "电影视听语言",
    capability: "以色彩关系为线索，提炼电影画面的情绪表达。",
    image: {
      src: "/personal-xhs/05-color.webp",
      alt: "白夜下《色彩》系列封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 15vw",
    },
    metrics: [
      { label: "观看", value: 21247 },
      { label: "评论", value: 0 },
      { label: "点赞", value: 849 },
      { label: "收藏", value: 587 },
      { label: "分享", value: 107 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/65471a96000000001e02976e?xsec_token=ABeeWLisrAeO0pWYAZOvDfmsMldP02WS2-lun8QjT_5I0=&xsec_source=pc_user",
  },
  {
    id: "sound",
    kind: "verified",
    title: "声音设计",
    format: "电影视听语言",
    capability: "从声音层次切入，解析画面之外的叙事信息。",
    image: {
      src: "/personal-xhs/06-sound.webp",
      alt: "白夜下《声音设计》系列封面",
      width: 640,
      height: 853,
      sizes: "(max-width: 620px) calc(100vw - 24px), (max-width: 900px) calc(50vw - 25px), 15vw",
    },
    metrics: [
      { label: "观看", value: 7308 },
      { label: "评论", value: 0 },
      { label: "点赞", value: 369 },
      { label: "收藏", value: 315 },
      { label: "分享", value: 44 },
    ],
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/654222d8000000001e022020?xsec_token=ABwOpukjnvkxsrKOWbs-TlyJe6n_gp9o0oIPA8aCdYnz8=&xsec_source=pc_user",
  },
] as const satisfies readonly PersonalWork[];
