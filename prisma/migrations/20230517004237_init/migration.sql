-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false,
    "course" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "saturdayFrom" TIMESTAMP(3),
    "saturdayTo" TIMESTAMP(3),
    "saturdayRoomId" INTEGER NOT NULL,
    "sundayFrom" TIMESTAMP(3),
    "sundayTo" TIMESTAMP(3),
    "sundayRoomId" INTEGER,
    "mondayFrom" TIMESTAMP(3),
    "mondayTo" TIMESTAMP(3),
    "mondayRoomId" INTEGER,
    "tuesdayFrom" TIMESTAMP(3),
    "tuesdayTo" TIMESTAMP(3),
    "tuesdayRoomId" INTEGER,
    "wednesdayFrom" TIMESTAMP(3),
    "wednesdayTo" TIMESTAMP(3),
    "wednesdayRoomId" INTEGER,
    "thursdayFrom" TIMESTAMP(3),
    "thursdayTo" TIMESTAMP(3),
    "thursdayRoomId" INTEGER,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "Room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_id_key" ON "Routine"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_userId_key" ON "Routine"("userId");

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_saturdayRoomId_fkey" FOREIGN KEY ("saturdayRoomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_sundayRoomId_fkey" FOREIGN KEY ("sundayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_mondayRoomId_fkey" FOREIGN KEY ("mondayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_tuesdayRoomId_fkey" FOREIGN KEY ("tuesdayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_wednesdayRoomId_fkey" FOREIGN KEY ("wednesdayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_thursdayRoomId_fkey" FOREIGN KEY ("thursdayRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
