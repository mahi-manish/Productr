import React, { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({ product, onTogglePublish, onEdit, onDelete, onViewImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const imageUrl = hasImages
    ? images[currentImageIndex]
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col p-4">
      {/* Image Carousel */}
      <div
        className="relative h-56 bg-[#f8f9fa] rounded-xl overflow-hidden group cursor-pointer border border-gray-100"
        onClick={() => hasImages && onViewImages(product.images)}
      >
        {hasImages ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}

        {/* Navigation Arrows (Visible on Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center mt-[-14px] z-10 relative">
        {images.length > 1 && (
          <div className="flex gap-2 px-3 py-1.5 border border-gray-100 rounded-full bg-white shadow-sm">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-[#ff5722]' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 mt-3 space-y-3">
        <h3 className="text-[16px] font-bold text-black line-clamp-1">{product.name}</h3>

        <div className="space-y-[6px] text-[14px]">
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Product type -</span>
            <span className="text-[#101828] text-right capitalize">{product.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Quantity Stock -</span>
            <span className="text-[#101828] text-right">{product.stockCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">MRP-</span>
            <span className="text-[#101828] text-right">₹ {product.mrp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Selling Price -</span>
            <span className="text-[#101828] text-right">₹ {product.sellingPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Brand Name -</span>
            <span className="text-[#101828] text-right truncate max-w-[140px]">{product.brandName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Total Number of images -</span>
            <span className="text-[#101828] text-right">{images.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#98a2b3]">Exchange Eligibility -</span>
            <span className="text-[#101828] text-right">{product.returnEligibility ? 'YES' : 'NO'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => onTogglePublish(product.productId)}
          className={`flex-[1.5] py-2 rounded-lg font-semibold text-sm transition-colors ${product.published
            ? 'bg-[#10b981] hover:bg-[#059669] text-white'
            : 'bg-[#1d4ed8] hover:bg-[#1e40af] text-white'
            }`}
        >
          {product.published ? 'Unpublish' : 'Publish'}
        </button>

        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-2 flex items-center justify-center gap-2 border border-gray-300 rounded-lg text-black font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(product.productId)}
          className="w-[42px] h-[40px] flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
