import google.generativeai as genai
import textwrap
from PIL import Image
import requests
from io import BytesIO
import os

# Configure the Gemini API with your key from the environment variable
genai.configure(api_key=os.getenv('GOOGLE_API_KEY', 'AIzaSyAwjjxvTlkPT2tvJ3ZQoQHjbrSULjL0swk'))

def analyze_text_for_misinformation(text: str):
    """Analyzes a given text for misinformation and provides a detailed breakdown.
    
    Args:
        text (str): The text content to analyze.
        
    Returns:
        str: A detailed analysis of the text's credibility and potential misinformation tactics.
    """
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    prompt = textwrap.dedent(f"""
    You are an AI that helps users identify manipulated or misleading texts. Your task is to analyze the provided text and provide a response that is between 100 and 150 words.

    Begin your response with a single-line summary that includes a percentage-based probability for the text being genuine, manipulated, or used in a misleading context. For example: "This text is **90% likely to be accurate**, **5% likely to contain misinformation**, and **5% likely to be misleading**."

    After the summary, provide a detailed analysis that includes the following sections:

    1. **Credibility Assessment**: A general statement on the credibility of the content.
    2. **Identified Tactics**: List specific misinformation tactics found in the text (e.g., emotionally charged language, lack of sources, cherry-picking data, false context, etc.).
    3. **Educational Explanation**: For each identified tactic, explain *why* it's a red flag for misinformation.
    4. **Actionable Advice**: Provide clear, simple steps the user can take to verify the information on their own.

    Text to analyze: {text}

    Analysis:
    """)
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during text analysis: {e}"

def analyze_image_for_misinformation(image_path: str):
    """Analyzes an image from a URL for signs of manipulation or false context.
    
    Args:
        image_path (str): A URL to the image to analyze.
        
    Returns:
        str: A detailed analysis of the image's credibility.
    """
    try:
        # Download the image from the URL
        response = requests.get(image_path)
        img = Image.open(BytesIO(response.content))
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = textwrap.dedent("""
        You are an AI that helps users identify manipulated or misleading images. Your task is to analyze the provided image and provide a response that is between 200 and 250 words.

        Begin your response with a single-line summary that includes a percentage-based probability for the image being genuine, manipulated, or used in a misleading context. For example: "This image is **90% likely to be genuine**, **5% likely to be manipulated**, and **5% likely to be used in a misleading context**."

        After the summary, provide a detailed analysis that includes the following sections:

        1. **AI-Generated Image**: Tell if the image is AI generated or how much are the chances of the image being AI generated.
        2. **Credibility Assessment**: Is this image likely to be genuine, manipulated, or used in a misleading context?
        3. **Identified Issues**: Point out any visual inconsistencies or signs of manipulation (e.g., blurring, unusual shadows, deepfake artifacts).
        4. **Contextual Analysis**: If the image appears genuine but is a stock photo or a historical image, state this.
        5. **Verification Steps**: Suggest ways for the user to verify the image's authenticity (e.g., a reverse image search).

        Analysis:
        """)
        
        response = model.generate_content([prompt, img])
        return response.text
    except Exception as e:
        return f"An error occurred during image analysis: {e}"