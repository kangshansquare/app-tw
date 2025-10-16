/*
  Warnings:

  - You are about to drop the column `userId` on the `Middleware` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Middleware` DROP FOREIGN KEY `Middleware_userId_fkey`;

-- DropIndex
DROP INDEX `Middleware_userId_fkey` ON `Middleware`;

-- AlterTable
ALTER TABLE `Middleware` DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `Middleware` ADD CONSTRAINT `Middleware_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
