/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `pdfUrl` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
