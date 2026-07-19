export const CONTACT_EMAIL = "2496739820@qq.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

// Replace this path with a future WeChat QR asset without touching badge rendering.
export const CONTACT_QR_SOURCE = "/contact-qr.png";
export const CONTACT_QR_FALLBACK_VALUE = CONTACT_MAILTO;
export const CONTACT_AVATAR_SOURCE = "/brand-avatar.png";
export const CONTACT_INTRO = "用内容建立信任 用运营承接到店";

export const CONTACT_CAPABILITIES = [
  "内容策划",
  "账号运营",
  "影像制作",
  "平台投流",
  "到店转化",
  "数据复盘",
] as const;

export const CONTACT_RESULTS = [
  { value: "60+", label: "月均有效客资" },
  { value: "3W+", label: "月均到店新客 GMV" },
  { value: "8W+", label: "月度最高 GMV" },
  { value: "30%", label: "约贡献门店总业绩" },
] as const;

export async function createFallbackQrDataUrl(): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(CONTACT_QR_FALLBACK_VALUE, {
    width: 768,
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#26231e", light: "#fffdf8" },
  });
}
