// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------
//  OpenAI SETUP
// ----------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Small helper to build a cover-letter prompt from cvData
function buildCoverLetterPrompt(cvData, company, position) {
  const { personalInfo, professionalSummary, workExperience, skills } = cvData || {};

  return (
    `You are an assistant that writes professional cover letters.\n\n` +
    `Use the candidate details below to write a clear, concise, and professional cover letter for the role "${position}" at "${company}".\n\n` +
    `Candidate name: ${personalInfo?.fullName || ''}\n` +
    `Email: ${personalInfo?.email || ''}\n` +
    `Phone: ${personalInfo?.phone || ''}\n` +
    `Location: ${personalInfo?.address || ''}\n` +
    `Title/Profession: ${personalInfo?.profession || ''}\n\n` +
    `Professional summary: ${professionalSummary || ''}\n\n` +
    `Key skills: ${(skills || []).join(', ')}\n\n` +
    `Most recent job: ${workExperience?.[0]?.jobTitle || ''} at ${
      workExperience?.[0]?.company || ''
    }\n` +
    `Responsibilities: ${workExperience?.[0]?.description || ''}\n\n` +
    `Write the letter in the first person, 3–5 paragraphs, friendly but professional tone, and do not leave any placeholders like [Company].`
  );
}

// Health check
app.get('/', (req, res) => {
  res.send('CV Builder API is running');
});

// ======================
// 1) COVER LETTER ENDPOINT
app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    // Support BOTH formats:
    //  - { cvData, company, position }
    //  - { personalInfo, professionalSummary, workExperience, education, skills, company, position }
    const {
      cvData,
      company,
      position,
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
    } = req.body || {};

    if (!company || !position) {
      return res.status(400).json({
        success: false,
        error: 'company and position are required.',
      });
    }

    const effectiveCvData =
      cvData ||
      {
        personalInfo: personalInfo || {},
        professionalSummary: professionalSummary || '',
        workExperience: workExperience || [],
        education: education || [],
        skills: skills || [],
      };

    const prompt = buildCoverLetterPrompt(effectiveCvData, company, position);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You write polished, human-sounding cover letters for job applications.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const coverLetter = completion.choices[0].message.content?.trim();

    if (!coverLetter) {
      throw new Error('OpenAI did not return cover letter text');
    }

    // IMPORTANT: include success flag for the frontend
    return res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('OpenAI error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate cover letter.',
    });
  }
});


// ======================
// 2) YOCO CHECKOUT SETUP
// ======================
const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY
  ? process.env.YOCO_SECRET_KEY.trim()
  : null;

if (!YOCO_SECRET_KEY) {
  console.warn('⚠️ YOCO_SECRET_KEY is not set in .env. Payments will fail until you add it.');
} else {
  console.log('Loaded secret key:', YOCO_SECRET_KEY.slice(0, 10) + '...');
}

// SINGLE handler used by BOTH /api/payment/process and /api/create-checkout-session
const yocoCheckoutHandler = async (req, res) => {
  console.log('Yoco checkout handler hit:', req.path);

  try {
    const { packageType, amount, cvData, coverLetterCompany, coverLetterPosition } =
      req.body || {};

    console.log('Incoming payment request:', {
      packageType,
      amount,
      coverLetterCompany,
      coverLetterPosition,
    });

    if (!amount || amount < 200) {
      // Yoco won’t take less than R2.00 (200 cents)
      return res.status(400).json({
        success: false,
        error: 'Amount missing or below minimum (R2.00).',
      });
    }

    if (!YOCO_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Yoco secret key not configured on server',
      });
    }

    // Optional: pre-generate AI cover letter for AI package
    let aiCoverLetter = null;

    if (packageType === 'ai' && cvData && process.env.OPENAI_API_KEY) {
      try {
        console.log('🔄 Generating AI cover letter as part of AI package payment...');
        const prompt = buildCoverLetterPrompt(cvData, coverLetterCompany, coverLetterPosition);

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You write polished, human-sounding cover letters for job applications.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        aiCoverLetter = completion.choices[0].message.content?.trim() || null;
        console.log('✅ AI cover letter generated during payment flow.');
      } catch (err) {
        console.error(
          'OpenAI error during payment flow (AI package):',
          err?.response?.data || err.message
        );
        // We do NOT fail the payment if AI fails – frontend will fall back to basic
        aiCoverLetter = null;
      }
    }

    // Create Yoco checkout session
    const checkoutResponse = await axios.post(
      'https://payments.yoco.com/api/checkouts',
      {
        amount, // cents
        currency: 'ZAR',
        successUrl: 'https://cvgrid.netlify.app/#builder?payment=success',
        cancelUrl: 'https://cvgrid.netlify.app/#builder?payment=cancel',
        metadata: {
          packageType: packageType || null,
          coverLetterCompany: coverLetterCompany || null,
          coverLetterPosition: coverLetterPosition || null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${YOCO_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Yoco checkout response:', checkoutResponse.data);

    const redirectUrl = checkoutResponse.data.redirectUrl;

    if (!redirectUrl) {
      return res.status(500).json({
        success: false,
        error: 'No redirect URL returned from Yoco',
      });
    }

    // Shape React expects – now ALSO returns aiCoverLetter for AI package
    return res.json({
      success: true,
      redirectUrl,
      aiCoverLetter, // may be null if not AI package or generation failed
    });
  } catch (error) {
    console.error('Yoco checkout error:', error.response?.data || error.message);

    let errorMessage = 'Payment setup failed';

    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage =
        'Yoco rejected the secret key. Double-check YOCO_SECRET_KEY in your .env (copy it exactly from the Yoco portal).';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};

app.post('/api/payment/process', yocoCheckoutHandler);
app.post('/api/create-checkout-session', yocoCheckoutHandler);

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working',
    routes: [
      '/api/generate-cover-letter',
      '/api/payment/process',
      '/api/create-checkout-session',
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
