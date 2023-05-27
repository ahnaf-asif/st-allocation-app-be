/*
  Warnings:

  - A unique constraint covering the columns `[from]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[to]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_dayId_fkey";

-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_scheduleId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_from_key" ON "Schedule"("from");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_to_key" ON "Schedule"("to");

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
