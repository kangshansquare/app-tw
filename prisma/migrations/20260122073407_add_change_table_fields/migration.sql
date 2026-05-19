/*
  Warnings:

  - You are about to drop the column `code` on the `CloudProvider` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `CloudProvider` table. All the data in the column will be lost.
  - You are about to drop the column `is_enabled` on the `CloudProvider` table. All the data in the column will be lost.
  - Added the required column `label` to the `CloudProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CloudProvider_code_idx` ON `CloudProvider`;

-- AlterTable
ALTER TABLE `CloudProvider` DROP COLUMN `code`,
    DROP COLUMN `createAt`,
    DROP COLUMN `is_enabled`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `cloud_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `environment` VARCHAR(191) NOT NULL,
    `access_key_id` VARCHAR(191) NULL,
    `secret_access_key` VARCHAR(191) NULL,
    `enableRegionIds` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CloudRegion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `providerId` INTEGER NOT NULL,
    `regionId` INTEGER NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `name_zh` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'deprecated', 'hidden') NOT NULL DEFAULT 'active',

    UNIQUE INDEX `CloudRegion_providerId_regionId_key`(`providerId`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cloud_accounts` ADD CONSTRAINT `cloud_accounts_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CloudRegion` ADD CONSTRAINT `CloudRegion_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
