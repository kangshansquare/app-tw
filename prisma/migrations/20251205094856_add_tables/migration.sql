-- CreateTable
CREATE TABLE `CloudProvider` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CloudProvider_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider_id` INTEGER NOT NULL,
    `region_id` VARCHAR(191) NOT NULL,
    `name_zh` VARCHAR(191) NOT NULL,
    `name_en` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'deprecated', 'hidden') NOT NULL DEFAULT 'active',
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Region_region_id_key`(`region_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreDentials` (
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
ALTER TABLE `Region` ADD CONSTRAINT `Region_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreDentials` ADD CONSTRAINT `CreDentials_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `CloudProvider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
