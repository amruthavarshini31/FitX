import axios from 'axios';

// OpenFoodFacts API Integration
export const nutritionService = {
  searchFood: async (foodName: string) => {
    try {
      // Using OpenFoodFacts text search API
      const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${foodName}&search_simple=1&action=process&json=1&page_size=1`);
      
      if (response.data.products && response.data.products.length > 0) {
        const product = response.data.products[0];
        const nutriments = product.nutriments || {};
        
        return {
          name: product.product_name || foodName,
          calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
          protein: nutriments['proteins_100g'] || nutriments['proteins'] || 0,
          carbs: nutriments['carbohydrates_100g'] || nutriments['carbohydrates'] || 0,
          fats: nutriments['fat_100g'] || nutriments['fat'] || 0,
          source: 'OpenFoodFacts'
        };
      }
      
      // Fallback rough estimate if not found perfectly
      return {
        name: foodName,
        calories: 150,
        protein: 5,
        carbs: 20,
        fats: 5,
        source: 'Estimate'
      };
    } catch (error) {
      console.error("Error fetching nutrition data", error);
      return {
        name: foodName,
        calories: 100,
        protein: 0,
        carbs: 0,
        fats: 0,
        source: 'Error Fallback'
      };
    }
  }
};
