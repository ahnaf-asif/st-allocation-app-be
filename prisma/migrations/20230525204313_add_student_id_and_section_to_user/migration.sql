/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "section" INTEGER,
ADD COLUMN     "student_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_student_id_key" ON "User"("student_id");
