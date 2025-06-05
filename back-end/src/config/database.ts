import mongoose from "mongoose"
import { config } from "./env"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB 