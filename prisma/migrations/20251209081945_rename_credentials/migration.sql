/*
  Warnings:

  - You are about to drop the `CreDentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CreDentials` DROP FOREIGN KEY `CreDentials_provider_id_fkey`;

-- DropTable
DROP TABLE `CreDentials`;

-- CreateTable
CREATE TABLE `Credentials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_id` INTEGER NOT NULL,
    `access_key_id` VARCHAR(191) NOT NULL,
    `secret_access_key` VARCHAR(191) NOT NULL,
    `region_id` VARCHAR(191) NOT NULL,
    `is_valid` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Credentials` ADD CONSTRAINT `Credentials_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
