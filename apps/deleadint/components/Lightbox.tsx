// click-to-enlarge overlay for the Gallery grid — same pattern already used
// on Walk2Lead (components/S20_lightbox.tsx / .lightbox in main.js), just
// ported here since this site's Gallery never had it.
export function Lightbox() {
  return (
    <div className="lightbox" id="lightbox">
      <img id="lightbox-img" alt="" />
    </div>
  );
}
