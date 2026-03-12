import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Package, Box, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Image Viewer State
  const [viewingImages, setViewingImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get(`/products?search=${searchTerm}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/products/${id}/publish`);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 h-full bg-white flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.3333 5.66663H11.3333C8.20372 5.66663 5.66667 8.20368 5.66667 11.3333V28.3333C5.66667 31.4629 8.20372 34 11.3333 34H28.3333C31.4629 34 34 31.4629 34 28.3333V11.3333C34 8.20368 31.4629 5.66663 28.3333 5.66663Z" stroke="#0e175b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M62.3333 5.66663H45.3333C42.2037 5.66663 39.6667 8.20368 39.6667 11.3333V28.3333C39.6667 31.4629 42.2037 34 45.3333 34H62.3333C65.4629 34 68 31.4629 68 28.3333V11.3333C68 8.20368 65.4629 5.66663 62.3333 5.66663Z" stroke="#0e175b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28.3333 39.6666H11.3333C8.20372 39.6666 5.66667 42.2037 5.66667 45.3333V62.3333C5.66667 65.4629 8.20372 68 11.3333 68H28.3333C31.4629 68 34 65.4629 34 62.3333V45.3333C34 42.2037 31.4629 39.6666 28.3333 39.6666Z" stroke="#0e175b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M39.6667 53.8333H68" stroke="#0e175b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M53.8333 39.6666V68" stroke="#0e175b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#475467] mt-3">Feels a little empty over here...</h3>
          <p className="text-[#98a2b3] mt-2 text-sm max-w-[280px]">You can create products without connecting store<br/>you can add products to store anytime</p>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="mt-6 bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-sm"
          >
            Add your Products
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onTogglePublish={handleTogglePublish}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewImages={(images) => {
                  setViewingImages(images);
                  setCurrentImageIndex(0);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal for Product Form */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            fetchProducts();
          }}
        />
      )}

      {/* Image Viewer Modal */}
      {viewingImages && viewingImages.length > 0 && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 italic">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setViewingImages(null)}></div>
          
          <button 
            onClick={() => setViewingImages(null)}
            className="absolute top-6 right-6 z-10 p-2 bg-slate-800/80 hover:bg-red-500 text-slate-300 hover:text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center">
            {viewingImages.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev === 0 ? viewingImages.length - 1 : prev - 1);
                }}
                className="absolute left-4 z-10 p-3 bg-slate-800/80 hover:bg-cyan-500 text-white rounded-full transition-colors backdrop-blur-sm shadow-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img 
              src={viewingImages[currentImageIndex].startsWith('/') ? `http://localhost:5000${viewingImages[currentImageIndex]}` : viewingImages[currentImageIndex]} 
              alt="Product gallery" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {viewingImages.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev === viewingImages.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 z-10 p-3 bg-slate-800/80 hover:bg-cyan-500 text-white rounded-full transition-colors backdrop-blur-sm shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Pagination Indicators */}
            {viewingImages.length > 1 && (
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
               {viewingImages.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setCurrentImageIndex(idx)}
                   className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-cyan-400 w-8' : 'bg-slate-600 hover:bg-slate-400'}`}
                 />
               ))}
             </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
