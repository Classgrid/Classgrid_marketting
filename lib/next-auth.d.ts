import type { DefaultSession } from "next-auth";

export {};

declare module "next-auth" {
  interface Session {
    user: NonNullable<DefaultSession["user"]> & {
      id?: string;
      forumUserId?: string;
      provider?: string;
      isPlatformUser?: boolean;
      platformRole?: string | null;
      forumEmailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    forumUserId?: string;
    provider?: string;
    isPlatformUser?: boolean;
    platformRole?: string | null;
    forumEmailVerified?: boolean;
  }
}
