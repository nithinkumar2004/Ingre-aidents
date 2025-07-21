
import React, { useState } from 'react';
import { Recipe, RecipeDetails } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from './IconComponents';

interface RecipeDetailModalProps {
    recipe: Recipe;
    details: RecipeDetails | null;
    images: string[];
    isLoading: boolean;
    onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, details, images, isLoading, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (details && currentStep < details.instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{recipe.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full p-16">
                            <LoadingSpinner />
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Preparing recipe details...</p>
                        </div>
                    ) : details ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                           {/* Left Column: Ingredients & Instructions */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">Ingredients</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                    {details.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>

                                <h3 className="text-xl font-semibold mt-6 mb-3 text-green-700 dark:text-green-400">Instructions</h3>
                                <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                    {details.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>

                            {/* Right Column: Animated Video */}
                            <div className="p-6 bg-gray-100 dark:bg-gray-900/50 flex flex-col">
                                <h3 className="text-xl font-semibold mb-3 text-center text-green-700 dark:text-green-400">Cooking Animation</h3>
                                {images.length > 0 ? (
                                    <div className="flex-grow flex flex-col justify-center">
                                        <div className="relative">
                                             <div className="w-full aspect-video object-cover rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <img
                                                    src={images[currentStep]}
                                                    alt={`Step ${currentStep + 1}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                                             <p className="absolute bottom-2 left-2 right-2 text-white text-sm p-2 bg-black/50 rounded">
                                                {details.instructions[currentStep]}
                                             </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <button onClick={prevStep} disabled={currentStep === 0} className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                                <ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300"/>
                                            </button>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Step {currentStep + 1} / {details.instructions.length}</span>
                                            <button onClick={nextStep} disabled={currentStep === details.instructions.length - 1} className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                                <ChevronRightIcon className="w-6 h-6 text-gray-700 dark:text-gray-300"/>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-grow flex items-center justify-center">
                                         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                            <LoadingSpinner />
                                            <p className="mt-4 text-gray-600 dark:text-gray-400">Generating animations...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                         <div className="p-8 text-center text-red-500 dark:text-red-400">Failed to load recipe details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailModal;