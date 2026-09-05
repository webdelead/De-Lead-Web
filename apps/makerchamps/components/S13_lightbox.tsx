// click-to-enlarge overlay for the gallery marquee — same pattern as
// Walk2Lead's S20_lightbox.tsx (ported here since this site's gallery
// never had it).
export function S13_lightbox() {
  return (
    <div className="lightbox" id="lightbox">
      <img id="lightbox-img" alt="" />
    </div>
  );
}
