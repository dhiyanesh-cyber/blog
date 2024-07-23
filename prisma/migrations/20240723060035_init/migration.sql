/*
  Warnings:

  - Added the required column `description` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Blog` ADD COLUMN `description` VARCHAR(255) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(255) NULL;
