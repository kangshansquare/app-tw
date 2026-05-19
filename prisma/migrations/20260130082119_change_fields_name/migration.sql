/*
  Warnings:

  - You are about to drop the column `label` on the `CloudProvider` table. All the data in the column will be lost.
  - Added the required column `provider` to the `CloudProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CloudProvider_name_key` ON `CloudProvider`;

-- AlterTable
ALTER TABLE `CloudProvider` DROP COLUMN `label`,
    ADD COLUMN `provider` VARCHAR(191) NOT NULL;
