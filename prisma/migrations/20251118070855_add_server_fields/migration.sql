/*
  Warnings:

  - Added the required column `cabinetId` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpuCores` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpuModel` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diskTotal` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostname` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idcId` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kernelVersion` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `macAddress` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoryGB` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privateIp` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicIp` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Server` ADD COLUMN `cabinetId` INTEGER NOT NULL,
    ADD COLUMN `cpuCores` INTEGER NOT NULL,
    ADD COLUMN `cpuModel` VARCHAR(191) NOT NULL,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `diskTotal` VARCHAR(191) NOT NULL,
    ADD COLUMN `hostname` VARCHAR(191) NOT NULL,
    ADD COLUMN `idcId` INTEGER NOT NULL,
    ADD COLUMN `kernelVersion` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastSyncAt` DATETIME(3) NULL,
    ADD COLUMN `macAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `memoryGB` INTEGER NOT NULL,
    ADD COLUMN `os` VARCHAR(191) NOT NULL,
    ADD COLUMN `privateIp` VARCHAR(191) NOT NULL,
    ADD COLUMN `publicIp` VARCHAR(191) NOT NULL,
    ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL,
    ADD COLUMN `vendor` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Server` ADD CONSTRAINT `Server_idcId_fkey` FOREIGN KEY (`idcId`) REFERENCES `Idc`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Server` ADD CONSTRAINT `Server_cabinetId_fkey` FOREIGN KEY (`cabinetId`) REFERENCES `Cabinet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
