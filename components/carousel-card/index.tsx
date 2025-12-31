
import Image from "next/image";
import "./carousel-card.css";

type CarouselText = { label: string; body: string } | string;

interface CarouselCardProps {
  image: string;
  title: string;
  texts: CarouselText[];
}

const toItem = (s: string): { label: string; body: string } => {
  // Split at the first ":" -> "1. PROOF Supplies:" | " DO NOT open…"
  const i = s.indexOf(":");
  if (i >= 0) return { label: s.slice(0, i + 1), body: s.slice(i + 1) };
  return { label: "", body: s };
};

function CarouselCard({ image, title, texts }: CarouselCardProps) {
  return (
    <div className="carousel-card">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: 300,
        }}
      >
        <Image
          className="cc-image"
          src={image}
          alt="image"
          width={3000}
          height={3000}
          priority
          style={{ maxWidth: 200, height: "auto" }}
        />
      </div>

      <div className="cc-content">
        <h3 className="cc-title">{title}</h3>
        {texts.map((t, i) => {
          const item = typeof t === "string" ? toItem(t) : t;
          return (
            <p key={i} className="cc-text">
              {item.label && <strong>{item.label}</strong>} {item.body}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default CarouselCard;