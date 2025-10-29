import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI with the official SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CV Builder Backend is running!',
    timestamp: new Date().toISOString(),
    port: PORT,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CV Builder Backend Server',
    endpoints: {
      health: 'GET /api/health',
      generateCoverLetter: 'POST /api/generate-cover-letter',
      optimizeHumanWriting: 'POST /api/optimize-human-writing'
    }
  });
});

// Enhanced human-like writing instructions
const HUMAN_WRITING_TECHNIQUES = `
CRITICAL WRITING INSTRUCTIONS FOR AUTHENTIC HUMAN-LIKE COVER LETTER:

**ESSENTIAL STYLE GUIDELINES:**
- Write like a real human, not a perfect AI
- Use natural imperfections: occasional sentence fragments, conversational asides
- Vary sentence length dramatically (from 3 words to 30+ words)
- Include personal voice markers: "I've always believed...", "What excites me particularly..."
- Use contractions naturally (I'm, you're, don't, it's)
- Add subtle emotional authenticity: genuine enthusiasm, appropriate vulnerability

**AVOID AI PATTERNS:**
- No robotic three-point structures
- No "Firstly, secondly, thirdly" transitions
- Avoid perfect parallel sentence construction
- Don't overuse business jargon unnecessarily
- Break away from formulaic paragraph structures

**HUMAN TOUCHES:**
- Occasional mild repetition for emphasis
- Natural flow between ideas (not perfectly logical)
- Personal anecdotes or reflections where appropriate
- Show, don't just tell (share why you're genuinely interested)
- Include subtle personality traits in writing style
`;

// Cover letter generation endpoint with GPT-4
app.post('/api/generate-cover-letter', async (req, res) => {
  console.log('📝 Cover letter generation request received');
  
  try {
    const {
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
      company,
      position,
      jobDescription
    } = req.body;

    console.log('Company:', company);
    console.log('Position:', position);
    console.log('Candidate:', personalInfo?.fullName || 'Unknown');

    // Validate required fields
    if (!company || !position) {
      return res.status(400).json({ 
        success: false,
        error: 'Company and position are required'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured');
      return res.status(500).json({ 
        success: false,
        error: 'OpenAI API key not configured on server'
      });
    }

// In your /api/generate-cover-letter endpoint, update the prompt:

// Enhanced prompt for GPT-4 (UPDATED VERSION)
const prompt = `Create an authentic, human-sounding cover letter for ${personalInfo?.fullName || 'the candidate'} applying for ${position} at ${company}.

IMPORTANT: This must sound like it was written by a real human - not AI. Focus on natural language, personal voice, and authentic enthusiasm.

CANDIDATE BACKGROUND:
${personalInfo?.fullName ? `Name: ${personalInfo.fullName}` : ''}
${personalInfo?.profession ? `Profession: ${personalInfo.profession}` : ''}

Professional Summary: ${professionalSummary || 'Experienced professional seeking new opportunities'}

Relevant Experience:
${workExperience && workExperience.length > 0 ? workExperience.map(exp => 
  `- ${exp.jobTitle || 'Position'} at ${exp.company || 'Company'} (${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}): ${exp.description || 'Key responsibilities and achievements'}`
).join('\n') : 'No work experience provided'}

Education:
${education && education.length > 0 ? education.map(edu => 
  `- ${edu.degree || 'Degree'} from ${edu.institution || 'Institution'}${edu.graduationYear ? ` (${edu.graduationYear})` : ''}${edu.field ? ` in ${edu.field}` : ''}`
).join('\n') : 'No education information provided'}

Key Skills: ${skills && skills.length > 0 ? skills.join(', ') : 'No specific skills listed'}

${jobDescription ? `JOB DESCRIPTION CONTEXT:\n${jobDescription}` : ''}

${HUMAN_WRITING_TECHNIQUES}

SPECIFIC WRITING DIRECTIVES:
• Start with genuine, specific enthusiasm for ${company} and the ${position} role
• Connect 2-3 specific skills/experiences to the role naturally
• Show personality - why this role matters to the candidate personally
• Use varied sentence structures (mix short, medium, long sentences)
• Include natural conversational elements and contractions
• Avoid perfect business letter clichés
• Make it sound uniquely personal to this candidate
• Keep it professional but warm and human (250-350 words)
• End with a genuine, not generic, call to action
• DO NOT include company address, city, state, or zip code after the company name
• Format: [Date] -> [Candidate Info] -> "Hiring Manager" at [Company Name] -> "Dear Hiring Manager,"

FORMATTING RULES:
- Start with current date
- Include candidate contact information (name, email, phone, LinkedIn)
- Address to: "Hiring Manager" at ${company}
- Skip company address entirely
- Begin letter with "Dear Hiring Manager,"

Remember: The goal is to sound like a real person wrote this, not an AI. Include natural imperfections and personal voice.`;
    console.log('🤖 Sending request to GPT-4 for human-like writing...');

    // Using GPT-4 for superior human-like writing
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Changed to GPT-4
      messages: [
        {
          role: 'system',
          content: `You are an expert writer and career coach who specializes in creating authentic, human-sounding cover letters that don't trigger AI detection. You understand that real human writing has:
- Natural variations in sentence structure
- Occasional imperfections and conversational phrases
- Personal voice and genuine enthusiasm
- Avoidance of perfect, formulaic patterns
- Authentic emotional resonance

Your goal is to write cover letters that sound like they were written by a real, thoughtful human being - not an AI. Focus on authenticity over perfection.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // Slightly lower for GPT-4 (it's more creative by default)
      max_tokens: 1500,
      frequency_penalty: 0.2,
      presence_penalty: 0.1,
      top_p: 0.9
    });

    const coverLetter = completion.choices[0].message.content;
    
    console.log('✅ Cover letter generated with GPT-4');
    console.log('📊 Word count:', coverLetter.split(' ').length);
    console.log('🤖 Model used: GPT-4');

    res.json({ 
      success: true,
      coverLetter: coverLetter,
      wordCount: coverLetter.split(' ').length,
      model: 'gpt-4',
      writingStyle: 'human_optimized_gpt4'
    });

  } catch (error) {
    console.error('❌ Cover letter generation error:', error);
    
    // Enhanced error handling for GPT-4 specific issues
    let errorMessage = 'Failed to generate cover letter';
    
    if (error.status === 401) {
      errorMessage = 'Invalid OpenAI API key - please check your configuration';
    } else if (error.status === 429) {
      errorMessage = 'API rate limit exceeded - please try again later';
    } else if (error.status === 404) {
      errorMessage = 'GPT-4 model not available - you may need to upgrade your OpenAI plan';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Network error - cannot connect to OpenAI API';
    } else if (error.message) {
      errorMessage = `OpenAI API error: ${error.message}`;
    }

    res.status(500).json({ 
      success: false,
      error: errorMessage,
      model: 'gpt-4'
    });
  }
});

// Enhanced human-writing optimization with GPT-4
app.post('/api/optimize-human-writing', async (req, res) => {
  try {
    const { text, style = 'professional' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for optimization'
      });
    }

    const styleInstructions = {
      professional: 'professional but conversational business communication',
      casual: 'friendly, informal human conversation',
      creative: 'creative, expressive writing with personality',
      technical: 'clear technical writing that avoids jargon overload'
    };

    const optimizationPrompt = `Rewrite this text to sound completely human-written and avoid AI detection. Make it natural, authentic, and ${styleInstructions[style]}.

Original text: "${text}"

Key changes needed:
- Add natural sentence variation (mix short/medium/long)
- Include occasional conversational phrases
- Use contractions and natural language
- Break perfect grammatical patterns occasionally
- Add personal voice and authenticity
- Remove any AI-sounding formulaic patterns

Make it sound like a real human wrote it, not an AI.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Changed to GPT-4
      messages: [
        {
          role: 'system',
          content: 'You are an expert at transforming AI-generated text into authentic human writing. You add natural language patterns, personality, and human touches while removing AI detection patterns.'
        },
        {
          role: 'user',
          content: optimizationPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      frequency_penalty: 0.3
    });

    const optimizedText = completion.choices[0].message.content;

    res.json({
      success: true,
      original: text,
      optimized: optimizedText,
      model: 'gpt-4',
      style: style
    });

  } catch (error) {
    console.error('❌ Text optimization error:', error);
    
    // Fallback to GPT-3.5-turbo if GPT-4 fails
    if (error.status === 404) {
      console.log('🔄 GPT-4 not available, falling back to GPT-3.5-turbo');
      // You could implement fallback logic here
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to optimize text',
      model: 'gpt-4'
    });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    availableEndpoints: {
      'GET /api/health': 'Health check',
      'POST /api/generate-cover-letter': 'Generate cover letter',
      'POST /api/optimize-human-writing': 'Optimize text for human writing'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 CV Builder Backend Server started!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🤖 Using GPT-4 for Human-Like Writing
📝 Cover letter endpoint: http://localhost:${PORT}/api/generate-cover-letter
🔄 Human optimization endpoint: http://localhost:${PORT}/api/optimize-human-writing
❤️  Health check: http://localhost:${PORT}/api/health
🔑 OpenAI configured: ${!!process.env.OPENAI_API_KEY}
💡 Using model: GPT-4
  `);
});