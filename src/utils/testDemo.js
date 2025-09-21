// Test function to verify demo mode is working
export const testDemoMode = async () => {
  try {
    console.log('Testing demo mode...')
    
    const { mockAnalyzeText } = await import('../services/mockApi')
    const result = await mockAnalyzeText('Test text')
    
    console.log('Demo mode test result:', result)
    
    return result && result.explanation && result.confidence !== undefined
  } catch (error) {
    console.error('Demo mode test failed:', error)
    return false
  }
}

// Auto-test on load in development
if (import.meta.env.DEV) {
  testDemoMode().then(success => {
    console.log('Demo mode test:', success ? '✅ PASSED' : '❌ FAILED')
  })
}