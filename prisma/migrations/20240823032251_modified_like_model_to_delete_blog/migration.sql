-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `Likes_blogId_fkey`;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
