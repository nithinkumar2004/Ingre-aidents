
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
    onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(recipe)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg dark:shadow-black/20 overflow-hidden transform hover:scale-105 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
        >
            <img 
                className="h-48 w-full object-cover bg-gray-200 dark:bg-gray-700" 
                src={recipe.imageUrl || `https://picsum.photos/400/300?random=${recipe.name}`} 
                alt={`A dish of ${recipe.name}`} 
            />
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{recipe.name}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{recipe.description}</p>
                </div>
                <button className="mt-4 text-green-500 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 self-start">
                    View Recipe &rarr;
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
