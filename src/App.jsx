import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import ResultSection from './components/ResultSection'
import LoadingAnimation from './components/LoadingAnimation'
import { checkFact } from './services/api'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [inputData, setInputData] = useState(null)

  const handleFactCheck = async (data) => {
    setIsLoading(true)
    setInputData(data)
    setResult(null)
    
    try {
      const response = await checkFact(data)
      setResult(response)
    } catch (error) {
      setResult({
        isTrue: false,
        confidence: 0,
        explanation: 'Error occurred while checking the fact. Please try again.',
        sources: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setInputData(null)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingAnimation key="loading" />
            ) : result ? (
              <ResultSection 
                key="result" 
                result={result} 
                inputData={inputData}
                onReset={handleReset}
              />
            ) : (
              <UploadSection 
                key="upload" 
                onFactCheck={handleFactCheck}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App