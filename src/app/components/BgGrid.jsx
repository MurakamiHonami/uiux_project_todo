export default function BgGrid() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: "linear-gradient(rgba(0,255,120,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,120,0.025) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }} />
  );
}
