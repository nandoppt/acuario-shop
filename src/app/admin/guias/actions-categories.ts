"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(profile?.role!=="admin") redirect("/");
  return supabase;
}

function slugify(value:string){return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}

export async function createGuideCategory(formData:FormData){
  const supabase=await requireAdmin();
  const name=String(formData.get("name")??"").trim();
  const description=String(formData.get("description")??"").trim();
  if(!name) throw new Error("Escribe el nombre de la categoría.");
  const {data:last}=await supabase.from("guide_categories").select("sort_order").order("sort_order",{ascending:false}).limit(1).maybeSingle();
  const {error}=await supabase.from("guide_categories").insert({name,slug:slugify(name),description,sort_order:(last?.sort_order??0)+1});
  if(error) throw new Error(error.message);
  revalidatePath("/guias/biblioteca"); revalidatePath("/admin/guias"); revalidatePath("/admin/guias/categorias"); redirect("/admin/guias/categorias");
}

export async function toggleGuideCategory(id:string, active:boolean){
  const supabase=await requireAdmin();
  const {error}=await supabase.from("guide_categories").update({is_active:active}).eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/guias/biblioteca"); revalidatePath("/admin/guias/categorias");
}