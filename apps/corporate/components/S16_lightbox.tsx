// click-to-enlarge overlay for the Gallery grid — same pattern as
// Walk2Lead's S20_lightbox.tsx (ported here since this site's gallery never
// had it). Numbered S16 to keep the section-order naming convention.
export function S16_lightbox() {
  return (
    <div className="lightbox" id="lightbox">
      <img id="lightbox-img" alt="" />
    </div>
  );
}
