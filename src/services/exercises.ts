// Mock of Wger Exercise API

export const exercisesService = {
  getCategories: () => {
    return ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Abs', 'Cardio', 'Yoga'];
  },
  
  getExercisesByCategory: async (category: string) => {
    const mockDb: Record<string, string[]> = {
      'Chest': ['Bench Press', 'Push-ups', 'Incline Dumbbell Press'],
      'Back': ['Pull-ups', 'Deadlifts', 'Rows'],
      'Legs': ['Squats', 'Lunges', 'Leg Press'],
      'Arms': ['Bicep Curls', 'Tricep Extensions'],
      'Shoulders': ['Overhead Press', 'Lateral Raises'],
      'Abs': ['Crunches', 'Planks', 'Leg Raises'],
      'Cardio': ['Running', 'Cycling', 'Jump Rope'],
      'Yoga': ['Sun Salutation', 'Downward Dog']
    };
    
    return new Promise<string[]>((resolve) => setTimeout(() => resolve(mockDb[category] || []), 200));
  }
};
