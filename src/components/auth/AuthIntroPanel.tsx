type AuthBenefit = {
  title: string;
  description: string;
};

type AuthIntroPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: AuthBenefit[];
};

export default function AuthIntroPanel({
  eyebrow,
  title,
  description,
  benefits,
}: AuthIntroPanelProps) {
  return (
    <div className="auth-panel auth-panel--info">
      <span className="section__eyebrow">{eyebrow}</span>
      <h1 className="auth-panel__title">{title}</h1>
      <p className="auth-panel__description">{description}</p>

      <div className="auth-benefits">
        {benefits.map((benefit) => (
          <div className="auth-benefit" key={benefit.title}>
            <strong>{benefit.title}</strong>
            <span>{benefit.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
