import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Star, Heart, Volume2, VolumeX } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onBack: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);
        
        speechSynthesis.speak(utterance);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 active:text-emerald-700 dark:active:text-emerald-300 transition-colors duration-200 touch-manipulation p-2 -ml-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Back to recipes</span>
            </button>
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`p-3 sm:p-2 rounded-full transition-all duration-200 touch-manipulation active:scale-90 ${
                isFavorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              {recipe.description}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 mb-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {recipe.cookingTime}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {recipe.servings} servings
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className={`p-3 sm:p-3 rounded-lg border-l-4 text-sm sm:text-base ${
                      recipe.matchedIngredients.includes(ingredient)
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 rounded-lg border-l-4 transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-lg'
                        : index < currentStep
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 opacity-75'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                            Step {index + 1}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 ml-11 leading-relaxed">
                          {instruction}
                        </p>
                      </div>
                      {index === currentStep && (
                        <button
                          onClick={() => speakText(instruction)}
                          className="ml-2 sm:ml-4 p-2 sm:p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 active:bg-emerald-200 dark:active:bg-emerald-900/40 rounded-lg transition-colors duration-200 touch-manipulation"
                        >
                          {isReading ? (
                            <VolumeX className="h-5 w-5 sm:h-5 sm:w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-500 hover:bg-gray-600 active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 touch-manipulation"
                >
                  <span className="hidden sm:inline">Previous Step</span>
                  <span className="sm:hidden">Previous</span>
                </button>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                  {currentStep + 1} of {recipe.instructions.length}
                </span>
                <button
                  onClick={nextStep}
                  disabled={currentStep === recipe.instructions.length - 1}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 touch-manipulation"
                >
                  <span className="hidden sm:inline">Next Step</span>
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};