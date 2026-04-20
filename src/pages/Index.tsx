import { useEffect, useRef, useState, useCallback } from "react";
// @ts-expect-error no types
import GIF from "gif.js.optimized";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TOTAL_DAYS = 30;
const JUNE_START = 0;

const W = 460;
const H = 520;
const COLS = 7;
const GRID_LEFT = 30;
const GRID_TOP = 160;
const CELL_SIZE = (W - GRID_LEFT * 2) / COLS;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function drawCalendar(ctx: CanvasRenderingContext2D, heartScale: number) {
  ctx.clearRect(0, 0, W, H);

  ctx.save();
  ctx.font = "300 11px Montserrat, sans-serif";
  ctx.fillStyle = "#B0A0BC";
  ctx.textAlign = "center";
  ctx.fillText("2026", W / 2, 52);

  ctx.font = "300 56px Georgia, serif";
  ctx.fillStyle = "#4A3F52";
  ctx.fillText("Июнь", W / 2, 112);

  const grad = ctx.createLinearGradient(W / 2 - 24, 0, W / 2 + 24, 0);
  grad.addColorStop(0, "#FFDAC1");
  grad.addColorStop(0.5, "#E8DAFF");
  grad.addColorStop(1, "#C7F2E4");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 24, 124);
  ctx.lineTo(W / 2 + 24, 124);
  ctx.stroke();
  ctx.restore();

  DAYS.forEach((d, i) => {
    ctx.save();
    ctx.font = "500 9px Montserrat, sans-serif";
    ctx.fillStyle = i >= 5 ? "#C97C50" : "#B0A0BC";
    ctx.textAlign = "center";
    ctx.fillText(d.toUpperCase(), GRID_LEFT + i * CELL_SIZE + CELL_SIZE / 2, GRID_TOP);
    ctx.restore();
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < JUNE_START; i++) cells.push(null);
  for (let d = 1; d <= TOTAL_DAYS; d++) cells.push(d);

  cells.forEach((day, idx) => {
    if (!day) return;
    const col = idx % COLS;
    const row = Math.floor(idx / COLS);
    const cx = GRID_LEFT + col * CELL_SIZE + CELL_SIZE / 2;
    const cy = GRID_TOP + 20 + row * CELL_SIZE + CELL_SIZE / 2;
    const isWeekend = col >= 5;
    const isHeart = day === 12;

    if (isHeart) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(heartScale, heartScale);

      ctx.shadowColor = "rgba(240, 120, 120, 0.4)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;

      const s = 21;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.28);
      ctx.bezierCurveTo(-s * 0.08, s * 0.08, -s * 0.5, -s * 0.05, -s * 0.5, -s * 0.32);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.65, -s * 0.1, -s * 0.85, 0, -s * 0.52);
      ctx.bezierCurveTo(s * 0.1, -s * 0.85, s * 0.5, -s * 0.65, s * 0.5, -s * 0.32);
      ctx.bezierCurveTo(s * 0.5, -s * 0.05, s * 0.08, s * 0.08, 0, s * 0.28);
      ctx.closePath();
      ctx.fillStyle = "#FFBCBC";
      ctx.fill();
      ctx.strokeStyle = "#F07878";
      ctx.lineWidth = 1.5 / heartScale;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.font = "500 13px Montserrat, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(day), cx, cy + 1);
      ctx.restore();
    } else {
      ctx.save();
      ctx.font = "400 14px Montserrat, sans-serif";
      ctx.fillStyle = isWeekend ? "#C97C50" : "#4A3F52";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(day), cx, cy);
      ctx.restore();
    }
  });

  const dots = [
    { color: "#FFDAC1", r: 5 },
    { color: "#E8DAFF", r: 4 },
    { color: "#C7F2E4", r: 5 },
  ];
  let dx = W / 2 - 18;
  dots.forEach(({ color, r }) => {
    ctx.beginPath();
    ctx.arc(dx, H - 32, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    dx += 18;
  });
}

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [gifStatus, setGifStatus] = useState<"idle" | "rendering" | "done">("idle");
  const [webmStatus, setWebmStatus] = useState<"idle" | "recording" | "done">("idle");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let start: number | null = null;
    const DURATION = 2400;

    function tick(ts: number) {
      if (!start) start = ts;
      const t = ((ts - start) % DURATION) / DURATION;
      const pulse = 1 + 0.1 * Math.sin(easeInOut(t) * Math.PI * 2);
      drawCalendar(ctx, pulse);
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const exportGif = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGifStatus("rendering");

    const gif = new GIF({
      workers: 2,
      quality: 6,
      width: W,
      height: H,
      workerScript: "https://cdn.jsdelivr.net/npm/gif.js.optimized@1.0.1/dist/gif.worker.js",
      transparent: 0x000000,
    });

    const tmp = document.createElement("canvas");
    tmp.width = W;
    tmp.height = H;
    const ctx = tmp.getContext("2d")!;
    const FRAMES = 40;
    const DURATION = 2400;

    for (let i = 0; i < FRAMES; i++) {
      const t = i / FRAMES;
      const pulse = 1 + 0.1 * Math.sin(easeInOut(t) * Math.PI * 2);
      drawCalendar(ctx, pulse);
      gif.addFrame(ctx, { copy: true, delay: Math.round(DURATION / FRAMES) });
    }

    gif.on("finished", (blob: Blob) => {
      setGifStatus("done");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "june-2026.gif";
      a.click();
    });

    gif.render();
  }, []);

  const exportWebm = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setWebmStatus("recording");

    const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setWebmStatus("done");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "june-2026.webm";
      a.click();
    };
    recorder.start();
    setTimeout(() => recorder.stop(), 2600);
  }, []);

  return (
    <div style={styles.page}>
      <canvas ref={canvasRef} width={W} height={H} style={styles.canvas} />

      <div style={styles.buttons}>
        <button
          onClick={exportGif}
          disabled={gifStatus === "rendering"}
          style={{ ...styles.btn, ...styles.btnPeach }}
        >
          {gifStatus === "rendering" ? "Генерирую..." : gifStatus === "done" ? "GIF скачан ✓" : "Скачать GIF"}
        </button>

        <button
          onClick={exportWebm}
          disabled={webmStatus === "recording"}
          style={{ ...styles.btn, ...styles.btnLavender }}
        >
          {webmStatus === "recording"
            ? "Записываю..."
            : webmStatus === "done"
            ? "WebM скачан ✓"
            : "Скачать WebM"}
        </button>
      </div>

      <p style={styles.hint}>
        GIF — для мессенджеров и везде<br />
        WebM — идеальная прозрачность для сайтов и монтажа
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    padding: "40px 20px",
    background: "linear-gradient(135deg, #FFF5F0 0%, #F8F0FF 45%, #EDFAF5 100%)",
    fontFamily: "'Montserrat', sans-serif",
  },
  canvas: {
    borderRadius: 24,
    background: "transparent",
    boxShadow: "0 8px 60px rgba(160,120,200,0.13)",
  },
  buttons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btn: {
    padding: "12px 28px",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    fontSize: 13,
    letterSpacing: "0.04em",
    transition: "opacity 0.2s",
  },
  btnPeach: {
    background: "#FFDAC1",
    color: "#7A4A28",
  },
  btnLavender: {
    background: "#E8DAFF",
    color: "#5A3A8A",
  },
  hint: {
    fontSize: 11,
    color: "#B0A0BC",
    textAlign: "center",
    lineHeight: 1.8,
    letterSpacing: "0.03em",
  },
};