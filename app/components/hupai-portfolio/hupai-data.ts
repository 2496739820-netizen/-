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
  profileUrl: "https://www.xiaohongshu.com/user/profile/64f85a95000000001e032b07",
  followers: "3604粉丝",
  likesAndSaves: "1.7 万获赞与收藏",
  responsibility: "2024.05 至今负责拍摄与运营",
  snapshotDate: "2026-07-27",
} as const;

export const hupaiWorks = [
  {
    id: "66ab4132000000002701f16e",
    title: "林德伯格 全系列干货讲解",
    originalTitle: "林德伯格 全系列干货讲解",
    publishedAt: "2024-08-01",
    format: "图文干货",
    capability: "以品牌知识拆解建立专业信任，完成选题、拍摄与图文表达。",
    image: {
      src: "/hupai/lindberg-series-evidence.png",
      alt: "林德伯格全系列干货讲解的小红书笔记页面截图",
      width: 1068,
      height: 836,
    },
    metrics: [
      { label: "点赞", value: 127 },
      { label: "收藏", value: 147 },
      { label: "评论", value: 48 },
      { label: "分享", value: 49 },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/66ab4132000000002701f16e",
    kind: "image",
  },
  {
    id: "69a16f6f0000000015038c2e",
    title: "日系 美系 欧系",
    originalTitle: "日系 美系 欧系眼镜风格怎么选？",
    publishedAt: "2026-02-27",
    format: "品牌策划图文",
    capability: "用风格对比降低选购门槛，将品牌定位转化为可读、可收藏的内容。",
    image: {
      src: "/hupai/eyewear-universe-cover.webp",
      alt: "日系、美系、欧系眼镜风格对比的小红书笔记封面",
      width: 1080,
      height: 1440,
    },
    metrics: [
      { label: "点赞", value: 81 },
      { label: "收藏", value: 88 },
      { label: "评论", value: 11 },
      { label: "分享", value: 21 },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/69a16f6f0000000015038c2e",
    kind: "image",
  },
  {
    id: "6a4a0ea7000000001702df31",
    title: "林德伯格 6537",
    originalTitle: "林德伯格 6537",
    publishedAt: "2026-07-05",
    format: "19 秒竖屏短视频",
    capability: "以短视频展示镜架细节与佩戴质感，兼顾产品表达和平台内容节奏。",
    image: {
      src: "/hupai/lindberg-6537-cover.webp",
      alt: "林德伯格 6537 短视频的小红书笔记封面",
      width: 1080,
      height: 1440,
    },
    metrics: [
      { label: "点赞", value: 22 },
      { label: "收藏", value: 9 },
      { label: "评论", value: 10 },
      { label: "分享", value: 2 },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/6a4a0ea7000000001702df31",
    kind: "video",
    video: {
      src: "/hupai/lindberg-6537-preview.mp4",
      poster: "/hupai/lindberg-6537-cover.webp",
      label: "林德伯格 6537 19 秒竖屏短视频预览",
    },
  },
] as const satisfies readonly HupaiWork[];
