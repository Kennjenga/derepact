-- CreateTable
CREATE TABLE "user" (
    "uid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);
