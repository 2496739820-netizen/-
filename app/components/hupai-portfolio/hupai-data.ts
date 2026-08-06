import metricSnapshot from "./xhs-metrics.json";

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

function verifiedCount(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid Xiaohongshu metric: ${label}`);
  }
  return value;
}

function hupaiMetrics(
  id: keyof typeof metricSnapshot.hupai.works,
): readonly WorkMetric[] {
  const metrics = metricSnapshot.hupai.works[id];
  return [
    { label: "点赞", value: verifiedCount(metrics.likes, `${id}.likes`) },
    { label: "收藏", value: verifiedCount(metrics.saves, `${id}.saves`) },
    { label: "评论", value: verifiedCount(metrics.comments, `${id}.comments`) },
    { label: "分享", value: verifiedCount(metrics.shares, `${id}.shares`) },
  ];
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(metricSnapshot.snapshotDate)) {
  throw new Error("Invalid Xiaohongshu snapshot date");
}

export const hupaiAccount = {
  name: "虎.派.眼.镜",
  profileUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77",
  followers: `${metricSnapshot.hupai.followers}粉丝`,
  likesAndSaves: `${metricSnapshot.hupai.likesAndSaves}获赞与收藏`,
  responsibility: "2024.05 至今负责拍摄与运营",
  snapshotDate: metricSnapshot.snapshotDate,
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
    metrics: hupaiMetrics("66ab4132000000002701f16e"),
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
    metrics: hupaiMetrics("69a16f6f0000000015038c2e"),
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
    metrics: hupaiMetrics("6a4a0ea7000000001702df31"),
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

function personalMetrics(
  id: keyof typeof metricSnapshot.personal.works,
): readonly PersonalWorkMetric[] {
  const metrics = metricSnapshot.personal.works[id];
  return [
    { label: "观看", value: verifiedCount(metrics.views, `${id}.views`) },
    { label: "评论", value: verifiedCount(metrics.comments, `${id}.comments`) },
    { label: "点赞", value: verifiedCount(metrics.likes, `${id}.likes`) },
    { label: "收藏", value: verifiedCount(metrics.saves, `${id}.saves`) },
    { label: "分享", value: verifiedCount(metrics.shares, `${id}.shares`) },
  ];
}

const personalMetricRows = Object.values(metricSnapshot.personal.works);
const formatCompactWan = (value: number) => `${(value / 10_000).toFixed(1)}万`;
const formatInteger = new Intl.NumberFormat("en-US").format;

export const personalAccount = {
  name: "白夜下",
  profileUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2",
  followers: new Intl.NumberFormat("en-US").format(metricSnapshot.personal.followers),
  likesAndSaves: metricSnapshot.personal.likesAndSaves,
  publishedNotes: metricSnapshot.personal.publishedNotes,
  positioning: "影视后期 · 视听语言知识",
  snapshotDate: metricSnapshot.snapshotDate,
} as const;

export const personalResults = {
  maxViews: formatCompactWan(Math.max(...personalMetricRows.map((work) => work.views))),
  maxLikes: formatInteger(Math.max(...personalMetricRows.map((work) => work.likes))),
  maxSaves: formatInteger(Math.max(...personalMetricRows.map((work) => work.saves))),
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
    metrics: personalMetrics("montage"),
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
    metrics: personalMetrics("angle"),
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
    metrics: personalMetrics("narrative-montage"),
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
    metrics: personalMetrics("composition"),
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
    metrics: personalMetrics("color"),
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
    metrics: personalMetrics("sound"),
    noteUrl: "https://www.xiaohongshu.com/user/profile/61ffe9a000000000100092c2/654222d8000000001e022020?xsec_token=ABwOpukjnvkxsrKOWbs-TlyJe6n_gp9o0oIPA8aCdYnz8=&xsec_source=pc_user",
  },
] as const satisfies readonly PersonalWork[];
