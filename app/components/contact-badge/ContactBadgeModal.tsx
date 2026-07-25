"use client";

import {
  Component,
  ComponentType,
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { StaticBadgeFallback } from "./StaticBadgeFallback";
import { useFocusTrap } from "./useFocusTrap";

type ContactBadgeModalProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

type SceneProps = {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
  onDismiss: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
};

type RenderMode = "checking" | "loading" | "3d" | "static";

class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    const extension = context.getExtension("WEBGL_lose_context");
    extension?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function isLowPerformanceMobile() {
  if (!window.matchMedia("(max-width: 767px)").matches) return false;
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  return (
    (navigatorWithMemory.deviceMemory !== undefined && navigatorWithMemory.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4)
  );
}

export function ContactBadgeModal({ open, onClose, triggerRef }: ContactBadgeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<RenderMode>("checking");
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, cardX: 0 });
  const handleClose = useCallback(() => {
    setIsFlipped(false);
    setMode("checking");
    setScene(null);
    setSceneReady(false);
    onClose();
  }, [onClose]);

  useFocusTrap(open, dialogRef, closeRef, triggerRef, handleClose);

  useEffect(() => {
    if (!open) return;
    const updateAnchor = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const x = viewportWidth * (viewportWidth < 768 ? 0.5 : 0.68);
      const y = -Math.max(18, viewportHeight * 0.025);
      const cardWidth = Math.min(300, viewportWidth * 0.72, viewportHeight * 0.42 * (2.6 / 3.7));
      const cardX = Math.min(
        Math.max(x, cardWidth / 2 + 16),
        viewportWidth - cardWidth / 2 - 16,
      );
      setAnchor({ x, y, cardX });
    };
    updateAnchor();
    window.addEventListener("resize", updateAnchor);
    return () => window.removeEventListener("resize", updateAnchor);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const loadScene = async () => {
      await Promise.resolve();
      if (cancelled) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || isLowPerformanceMobile() || !supportsWebGL()) {
        setMode("static");
        return;
      }

      setMode("loading");
      try {
        const sceneModule = await import("./ContactBadgeScene");
        if (cancelled) return;
        setScene(() => sceneModule.default);
        setMode("3d");
      } catch {
        if (!cancelled) setMode("static");
      }
    };
    void loadScene();

    return () => { cancelled = true; };
  }, [open]);

  const useStaticFallback = useCallback(() => {
    setScene(null);
    setSceneReady(false);
    setMode("static");
  }, []);
  const markSceneReady = useCallback(() => setSceneReady(true), []);

  if (!open) return null;

  const modalStyle = {
    "--contact-anchor-x": `${anchor.x}px`,
    "--contact-anchor-y": `${anchor.y}px`,
    "--contact-card-x": `${anchor.cardX}px`,
  } as CSSProperties;

  return createPortal(
    <div
      id="contact-badge-modal"
      className="contact-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div ref={dialogRef} className="contact-modal-shell" tabIndex={-1} style={modalStyle}>
        <h2 id="contact-dialog-title" className="sr-only">联系庄澍凯</h2>
        <button ref={closeRef} className="contact-modal-close" type="button" onClick={handleClose} aria-label="关闭联系工牌" autoFocus>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <div
          className="contact-modal-stage"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
        >
          {mode === "3d" && Scene && (
            <SceneErrorBoundary onError={useStaticFallback}>
              <Scene
                isFlipped={isFlipped}
                onReady={markSceneReady}
                onSceneError={useStaticFallback}
                onDismiss={handleClose}
                anchorXRatio={anchor.x / Math.max(1, window.innerWidth)}
                anchorYRatio={anchor.y / Math.max(1, window.innerHeight)}
              />
            </SceneErrorBoundary>
          )}
          {(mode === "static" || mode === "checking" || mode === "loading" || !sceneReady) && (
            <StaticBadgeFallback isFlipped={isFlipped} />
          )}
        </div>

        <div className="contact-modal-controls">
          <button
            className="badge-flip-button"
            type="button"
            aria-pressed={isFlipped}
            onClick={() => setIsFlipped((current) => !current)}
          >
            <span>{isFlipped ? "返回个人简介" : "查看联系方式"}</span>
            <i aria-hidden="true">↻</i>
          </button>
          <p aria-live="polite">
            {mode === "checking" || mode === "loading" || (mode === "3d" && !sceneReady)
              ? "工牌内容已显示　拖拽交互加载中"
              : mode === "static"
                ? "轻点按钮查看联系方式"
                : isFlipped
                  ? "扫码添加微信或通过邮箱联系"
                  : "拖动工牌或查看背面二维码"}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
