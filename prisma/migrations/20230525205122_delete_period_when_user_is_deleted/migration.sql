-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_userId_fkey";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
