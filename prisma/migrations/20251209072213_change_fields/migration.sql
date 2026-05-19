/*
  Warnings:

  - You are about to drop the column `provider_id` on the `Region` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_code,region_id]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_code` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Region` DROP FOREIGN KEY `Region_provider_id_fkey`;

-- DropIndex
DROP INDEX `CloudProvider_code_key` ON `CloudProvider`;

-- DropIndex
DROP INDEX `Region_provider_id_fkey` ON `Region`;

-- AlterTable
ALTER TABLE `Region` DROP COLUMN `provider_id`,
    ADD COLUMN `provider_code` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `CloudProvider_code_idx` ON `CloudProvider`(`code`);

-- CreateIndex
CREATE INDEX `Region_provider_code_idx` ON `Region`(`provider_code`);

-- CreateIndex
CREATE UNIQUE INDEX `Region_provider_code_region_id_key` ON `Region`(`provider_code`, `region_id`);
