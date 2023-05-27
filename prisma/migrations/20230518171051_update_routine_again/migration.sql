/*
  Warnings:

  - You are about to drop the column `mondayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `mondayTo` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `saturdayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `saturdayTo` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `sundayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `sundayTo` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `thursdayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `thursdayTo` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `tuesdayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `tuesdayTo` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `wednesdayFrom` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `wednesdayTo` on the `Routine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Routine" DROP CONSTRAINT "Routine_userId_fkey";

-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "mondayFrom",
DROP COLUMN "mondayTo",
DROP COLUMN "saturdayFrom",
DROP COLUMN "saturdayTo",
DROP COLUMN "sundayFrom",
DROP COLUMN "sundayTo",
DROP COLUMN "thursdayFrom",
DROP COLUMN "thursdayTo",
DROP COLUMN "tuesdayFrom",
DROP COLUMN "tuesdayTo",
DROP COLUMN "wednesdayFrom",
DROP COLUMN "wednesdayTo",
ADD COLUMN     "mondayPeriod" TEXT,
ADD COLUMN     "saturdayPeriod" TEXT,
ADD COLUMN     "sundayPeriod" TEXT,
ADD COLUMN     "thursdayPeriod" TEXT,
ADD COLUMN     "tuesdayPeriod" TEXT,
ADD COLUMN     "wednesdayPeriod" TEXT;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
