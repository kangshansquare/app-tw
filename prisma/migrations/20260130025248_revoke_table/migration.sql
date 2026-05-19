/*
  Warnings:

  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cloud_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cloud_accounts` DROP FOREIGN KEY `cloud_accounts_providerId_fkey`;

-- DropTable
DROP TABLE `Region`;

-- DropTable
DROP TABLE `cloud_accounts`;

-- CreateTable
CREATE TABLE `CloudAccount` (
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

-- AddForeignKey
ALTER TABLE `CloudAccount` ADD CONSTRAINT `CloudAccount_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
