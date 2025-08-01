import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace with your real admin check (e.g., database)
        if (credentials?.username === "admin" && credentials?.password === "securepassword") {
          return { id: "admin", name: "Admin User", email: "admin@namatrain.ai" }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin-login"
  }
})
