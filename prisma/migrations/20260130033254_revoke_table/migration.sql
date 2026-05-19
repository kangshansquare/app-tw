/*
  Warnings:

  - You are about to drop the `Credentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Credentials` DROP FOREIGN KEY `Credentials_provider_id_fkey`;

-- DropTable
DROP TABLE `Credentials`;
