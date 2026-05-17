import { client } from "@/sanity/lib/client"
import { acknowledgementsQuery } from "@/sanity/lib/queries"
import AcknowledgementClient from "@/components/acknowledgement/AcknowledgementClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Acknowledgements | ClassGrid – With Gratitude",
  description: "Recognizing the mentors, contributors, and supporters who made ClassGrid possible.",
}

export const revalidate = 60; // Revalidate every minute

export default async function AcknowledgementPage() {
  const acknowledgements = await client.fetch(acknowledgementsQuery)

  // Separate the data by category
  const contributors = acknowledgements.filter((a: any) => a.category === 'contributor')
  const mentors = acknowledgements.filter((a: any) => a.category === 'mentor')
  const family = acknowledgements.filter((a: any) => a.category === 'family')

  return (
    <AcknowledgementClient 
      contributors={contributors} 
      mentors={mentors} 
      family={family} 
    />
  )
}
