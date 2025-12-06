import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange }) => {
  
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'headerImage' | 'footerImage') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Branding Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Branding</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Header Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'headerImage')}
                className="hidden"
                id="header-upload"
              />
              <label 
                htmlFor="header-upload"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-red hover:bg-red-50 transition-colors"
              >
                {data.headerImage ? (
                  <img src={data.headerImage} alt="Header Preview" className="h-12 object-contain" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500">Upload Header</span>
                  </>
                )}
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Footer Image</label>
             <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'footerImage')}
                className="hidden"
                id="footer-upload"
              />
              <label 
                htmlFor="footer-upload"
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-red hover:bg-red-50 transition-colors"
              >
                {data.footerImage ? (
                  <img src={data.footerImage} alt="Footer Preview" className="h-12 object-contain" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500">Upload Footer</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Invoice #</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
            />
          </div>
        </div>

        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
           <input
             type="text"
             value={data.billToName}
             onChange={(e) => updateField('billToName', e.target.value)}
             className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
             placeholder="Ascent Business Solutions"
           />
        </div>

        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">Client Address</label>
           <textarea
             value={data.billToAddress}
             onChange={(e) => updateField('billToAddress', e.target.value)}
             className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
             rows={2}
             placeholder="Temple Rd, Ja-Ela"
           />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
           <h2 className="text-lg font-bold text-gray-800">Items</h2>
           <button 
             onClick={addItem}
             className="flex items-center gap-1 text-xs bg-brand-red text-white px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-transform"
           >
             <Plus size={14} /> Add Item
           </button>
        </div>
        
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 relative group">
              <button 
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="space-y-3 pr-6">
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase">Description</label>
                   <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full p-1 border-b border-gray-200 focus:border-brand-red focus:outline-none bg-transparent font-medium text-gray-900"
                    placeholder="Item name"
                   />
                </div>
                <div className="flex gap-4">
                   <div className="w-20">
                     <label className="block text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                     <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full p-1 border-b border-gray-200 focus:border-brand-red focus:outline-none bg-transparent text-gray-900 font-medium"
                     />
                   </div>
                   <div className="flex-1">
                     <label className="block text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                     <div className="relative">
                       <span className="absolute left-0 top-1 text-gray-400 text-sm">Rs</span>
                       <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full pl-6 p-1 border-b border-gray-200 focus:border-brand-red focus:outline-none bg-transparent text-gray-900 font-medium"
                       />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Summary</h2>
        
        <div>
           <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
           <input
             type="text"
             value={data.notes}
             onChange={(e) => updateField('notes', e.target.value)}
             className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
             placeholder="e.g. Lean Six Sigma Program"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Delivery Fee</label>
             <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">Rs</span>
                <input
                  type="number"
                  value={data.deliveryFee}
                  onChange={(e) => updateField('deliveryFee', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
                />
             </div>
          </div>
          <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Discount</label>
             <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400 text-sm">Rs</span>
                <input
                  type="number"
                  value={data.discount}
                  onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 p-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-red focus:outline-none transition-all text-gray-900 font-medium"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;