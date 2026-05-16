import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  const posts: any[] = [
    {
      id: "1",
      author: "Sarah Jenkins",
      role: "Design Mentor",
      content: "Just finished reviewing the latest batch of UI portfolios from the advanced class. I am consistently blown away by the level of detail and thoughtful interaction design you all are applying. Keep up the fantastic work! 🚀",
      likes: 24,
      comments: 5,
      timestamp: "2 hours ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      tip: {
        title: "Tip of the Day",
        content: "Remember that contrast is key. Always check your text against background tonal values for readability."
      }
    },
    {
      id: "2",
      author: "Marcus Chen",
      role: "Engineering Student",
      content: "Can anyone recommend good resources for learning about advanced graph algorithms? I'm struggling a bit with the current assignment on pathfinding optimization.",
      likes: 12,
      comments: 8,
      timestamp: "5 hours ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      tags: ["#Algorithms", "#Help"]
    }
  ];

  const courses = [
    {
      id: "1",
      title: "Advanced Front-End Architecture",
      category: "Web Dev",
      module: "Module 4: React Context",
      progress: 65,
      description: "Master state management and complex application structures using the latest industry standards.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop"
    },
    {
      id: "2",
      title: "UI/UX Fundamentals",
      category: "Design",
      module: "Module 2: Typography",
      progress: 30,
      description: "Learn the core principles of user interface and experience design.",
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&h=450&fit=crop"
    }
  ];

  // API routes
  app.get("/api/posts", (req, res) => {
    res.json(posts);
  });

  app.get("/api/courses", (req, res) => {
    res.json(courses);
  });

  app.post("/api/posts", (req, res) => {
    const newPost = {
      id: Math.random().toString(36).substr(2, 9),
      author: "Current User",
      role: "Member",
      content: req.body.content,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
