import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

const handler = async (req, res) => {
  try {
    return await NextAuth(authOptions)(req, res);
  } catch (error) {
    console.error("NextAuth error:", error);
    if (res) {
      res.status(500).json({ error: error.message || "Unknown error" });
    } else {
      throw error;
    }
  }
};

export { handler as GET, handler as POST }; 