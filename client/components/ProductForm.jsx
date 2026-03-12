import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    stockCount: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    returnEligibility: true,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [valErrors, setValErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || '',
        stockCount: product.stockCount !== undefined ? product.stockCount : '',
        mrp: product.mrp !== undefined ? product.mrp : '',
        sellingPrice: product.sellingPrice !== undefined ? product.sellingPrice : '',
        brandName: product.brandName || '',
        returnEligibility: product.returnEligibility !== undefined ? product.returnEligibility : true,
      });
      setImages(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      images.forEach(item => {
        if (typeof item !== 'string' && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [images]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'returnEligibility') {
      val = value === 'Yes';
    }
    setFormData({
      ...formData,
      [name]: val,
    });
    // Clear validation error on change
    if (valErrors[name]) {
      setValErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;

    if (totalImages > 7) {
      setError('You can select a maximum of 7 images in total.');
      return;
    }
    setError('');

    const mappedFiles = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...mappedFiles]);
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    const item = images[indexToRemove];
    if (typeof item !== 'string' && item.preview) {
      URL.revokeObjectURL(item.preview);
    }
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.toString().trim()) errs.name = 'Please enter product name';
    if (!formData.type?.toString().trim()) errs.type = 'Please enter product type';
    if (formData.stockCount === '' || formData.stockCount === null) errs.stockCount = 'Please enter quantity stock';
    if (formData.mrp === '' || formData.mrp === null) errs.mrp = 'Please enter MRP';
    if (formData.sellingPrice === '' || formData.sellingPrice === null) errs.sellingPrice = 'Please enter selling price';

    setValErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('type', formData.type);
    payload.append('brandName', formData.brandName);
    payload.append('stockCount', Number(formData.stockCount));
    payload.append('mrp', Number(formData.mrp));
    payload.append('sellingPrice', Number(formData.sellingPrice));
    payload.append('returnEligibility', formData.returnEligibility);

    try {
      if (product) {
        images.forEach(item => {
          if (typeof item === 'string') {
            payload.append('existingImages', item);
          } else {
            payload.append('images', item);
          }
        });

        await api.put(`/products/${product.productId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        images.forEach(item => {
          if (typeof item !== 'string') {
            payload.append('images', item);
          }
        });
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-[480px] rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg shrink-0">
          <h2 className="text-[17px] font-semibold text-slate-700">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <form id="product-form" onSubmit={handleSubmit} className="space-y-[18px]">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`w-full bg-white border rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 ${valErrors.name ? 'border-[#ff6b6b] focus:ring-[#ff6b6b]' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              {valErrors.name && <p className="text-[#ff6b6b] text-xs mt-1.5">{valErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Product Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full bg-white border rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 appearance-none ${valErrors.type ? 'border-[#ff6b6b] focus:ring-[#ff6b6b]' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23475569"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option value="" disabled hidden>Select product type</option>
                <option value="foods">Foods</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothes</option>
                <option value="beautyProducts">Beauty Products</option>
                <option value="other">Other</option>
              </select>
              {valErrors.type && <p className="text-[#ff6b6b] text-xs mt-1.5">{valErrors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Quantity Stock</label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleChange}
                placeholder="Total number of Stock available"
                className={`w-full bg-white border rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 ${valErrors.stockCount ? 'border-[#ff6b6b] focus:ring-[#ff6b6b]' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              {valErrors.stockCount && <p className="text-[#ff6b6b] text-xs mt-1.5">{valErrors.stockCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">MRP</label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="MRP of one unit"
                className={`w-full bg-white border rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 ${valErrors.mrp ? 'border-[#ff6b6b] focus:ring-[#ff6b6b]' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              {valErrors.mrp && <p className="text-[#ff6b6b] text-xs mt-1.5">{valErrors.mrp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Selling price of one unit"
                className={`w-full bg-white border rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 ${valErrors.sellingPrice ? 'border-[#ff6b6b] focus:ring-[#ff6b6b]' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              {valErrors.sellingPrice && <p className="text-[#ff6b6b] text-xs mt-1.5">{valErrors.sellingPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Brand Name</label>
              <input
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Brand of the product"
                className="w-full bg-white border border-gray-200 rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-black">Upload Product Images</label>
                {images.length > 0 && (
                  <label className="text-sm font-medium text-slate-500 cursor-pointer hover:text-black">
                    Add More Photos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="border border-dashed border-gray-200 rounded-lg p-3 min-h-[90px] flex gap-3 flex-wrap items-center">
                {images.length === 0 && (
                  <div className="w-full flex-1 flex flex-col items-center justify-center gap-1 cursor-pointer relative py-2 min-h-[70px]">
                    <span className="text-sm text-gray-500">Upload up to 7 product images</span>
                    <span className="text-sm font-medium text-black">Browse</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                )}
                {images.map((item, index) => {
                  const isExisting = typeof item === 'string';
                  const src = isExisting ? item : item.preview;

                  return (
                    <div key={`img-${index}`} className="relative group w-[60px] h-[60px] rounded border border-gray-200 bg-white flex-shrink-0">
                      <img src={src} alt="Preview" className="w-full h-full object-contain p-[2px]" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-[5px] -right-[5px] bg-white border border-gray-200 shadow-sm rounded-full w-[16px] h-[16px] flex items-center justify-center text-slate-500 hover:text-[#ff6b6b] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Exchange or return eligibility</label>
              <select
                name="returnEligibility"
                value={formData.returnEligibility ? 'Yes' : 'No'}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-md py-[9px] px-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-black"
                style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23475569"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 flex justify-end shrink-0 bg-gray-100 rounded-b-lg">
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-[10px] rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '...' : product ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
