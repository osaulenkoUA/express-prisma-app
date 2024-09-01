-- CreateTable
CREATE TABLE "networks" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" DECIMAL(10,2),
    "alias" TEXT,
    "description" TEXT,
    "features" TEXT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "networks_number_key" ON "networks"("number");
