/*
  Warnings:

  - Added the required column `object` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contactmessage` ADD COLUMN `object` VARCHAR(191) NOT NULL;
