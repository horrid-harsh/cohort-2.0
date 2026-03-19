import { Router } from "express";
import { getGraph } from "../controllers/graph.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


/**
 * @route /api/v1/graph
 * @methods GET - getGraph
 * @access private
 */
router.get("/", verifyJWT, getGraph);

export default router;