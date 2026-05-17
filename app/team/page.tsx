import { client } from "@/sanity/lib/client"
import { teamMembersQuery } from "@/sanity/lib/queries"
import TeamClient from "@/components/team/TeamClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Meet Our Team | ClassGrid",
  description: "Meet the innovators, educators, and engineers behind the ClassGrid platform.",
}

export const revalidate = 60; // Revalidate every minute

export default async function TeamPage() {
  const teamMembers = await client.fetch(teamMembersQuery)

  // Group by department
  const leadership = teamMembers.filter((m: any) => m.department === 'leadership')
  const engineering = teamMembers.filter((m: any) => m.department === 'engineering')
  const sales = teamMembers.filter((m: any) => m.department === 'sales')
  const support = teamMembers.filter((m: any) => m.department === 'support')

  return (
    <TeamClient 
      leadership={leadership} 
      engineering={engineering} 
      sales={sales} 
      support={support} 
    />
  )
}
