import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, Type, Search, X, FileText, Camera } from 'lucide-react'

const UploadSection = ({ onFactCheck }) => {
  const [activeTab, setActiveTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  const examplePrompts = [
    "Is the Great Wall of China visible from space?",
    "Did Coca-Cola invent the modern image of Santa Claus?",
    "Do goldfish have a 3-second memory?",
    "Is it true that we only use 10% of our brains?"
  ]

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedFile(file)
        setActiveTab('image')
      }
    }
  })

  const handleSubmit = () => {
    if (activeTab === 'text' && textInput.trim()) {
      onFactCheck({ type: 'text', content: textInput.trim() })
    } else if (activeTab === 'image' && uploadedFile) {
      onFactCheck({ type: 'image', content: uploadedFile })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (activeTab === 'image') {
      setActiveTab('text')
    }
  }

  const isSubmitDisabled = 
    (activeTab === 'text' && !textInput.trim()) || 
    (activeTab === 'image' && !uploadedFile)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Main Input Section */}
      <div className="bento-card shadow-glow">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-1.5 flex space-x-1 border border-white/10">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl transition-all duration-300 font-semibold ${
                activeTab === 'text'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl transition-all duration-300 font-semibold ${
                activeTab === 'image'
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Image</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'text' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste a URL, news snippet, or social media claim to verify..."
                  className="w-full h-48 p-8 bg-slate-800/30 border border-white/10 rounded-2xl text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-lg leading-relaxed"
                  maxLength={1000}
                />
                <div className="absolute bottom-4 right-6 text-white/30 text-sm font-medium">
                  {textInput.length}/1000
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50 hover:bg-slate-800/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  <motion.div
                    animate={{ y: isDragActive ? -10 : 0, scale: isDragActive ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: isDragActive ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
                      >
                        <Upload className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {isDragActive ? 'Drop your image here' : 'Drag & Drop an image'}
                      </h3>
                      <p className="text-white/60 text-lg mb-4">
                        or click to browse your files
                      </p>
                      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-700/50 rounded-xl border border-white/10">
                        <span className="text-white/50 text-sm font-medium">
                          Supports: JPG, PNG, GIF, WebP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="bg-slate-800/30 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-bold text-xl">Image Ready for Analysis</h3>
                    <button
                      onClick={removeFile}
                      className="text-white/50 hover:text-red-400 transition-colors duration-200 p-2 hover:bg-red-400/10 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative mb-4">
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Uploaded"
                      className="w-full max-h-80 object-contain rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 font-medium">{uploadedFile.name}</span>
                    <span className="text-white/40">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center pt-4"
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={`flex items-center space-x-4 px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
                isSubmitDisabled
                  ? 'bg-slate-600/50 text-white/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transform hover:scale-105 accent-glow'
              }`}
            >
              <Search className="w-7 h-7" />
              <span>Analyze with TruthLens</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Example Prompts Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="bento-card"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Try These Examples</h3>
          <p className="text-white/50">Click any example to test TruthLens instantly</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examplePrompts.map((prompt, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={() => {
                setTextInput(prompt)
                setActiveTab('text')
              }}
              className="p-6 bg-slate-800/30 border border-white/10 rounded-xl text-left hover:bg-slate-700/40 hover:border-primary-500/30 transition-all duration-300 group"
            >
              <p className="text-white/80 group-hover:text-white transition-colors leading-relaxed">
                "{prompt}"
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UploadSection