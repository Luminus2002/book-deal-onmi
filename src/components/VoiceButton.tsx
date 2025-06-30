import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import { motion } from 'framer-motion';

const VoiceButton: React.FC = () => {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open Voice Assistant</span>
      </motion.button>

      <VoiceAssistant 
        isOpen={showAssistant} 
        onClose={() => setShowAssistant(false)} 
      />
    </>
  );
};

export default VoiceButton;