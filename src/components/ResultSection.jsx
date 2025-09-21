import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, ExternalLink, Quote } from 'lucide-react'
import ProbabilityChart from './ProbabilityChart'

const extractProbabilities = (text) => {
  // Try image format first: "X% likely to be genuine, Y% likely to be manipulated, Z% likely to be used in a misleading context"
  const imageRegex = /(\d+)%\s+likely\s+to\s+be\s+genuine.*?(\d+)%\s+likely\s+to\s+be\s+manipulated.*?(\d+)%\s+likely\s+to\s+be\s+used\s+in\s+a\s+misleading\s+context/i
  const imageMatch = text.match(imageRegex)
  
  if (imageMatch) {
    return [
      parseInt(imageMatch[1]), // Genuine
      parseInt(imageMatch[2]), // Manipulated  
      parseInt(imageMatch[3])  // Misleading context
    ]
  }
  
  // Try text format: "X% likely to be accurate, Y% likely to contain misinformation, Z% likely to be misleading"
  const textRegex = /(\d+)%\s+likely\s+to\s+be\s+accurate.*?(\d+)%\s+likely\s+to\s+contain\s+misinformation.*?(\d+)%\s+likely\s+to\s+be\s+misleading/i
  const textMatch = text.match(textRegex)
  
  if (textMatch) {
    return [
      parseInt(textMatch[1]), // Accurate (maps to Genuine)
      parseInt(textMatch[2]), // Misinformation (maps to Manipulated)
      parseInt(textMatch[3])  // Misleading
    ]
  }
  
  return null
}

const formatAnalysisText = (text) => {
  if (!text) return ''
  
  let formatted = text
    // Convert **text** to bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Convert numbered lists to proper formatting
    .replace(/^(\d+)\.\s+\*\*(.*?)\*\*:\s*(.*$)/gm, '<div class="mb-6"><h4 class="text-lg font-bold text-white mb-3"><span class="text-primary-400 mr-2">$1.</span><strong>$2</strong></h4><p class="text-white/70 leading-relaxed ml-6">$3</p></div>')
    // Convert bullet points to proper list items
    .replace(/^\s*-\s+(.*$)/gm, '<li class="text-white/70 mb-2 ml-4 leading-relaxed">$1</li>')
    // Convert emojis to styled spans
    .replace(/🔍/g, '<span class="text-blue-400 text-xl mr-2 inline-block">🔍</span>')
    .replace(/🚩/g, '<span class="text-red-400 text-xl mr-2 inline-block">🚩</span>')
    .replace(/💡/g, '<span class="text-yellow-400 text-xl mr-2 inline-block">💡</span>')
    .replace(/✅/g, '<span class="text-green-400 text-xl mr-2 inline-block">✅</span>')
    .replace(/📸/g, '<span class="text-purple-400 text-xl mr-2 inline-block">📸</span>')
    .replace(/🤔/g, '<span class="text-orange-400 text-xl mr-2 inline-block">🤔</span>')
  
  // Convert consecutive list items to proper ul
  formatted = formatted.replace(/(<li.*?<\/li>\s*)+/g, (match) => {
    return `<ul class="space-y-2 mb-4 ml-4">${match}</ul>`
  })
  
  // Convert line breaks to proper spacing
  formatted = formatted
    .replace(/\n\n/g, '</p><p class="mb-4 text-white/70 leading-relaxed">')
    .replace(/\n/g, '<br>')
  
  // Wrap remaining text in paragraph tags
  if (!formatted.startsWith('<div') && !formatted.startsWith('<h') && !formatted.startsWith('<ul') && !formatted.startsWith('<p')) {
    formatted = `<p class="mb-4 text-white/70 leading-relaxed">${formatted}</p>`
  }
  
  return formatted
}

const ResultSection = ({ result, inputData, onReset }) => {
  const probabilities = extractProbabilities(result.explanation)
  
  const getResultIcon = () => {
    if (result.confidence >= 80) {
      return result.isTrue ? CheckCircle : XCircle
    }
    return AlertTriangle
  }

  const getResultColor = () => {
    if (result.confidence >= 80) {
      return result.isTrue ? 'accent' : 'danger'
    }
    return 'warning'
  }

  const getResultText = () => {
    if (result.confidence >= 80) {
      return result.isTrue ? 'Likely True' : 'Likely False'
    }
    return 'Uncertain'
  }

  const ResultIcon = getResultIcon()
  const colorScheme = getResultColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Main Result Card */}
      <div className="bento-card shadow-glow">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 ${
              colorScheme === 'accent' ? 'bg-accent-500/20' : 
              colorScheme === 'danger' ? 'bg-danger-500/20' : 'bg-warning-500/20'
            }`}
          >
            <ResultIcon 
              className={`w-12 h-12 ${
                colorScheme === 'accent' ? 'text-accent-500' : 
                colorScheme === 'danger' ? 'text-danger-500' : 'text-warning-500'
              }`}
            />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {getResultText()}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center space-x-2"
          >
            <span className="text-white/70">Confidence:</span>
            <div className="flex items-center space-x-4">
              <div className="w-40 bg-slate-700/50 rounded-full h-3 border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className={`h-3 rounded-full ${
                    colorScheme === 'accent' ? 'bg-accent-500' : 
                    colorScheme === 'danger' ? 'bg-danger-500' : 'bg-warning-500'
                  }`}
                />
              </div>
              <span className="text-white font-bold text-lg">{result.confidence}%</span>
            </div>
          </motion.div>
        </div>

        {/* Probability Chart */}
        {probabilities && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <ProbabilityChart probabilities={probabilities} />
          </motion.div>
        )}

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-slate-800/30 border border-white/10 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Quote className="w-6 h-6 mr-3" />
            Detailed Analysis
          </h3>
          <div 
            className="analysis-content text-white/70 leading-relaxed text-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatAnalysisText(result.explanation) }}
          />
        </motion.div>

        {/* Sources */}
        {result.sources && result.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-slate-800/30 border border-white/10 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Sources & References
            </h3>
            <div className="space-y-3">
              {result.sources.map((source, index) => (
                <motion.a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-slate-700/30 border border-white/10 rounded-xl hover:bg-slate-600/40 hover:border-primary-500/30 transition-all duration-200 group"
                >
                  <ExternalLink className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
                  <div className="flex-1">
                    <p className="text-white group-hover:text-primary-300 transition-colors font-medium">
                      {source.title}
                    </p>
                    <p className="text-white/50 text-sm">
                      {source.domain}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="bg-slate-800/30 border border-white/10 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">
          Checked Content
        </h3>
        {inputData.type === 'text' ? (
          <div className="bg-slate-700/30 border border-white/10 rounded-xl p-6">
            <p className="text-white/70 italic text-lg leading-relaxed">"{inputData.content}"</p>
          </div>
        ) : (
          <div className="bg-slate-700/30 border border-white/10 rounded-xl p-6">
            <img
              src={URL.createObjectURL(inputData.content)}
              alt="Checked content"
              className="max-h-40 rounded-lg mx-auto shadow-lg"
            />
            <p className="text-white/50 text-sm text-center mt-4 font-medium">
              {inputData.content.name}
            </p>
          </div>
        )}
      </motion.div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="flex justify-center"
      >
        <button
          onClick={onReset}
          className="flex items-center space-x-4 px-10 py-5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl font-bold text-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/10"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Check Another Claim</span>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ResultSection