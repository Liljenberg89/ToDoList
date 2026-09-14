import mongoose from "mongoose";

export async function connectDB(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  const { connection } = mongoose;
  connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  console.log(`MongoDB connected: ${connection.host}/${connection.name}`);
}
