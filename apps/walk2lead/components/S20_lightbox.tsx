// Lightbox host — hidden until main.js (still loaded) wires the gallery / press
// images to `#lightbox`. Becomes <LightboxProvider> from @delead/ui once every
// section that opens an image (S15 gallery, S17 press) is migrated.
export function S20_lightbox() {
  return (
    <div
      id="lightbox"
      className="fixed inset-0 z-[200] hidden cursor-zoom-out place-items-center bg-[rgba(20,10,16,0.94)] p-[30px] [&.open]:grid"
    >
      <img id="lightbox-img" alt="" className="max-h-[88vh] max-w-full rounded-[12px]" />
    </div>
  );
}
