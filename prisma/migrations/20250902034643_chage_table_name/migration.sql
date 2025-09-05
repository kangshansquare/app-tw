/*
  Warnings:

  - You are about to drop the `openVPN` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `openVPN`;

-- CreateTable
CREATE TABLE `OpenVPN` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '-',
    `sector` VARCHAR(191) NOT NULL DEFAULT '-',
    `account_ip` VARCHAR(191) NOT NULL,
    `apply_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dest_ip` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL DEFAULT '工作需要',
    `apply_duration` VARCHAR(191) NOT NULL DEFAULT '永久',
    `status` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '-',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
