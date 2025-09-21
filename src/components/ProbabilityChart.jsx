import React from 'react'
import { motion } from 'framer-motion'

const ProbabilityChart = ({ probabilities }) => {
  if (!probabilities || probabilities.length === 0) return null

  const colors = [
    { bg: 'bg-green-500', text: 'text-green-400', label: 'Genuine' },
    { bg: 'bg-red-500', text: 'text-red-400', label: 'Manipulated' },
    { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Misleading Context' }
  ]

  return (
    <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-8 mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Authenticity Analysis
      </h3>
      
      {/* Horizontal Bar Chart */}
      <div className="space-y-6 mb-8">
        {probabilities.map((prob, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${colors[index]?.text || 'text-white'}`}>
                {colors[index]?.label || `Category ${index + 1}`}
              </span>
              <span className="text-white font-bold text-lg">
                {prob}%
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob}%` }}
                transition={{ delay: index * 0.2 + 0.3, duration: 1, ease: "easeOut" }}
                className={`h-4 rounded-full ${colors[index]?.bg || 'bg-blue-500'} shadow-lg`}
                style={{
                  boxShadow: `0 0 20px ${colors[index]?.bg === 'bg-green-500' ? 'rgba(34, 197, 94, 0.3)' : 
                                        colors[index]?.bg === 'bg-red-500' ? 'rgba(239, 68, 68, 0.3)' : 
                                        'rgba(234, 179, 8, 0.3)'}`
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Circular Progress Indicators */}
      <div className="grid grid-cols-3 gap-6">
        {probabilities.map((prob, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-3">
              {/* Background circle */}
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke={colors[index]?.bg === 'bg-green-500' ? '#22c55e' : 
                         colors[index]?.bg === 'bg-red-500' ? '#ef4444' : '#eab308'}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 201" }}
                  animate={{ strokeDasharray: `${(prob / 100) * 201} 201` }}
                  transition={{ delay: index * 0.1 + 0.8, duration: 1, ease: "easeOut" }}
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {prob}%
                </span>
              </div>
            </div>
            <p className={`text-sm font-medium ${colors[index]?.text || 'text-white'}`}>
              {colors[index]?.label || `Category ${index + 1}`}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-8 p-4 bg-slate-700/30 rounded-xl border border-white/10"
      >
        <p className="text-white/70 text-center text-sm">
          <span className="font-semibold text-white">Overall Assessment:</span> Based on visual analysis, 
          this content has a <span className={`font-bold ${colors[0]?.text}`}>{probabilities[0]}% probability</span> of being authentic.
        </p>
      </motion.div>
    </div>
  )
}

export default ProbabilityChart