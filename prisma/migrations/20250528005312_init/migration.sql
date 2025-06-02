/*
  Warnings:

  - You are about to drop the column `notifyEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `notifySMS` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `subscribeNews` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `notifyEmail`,
    DROP COLUMN `notifySMS`,
    DROP COLUMN `subscribeNews`,
    ADD COLUMN `newsletterSubscribed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `phone` VARCHAR(191) NULL;
