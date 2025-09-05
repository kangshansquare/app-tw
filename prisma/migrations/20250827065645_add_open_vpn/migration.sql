-- CreateTable
CREATE TABLE `openVPN` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '-',
    `sector` VARCHAR(191) NOT NULL DEFAULT '-',
    `account_ip` VARCHAR(191) NOT NULL,
    `apply_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dest_ip` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL DEFAULT '工作需要',
    `apply_duration` VARCHAR(191) NOT NULL DEFAULT '永久',
    `status` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '-',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
