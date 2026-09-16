import "dotenv/config.js";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma successfully connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("❌ Prisma connection failed:", error.message);
    process.exit(1);
  }
}

startServer();