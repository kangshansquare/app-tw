/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,name]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Credentials` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Credentials_provider_id_name_key` ON `Credentials`(`provider_id`, `name`);
