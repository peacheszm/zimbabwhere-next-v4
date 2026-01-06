import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/endpoints/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "WordPress",
      credentials: {
        login: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // 1) Prefer JWT passed from client (if login form already fetched it)
          let jwt = credentials.jwt;

          // 2) Otherwise, obtain JWT from WordPress
          if (!jwt) {
            const authData = await authenticateUser(
              credentials.login,
              credentials.password
            );

            jwt = authData?.jwt || authData?.data?.jwt;
          }

          if (!jwt || typeof jwt !== "string") {
            return null; // Triggers CredentialsSignin
          }

          // Decode JWT token to extract user information
          const payload = JSON.parse(
            Buffer.from(jwt.split(".")[1], "base64").toString()
          );

          const userData = {
            id: payload.id,
            email: payload.email,
            name:
              payload.first_name && payload.last_name
                ? `${payload.first_name} ${payload.last_name}`
                : payload.username,
            username: payload.username,
            firstName: payload.first_name,
            lastName: payload.last_name,
            jwt: jwt,
            jwtPayload: payload,
          };

          return userData;
        } catch (error) {
          console.error("❌ Authentication failed:", error?.message || error);
          return null; // Triggers CredentialsSignin
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // persist WP user id
        token.jwt = user.jwt;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.jwtPayload = user.jwtPayload;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // read from our stored id, not token.sub
        session.user.username = token.username;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.jwt = token.jwt;
        session.jwtPayload = token.jwtPayload;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
