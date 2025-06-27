import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin, Heart, Wallet } from 'lucide-react';
import { QuestionnaireData, Interest, TravelStyle, Climate, Season } from '@/types';

interface TravelQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
  onSkip: () => void;
}

const TravelQuestionnaire: React.FC<TravelQuestionnaireProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    accommodationBudget: '',
    transportationBudget: '',
    totalBudget: '',
    primaryInterest: 'ADVENTURE',
    preferredTravelStyle: 'CASUAL',
    preferredClimate: 'MEDITERRANEAN',
    preferredTravelSeason: 'SUMMER',
    preferredAccommodation: 'HOTEL',
    avgTravelDuration: 7,
    transportPreference: 'FLIGHTS',
    dataSharing: true,
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(questionnaireData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };




  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Interest & Budget</h2>
        <p className="text-gray-600">Tell us about your travel preferences</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Primary Travel Interest (Select one)</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'ADVENTURE', label: 'Adventure', desc: 'Hiking, extreme sports, outdoor activities', icon: '🏔️' },
              { value: 'RELAXATION', label: 'Relaxation', desc: 'Spas, beaches, peaceful retreats', icon: '🧘‍♀️' },
              { value: 'CULTURAL_EXPERIENCE', label: 'Cultural Experience', desc: 'Museums, local traditions, history', icon: '🏛️' },
              { value: 'NATURE', label: 'Nature', desc: 'Wildlife, national parks, natural wonders', icon: '🌿' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setQuestionnaireData({ ...questionnaireData, primaryInterest: option.value as Interest })}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  questionnaireData.primaryInterest === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Travel Style (Select one)</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'CASUAL', label: 'Casual Explorer', desc: 'Relaxed pace, spontaneous' },
              { value: 'FREQUENT', label: 'Frequent Traveler', desc: 'Regular trips, experienced' },
              { value: 'BUSINESS', label: 'Business Traveler', desc: 'Efficient, professional' },
              { value: 'ENTHUSIAST', label: 'Travel Enthusiast', desc: 'Deep experiences, immersive' },
              { value: 'ORGANIZER', label: 'Travel Organizer', desc: 'Detailed planning, group coordination' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setQuestionnaireData({ ...questionnaireData, preferredTravelStyle: option.value as TravelStyle })}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  questionnaireData.preferredTravelStyle === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">What's your typical trip duration?</label>
          <div className="space-y-2">
            <input
              type="range"
              min="1"
              max="30"
              value={questionnaireData.avgTravelDuration}
              onChange={(e) => setQuestionnaireData({ 
                ...questionnaireData, 
                avgTravelDuration: parseInt(e.target.value) 
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 day</span>
              <span className="font-medium text-primary-600">
                {questionnaireData.avgTravelDuration} {questionnaireData.avgTravelDuration === 1 ? 'day' : 'days'}
              </span>
              <span>30 days</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferred transportation method</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'FLIGHTS', label: 'Flights', desc: 'Air travel for faster long-distance trips', icon: '✈️' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setQuestionnaireData({ ...questionnaireData, transportPreference: option.value as 'FLIGHTS' })}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  questionnaireData.transportPreference === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Travel Budget Breakdown</label>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Accommodation Budget (per trip)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={questionnaireData.accommodationBudget}
                    onChange={(e) => {
                      const accommodationBudget = e.target.value;
                      const transportationBudget = questionnaireData.transportationBudget;
                      const totalBudget = accommodationBudget && transportationBudget ? 
                        (parseInt(accommodationBudget) + parseInt(transportationBudget)).toString() : '';
                      setQuestionnaireData({ 
                        ...questionnaireData, 
                        accommodationBudget,
                        totalBudget
                      });
                    }}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="2000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Transportation Budget (per trip)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={questionnaireData.transportationBudget}
                    onChange={(e) => {
                      const transportationBudget = e.target.value;
                      const accommodationBudget = questionnaireData.accommodationBudget;
                      const totalBudget = accommodationBudget && transportationBudget ? 
                        (parseInt(accommodationBudget) + parseInt(transportationBudget)).toString() : '';
                      setQuestionnaireData({ 
                        ...questionnaireData, 
                        transportationBudget,
                        totalBudget
                      });
                    }}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1500"
                  />
                </div>
              </div>
            </div>
            {questionnaireData.totalBudget && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-700">Total Budget per Trip:</span>
                  <span className="text-lg font-bold text-primary-800">${questionnaireData.totalBudget}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Climate & Season Preferences</h2>
        <p className="text-gray-600">What weather and seasons do you prefer?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Climate (Select one)</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'TROPICAL', label: 'Tropical', desc: 'Warm, humid, year-round heat', icon: '🌴' },
            { value: 'MEDITERRANEAN', label: 'Mediterranean', desc: 'Mild winters, warm summers', icon: '☀️' },
            { value: 'CONTINENTAL', label: 'Continental', desc: 'Four distinct seasons', icon: '🍂' },
            { value: 'ARID', label: 'Arid/Desert', desc: 'Dry, hot days, cool nights', icon: '🏜️' },
            { value: 'POLAR', label: 'Polar/Arctic', desc: 'Cold, snow, northern lights', icon: '❄️' },
            { value: 'MONSOON', label: 'Monsoon', desc: 'Wet and dry seasons', icon: '🌧️' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setQuestionnaireData({ ...questionnaireData, preferredClimate: option.value as Climate })}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                questionnaireData.preferredClimate === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Travel Season (Select one)</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'SPRING', label: 'Spring', desc: 'Mild temperatures, blooming nature', icon: '🌸' },
            { value: 'SUMMER', label: 'Summer', desc: 'Warm weather, long days', icon: '☀️' },
            { value: 'AUTUMN', label: 'Autumn', desc: 'Cool weather, fall colors', icon: '🍁' },
            { value: 'WINTER', label: 'Winter', desc: 'Cold weather, snow activities', icon: '⛄' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setQuestionnaireData({ ...questionnaireData, preferredTravelSeason: option.value as Season })}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                questionnaireData.preferredTravelSeason === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Accommodation Type (Select one)</label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'HOTEL', label: 'Hotels', desc: 'Traditional hotel service with amenities', icon: '🏨' },
            { value: 'AIRBNB', label: 'AirBnBs', desc: 'Private homes, local experience, more space', icon: '🏠' },
            { value: 'LODGE', label: 'Lodges', desc: 'Nature-focused, rustic charm, unique experiences', icon: '🏔️' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setQuestionnaireData({ 
                ...questionnaireData, 
                preferredAccommodation: option.value as any
              })}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                questionnaireData.preferredAccommodation === option.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
              <div className="text-sm text-gray-500">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Wallet className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Personalization</h2>
        <p className="text-gray-600">Help us provide better recommendations</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="dataSharing"
              checked={questionnaireData.dataSharing}
              onChange={(e) => setQuestionnaireData({ ...questionnaireData, dataSharing: e.target.checked })}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <label htmlFor="dataSharing" className="text-sm font-medium text-gray-700">
                Allow Farrin to use my preferences and travel history for personalized recommendations
              </label>
              <p className="text-xs text-gray-500 mt-1">
                This helps our AI provide better destination suggestions and travel planning assistance. 
                You can change this setting anytime in your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What you'll get:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Personalized destination recommendations based on your interests</li>
            <li>• Budget-appropriate travel suggestions</li>
            <li>• Climate and season-based recommendations</li>
            <li>• Trip planning tailored to your travel style</li>
            <li>• Suggestions for places similar to ones you've enjoyed</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🎉 <strong>Almost done!</strong> Your preferences will help us create a personalized travel experience just for you.
        </p>
      </div>
    </div>
  );



  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return questionnaireData.primaryInterest && questionnaireData.preferredTravelStyle && questionnaireData.avgTravelDuration && questionnaireData.transportPreference && (questionnaireData.accommodationBudget || questionnaireData.transportationBudget);
      case 2:
        return questionnaireData.preferredClimate && questionnaireData.preferredTravelSeason && questionnaireData.preferredAccommodation;
      case 3:
        return true; // Data sharing has a default
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm font-medium text-gray-700">{currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
          )}
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip Setup
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            canProceed()
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
          {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default TravelQuestionnaire;