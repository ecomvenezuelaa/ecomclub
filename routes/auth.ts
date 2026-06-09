import { Router } from "express";
import supabase from "../lib/supabase.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const role = "miembro";

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("already been registered")) {
      return res.status(400).json({ error: "Este email ya está registrado. Intenta iniciar sesión." });
    }
    return res.status(400).json({ error: error.message });
  }
  if (!data.user) {
    return res.status(400).json({ error: "No se pudo crear la cuenta" });
  }

  const defaultAvatar = `https://i.pravatar.cc/150?u=${data.user.id}`;
  const { data: profileData, error: profileInsertError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, name, role, avatar: defaultAvatar, bio: "" })
    .select()
    .single();

  console.log("Profile insert →", { profileData, profileInsertError });
  if (profileInsertError) {
    return res.status(500).json({ error: `Error creando perfil: ${profileInsertError.message}` });
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !signInData.session) {
    return res.status(201).json({
      requiresEmailConfirmation: false,
      message: "Cuenta creada con éxito. Ya puedes iniciar sesión.",
      autoLogin: false,
    });
  }

  res.status(201).json({
    user: {
      id: data.user.id,
      name,
      email: data.user.email!,
      role,
      avatar: defaultAvatar,
      bio: "",
    },
    token: signInData.session.access_token,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      return res.status(401).json({ error: "Debes confirmar tu email antes de iniciar sesión." });
    }
    if (error.message.includes("Invalid login credentials")) {
      return res.status(401).json({ error: "Email o contraseña incorrectos." });
    }
    return res.status(401).json({ error: error.message });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, avatar, bio")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name: data.user.email!.split("@")[0],
      role: "miembro",
      avatar: `https://i.pravatar.cc/150?u=${data.user.id}`,
      bio: "",
    });
  }

  res.json({
    user: {
      id: data.user.id,
      name: profile?.name ?? data.user.email!.split("@")[0],
      email: data.user.email!,
      role: profile?.role ?? "miembro",
      avatar: profile?.avatar ?? `https://i.pravatar.cc/150?u=${data.user.id}`,
      bio: profile?.bio ?? "",
    },
    token: data.session.access_token,
  });
});

router.post("/avatar", async (req, res) => {
  const { userId, imageData } = req.body;

  if (!userId || !imageData) {
    return res.status(400).json({ error: "userId e imageData son requeridos" });
  }

  const matches = imageData.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ error: "Formato de imagen inválido" });
  }

  const buffer = Buffer.from(matches[2], "base64");
  const filePath = `avatar-${userId}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("Avatars")
    .upload(filePath, buffer, { contentType: "image/jpeg", upsert: true });

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  const { data: publicData } = supabase.storage.from("Avatars").getPublicUrl(filePath);

  if (!publicData?.publicUrl) {
    return res.status(500).json({ error: "No se pudo generar la URL de la imagen" });
  }

  res.json({ url: publicData.publicUrl });
});

router.put("/profile", async (req, res) => {
  const { id, name, avatar, bio, gender, city, phone } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const updateData: Record<string, any> = {
    name,
    avatar,
    bio,
    updated_at: new Date().toISOString(),
  };

  if (gender !== undefined) updateData.gender = gender;
  if (city !== undefined) updateData.city = city;
  if (phone !== undefined) updateData.phone = phone;

  let updated: any = null;
  let profileError: any = null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select("name, role, avatar, bio, gender, city, phone")
      .single();

    updated = data;
    profileError = error;
  } catch (err) {
    profileError = err;
  }

  // Fallback if the database does not have the new columns
  if (profileError && (profileError.message?.includes("column") || profileError.message?.includes("does not exist") || String(profileError).includes("column"))) {
    console.warn("La tabla de perfiles en Supabase no tiene los campos extendidos. Fallback a columnas estándar.");
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ name, avatar, bio, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("name, role, avatar, bio")
        .single();
      
      updated = data;
      profileError = error;
      
      if (updated) {
        // Adjuntar los campos extendidos para que se almacenen en LocalStorage
        updated.gender = gender;
        updated.city = city;
        updated.phone = phone;
      }
    } catch (err) {
      profileError = err;
    }
  }

  if (profileError) {
    return res.status(400).json({ error: profileError.message || String(profileError) });
  }

  const { data: authUser } = await supabase.auth.admin.getUserById(id);

  res.json({
    user: {
      id,
      name: updated.name,
      email: authUser?.user?.email ?? "",
      role: updated.role,
      avatar: updated.avatar,
      bio: updated.bio,
      gender: updated.gender || gender || "",
      city: updated.city || city || "",
      phone: updated.phone || phone || "",
    },
  });
});

export default router;
