-- AlterTable
ALTER TABLE "Negocio" ADD COLUMN     "acaoPrincipal" TEXT NOT NULL DEFAULT 'whatsapp',
ADD COLUMN     "ctaItem" TEXT NOT NULL DEFAULT 'Tenho interesse',
ADD COLUMN     "fatos" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "rotuloItem" TEXT NOT NULL DEFAULT 'item';
