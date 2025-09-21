import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Search } from 'lucide-react'

const LoadingAnimation = () => {
  const steps = [
    { icon: Search, text: 'Analyzing content...', delay: 0 },
    { icon: Brain, text: 'Processing with AI...', delay: 1 },
    { icon: Zap, text: 'Verifying facts...', delay: 2 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-effect rounded-3xl p-12 text-center shadow-glow">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <div className="w-full h-full border-4 border-blue-400/30 border-t-blue-400 rounded-full"></div>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Brain className="w-10 h-10 text-blue-400" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">
          Fact-checking in progress...
        </h2>

        {/* Step Indicators */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay, duration: 0.5 }}
              className="flex items-center justify-center space-x-3"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  delay: step.delay,
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <step.icon className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-white/80">{step.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 mt-4 text-sm"
        >
          This may take a few moments...
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LoadingAnimation