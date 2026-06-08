import { fetchReviewsData } from "./actions";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const initialReviews = await fetchReviewsData();

  return <ReviewsClient initialReviews={initialReviews} />;
}
