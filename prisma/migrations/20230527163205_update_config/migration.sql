/*
  Warnings:

  - Added the required column `maxPeriodsPerDay` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPeriodsPerWeek` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "maxPeriodsPerDay" INTEGER NOT NULL,
ADD COLUMN     "totalPeriodsPerWeek" INTEGER NOT NULL;
