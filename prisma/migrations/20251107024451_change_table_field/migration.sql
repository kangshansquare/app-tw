/*
  Warnings:

  - You are about to alter the column `powerKw` on the `Cabinet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Cabinet` MODIFY `powerKw` VARCHAR(191) NULL;
