import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;
  res.json({ reply: "Echo: " + text });
});

export default router;
