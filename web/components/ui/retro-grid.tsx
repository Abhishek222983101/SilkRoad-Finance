"use client";
import { useEffect, useRef } from "react";

interface RetroGridProps {
  gridColor?: string;
  showScanlines?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export default function RetroGrid({
  gridColor = "#00E500",
  showScanlines = true,
  glowEffect = true,
  className = "",
}: RetroGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 0, g: 229, b: 0 };
    };

    const cellWidth = 120;
    const cellDepth = 80;
    const numCellsDeep = 20;
    const cameraY = 60;
    const focalLength = 500;
    let offset = 0;
    const speed = 1.0;

    const project3DTo2D = (x: number, y: number, z: number) => {
      const relY = y - cameraY;
      const relZ = z - 400;
      if (relZ <= 10) return null;
      const scale = focalLength / relZ;
      return { x: canvas.width / 2 + x * scale, y: canvas.height * 0.5 - relY * scale };
    };

    const drawCell = (x: number, z: number, zOffset: number) => {
      const actualZ = z - zOffset;
      if (actualZ < -cellDepth || actualZ > numCellsDeep * cellDepth) return;

      const p1 = project3DTo2D(x - cellWidth / 2, 0, actualZ);
      const p2 = project3DTo2D(x + cellWidth / 2, 0, actualZ);
      const p3 = project3DTo2D(x - cellWidth / 2, 0, actualZ + cellDepth);
      const p4 = project3DTo2D(x + cellWidth / 2, 0, actualZ + cellDepth);

      if (!p1 || !p2 || !p3 || !p4) return;

      const distanceFactor = Math.min(1, actualZ / (numCellsDeep * cellDepth));
      const alpha = Math.max(0.1, 1 - distanceFactor);
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridColor;
      // REVERTED OPACITY to 0.3 (Clean, not shiny)
      ctx.globalAlpha = alpha * 0.3;

      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const rgb = hexToRgb(gridColor);
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "black");
      // REVERTED FOG OPACITY to 0.15
      bgGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      offset += speed;
      if (offset >= cellDepth) offset = 0;

      for (let row = 0; row < numCellsDeep; row++) {
        const z = row * cellDepth;
        for (let col = -10; col <= 10; col++) {
          drawCell(col * cellWidth, z, offset);
        }
      }

      if (showScanlines) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 2);
      }

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [gridColor, showScanlines, glowEffect]);

  return <canvas ref={canvasRef} className={className} />;
}