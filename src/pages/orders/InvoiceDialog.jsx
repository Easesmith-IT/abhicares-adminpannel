import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const InvoiceDialog = ({ open, setOpen, pdfUrl }) => {
  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "invoice.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);

      // fallback
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        {/* Header with Download */}
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Invoice Preview</DialogTitle>

          <Button
            variant="outline"
            className="mr-5"
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogHeader>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="Invoice PDF"
              className="w-full h-full rounded-md border"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No invoice available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
