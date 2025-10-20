const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const {
      personalInfo,
      professionalSummary,
      workExperience,
      education,
      skills,
      company,
      position
    } = JSON.parse(event.body);

    // Validate required fields
    if (!company || !position) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Company and position are required' })
      };
    }

    // Enhanced prompt for more human-like cover letters
    const prompt = `Write a professional cover letter for someone applying for the ${position} position at ${company}.

CANDIDATE BACKGROUND:
- Name: ${personalInfo.fullName || 'The candidate'}
- Profession: ${personalInfo.profession || 'Professional'}
- Email: ${personalInfo.email || ''}
- Phone: ${personalInfo.phone || ''}

PROFESSIONAL SUMMARY:
${professionalSummary || 'Experienced professional seeking new opportunities'}

WORK EXPERIENCE:
${workExperience.map(exp => 
  `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'}): ${exp.description}`
).join('\n')}

EDUCATION:
${education.map(edu => 
  `- ${edu.degree} from ${edu.institution}${edu.graduationYear ? ` (${edu.graduationYear})` : ''}`
).join('\n')}

KEY SKILLS:
${skills.join(', ')}

WRITING INSTRUCTIONS:
1. Make it sound natural and human-written, not AI-generated
2. Show genuine enthusiasm for the company and position
3. Highlight 2-3 most relevant experiences/skills
4. Keep it concise (250-350 words)
5. Use varied sentence structure and natural transitions
6. Include specific reasons why the candidate is interested in this company
7. End with a call to action for an interview
8. Use professional but warm tone
9. Avoid clichés and generic phrases
10. Make it personalized to the specific role

Format as a proper business letter with appropriate spacing.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
      presence_penalty: 0.2,
      frequency_penalty: 0.3
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const coverLetter = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ coverLetter })
    };

  } catch (error) {
    console.error('Error generating cover letter:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate cover letter',
        details: error.message 
      })
    };
  }
};