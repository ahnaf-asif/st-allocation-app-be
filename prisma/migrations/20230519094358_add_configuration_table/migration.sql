-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "updateRoutineDeadline" TIMESTAMP(3),

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_id_key" ON "Configuration"("id");
