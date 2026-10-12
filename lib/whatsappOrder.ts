import { buildWhatsAppLink, getBusinessSettingsRemote } from "./settings";

/**
 * Link WA langsung per layanan (tanpa form, tanpa bikin data pesanan di database).
 * Dipakai di kartu/daftar layanan: klik "Pesan Konveksi" -> langsung ke WhatsApp,
 * tidak ada halaman atau form apa pun di antaranya.
 */
export async function getServiceInquiryWhatsAppLink(service: {
  name: string;
  categoryLabel?: string;
}): Promise<string | null> {
  const settings = await getBusinessSettingsRemote();
  const message = [
    "Halo JahitPakaian, saya ingin tanya & pesan konveksi.",
    "",
    `Layanan: ${service.name}${service.categoryLabel ? ` (${service.categoryLabel})` : ""}`,
    "",
    "Mohon info jumlah minimal, bahan, dan estimasi waktu produksinya ya. Terima kasih!",
  ].join("\n");
  return buildWhatsAppLink(settings, message);
}

export interface WhatsAppContactInput {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

/** Susun teks pertanyaan/konsultasi (formulir Hubungi Kami) untuk dikirim ke WhatsApp admin. */
export function buildContactMessage(c: WhatsAppContactInput): string {
  const lines = [
    "Halo JahitPakaian, saya ingin bertanya.",
    "",
    `Nama: ${c.name}`,
    `No. WhatsApp: ${c.phone}`,
  ];
  if (c.email) lines.push(`Email: ${c.email}`);
  lines.push(`Subjek: ${c.subject}`, "", c.message);
  return lines.join("\n");
}

/** Buat link wa.me ke nomor bisnis dengan pertanyaan dari formulir Hubungi Kami terisi otomatis. */
export async function getContactWhatsAppLink(c: WhatsAppContactInput): Promise<string | null> {
  const settings = await getBusinessSettingsRemote();
  return buildWhatsAppLink(settings, buildContactMessage(c));
}