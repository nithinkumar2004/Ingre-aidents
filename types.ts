
export interface Recipe {
    name: string;
    description: string;
    imageUrl?: string;
}

export interface RecipeDetails {
    ingredients: string[];
    instructions: string[];
}
