// Mock API for demo purposes when backend is not available
export const mockAnalyzeText = async (text) => {
  console.log('🎭 Mock API: Analyzing text:', text?.substring(0, 50) + '...')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const mockResponses = [
    {
      isTrue: false,
      confidence: 85,
      explanation: `This text is **15% likely to be accurate**, **70% likely to contain misinformation**, and **15% likely to be misleading**.

1. **Credibility Assessment**: This content shows several red flags typical of misinformation campaigns, including emotional language and lack of credible sources.

2. **Identified Tactics**: The text uses fear-mongering language, makes unverified claims, and lacks citations from reputable sources.

3. **Educational Explanation**: These tactics are designed to bypass critical thinking by triggering emotional responses rather than logical analysis.

4. **Actionable Advice**: Cross-reference claims with fact-checking websites like Snopes.com, verify sources, and look for peer-reviewed evidence.`,
      sources: [
        {
          title: "Snopes Fact-Checking",
          url: "https://www.snopes.com",
          domain: "snopes.com"
        },
        {
          title: "FactCheck.org",
          url: "https://www.factcheck.org",
          domain: "factcheck.org"
        }
      ]
    },
    {
      isTrue: true,
      confidence: 78,
      explanation: `This text is **75% likely to be accurate**, **15% likely to contain misinformation**, and **10% likely to be misleading**.

1. **Credibility Assessment**: The content appears to be factually accurate and well-sourced, with verifiable claims.

2. **Identified Tactics**: No significant misinformation tactics detected. The language is neutral and informative.

3. **Educational Explanation**: The information aligns with established facts and credible sources.

4. **Actionable Advice**: Still verify through multiple sources and check for recent updates to ensure accuracy.`,
      sources: [
        {
          title: "Reliable News Source",
          url: "https://example.com/news",
          domain: "example.com"
        }
      ]
    }
  ]
  
  const result = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  console.log('✅ Mock API: Returning result with confidence:', result.confidence)
  return result
}

export const mockAnalyzeImage = async () => {
  console.log('🎭 Mock API: Analyzing image')
  
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const result = {
    isTrue: false,
    confidence: 82,
    explanation: `This image is **20% likely to be genuine**, **65% likely to be manipulated**, and **15% likely to be used in a misleading context**.

1. **AI-Generated Image**: High probability of AI generation detected due to unnatural textures and lighting inconsistencies.

2. **Credibility Assessment**: Multiple visual artifacts suggest digital manipulation or AI generation.

3. **Identified Issues**: Inconsistent lighting, unnatural skin textures, and suspicious background elements.

4. **Contextual Analysis**: The image appears to be created for misleading purposes, possibly to support false narratives.

5. **Verification Steps**: Use reverse image search, check for original sources, and consult image forensics tools.`,
    sources: [
      {
        title: "Google Reverse Image Search",
        url: "https://images.google.com",
        domain: "images.google.com"
      }
    ]
  }
  
  console.log('✅ Mock API: Returning image result with confidence:', result.confidence)
  return result
}