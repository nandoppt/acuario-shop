import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "product-images";

export async function getProductImageUrl(
  storagePath: string,
) {
  const supabase = await createClient();

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return publicUrl;
}