import React, { useState, useRef } from 'react';
import { Download, Edit2, Eye, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvoiceTemplate from './components/InvoiceTemplate';
import InvoiceEditor from './components/InvoiceEditor';
import { InvoiceData } from './types';

const INITIAL_DATA: InvoiceData = {
  invoiceNumber: '1572',
  date: new Date().toISOString().split('T')[0],
  billToName: 'Ascent Business Solutions',
  billToAddress: 'Temple Rd, Ja-Ela',
  items: [
    { id: '1', description: 'Fried Rice (Non-veg)', quantity: 39, unitPrice: 700.00 },
    { id: '2', description: 'Fried Rice (Veg)', quantity: 3, unitPrice: 400.00 }
  ],
  notes: 'Lean Six Sigma Program',
  deliveryFee: 490.00,
  discount: 0,
  headerImage: '',
  footerImage: ''
};

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(INITIAL_DATA);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref specifically for PDF generation - located off-screen
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      // Use the off-screen print ref which is always full size (A4)
      const element = printRef.current;
      if (!element) {
        throw new Error("Print template not found");
      }

      // Important: Use windowWidth option to force desktop layout rendering
      // This prevents the mobile viewport from squashing the layout during capture
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // For images
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200 // Force a desktop window width to prevent mobile layout shifts
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height maintaining aspect ratio
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`Invoice_${data.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-red p-1.5 rounded-lg">
               <span className="font-script text-white font-bold text-lg leading-none">L</span>
            </div>
            <h1 className="font-bold text-gray-800">Luman's Invoice</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label={mode === 'edit' ? "Preview" : "Edit"}
            >
              {mode === 'edit' ? <Eye size={20} /> : <Edit2 size={20} />}
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all shadow-md active:scale-95 ${
                isGenerating ? 'bg-gray-400 cursor-wait' : 'bg-brand-yellow hover:bg-yellow-500 text-gray-900'
              }`}
            >
              {isGenerating ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Download size={18} />
                  <span className="hidden sm:inline">Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        
        {mode === 'edit' ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <InvoiceEditor data={data} onChange={setData} />
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
             <div className="w-full overflow-x-auto no-scrollbar flex justify-center pb-8">
               {/* 
                 Scale wrapper: 
                 On mobile, we scale down the A4 container so it fits the width for PREVIEW ONLY.
                 The actual PDF generation uses the hidden InvoiceTemplate below.
               */}
               <div className="origin-top transform scale-[0.45] sm:scale-75 md:scale-100 transition-transform duration-300">
                  <InvoiceTemplate data={data} />
               </div>
             </div>
             
             <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg flex items-center gap-2 z-40 opacity-90">
               <AlertCircle size={14} className="text-brand-yellow" />
               <span>Preview Mode - Scale may vary on screen</span>
             </div>
          </div>
        )}

      </main>

      {/* 
        HIDDEN PRINT TEMPLATE
        This is what actually gets captured for the PDF.
        It is positioned off-screen but kept in the DOM so html2canvas can render it.
        We force the width to 794px (A4) to ensure consistency regardless of device screen size.
      */}
      <div style={{ position: 'absolute', top: -10000, left: -10000, width: '794px', height: '1123px', overflow: 'hidden' }}>
        <InvoiceTemplate ref={printRef} data={data} />
      </div>
    </div>
  );
};

export default App;