/*
  Warnings:

  - You are about to drop the column `razorpayOrderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPaymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpaySignature` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "total" REAL NOT NULL,
    "gst" REAL NOT NULL DEFAULT 0,
    "grandTotal" REAL NOT NULL DEFAULT 0,
    "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "cashfreeOrderId" TEXT,
    "cashfreePaymentId" TEXT,
    "cashfreePaymentSessionId" TEXT,
    "paymentError" TEXT,
    "orderType" TEXT NOT NULL DEFAULT 'DINE_IN',
    "tableNumber" TEXT,
    "specialNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "customerEmail", "customerName", "customerPhone", "grandTotal", "gst", "id", "orderType", "paymentError", "paymentMethod", "paymentStatus", "specialNote", "status", "tableNumber", "total", "updatedAt", "userId") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "grandTotal", "gst", "id", "orderType", "paymentError", "paymentMethod", "paymentStatus", "specialNote", "status", "tableNumber", "total", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_cashfreeOrderId_key" ON "Order"("cashfreeOrderId");
CREATE UNIQUE INDEX "Order_cashfreePaymentId_key" ON "Order"("cashfreePaymentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
