export const CONTACT_EMAIL = "2496739820@qq.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_PHONE = "158 1534 7183";
export const CONTACT_TEL = "tel:15815347183";

// Replace this path with a future WeChat QR asset without touching badge rendering.
export const CONTACT_QR_SOURCE = "/contact-qr.png";
export const CONTACT_QR_FALLBACK_VALUE = CONTACT_MAILTO;
export const CONTACT_AVATAR_SOURCE = "/zhuang-shukai-portrait.jpg";

export const CONTACT_CAPABILITIES = [
  "内容策划",
  "账号运营",
  "影像制作",
  "平台投流",
  "到店转化",
  "数据复盘",
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
