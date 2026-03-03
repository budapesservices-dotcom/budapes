import type { SpringOptions } from "motion/react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltedCardProps {
  imageSrc?: string; // Sekarang opsional (untuk fallback)
  imageLayers?: string[]; // PROPERTI BARU: Untuk menampung potongan layer 1 - 4
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  imageHeight?: React.CSSProperties["height"];
  imageWidth?: React.CSSProperties["width"];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

const springValues: SpringOptions = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

export default function TiltedCard({
  imageSrc,
  imageLayers = [], // Default kosong
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);

  const rotateFigcaption = useSpring(0, {
    stiffness: 400,
    damping: 25,
    mass: 0.5,
  });

  const [lastY, setLastY] = useState(0);

  function handleInteractionMove(
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
  ) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const offsetX = clientX - rect.left - rect.width / 2;
    const offsetY = clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(clientX - rect.left);
    y.set(clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleInteractionStart() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleInteractionEnd() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:1000px] flex flex-col items-center justify-center touch-action-none"
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleInteractionMove}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchMove={handleInteractionMove}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* LOGIKA LAYER PARALLAX */}
        {imageLayers.length > 0
          ? imageLayers.map((layer, index) => {
              // Layer 1 (index 0) = 0px (paling belakang)
              // Layer 2 (index 1) = 25px
              // Layer 3 (index 2) = 50px
              // Layer 4 (index 3) = 75px (paling depan)
              const depth = index * 25;
              return (
                <motion.img
                  key={index}
                  src={layer}
                  alt={`${altText} Layer ${index + 1}`}
                  className={`absolute top-0 left-0 object-cover rounded-[15px] will-change-transform ${index === 0 ? "shadow-2xl" : ""}`}
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                    transform: `translateZ(${depth}px)`,
                  }}
                />
              );
            })
          : // Jika belum dipotong-potong, tampilkan gambar tunggal biasa
            imageSrc && (
              <motion.img
                src={imageSrc}
                alt={altText}
                className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)] shadow-2xl"
                style={{
                  width: imageWidth,
                  height: imageHeight,
                }}
              />
            )}

        {/* Label Judul didorong ke Z:120px agar tidak tertusuk oleh Layer 4 yang ada di 75px */}
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 z-[2] will-change-transform"
            style={{ transform: "translateZ(120px)" }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
