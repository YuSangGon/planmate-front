import { useState, useEffect } from "react";
import { getPlansTop3, type PlanItem } from "../../services/planApi";
import { useNavigate } from "react-router-dom";

export default function FeaturedPlansSection() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlansTop3();
        setPlans(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Top3 plan list load failed",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const goToPlanDetail = (planId: string) => {
    navigate(`/plans/${planId}`);
  };

  return (
    <section className="section">
      <div className="section__header">
        <span className="section__eyebrow">Featured plans</span>
        <h2 className="section__title">Templates travellers already want</h2>
      </div>

      <div className="grid grid--3">
        {!isLoading &&
          plans.map((plan) => (
            <article className="plan-card" key={plan.title}>
              <div className="plan-card__image">
                <span className="plan-card__tag">{plan.tags[0] ?? ""}</span>
              </div>
              <div className="plan-card__body">
                <h3>{plan.title}</h3>
                <p>{plan.summary}</p>
                <div className="plan-card__footer">
                  <span className="plan-card__price">{plan.price}</span>
                  <button
                    className="text-link"
                    onClick={() => goToPlanDetail(plan.id)}
                  >
                    View plan
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
