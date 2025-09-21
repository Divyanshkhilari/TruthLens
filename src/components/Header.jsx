import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap } from 'lucide-react'

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="border-b border-white/5 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center space-x-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Zap className="w-4 h-4 text-accent-500" />
            </motion.div>
          </motion.div>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold gradient-text tracking-tight">
              TruthLens
            </h1>
            <p className="text-white/60 text-lg mt-2 font-medium">
              AI-Powered Fact Verification
            </p>
          </div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center text-white/50 mt-6 max-w-3xl mx-auto text-lg leading-relaxed"
        >
          Instantly verify claims, debunk misinformation, and discover the truth with cutting-edge AI technology
        </motion.p>
      </div>
    </motion.header>
  )
}

export default Header