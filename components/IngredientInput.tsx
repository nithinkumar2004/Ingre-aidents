
import React, { useState, useRef } from 'react';
import { CameraIcon, DocumentTextIcon, SparklesIcon } from './IconComponents';

interface IngredientInputProps {
    onGetRecipes: (inputType: 'text' | 'image', data: string | File) => void;
    isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onGetRecipes, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
    const [textInput, setTextInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        if (activeTab === 'text' && textInput.trim()) {
            onGetRecipes('text', textInput);
        } else if (activeTab === 'image' && imageFile) {
            onGetRecipes('image', imageFile);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl mx-auto transition-colors duration-300">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex items-center justify-center font-semibold py-2 px-4 w-1/2 transition-colors duration-300 ${activeTab === 'text' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    aria-current={activeTab === 'text'}
                >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    List Ingredients
                </button>
                <button
                    onClick={() => setActiveTab('image')}
                    className={`flex items-center justify-center font-semibold py-2 px-4 w-1/2 transition-colors duration-300 ${activeTab === 'image' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    aria-current={activeTab === 'image'}
                >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    Upload Photo
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === 'text' ? (
                    <div>
                        <label htmlFor="ingredients-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Enter ingredients you have (e.g., chicken, tomatoes, rice)
                        </label>
                        <textarea
                            id="ingredients-text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 transition text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="eggs, onion, cheese, bell pepper..."
                        />
                    </div>
                ) : (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                            aria-label="Upload image"
                        />
                        <div
                            onClick={handleImageClick}
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-colors"
                            role="button"
                            aria-label="Image upload area"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Ingredient preview" className="max-h-40 rounded-md" />
                            ) : (
                                <div className="space-y-1 text-center">
                                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <p className="pl-1">Click to upload a photo of your ingredients</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                 <button
                    type="submit"
                    disabled={isLoading || (activeTab === 'text' && !textInput.trim()) || (activeTab === 'image' && !imageFile)}
                    className="mt-4 w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Thinking...' : 'Find Recipes'}
                </button>
            </form>
        </div>
    );
};

export default IngredientInput;