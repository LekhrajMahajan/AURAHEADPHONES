import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, UploadCloud } from 'lucide-react';
import { getOptimizedUrl } from '../../utils/cloudinary';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', color: '', price: '', discount: '', tag: '', category: 'Headphones', stock: '', img: '', images: []
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        color: product.color || '',
        price: product.price || '',
        discount: product.discount || '',
        tag: product.tag || '',
        category: product.category || 'Headphones',
        stock: product.stock || '',
        img: product.img || '',
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', color: '', price: '', discount: '', tag: '', category: 'Headphones', stock: '', img: '', images: []
      });
    }
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    const uploadedUrls = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'aura_preset');
        formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxvpvyq9z');
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxvpvyq9z'}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setFormData(prev => {
        const newImages = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          img: prev.img || uploadedUrls[0], // Set main image if empty
          images: newImages
        };
      });
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Image upload failed. Please ensure Cloudinary URL/Preset is configured in .env');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== indexToRemove);
      let newMainImg = prev.img;
      if (prev.img === prev.images[indexToRemove]) {
        newMainImg = newImages[0] || '';
      }
      return {
        ...prev,
        images: newImages,
        img: newMainImg
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      // Ensure VITE_API_URL fallback includes /api
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = `${baseUrl}/products${editingProduct ? `/${editingProduct._id}` : ''}`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Products</h1>
          <p className="text-gray-500 mt-1">Manage your catalog, stock, and pricing.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium pl-6">Product</th>
                <th className="p-4 font-medium">Price / Discount</th>
                <th className="p-4 font-medium">Category / Tag</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-4">
                    <img src={getOptimizedUrl(p.img, { width: 100 })} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.color}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-[#1A1A1A]">₹{p.price}</p>
                    {p.discount > 0 && <p className="text-xs text-green-500">{p.discount}% OFF</p>}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[#1A1A1A]">{p.category || '—'}</p>
                    <p className="text-xs text-gray-400">{p.tag || '—'}</p>
                  </td>
                  <td className="p-4">
                    {p.stock <= 5 ? (
                      <span className="inline-flex flex-col gap-1 items-start text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                        {p.stock} left
                        <span className="flex items-center gap-1 text-[10px]"><AlertTriangle size={10} /> Low Stock</span>
                      </span>
                    ) : (
                      <span className="inline-flex text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                        {p.stock} in stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="p-8 text-center text-gray-500">No products found.</div>}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#1A1A1A]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="productForm" onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Name</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Category</label><input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Color Variant</label><input required value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" placeholder="e.g. Matte Black" /></div>
                  <div><label className="block text-sm font-medium mb-1">Tag (Optional)</label><input value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" placeholder="e.g. New Arrival" /></div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Price (₹)</label><input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Discount (%)</label><input type="number" min="0" max="100" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" /></div>
                  <div><label className="block text-sm font-medium mb-1">Stock</label><input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-gray-200 focus:ring-2 focus:ring-[#1A1A1A] outline-none" /></div>
                </div>

                {/* Images Section */}
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center justify-between">
                    Images
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                      {uploading ? <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"/> : <UploadCloud size={14} />}
                      Upload Files
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading}/>
                    </label>
                  </label>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className={`relative group aspect-square rounded-xl overflow-hidden border-2 ${formData.img === imgUrl ? 'border-[#1A1A1A]' : 'border-transparent'}`}>
                        <img src={getOptimizedUrl(imgUrl, { width: 150 })} alt="" className="w-full h-full object-cover bg-gray-50" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setFormData(prev => ({...prev, img: imgUrl}))} className="bg-white text-xs px-2 py-1 rounded text-black font-medium" title="Set as Main">Main</button>
                          <button type="button" onClick={() => removeImage(idx)} className="bg-red-500 text-white p-1 rounded" title="Remove"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                    {formData.images.length === 0 && (
                      <div className="col-span-1 border-2 border-dashed border-gray-200 rounded-xl aspect-square flex flex-col items-center justify-center text-gray-400">
                        <UploadCloud size={24} className="mb-1" />
                        <span className="text-[10px]">No images</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 sticky bottom-0 z-10">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
              <button type="submit" form="productForm" disabled={uploading} className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
