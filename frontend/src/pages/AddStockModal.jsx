import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Plus } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function AddStockModal({ setShowAddStockModal }) {
  const navigate = useNavigate();

  // State
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStock, setNewStock] = useState({ 
        quantity: '', 
        cost: '', 
        itemname: '' ,  
        materialStockMin: ''
    });

  // Close modal (smart: works for both route & popup)
  const handleClose = () => {
    if (setShowAddStockModal) {
      setShowAddStockModal(false);
    } else {
      navigate(-1); // go back if used as a page
    }
  };
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(`${apiUrl}/inventory/getMaterials`);
        const data = response.data;
        if (Array.isArray(data)) {
          setMaterials(data);
        } else {
          console.warn("API returned non-array for materials:", data);
          setMaterials([]);
        }
      } catch (err) {
        console.error('Error fetching materials:', err);
        setError(err.message);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMaterials(); 
  }, []);
  
  

  const handleAddStock = async () => {  
    const payload = selectedMaterial
  ? {
      inventoryid: selectedMaterial.inventoryid,
      quantity: Number(newStock.quantity),
      date: new Date().toISOString().slice(0, 10),
    }
  : {
      itemname: newStock.itemname,
      quantity: Number(newStock.quantity),
      cost: Number(newStock.cost),
      materialStockMin: Number(newStock.materialStockMin),
      date: new Date().toISOString().slice(0, 10),
    };

  
    try {
        console.log("Making POST request...");
    
        const response = await axios.post(`${apiUrl}/inventory/addmaterials`, payload);
    
        console.log('New Material response:', response);  // Log the whole response object
        setMaterials(response.data);  // Update your materials state with the response data
    
        setNewStock({ quantity: '', cost: '', itemname: '', materialStockMin: '' });
        setSelectedMaterial(null);
        handleClose();
    } catch (err) {
        console.error('Error adding material:', err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Stock</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
            </button>
        </div>
    
        {error && <p className="text-sm text-red-500 mb-2">Error: {error}</p>}
    
        <div className="space-y-4">
            {loading ? (
            <p className="text-sm text-gray-500">Loading materials...</p>
            ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Start typing or select a material"
                value={newStock.itemname}
                onChange={(e) => {
                    const input = e.target.value;
                    setNewStock((prev) => ({ ...prev, itemname: input }));
    
                    const matchedMaterial = materials.find(
                    (m) => m.itemname.toLowerCase() === input.toLowerCase()
                    );
    
                    if (matchedMaterial) {
                    setSelectedMaterial(matchedMaterial);
                    setNewStock((prev) => ({
                        ...prev,
                        materialStockMin: matchedMaterial.materialStockMin || '',
                    }));
                    } else {
                    setSelectedMaterial(null);
                    setNewStock((prev) => ({
                        ...prev,
                        materialStockMin: '',
                    }));
                    }
                }}
                />
    
                {!selectedMaterial && materials.length > 0 && (
                <div className="border rounded-md max-h-40 overflow-y-auto mt-1">
                    {materials
                    .filter((m) =>
                        m.itemname.toLowerCase().includes(newStock.itemname.toLowerCase())
                    )
                    .map((material) => (
                        <div
                        key={material.inventoryid}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            setSelectedMaterial(material);
                            setNewStock({
                            ...newStock,
                            itemname: material.itemname,
                            materialStockMin: material.materialStockMin || '',
                            });
                        }}
                        >
                        {material.itemname}
                        </div>
                    ))}
                </div>
                )}
            </div>
            )}
    
            {/* Only show minimum stock input if it's a new material */}
            {selectedMaterial === null && (
            <input
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter minimum stock"
                value={newStock.materialStockMin ?? ''}
                onChange={(e) =>
                setNewStock((prev) => ({ ...prev, materialStockMin: e.target.value }))
                }
            />
            )}
    
            <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter quantity"
            value={newStock.quantity ?? ''}
            onChange={(e) =>
                setNewStock((prev) => ({ ...prev, quantity: e.target.value }))
            }
            />
            {selectedMaterial === null && (
            <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter unit price"
            value={newStock.cost ?? ''}
            onChange={(e) =>
                setNewStock((prev) => ({ ...prev, cost: e.target.value }))
            }
            />)}
    
            <div className="flex justify-end space-x-3 mt-6">
            <button
                onClick={handleClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                onClick={handleAddStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                disabled={
                    !newStock.quantity ||
                    (!selectedMaterial && (!newStock.itemname || !newStock.cost || !newStock.materialStockMin))
                  }
                  
            >
                <Plus size={16} className="mr-2" />
                Add Stock
            </button>
            </div>
        </div>
        </div>
    </div>
    );
}      