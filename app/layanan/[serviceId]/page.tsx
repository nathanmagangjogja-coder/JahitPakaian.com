import type { Metadata } from "next";
import { getServiceByIdRemote } from "@/lib/services";
import { getCategoriesRemote } from "@/lib/categories";
import { BRAND_NAME } from "@/lib/brand";
import { ServiceDetailClient } from "./ServiceDetailClient";
export const dynamic = "force-dynamic";

type Props = { params: { serviceId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceByIdRemote(params.serviceId);
  if (!service) {
    return { title: `Layanan tidak ditemukan - ${BRAND_NAME}` };
  }
  return {
    title: `${service.name} - ${BRAND_NAME}`,
    description: `${service.description} Estimasi produksi ${service.duration}.`,
    openGraph: service.images[0] ? { images: [service.images[0]] } : undefined,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const [initialService, categories] = await Promise.all([
    getServiceByIdRemote(params.serviceId),
    getCategoriesRemote(),
  ]);
  return <ServiceDetailClient serviceId={params.serviceId} initialService={initialService} categories={categories} />;
}
