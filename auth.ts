import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import PostgresAdapter from "@auth/pg-adapter";
import { pool, ensureDb } from "@/lib/db";

const authSecret = process.env.AUTH_SECRET;
const emailServer = process.env.EMAIL_SERVER;
const emailFrom = process.env.EMAIL_FROM;

if (!authSecret) {
  throw new Error("AUTH_SECRET is required for authentication");
}

if (!emailServer || !emailFrom) {
  throw new Error("EMAIL_SERVER and EMAIL_FROM must be configured for email auth");
}

await ensureDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  session: {
    strategy: "database",
  },
  providers: [
    EmailProvider({
      server: emailServer,
      from: emailFrom,
    }),
  ],
  trustHost: true,
  secret: authSecret,
});
