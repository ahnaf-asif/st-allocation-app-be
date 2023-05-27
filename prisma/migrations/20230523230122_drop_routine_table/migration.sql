/*
  Warnings:

  - You are about to drop the `Routine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_mondayRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_saturdayRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_sundayRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_thursdayRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_tuesdayRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_userId_fkey";

-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_wednesdayRoomId_fkey";

-- DropTable
DROP TABLE "Routine";

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "dayId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Day_id_key" ON "Day"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Day_name_key" ON "Day"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Period_id_key" ON "Period"("id");

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
