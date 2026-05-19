import { Router } from "express";
import supabase from "../lib/supabase";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data ?? []);
});

export default router;
