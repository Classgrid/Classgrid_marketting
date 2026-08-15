import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not ready");
    }

    const email = session.user.email;
    const user = await db.collection("users").findOne(
      { email: { $regex: new RegExp(`^${email}$`, 'i') } },
      { projection: { role: 1, additional_roles: 1, organization_id: 1 } }
    );

    if (!user) {
      return NextResponse.json({ userContext: null });
    }

    // SECURITY BLOCK: NEVER send context for super admins.
    if (user.role === "super_admin") {
      return NextResponse.json({ userContext: null });
    }

    let organization = null;
    if (user.organization_id) {
      organization = await db.collection("organizations").findOne(
        { _id: user.organization_id },
        { projection: { name: 1, org_type: 1, subdomain: 1, structure_type: 1, customDomain: 1, isCustomDomainEnabled: 1 } }
      );
    }

    const userContext = {
      role: user.role,
      additional_roles: user.additional_roles || [],
      org_name: organization ? organization.name : null,
      org_type: organization ? organization.org_type : null,
      structure_type: organization ? organization.structure_type : null,
      login_url: organization ? (
          (organization.customDomain && organization.isCustomDomainEnabled) 
              ? `https://${organization.customDomain}` 
              : `https://${organization.subdomain}.classgrid.in`
      ) : null
    };

    return NextResponse.json({ userContext });

  } catch (error) {
    console.error("Error fetching AI context:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
