type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <span className="section__eyebrow">{eyebrow}</span>
      <h1 className="page-hero__title">{title}</h1>
      <p className="page-hero__description">{description}</p>
    </section>
  );
}
