/*
  Warnings:

  - Added the required column `authorEmail` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Blog` ADD COLUMN `authorEmail` VARCHAR(255) NOT NULL,
    ADD COLUMN `authorId` VARCHAR(255) NOT NULL,
    ADD COLUMN `authorName` VARCHAR(255) NOT NULL;
