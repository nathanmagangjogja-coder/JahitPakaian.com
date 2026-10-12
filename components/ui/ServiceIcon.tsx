import {
  Scissors,
  Shirt,
  Maximize2,
  Briefcase,
  Pen,
  PlusCircle,
  Wrench,
  Zap,
  CircleDot,
  RefreshCw,
  PenTool,
  Palette,
  Boxes,
  BriefcaseBusiness,
  ShoppingBag,
  Printer,
  GraduationCap,
  HardHat,
  Ruler,
  Package,
  Layers,
  Gift,
  Tag,
  Sparkles,
  Truck,
  Store,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  shirt: Shirt,
  maximize: Maximize2,
  briefcase: Briefcase,
  needle: Pen,
  "patch-plus": PlusCircle,
  suture: Wrench,
  zap: Zap,
  "circle-dot": CircleDot,
  "refresh-cw": RefreshCw,
  "pen-tool": PenTool,
  palette: Palette,
  boxes: Boxes,
  "briefcase-business": BriefcaseBusiness,
  "shopping-bag": ShoppingBag,
  printer: Printer,
  "graduation-cap": GraduationCap,
  "hard-hat": HardHat,
  ruler: Ruler,
  package: Package,
  layers: Layers,
  gift: Gift,
  tag: Tag,
  sparkles: Sparkles,
  truck: Truck,
  store: Store,
};

/** Pilihan ikon di form admin (kategori dan layanan), [kunci, label]. */
export const serviceIconOptions: [string, string][] = [
  ["shirt", "Baju / Kaos"],
  ["graduation-cap", "Seragam sekolah"],
  ["hard-hat", "Wearpack / Seragam kerja"],
  ["briefcase-business", "Jas / Blazer"],
  ["scissors", "Gunting / Celana"],
  ["printer", "Sablon"],
  ["pen-tool", "Bordir"],
  ["shopping-bag", "Merchandise / Tas"],
  ["boxes", "Produksi massal"],
  ["palette", "Desain"],
  ["ruler", "Ukuran / Pola"],
  ["layers", "Bahan / Kain"],
  ["package", "Paket"],
  ["gift", "Hadiah / Souvenir"],
  ["tag", "Label / Brand"],
  ["sparkles", "Premium"],
  ["truck", "Pengiriman"],
  ["store", "Toko / Reseller"],
];

interface ServiceIconProps {
  name: string;
  className?: string;
}

export function ServiceIcon({ name, className = "h-6 w-6" }: ServiceIconProps) {
  const Icon = iconMap[name] || Shirt;
  return <Icon className={className} />;
}
