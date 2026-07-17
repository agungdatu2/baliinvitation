import { ComponentType } from "react";
import { TemplateProps } from "@/types/invitation";
import LumeTemplate from "./lume/LumeTemplate";
import ReverieTemplate from "./reverie/ReverieTemplate";

// Daftar semua template yang tersedia. Tambah template baru cukup:
// 1. buat folder src/components/templates/<key>/
// 2. daftarkan di sini dengan key yang sama dgn Template.key di DB
export const TEMPLATE_REGISTRY: Record<string, ComponentType<TemplateProps>> = {
  lume: LumeTemplate,
  reverie: ReverieTemplate,
};
