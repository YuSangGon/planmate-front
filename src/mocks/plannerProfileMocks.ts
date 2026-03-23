export type PlannerReview = {
  id: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

export type PlannerPlan = {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  summary: string;
  tags: string[];
};

export type PlannerProfile = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  rating: string;
  reviews: string;
  completedPlans: number;
  responseRate: string;
  location: string;
  intro: string;
  strengths: string[];
  plannerPlans: PlannerPlan[];
  plannerReviews: PlannerReview[];
};

export const plannerProfileMocks: PlannerProfile[] = [
  {
    id: "cmmxb2i2800024mkvrdmvby77",
    name: "Emma",
    specialty: "Europe city itineraries",
    description:
      "Creates calm and thoughtful city plans with food, museums, and flexible pacing.",
    rating: "4.9",
    reviews: "124 reviews",
    completedPlans: 42,
    responseRate: "96%",
    location: "London, UK",
    intro:
      "I love turning vague travel ideas into clear and comfortable itineraries. My style is thoughtful, realistic, and never overpacked.",
    strengths: ["City breaks", "Museums", "Cafés", "Slow travel"],
    plannerPlans: [
      {
        id: "emma-plan-1",
        title: "4 Days in Edinburgh",
        destination: "Edinburgh",
        duration: "4 days",
        price: "GBP 25",
        summary:
          "A calm and scenic city itinerary with cafés, bookstores, and easy walking routes.",
        tags: ["Scenic", "City break", "Slow-paced"],
      },
      {
        id: "emma-plan-2",
        title: "3 Days in Paris",
        destination: "Paris",
        duration: "3 days",
        price: "EUR 30",
        summary:
          "A balanced route for museums, quiet neighbourhoods, and memorable food stops.",
        tags: ["Culture", "Museums", "Food"],
      },
      {
        id: "emma-plan-3",
        title: "Weekend in Bruges",
        destination: "Bruges",
        duration: "2 days",
        price: "EUR 18",
        summary:
          "A soft-paced weekend plan with canals, cafés, and relaxed sightseeing.",
        tags: ["Weekend", "Cosy", "Scenic"],
      },
    ],
    plannerReviews: [
      {
        id: "review-emma-1",
        author: "Sang",
        rating: 5,
        content:
          "The itinerary felt very realistic and calm. It matched exactly the kind of trip I wanted.",
        createdAt: "2 weeks ago",
      },
      {
        id: "review-emma-2",
        author: "Mina",
        rating: 5,
        content:
          "Emma gave me a thoughtful plan with great café spots and a perfect walking flow.",
        createdAt: "1 month ago",
      },
      {
        id: "review-emma-3",
        author: "Alex",
        rating: 4,
        content:
          "Very polished and well organised. I would happily work with her again.",
        createdAt: "2 months ago",
      },
    ],
  },
  {
    id: "planner-daniel",
    name: "Daniel",
    specialty: "Budget-friendly travel plans",
    description:
      "Focuses on efficient routes, low-cost options, and practical choices for first-time travellers.",
    rating: "4.8",
    reviews: "96 reviews",
    completedPlans: 35,
    responseRate: "93%",
    location: "Seoul, South Korea",
    intro:
      "I like making travel more approachable. My itineraries focus on value, clarity, and smart movement without losing the fun.",
    strengths: ["Budget travel", "Efficient routes", "First-time trips"],
    plannerPlans: [
      {
        id: "daniel-plan-1",
        title: "Budget 5 Days in Tokyo",
        destination: "Tokyo",
        duration: "5 days",
        price: "JPY 3500",
        summary:
          "A practical first-time Tokyo itinerary with affordable food, transport flow, and realistic daily pacing.",
        tags: ["Budget", "Tokyo", "Practical"],
      },
      {
        id: "daniel-plan-2",
        title: "Low-cost Bangkok Weekend",
        destination: "Bangkok",
        duration: "3 days",
        price: "THB 900",
        summary:
          "Street food, temples, and practical movement for travellers who want value and simplicity.",
        tags: ["Budget", "Food", "Weekend"],
      },
    ],
    plannerReviews: [
      {
        id: "review-daniel-1",
        author: "Jenny",
        rating: 5,
        content:
          "Super practical and very easy to follow. Great for my first solo trip.",
        createdAt: "3 weeks ago",
      },
      {
        id: "review-daniel-2",
        author: "Chris",
        rating: 4,
        content:
          "Really good value-focused planning. Helped me avoid wasting time and money.",
        createdAt: "1 month ago",
      },
    ],
  },
  {
    id: "planner-sophie",
    name: "Sophie",
    specialty: "Food-focused travel routes",
    description:
      "Designs travel around memorable meals, local cafés, and neighbourhood-based exploration.",
    rating: "5.0",
    reviews: "141 reviews",
    completedPlans: 51,
    responseRate: "98%",
    location: "Paris, France",
    intro:
      "Food tells the story of a place. I build itineraries around local flavour, neighbourhood atmosphere, and memorable meals.",
    strengths: ["Food routes", "Neighbourhood guides", "Local recommendations"],
    plannerPlans: [
      {
        id: "sophie-plan-1",
        title: "Food Lover’s Paris",
        destination: "Paris",
        duration: "4 days",
        price: "EUR 35",
        summary:
          "A neighbourhood-based Paris route built around pastry shops, bistros, and relaxed local exploration.",
        tags: ["Food", "Paris", "Neighbourhood"],
      },
      {
        id: "sophie-plan-2",
        title: "Barcelona Through Food",
        destination: "Barcelona",
        duration: "4 days",
        price: "EUR 32",
        summary:
          "Markets, tapas, coffee, and slow afternoons built into one coherent route.",
        tags: ["Food", "Barcelona", "Slow-paced"],
      },
    ],
    plannerReviews: [
      {
        id: "review-sophie-1",
        author: "Leo",
        rating: 5,
        content:
          "This was the most fun food itinerary I have ever followed. Everything felt intentional.",
        createdAt: "5 days ago",
      },
      {
        id: "review-sophie-2",
        author: "Hana",
        rating: 5,
        content:
          "Amazing local suggestions. It felt like travelling with a friend who knows the city deeply.",
        createdAt: "2 weeks ago",
      },
    ],
  },
];
