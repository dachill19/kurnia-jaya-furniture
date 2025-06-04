/*
  Warnings:

  - You are about to drop the column `alamatLengkap` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `kodePos` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `kota` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `Address` table. All the data in the column will be lost.
  - Added the required column `city` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullAddress` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrict` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `village` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "alamatLengkap",
DROP COLUMN "kodePos",
DROP COLUMN "kota",
DROP COLUMN "provinsi",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "fullAddress" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "recipient" TEXT NOT NULL,
ADD COLUMN     "subdistrict" TEXT NOT NULL,
ADD COLUMN     "village" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
