import React, { forwardRef } from 'react';
import { InvoiceData } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface InvoiceTemplateProps {
  data: InvoiceData;
}

// Using forwardRef to allow the parent to capture this component for PDF generation
const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ data }, ref) => {
  
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const total = subtotal + data.deliveryFee - data.discount;

  return (
    <div ref={ref} className="bg-white w-[794px] min-h-[1123px] relative text-sm text-gray-800 shadow-none overflow-hidden flex flex-col">
      
      {/* Header Section - Replaced with Image */}
      <div className="w-full">
        {data.headerImage ? (
          <img src={data.headerImage} alt="Header" className="w-full h-auto object-contain" />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 border-b">
            <span className="italic">No Header Image Uploaded</span>
          </div>
        )}
      </div>

      {/* Invoice Info Section */}
      <div className="px-12 py-8 grid grid-cols-2 gap-12">
        <div>
          <h3 className="text-gray-600 font-bold mb-1 text-lg">Invoice To</h3>
          <p className="font-semibold text-gray-800 text-lg">{data.billToName || 'Client Name'}</p>
          <p className="text-gray-500 whitespace-pre-wrap">{data.billToAddress || 'Address Line 1\nCity, Country'}</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
           <div>
             <h3 className="text-gray-600 font-bold mb-1 text-lg">Invoice #</h3>
             <p className="text-gray-500 text-lg">{data.invoiceNumber}</p>
           </div>
           <div>
             <h3 className="text-gray-600 font-bold mb-1 text-lg">Date</h3>
             <p className="text-gray-500 text-lg">{formatDate(data.date)}</p>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-12 mt-4 flex-grow">
        <table className="w-full">
          <thead>
            <tr className="bg-[#9c1515] text-brand-yellow">
              <th className="py-3 px-4 text-left font-bold uppercase tracking-wide w-1/2">Description</th>
              <th className="py-3 px-4 text-center font-bold uppercase tracking-wide">Qty</th>
              <th className="py-3 px-4 text-right font-bold uppercase tracking-wide">Unit price</th>
              <th className="py-3 px-4 text-right font-bold uppercase tracking-wide">Total price</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-3 px-4 border-b border-gray-100">{item.description}</td>
                <td className="py-3 px-4 text-center border-b border-gray-100">{item.quantity}</td>
                <td className="py-3 px-4 text-right border-b border-gray-100">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 px-4 text-right border-b border-gray-100 font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
            {/* Empty rows filler to maintain look if few items */}
             {data.items.length < 5 && Array.from({ length: 5 - data.items.length }).map((_, i) => (
               <tr key={`empty-${i}`} className="bg-white">
                 <td className="py-3 px-4 border-b border-gray-100">&nbsp;</td>
                 <td className="border-b border-gray-100"></td>
                 <td className="border-b border-gray-100"></td>
                 <td className="border-b border-gray-100"></td>
               </tr>
             ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex mt-6">
          <div className="w-1/2 pr-8">
            <div className="flex gap-2">
              <span className="font-bold text-gray-800">Notes:</span>
              <p className="text-gray-600 text-sm">{data.notes}</p>
            </div>
          </div>
          <div className="w-1/2 pl-8 flex flex-col gap-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-800 font-medium">Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between items-center py-1 text-red-600">
                <span className="font-medium">Discount</span>
                <span className="font-bold">-{formatCurrency(data.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-800 font-medium">Delivery</span>
              <span className="font-bold text-gray-900">{formatCurrency(data.deliveryFee)}</span>
            </div>
            <div className="flex justify-between items-center bg-brand-yellow px-4 py-2 mt-2 -mx-4 shadow-sm">
              <span className="font-bold text-gray-900 text-lg uppercase">Total:</span>
              <span className="font-bold text-gray-900 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Replaced with Image */}
      <div className="mt-auto w-full">
        {data.footerImage ? (
           <img src={data.footerImage} alt="Footer" className="w-full h-auto object-contain" />
        ) : (
           <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 border-t">
              <span className="italic">No Footer Image Uploaded</span>
           </div>
        )}
      </div>
    </div>
  );
});

export default InvoiceTemplate;