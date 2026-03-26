import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "hiresense-api" });
});

// Routes
import gigRoutes from "./routes/gig.routes";
import bidRoutes from "./routes/bid.routes";
import invoiceRoutes from "./routes/invoice.routes";
import milestoneRoutes from "./routes/milestone.routes";

app.use("/api/v1/gigs", gigRoutes);
app.use("/api/v1/bids", bidRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/milestones", milestoneRoutes);

app.listen(PORT, () => {
  console.log(`HireSense API running on port ${PORT}`);
});

export default app;
