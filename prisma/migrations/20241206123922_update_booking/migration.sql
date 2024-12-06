-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "seatNumber" DROP NOT NULL;
