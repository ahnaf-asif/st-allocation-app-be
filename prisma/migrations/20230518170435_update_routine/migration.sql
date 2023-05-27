-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_saturdayRoomId_fkey";

-- AlterTable
ALTER TABLE "Routine" ALTER COLUMN "saturdayRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_saturdayRoomId_fkey" FOREIGN KEY ("saturdayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
