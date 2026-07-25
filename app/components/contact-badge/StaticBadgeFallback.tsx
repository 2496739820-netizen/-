"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTACT_AVATAR_SOURCE,
  CONTACT_CAPABILITIES,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE,
  CONTACT_QR_SOURCE,
  CONTACT_TEL,
  createFallbackQrDataUrl,
} from "./contact-data";

type StaticBadgeFallbackProps = {
  isFlipped: boolean;
};

function BadgeFront({ hidden }: { hidden: boolean }) {
  return (
    <div className="badge-face badge-front" aria-hidden={hidden}>
      <div className="badge-front-head">
        <span className="badge-edition">PERSONAL CONTACT / 2026</span>
      </div>
      <div className="badge-identity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="badge-avatar" src={CONTACT_AVATAR_SOURCE} alt="庄澍凯个人照片" />
        <div className="badge-identity-copy">
          <p className="badge-role">高端眼镜门店<br />新媒体运营</p>
          <h3 className="badge-name">庄澍凯</h3>
          <span className="badge-name-en">ZHUANG SHUKAI</span>
          <span className="badge-region">求职区域　粤港澳大湾区</span>
        </div>
      </div>
      <div className="badge-divider" aria-hidden="true" />
      <div className="badge-contact-grid" aria-label="联系方式">
        <a href={CONTACT_TEL}><small>PHONE</small><strong>{CONTACT_PHONE}</strong></a>
        <a href={CONTACT_MAILTO}><small>EMAIL</small><strong>{CONTACT_EMAIL}</strong></a>
      </div>
      <div className="badge-divider" aria-hidden="true" />
      <p className="badge-section-label">职业技能</p>
      <div className="badge-capabilities" aria-label="核心能力">
        {CONTACT_CAPABILITIES.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function BadgeBack({ hidden }: { hidden: boolean }) {
  const [qrSource, setQrSource] = useState(CONTACT_QR_SOURCE);
  const requestRef = useRef(0);

  useEffect(() => () => { requestRef.current += 1; }, []);

  const handleQrError = async () => {
    const request = ++requestRef.current;
    try {
      const fallback = await createFallbackQrDataUrl();
      if (request === requestRef.current) setQrSource(fallback);
    } catch {
      // The email remains visible and usable if both image paths fail.
    }
  };

  return (
    <div className="badge-face badge-back" aria-hidden={hidden}>
      <div className="badge-back-head"><span>CONTACT</span><i aria-hidden="true" /></div>
      <div className="badge-qr-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrSource} onError={handleQrError} alt="庄澍凯联系二维码" />
      </div>
      <div className="badge-back-copy">
        <h3>扫码联系我</h3>
        <p>{CONTACT_EMAIL}</p>
      </div>
      <small>高端眼镜门店新媒体运营</small>
    </div>
  );
}

export function StaticBadgeFallback({ isFlipped }: StaticBadgeFallbackProps) {
  return (
    <div className="static-badge-scene" data-contact-badge="static">
      <div className="static-lanyard" aria-hidden="true">
        <i /><b /><u><em>ZHUANG SHUKAI · ZHUANG SHUKAI · ZHUANG SHUKAI</em></u><span />
      </div>
      <div className="static-clip" aria-hidden="true"><i /><b /></div>
      <div className={`static-badge ${isFlipped ? "is-flipped" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
        <BadgeFront hidden={isFlipped} />
        <BadgeBack hidden={!isFlipped} />
      </div>
    </div>
  );
}
