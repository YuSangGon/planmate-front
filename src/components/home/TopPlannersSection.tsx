import { useState, useEffect } from "react";
import {
  getPlannersTop3,
  type PlannerListItem,
} from "../../services/plannerApi";
import { useNavigate } from "react-router-dom";

export default function TopPlannersSection() {
  const [planners, setPlanners] = useState<PlannerListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanners = async () => {
      try {
        const response = await getPlannersTop3();
        setPlanners(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Top3 plan list load failed",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanners();
  }, []);

  const goToPlannerDetail = (plannerId: string) => {
    navigate(`/planners/${plannerId}`);
  };

  return (
    <section className="section">
      <div className="section__header">
        <span className="section__eyebrow">Top planners</span>
        <h2 className="section__title">People who genuinely enjoy planning</h2>
      </div>

      <div className="grid grid--3">
        {!isLoading &&
          planners.map((planner) => (
            <article className="planner-card" key={planner.name}>
              <div className="planner-card__avatar">{planner.name[0]}</div>
              <h3>{planner.name}</h3>
              <p>{planner.plannerReviewSummary?.strengths || "no strengths"}</p>
              <div className="planner-card__meta">
                <span>⭐ {planner.plannerReviewSummary?.rating ?? 0}</span>
                <span>
                  ( {planner.plannerReviewSummary?.reviewCount ?? 0} )
                </span>
              </div>
              <button
                className="btn btn--secondary planner-card__button"
                onClick={() => goToPlannerDetail(planner.id)}
              >
                View profile
              </button>
            </article>
          ))}
      </div>
      {!isLoading && errorMessage && <div className="gird">{errorMessage}</div>}
    </section>
  );
}
