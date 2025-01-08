/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Type, 
  Moon, 
  Sun, 
  Eye, 
  Filter, 
  Languages, // Changed from Language to Languages
  Contrast, 
  TextCursor, 
  Palette,
  Check
} from 'lucide-react';

const PlatformSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    colorScheme: 'default',
    textSize: 'medium',
    contrastMode: 'standard',
    speechOutput: false,
    language: 'English'
  });

  const accessibilityOptions = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Color Contrast',
      options: ['Standard', 'High Contrast', 'Grayscale']
    },
    {
      icon: <Type className="w-5 h-5" />,
      title: 'Text Size',
      options: ['Small', 'Medium', 'Large', 'Extra Large']
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: 'Speech Output',
      type: 'toggle'
    },
    {
      icon: <Languages className="w-5 h-5" />, // Updated to use Languages
      title: 'Language',
      options: ['English', 'Spanish', 'French', 'Arabic', 'Sign Language']
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Color Scheme',
      options: ['Default', 'Dyslexia-Friendly', 'High Visibility']
    }
  ];

  const toggleSettings = () => setIsOpen(!isOpen);

  const renderSettingsButton = () => (
    <button 
      onClick={toggleSettings}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
      style={{
        background: 'rgba(67, 24, 255, 0.85)',
        color: 'white'
      }}
    >
      <Settings className="w-6 h-6" />
    </button>
  );

  const renderSettingsPanel = () => (
    <div 
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      onClick={toggleSettings}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0.9)',
          borderTop: '4px solid rgba(67, 24, 255, 0.85)'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Settings className="mr-3 text-purple-600" /> Platform Accessibility Settings
          </h2>
          <button 
            onClick={toggleSettings} 
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {accessibilityOptions.map((setting, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-4">
              {setting.icon}
              <h3 className="ml-3 text-lg font-semibold text-gray-700">{setting.title}</h3>
            </div>

            {setting.type === 'toggle' ? (
              <div className="flex items-center">
                <span className="mr-4 text-gray-600">Enable Speech Output</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={selectedOptions.speechOutput}
                      onChange={() => setSelectedOptions(prev => ({
                        ...prev, 
                        speechOutput: !prev.speechOutput
                      }))}
                    />
                    <div className={`w-10 h-4 ${selectedOptions.speechOutput ? 'bg-purple-600' : 'bg-gray-300'} rounded-full shadow-inner`}></div>
                    <div 
                      className={`dot absolute -left-1 -top-1 bg-white w-6 h-6 rounded-full shadow transition-all duration-300 ${selectedOptions.speechOutput ? 'transform translate-x-full bg-purple-600' : 'bg-white'}`}
                    ></div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {setting.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center ${
                      selectedOptions[setting.title.toLowerCase().replace(' ', '')] === option.toLowerCase()
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setSelectedOptions(prev => ({
                      ...prev,
                      [setting.title.toLowerCase().replace(' ', '')]: option.toLowerCase()
                    }))}
                  >
                    {option}
                    {selectedOptions[setting.title.toLowerCase().replace(' ', '')] === option.toLowerCase() && (
                      <Check className="ml-2 w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <button 
            onClick={toggleSettings}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={toggleSettings}
            className="px-6 py-2 rounded-lg text-white transition-all duration-300"
            style={{
              background: 'rgba(67, 24, 255, 0.85)',
              boxShadow: '0 4px 6px rgba(67, 24, 255, 0.3)'
            }}
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* {renderSettingsButton()}
      {renderSettingsPanel()} */}
    </>
  );
};

export default PlatformSettings;