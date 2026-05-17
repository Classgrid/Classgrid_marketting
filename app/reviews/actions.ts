"use server";
import { client } from "@/sanity/lib/client";

export async function fetchReviewsData() {
  const query = `*[_type == "communityReview" && status == "published"] | order(isFeatured desc, _createdAt desc) {
    _id, name, institution, reviewText, suggestion, rating, status, adminReply, category, moduleName, positives, negatives, isVerified, isFeatured, _createdAt
  }`;
  return await client.fetch(query);
}
