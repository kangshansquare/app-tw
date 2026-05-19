/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Server_serialNumber_key` ON `Server`(`serialNumber`);
