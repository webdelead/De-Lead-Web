import { getGallery } from "@/lib/content";

type Img = { id: string; _url: string; _alt: string };

function Row({ imgs, dir }: { imgs: Img[]; dir: "left" | "right" }) {
  return (
    <div className={`marquee-row marquee-${dir}`}>
      <div className="marquee-track">
        {imgs.map((im) => (
          <img key={`a${im.id}`} src={im._url} alt={im._alt} loading="lazy" />
        ))}
        {imgs.map((im) => (
          <img key={`b${im.id}`} src={im._url} alt="" aria-hidden="true" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

export async function S09_gallery() {
  const rows = (await getGallery()) as Img[];
  const mid = Math.ceil(rows.length / 2);
  const top = rows.slice(0, mid);
  const bottom = rows.slice(mid);

  return (
    <>
      <section className="section gallery" id="gallery">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Inside a batch</span>
            <h2>What two days on campus <span className="italic">actually looks like</span></h2>
          </div>
        </div>
        <div className="marquee-wrap reveal">
          <Row imgs={top} dir="left" />
          <Row imgs={bottom} dir="right" />
        </div>
      </section>
    </>
  );
}
