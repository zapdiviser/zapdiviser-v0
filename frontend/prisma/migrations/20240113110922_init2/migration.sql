-- DropForeignKey
ALTER TABLE "RedirectUrl" DROP CONSTRAINT "RedirectUrl_redirectId_fkey";

-- AddForeignKey
ALTER TABLE "RedirectUrl" ADD CONSTRAINT "RedirectUrl_redirectId_fkey" FOREIGN KEY ("redirectId") REFERENCES "Redirect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
