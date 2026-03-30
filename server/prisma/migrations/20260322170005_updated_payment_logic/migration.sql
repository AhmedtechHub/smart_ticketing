/*
  Warnings:

  - A unique constraint covering the columns `[checkoutRequestId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Verification_identifier_value_key` ON `verification`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `checkoutRequestId` VARCHAR(191) NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `verification` MODIFY `value` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_checkoutRequestId_key` ON `Booking`(`checkoutRequestId`);
