import { Metadata } from "next";
import { CommunityClient } from "./CommunityClient";

export const metadata: Metadata = {
  title: "Community Forum (Coming Soon) | ClassGrid",
  description: "An exclusive space for ClassGrid institutions to connect, share resources, and discuss best practices.",
};

export default function CommunityPage() {
  return <CommunityClient />;
}
