/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CloudProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CloudProvider_name_key` ON `CloudProvider`(`name`);
