import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2 } from 'lucide-react';
import { nutritionService } from '../services/nutrition';
import { sharepointService } from '../services/sharepoint';
import { useAuth } from '../contexts/AuthContext';

const DietTracker = () => {
  const { currentUser } = useAuth();
  const [foodSearch, setFoodSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);

  React.useEffect(() => {
    if (currentUser) {
      sharepointService.getDietLogs(currentUser.id).then((data: any) => {
        if (Array.isArray(data)) setMeals(data);
      });
    }
  }, [currentUser]);

  // Daily totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  // Goals
  const goalCalories = 2500;
  const goalProtein = 150;
  const goalCarbs = 250;
  const goalFats = 70;

  const handleSearchAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodSearch) return;

    setIsSearching(true);
    const data = await nutritionService.searchFood(foodSearch);
    
    const newMeal = {
      id: Date.now().toString(),
      name: data.name,
      calories: Math.round(data.calories),
      protein: Math.round(data.protein),
      carbs: Math.round(data.carbs),
      fats: Math.round(data.fats),
      type: 'Snack' // Default type
    };

    setMeals([...meals, newMeal]);
    sharepointService.saveDietLog({ userId: currentUser?.id, ...newMeal });
    
    setFoodSearch('');
    setIsSearching(false);
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const MacroBar = ({ label, current, goal, color }: any) => {
    const percent = Math.min(100, Math.max(0, (current / goal) * 100));
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{current} / {goal}g</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${percent}%`, background: `rgb(${color})`, boxShadow: `0 0 10px rgba(${color}, 0.5)` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Diet <span className="text-neon">Nutrition</span></h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ flex: 1 }}
        >
          <h2 style={{ marginBottom: '1.5rem' }}>Daily Summary</h2>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{totalCalories}</div>
            <div style={{ color: 'var(--text-secondary)' }}>of {goalCalories} KCAL consumed</div>
          </div>

          <MacroBar label="Protein" current={totalProtein} goal={goalProtein} color="255, 42, 42" />
          <MacroBar label="Carbs" current={totalCarbs} goal={goalCarbs} color="42, 140, 255" />
          <MacroBar label="Fats" current={totalFats} goal={goalFats} color="255, 180, 42" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel"
          style={{ flex: 2 }}
        >
          <h2 style={{ marginBottom: '1.5rem' }}>Add Meal</h2>
          
          <form onSubmit={handleSearchAndAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search database (e.g. Chicken Rice, Banana)" 
                className="cyber-input"
                style={{ margin: 0, paddingLeft: '2.5rem' }}
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="neon-btn-solid" disabled={isSearching} style={{ whiteSpace: 'nowrap' }}>
              {isSearching ? 'Scanning...' : <><Plus size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Add Item</>}
            </button>
          </form>

          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Today's Logs</h3>
          
          {meals.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No meals logged yet. Initialize your diet protocol.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {meals.map(meal => (
                <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{meal.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>{meal.calories} kcal</div>
                    <button onClick={() => removeMeal(meal.id)} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DietTracker;
