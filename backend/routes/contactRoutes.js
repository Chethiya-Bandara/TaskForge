import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(["John", "Sarah"]);
});

export default router;