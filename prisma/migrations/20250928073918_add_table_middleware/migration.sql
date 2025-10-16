-- CreateTable
CREATE TABLE `Middleware` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `service_line` VARCHAR(191) NOT NULL,
    `deploy_mode` VARCHAR(191) NOT NULL,
    `ip_port` VARCHAR(191) NULL,
    `cluster_config` JSON NULL,
    `description` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Middleware` ADD CONSTRAINT `Middleware_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
