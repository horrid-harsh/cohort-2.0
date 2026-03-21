import { Router } from "express";
import { getClusters } from "../controllers/cluster.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// GET /api/v1/clusters
router.get("/", verifyJWT, aiLimiter, getClusters);

export default router;