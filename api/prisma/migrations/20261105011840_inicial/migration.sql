-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT '',
    "preco" DECIMAL(12,2),
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "categoriaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagemItem" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "capa" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImagemItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtributoItem" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "AtributoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "itemId" INTEGER,
    "atendido" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negocio" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nome" TEXT NOT NULL,
    "slogan" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "logoPublicId" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#1d4ed8',
    "corSecundaria" TEXT NOT NULL DEFAULT '#0f172a',
    "estiloTitulo" TEXT NOT NULL DEFAULT 'sans',
    "whatsapp" TEXT NOT NULL,
    "telefone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "endereco" TEXT NOT NULL DEFAULT '',
    "cidade" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "rotuloItens" TEXT NOT NULL DEFAULT 'Itens',
    "heroTitulo" TEXT NOT NULL DEFAULT '',
    "heroSubtitulo" TEXT NOT NULL DEFAULT '',
    "heroImagemUrl" TEXT,
    "heroPublicId" TEXT,
    "sobreTitulo" TEXT NOT NULL DEFAULT '',
    "sobreTexto" TEXT NOT NULL DEFAULT '',
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Negocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "nome" TEXT NOT NULL DEFAULT '',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");

-- CreateIndex
CREATE INDEX "Item_ativo_categoriaId_idx" ON "Item"("ativo", "categoriaId");

-- CreateIndex
CREATE INDEX "Item_ativo_destaque_idx" ON "Item"("ativo", "destaque");

-- CreateIndex
CREATE INDEX "ImagemItem_itemId_ordem_idx" ON "ImagemItem"("itemId", "ordem");

-- CreateIndex
CREATE INDEX "AtributoItem_itemId_ordem_idx" ON "AtributoItem"("itemId", "ordem");

-- CreateIndex
CREATE INDEX "Lead_atendido_criadoEm_idx" ON "Lead"("atendido", "criadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagemItem" ADD CONSTRAINT "ImagemItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtributoItem" ADD CONSTRAINT "AtributoItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
