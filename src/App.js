import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

 
const templatePreviews = {
  'Classic Professional': '/images/classicprofessional.png',
  'Modern Minimalist': '/images/modernminimalist.png',
  'Corporate Clean': '/images/corporateclean.png',
  'Creative Timeline': '/images/creativetimeline.png',
  'Bold Modern': '/images/boldmodern.png',
  'Elegant Traditional': '/images/eleganttraditional.png',
  'Tech Innovator': '/images/techinnovator.png',
  'Creative Arts': '/images/creativearts.png',
  'Academic Scholar': '/images/academicscholar.png',
  'Executive Leadership': '/images/executiveleadership.png',
  'Startup Entrepreneur': '/images/startupentrepreneur.png',
  'Minimal Tech': '/images/minimaltech.png'
};
 

const colorOptions = [
  { name: 'Classic Blue', value: '#2c3e50' },
  { name: 'Professional Navy', value: '#34495e' },
  { name: 'Corporate Teal', value: '#16a085' },
  { name: 'Executive Green', value: '#27ae60' },
  { name: 'Innovative Purple', value: '#8e44ad' },
  { name: 'Modern Gray', value: '#7f8c8d' },
  { name: 'Burgundy', value: '#8B0000' },
  { name: 'Forest Green', value: '#228B22' },
  { name: 'Deep Teal', value: '#008080' },
  { name: 'Royal Blue', value: '#4169E1' },
  { name: 'Charcoal', value: '#36454F' },
  { name: 'Brick Red', value: '#B22222' }
];
 
// Template Selector Component
const TemplateSelector = ({ selectedTemplate, onTemplateChange, selectedColor, onColorChange }) => {
  // Define templates without profile image
  const noImageTemplates = ['Bold Modern', 'Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'];
 
  return (
    <div className="template-selector">
      <h3>Select Template</h3>
      <div className="template-options">
        {Object.keys(templatePreviews).map(template => (
          <div 
            key={template} 
            className={`template-option ${selectedTemplate === template ? 'selected' : ''}`}
            onClick={() => onTemplateChange(template)}
          >
            <div className="template-preview-container">
              <img 
                src={templatePreviews[template]} 
                alt={`${template} template preview`}
                className="template-preview-image"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.innerHTML = `<span>${template}</span>`;
                }}
              />
            </div>
            <div className="template-name">{template}</div>
            {/* {noImageTemplates.includes(template) && (
              <div className="template-note">No Profile Image</div>
            )} */}
          </div>
        ))}
      </div>
 
      <div className="color-selector">
        <h3>Select Color Theme</h3>
        <div className="color-options">
          {colorOptions.map(color => (
            <div 
              key={color.value}
              className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
 
      {/* Show notification for templates without profile image */}
      {noImageTemplates.includes(selectedTemplate) && (
        <div className="template-info-notice">
          <strong>Note:</strong> The {selectedTemplate} template does not support profile images.
        </div>
      )}
    </div>
  );
};


const downloadCVAfterPayment = (packageData) => {
  return new Promise((resolve) => {
    console.log('🔄 Starting CV download with smart auto-sizing...', packageData);

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.zIndex = '9999';
    

    const style = document.createElement('style');
    style.textContent = `
      .smart-auto-size {
        font-size: 14px;
        line-height: 1.4;
      }
      .smart-auto-size .section {
        margin-bottom: 12px;
      }
      .smart-auto-size .experience-item,
      .smart-auto-size .education-item {
        margin-bottom: 10px;
        padding-bottom: 8px;
      }
      .smart-auto-size h1 {
        font-size: 24px;
        margin-bottom: 8px;
      }
      .smart-auto-size h2 {
        font-size: 16px;
        margin-bottom: 6px;
      }
      .smart-auto-size h3 {
        font-size: 14px;
        margin-bottom: 4px;
      }
      .smart-auto-size p {
        margin-bottom: 6px;
        line-height: 1.3;
      }
      
      /* Compact mode for overflow */
      .smart-compact-mode {
        font-size: 13px !important;
        line-height: 1.3 !important;
      }
      .smart-compact-mode .section {
        margin-bottom: 8px !important;
      }
      .smart-compact-mode .experience-item,
      .smart-compact-mode .education-item {
        margin-bottom: 6px !important;
        padding-bottom: 4px !important;
      }
      .smart-compact-mode p {
        margin-bottom: 4px !important;
        line-height: 1.2 !important;
      }
      .smart-compact-mode h1 {
        font-size: 22px !important;
        margin-bottom: 6px !important;
      }
      .smart-compact-mode h2 {
        font-size: 15px !important;
        margin-bottom: 4px !important;
      }
      .smart-compact-mode h3 {
        font-size: 13px !important;
        margin-bottom: 3px !important;
      }
      
      /* Ultra compact for severe overflow */
      .smart-ultra-compact {
        font-size: 12px !important;
        line-height: 1.25 !important;
      }
      .smart-ultra-compact .section {
        margin-bottom: 6px !important;
      }
      .smart-ultra-compact .experience-item,
      .smart-ultra-compact .education-item {
        margin-bottom: 4px !important;
        padding-bottom: 2px !important;
      }
      .smart-ultra-compact p {
        margin-bottom: 3px !important;
        line-height: 1.15 !important;
      }
      .smart-ultra-compact h1 {
        font-size: 20px !important;
        margin-bottom: 4px !important;
      }
      .smart-ultra-compact h2 {
        font-size: 14px !important;
        margin-bottom: 3px !important;
      }
      .smart-ultra-compact h3 {
        font-size: 12px !important;
        margin-bottom: 2px !important;
      }
    `;
    tempContainer.appendChild(style);
    
    const tempRoot = document.createElement('div');
    tempRoot.id = 'temp-cv-template';
    tempRoot.className = 'smart-auto-size'; 
    tempContainer.appendChild(tempRoot);
    document.body.appendChild(tempContainer);

    const { createRoot } = require('react-dom/client');
    const root = createRoot(tempRoot);
    
    let TemplateComponent;
    switch (packageData.selectedTemplate || 'Classic Professional') {
      case 'Classic Professional':
        TemplateComponent = ClassicProfessionalTemplate;
        break;
      case 'Modern Minimalist':
        TemplateComponent = ModernMinimalistTemplate;
        break;
      case 'Corporate Clean':
        TemplateComponent = CorporateCleanTemplate;
        break;
      case 'Creative Timeline':
        TemplateComponent = CreativeTimelineTemplate;
        break;
      case 'Bold Modern':
        TemplateComponent = BoldModernTemplate;
        break;
      case 'Elegant Traditional':
        TemplateComponent = ElegantTraditionalTemplate;
        break;
      case 'Tech Innovator':
        TemplateComponent = TechInnovatorTemplate;
        break;
      case 'Creative Arts':
        TemplateComponent = CreativeArtsTemplate;
        break;
      case 'Academic Scholar':
        TemplateComponent = AcademicScholarTemplate;
        break;
      case 'Executive Leadership':
        TemplateComponent = ExecutiveLeadershipTemplate;
        break;
      case 'Startup Entrepreneur':
        TemplateComponent = StartupEntrepreneurTemplate;
        break;
      case 'Minimal Tech':
        TemplateComponent = MinimalTechTemplate;
        break;
      default:
        TemplateComponent = ClassicProfessionalTemplate;
    }

    const noImageTemplates = ['Bold Modern', 'Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'];
    const templateProps = noImageTemplates.includes(packageData.selectedTemplate || 'Classic Professional') 
      ? { 
          cvData: packageData.cvData, 
          selectedColor: packageData.selectedColor || '#2c3e50'
        } 
      : { 
          cvData: packageData.cvData, 
          profileImage: packageData.profileImage || packageData.cvData?.profileImage || null,
          selectedColor: packageData.selectedColor || '#2c3e50'

        };

    root.render(
      React.createElement(TemplateComponent, templateProps)
    );

const waitForImagesAndCapture = (retries = 5) => {
  const cvElement = document.getElementById('temp-cv-template');
  if (!cvElement) {
    console.error('❌ Temporary CV template element not found');
    document.body.removeChild(tempContainer);
    resolve(false);
    return;
  }

  const images = cvElement.getElementsByTagName('img');
  let allLoaded = true;

  for (let i = 0; i < images.length; i++) {
    if (!images[i].complete) {
      allLoaded = false;
      break;
    }
  }

  if (!allLoaded && retries > 0) {
    console.log('⏳ Waiting for profile image(s) to load before capture...');
    setTimeout(() => waitForImagesAndCapture(retries - 1), 400);
    return;
  }

  // Smart auto-sizing function (unchanged)
  const applySmartAutoSizing = (element) => {
    const A4_HEIGHT_MM = 297;
    const A4_HEIGHT_PX = A4_HEIGHT_MM * 3.78;

    const contentHeight = element.scrollHeight;
    const maxHeight = A4_HEIGHT_PX;

    console.log(`📏 Content height: ${contentHeight}px, Max height: ${maxHeight}px`);

    if (contentHeight <= maxHeight) {
      console.log('✅ Content fits perfectly with base sizing');
      return 'perfect-fit';
    }

    const overflowRatio = contentHeight / maxHeight;
    console.log(`📊 Overflow ratio: ${overflowRatio.toFixed(2)}`);

    element.classList.remove('smart-compact-mode', 'smart-ultra-compact');

    if (overflowRatio > 1.4) {
      element.classList.add('smart-ultra-compact');
      console.log('⚠️ Severe overflow – ultra compact mode applied');
      return 'ultra-compact';
    } else {
      element.classList.add('smart-compact-mode');
      console.log('ℹ️ Mild overflow – compact mode applied');
      return 'compact';
    }
  };

  const sizingMode = applySmartAutoSizing(cvElement);
  console.log('📄 Final CV Element ready for PDF with smart sizing:', sizingMode);

  html2canvas(cvElement, {
    scale: 2,
    useCORS: true,
    logging: true,
    backgroundColor: '#ffffff',
    width: cvElement.scrollWidth,
    height: cvElement.scrollHeight,
  })
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeightMm = (imgProps.height * pdfWidth) / imgProps.width;

      if (imgHeightMm <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightMm);
      } else {
        let position = 0;
        let remainingHeight = imgHeightMm;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightMm);
        remainingHeight -= pdfHeight;

        while (remainingHeight > 0) {
          position -= pdfHeight;
          remainingHeight -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightMm);
        }
      }

      pdf.save(`${packageData.cvData?.personalInfo?.fullName || 'cv'}.pdf`);

      console.log('✅ CV downloaded successfully with smart auto-sizing and multipage support');

      root.unmount();
      document.body.removeChild(tempContainer);
      resolve(true);
    })
    .catch((error) => {
      console.error('❌ CV download failed:', error);
      root.unmount();
      document.body.removeChild(tempContainer);
      resolve(false);
    });
};

setTimeout(() => {
  waitForImagesAndCapture();
}, 600);
  });
};


const buildBasicCoverLetterText = (company, position, dataToUse) => { 
  if (!company || !position) {
    console.error('❌ Company and position required for cover letter');
    return '';
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const summary =
    dataToUse.professionalSummary ||
    `My experience in ${dataToUse.personalInfo?.profession || 'this field'} aligns with your requirements.`;

  const skillsSummary =
    dataToUse.skills && dataToUse.skills.length > 0
      ? dataToUse.skills.slice(0, 3).join(', ')
      : 'key areas';

  const firstRole =
    dataToUse.workExperience && dataToUse.workExperience.length > 0
      ? dataToUse.workExperience[0].jobTitle || 'a professional'
      : 'a professional';

  return `${currentDate}

Hiring Manager
${company}

Dear Hiring Manager,

I am writing to apply for the ${position} position at ${company}. ${summary}

As ${firstRole}, I have developed skills in ${skillsSummary}, which I believe would add value to your team.

I am impressed by ${company}'s work and would welcome the opportunity to contribute to your goals. Thank you for considering my application.
`.trim();
};



const cleanCoverLetterText = (text, fullName, company) => {
  if (!text) return '';

  // Normalise line endings
  let cleaned = text.replace(/\r\n/g, '\n');

  // Split into lines
  let lines = cleaned.split('\n');

  // Trim trailing empty lines
  while (lines.length && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  // Remove trailing name line if it exactly matches the full name
  if (fullName) {
    const lowerName = fullName.toLowerCase();
    if (
      lines.length &&
      lines[lines.length - 1].trim().toLowerCase() === lowerName
    ) {
      lines.pop();
    }
  }

  // Remove trailing closing words like "Sincerely", "Warm regards", etc.
  if (lines.length) {
    const closings = [
      'sincerely,',
      'sincerely',
      'kind regards,',
      'kind regards',
      'warm regards,',
      'warm regards',
      'regards,',
      'regards',
    ];
    const lastLower = lines[lines.length - 1].trim().toLowerCase();
    if (closings.includes(lastLower)) {
      lines.pop();
    }
  }

  cleaned = lines.join('\n').trim();

  // Append ONE clean closing
  if (fullName) {
    cleaned += `

Warm regards,
${fullName}`;
  } else {
    cleaned += `

Warm regards,`;
  }

  return cleaned.trim();
};




const downloadCoverLetterPDF = (content, type, dataToUse) => {
  if (!content) {
    console.error('❌ No cover letter content to download');
    return;
  }

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  let yPosition = 30;
  const lines = content.split('\n');

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      yPosition += 3;
      return;
    }

    if (trimmedLine.includes('Dear')) {
      yPosition += 8;
      pdf.setFontSize(10);
    } else if (trimmedLine.includes('Sincerely') || trimmedLine.includes('Best regards')) {
      yPosition += 12;
      pdf.setFontSize(10);
    } else if (trimmedLine === (dataToUse.personalInfo?.fullName || 'Your Name')) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
    } else if (
      trimmedLine.includes('@') ||
      trimmedLine.includes('LinkedIn') ||
      trimmedLine.includes('Phone')
    ) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
    } else {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
    }

    const wrapped = pdf.splitTextToSize(trimmedLine, maxWidth);
    wrapped.forEach((textLine) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(textLine, margin, yPosition);
      yPosition += 5;
    });
  });

  const safeName = (dataToUse.personalInfo?.fullName || 'Cover Letter').trim();
  pdf.save(`${safeName} Cover Letter.pdf`);
};


const downloadCoverLetterAfterPayment = (packageData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const dataToUse = packageData.cvData || {};
        const company = packageData.coverLetterCompany || '';
        const position = packageData.coverLetterPosition || '';
        const fullName = dataToUse.personalInfo?.fullName || 'Your Name';

        let rawText = '';

        // 1) Prefer AI text for AI package
        const aiText =
          typeof packageData.aiCoverLetter === 'string'
            ? packageData.aiCoverLetter.trim()
            : '';

        if (packageData.packageType === 'ai' && aiText) {
          console.log('🧠 Using AI cover letter text from packageData');
          rawText = aiText;
        } else {
          console.log('✉️ Using basic template cover letter text');
          rawText = buildBasicCoverLetterText(company, position, dataToUse);
        }

        // 2) Absolute fallback so user ALWAYS gets a letter
        if (!rawText || !rawText.trim()) {
          const dateLine = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          rawText = `
${dateLine}

Dear Hiring Manager,

I am excited to apply for the ${position || 'role'} at ${
            company || 'your company'
          }. Based on my experience and skills, I believe I can add meaningful value to your team.

Warm regards,
${fullName}
          `.trim();
        }

        const finalText = cleanCoverLetterText(rawText, fullName, company);

        downloadCoverLetterPDF(finalText, 'cover-letter', dataToUse);

        console.log('✅ Cover letter downloaded successfully');
        resolve(true);
      } catch (err) {
        console.error('❌ Cover letter download failed:', err);
        resolve(false);
      }
    }, 1000);
  });
};



// // 5) Main function: trigger BOTH downloads and clean up localStorage
// const triggerFileDownloads = async (packageData) => {
//   if (!packageData) {
//     console.error('❌ triggerFileDownloads called with no packageData');
//     return;
//   }

//   console.log('📄 Triggering downloads with packageData:', packageData);

//   const cvResult = await downloadCVAfterPayment(packageData);
//   const clResult = await downloadCoverLetterAfterPayment(packageData);

//   if (cvResult && clResult) {
//     console.log('✅ All downloads completed. Cleaning up localStorage.');
//     localStorage.removeItem('pendingPackage');
//     localStorage.removeItem('paymentComplete');
//   } else {
//     console.warn('⚠️ One or more downloads failed. Keeping localStorage for retry.');
//   }
// };

const DirectPaymentModal = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  cvData,
  coverLetterCompany,
  coverLetterPosition,
  coverLetter,
}) => {

  const [isProcessing, setIsProcessing] = useState(false);
  const [yocoSDK, setYocoSDK] = useState(null);
  const [cardError, setCardError] = useState('');

  // Initialize Yoco SDK
  useEffect(() => {
    if (!isOpen) return;

    const initYoco = () => {
      if (window.YocoSDK) {
        try {
          const yoco = new window.YocoSDK({
            publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxx',
          });
          console.log('✅ Yoco SDK initialized');
          setYocoSDK(yoco);
        } catch (error) {
          console.error('❌ Yoco SDK initialization failed:', error);
        }
      } else {
        console.log('🔄 Loading Yoco SDK...');
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Yoco SDK script loaded');
          try {
            const yoco = new window.YocoSDK({
              publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxx',
            });
            setYocoSDK(yoco);
          } catch (error) {
            console.error('❌ Yoco SDK initialization failed:', error);
          }
        };
        script.onerror = (error) => {
          console.error('❌ Failed to load Yoco SDK script:', error);
        };
        document.body.appendChild(script);
      }
    };

    initYoco();
  }, [isOpen]);

  const paymentOptions = {
    'basic': {
      title: 'CV + Basic Cover Letter',
      price: 'R20.00',
      amount: 2000,
      description: 'Professional CV + Basic template-based cover letter'
    },
    'ai': {
      title: 'CV + AI Cover Letter',
      price: 'R26.00',
      amount: 2600,
      description: 'Professional CV + AI-powered personalized cover letter'
    }
  };


const handlePayment = async () => {
  setIsProcessing(true);
  setCardError('');

  try {
    console.log('🔄 Creating Yoco checkout session...');

    // Get the absolute latest data
    const latestCvData = JSON.parse(localStorage.getItem('cvData') || '{}');
    const savedTemplate =
      localStorage.getItem('selectedTemplate') || 'Classic Professional';
    const savedColor =
      localStorage.getItem('selectedColor') || '#2c3e50';

    const response = await fetch(`${BACKEND_URL}/api/payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageType: selectedPackage,
        amount: paymentOptions[selectedPackage].amount,
        cvData: latestCvData,
        coverLetterCompany,
        coverLetterPosition,
        selectedTemplate: savedTemplate,
        selectedColor: savedColor,
      }),
    });

    const data = await response.json();
    console.log('🔎 /api/payment/process response:', data);

    if (!response.ok || !data.success || !data.redirectUrl) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Normalise AI text from the server
    const aiFromServer =
      typeof data.aiCoverLetter === 'string'
        ? data.aiCoverLetter.trim()
        : '';

    // Also reuse any AI text already generated in the app (AI preview)
    const aiFromState =
      typeof coverLetter === 'string'
        ? coverLetter.trim()
        : '';

    // This is what we will store and later use for the PDF
    const aiToStore = aiFromServer || aiFromState || null;

    const packageData = {
      cvData: latestCvData,
      coverLetterCompany,
      coverLetterPosition,
      packageType: selectedPackage,
      selectedTemplate: savedTemplate,
      selectedColor: savedColor,
      aiCoverLetter: aiToStore,
      profileImage: latestCvData.profileImage || null,
      timestamp: Date.now(),
    };

    console.log('💾 Saving pendingPackage to localStorage:', packageData);

    localStorage.setItem('pendingPackage', JSON.stringify(packageData));

    // Redirect to Yoco checkout
    window.location.href = data.redirectUrl;
  } catch (error) {
    console.error('❌ Checkout creation failed:', error);
    setCardError(error.message || 'Failed to initiate payment');
    setIsProcessing(false);
  }
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="payment-modal" style={{ maxWidth: '500px' }}>
        <div className="payment-modal-header">
          <h2>Download Your CV Package</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="selected-package-info">
          <h3>{paymentOptions[selectedPackage]?.title}</h3>
          <p>{paymentOptions[selectedPackage]?.description}</p>
          <div className="package-price">{paymentOptions[selectedPackage]?.price}</div>
        </div>

        <div className="payment-method">
          <h4>Secure Payment</h4>
          
          {cardError && (
            <div className="error-message" style={{
              color: '#dc3545',
              background: '#f8d7da',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              border: '1px solid #f5c6cb'
            }}>
              {cardError}
            </div>
          )}

          <div className="yoco-info">
            <div className="security-badge">
              <span>🔒</span>
              <span>Powered by Yoco - Secure Payment</span>
            </div>
                {/* <div className="payment-test-info">
                  <h5>Test Mode - Use Any Card:</h5>
                  <strong>Card Number:</strong> Any test number (e.g., 4242 4242 4242 4242)<br/>
                  <strong>Expiry Date:</strong> Any future date<br/>
                  <strong>CVC:</strong> Any 3 digits<br/>
                  <strong>Name:</strong> Any name<br/>
                  <em>Payments are simulated in development mode</em>
                </div> */}
          </div>
        </div>

        <div className="payment-actions">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            onClick={handlePayment} 
            disabled={isProcessing || !yocoSDK}
            className="pay-btn"
            style={{background: '#28a745'}}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Processing Payment...
              </>
            ) : (
              `Pay ${paymentOptions[selectedPackage]?.price}`
            )}
          </button>
        </div>

        <div className="payment-note">
          <small>
            💡 <strong>Note:</strong> Your CV and cover letter will download automatically after payment.
          </small>
        </div>
      </div>
    </div>
  );
};
 
// ADD COVER LETTER MODAL COMPONENT
const CoverLetterModal = ({ 
  isOpen, 
  onClose, 
  coverLetter, 
  onCoverLetterChange, 
  onDownloadCoverLetter,
  isGenerating 
}) => {
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="cover-letter-modal">
        <div className="cover-letter-modal-header">
          <h2>AI Generated Cover Letter</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="cover-letter-modal-content">
          {isGenerating ? (
            <div className="loading-spinner">Generating Cover Letter...</div>
          ) : (
            <>
              <textarea
                value={coverLetter}
                onChange={(e) => onCoverLetterChange(e.target.value)}
                placeholder="Your AI generated cover letter will appear here. You can edit it as needed."
                className="cover-letter-textarea"
              />
              <div className="cover-letter-actions">
                <button onClick={onClose}>Cancel</button>
                <button onClick={onDownloadCoverLetter} className="download-cover-letter-btn">
                  Download Cover Letter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
// Preview Modal Component
const PreviewModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="preview-modal" style={{ maxWidth: '900px' }}>
        <div className="preview-modal-header">
          <h2>CV Preview - This is how your PDF will look</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="preview-modal-content">
          <div style={{ 
            transform: 'scale(0.7)', 
            transformOrigin: 'top center',
            width: '210mm',
            margin: '0 auto',
            maxHeight: '70vh',
            overflow: 'auto'
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
 
// CVForm Component
const CVForm = React.memo(({
  cvData,
  currentSkill,
  currentCertification,
  currentLanguage,
  currentInterest,
  // currentReference,
  handleInputChange,
  addExperience,
  removeExperience,
  addEducation,
  removeEducation,
  addSkill,
  removeSkill,
  addCertification,
  removeCertification,
  addLanguage,
  removeLanguage,
  addInterest,
  removeInterest,
  setCurrentSkill,
  setCurrentCertification,
  setCurrentLanguage,
  setCurrentInterest,
  // setCurrentReference,
  profileImage,
  handleImageUpload,
  removeProfileImage,
  fileInputRef,
  resetCV,
  selectedColor,
  onColorChange,
  selectedTemplate,
  // Add these 5 new props for references
  addReference,
  removeReference,
  // ADD COVER LETTER PROPS
  coverLetterCompany,
  setCoverLetterCompany,
  coverLetterPosition,
  setCoverLetterPosition,
  generateCoverLetter,
  generateBasicCoverLetter,
}) => {
  return (
    <div className="form-section">
      {/* Global / general tips at the top */}
      <div className="tip-block">
        <strong>Tip:</strong> Before you download or submit your CV, carefully read it from top to bottom to check for spelling, grammar, dates, and any small mistakes. A clean, error-free CV looks more professional.
      </div>

      <div className="form-group">
        <h3>CV Color Theme</h3>
        <div className="color-selector-form">
          <div className="color-options-form">
            {colorOptions.map(color => (
              <div 
                key={color.value}
                className={`color-option-form ${selectedColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => onColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
          <div className="selected-color-info">
            <span>Selected: </span>
            <span className="color-name">{colorOptions.find(c => c.value === selectedColor)?.name}</span>
            <div 
              className="color-preview" 
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        </div>
      </div>

      {!['Bold Modern', 'Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'].includes(selectedTemplate) ? (
        <div className="form-group">
          <h3>Profile Image (Optional)</h3>
          <div className="tip-block">
            <strong>Tip:</strong> In many professional settings a profile photo is not required, and sometimes it can be unnecessary. If you’re unsure, it’s usually safe to leave the image off and let your experience and skills speak for you.
          </div>
          <div className="image-upload-options">
            <div className="upload-option">
              <label htmlFor="file-upload" className="upload-btn">
                Upload Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            {profileImage && (
              <div className="upload-option">
                <button className="remove-image-btn" onClick={removeProfileImage}>
                  Remove Image
                </button>
              </div>
            )}
          </div>
          {profileImage && (
            <div className="image-preview">
              <img src={profileImage} alt="Profile preview" />
            </div>
          )}
        </div>
      ) : (
        <div className="form-group">
          <h3>Profile Image</h3>
          <div className="tip-block">
            <strong>Tip:</strong> This template does not support profile images. In most professional CVs, a photo is not necessary, so you can safely focus on your content.
          </div>
          <div className="no-image-notice">
            <p>The <strong>{selectedTemplate}</strong> template does not support profile images.</p>
          </div>
        </div>
      )}

      <div className="form-group">
        <h3>Personal Information</h3>
        <div className="tip-block">
          <strong>Tip:</strong> Use a professional email address, include a working phone number, and make sure links (like LinkedIn) actually open to your profile. Keep this section clean and accurate.
        </div>
        <input
          type="text"
          placeholder="Full Name"
          value={cvData.personalInfo.fullName}
          onChange={(e) => handleInputChange('personalInfo.fullName', 'fullName', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={cvData.personalInfo.email}
          onChange={(e) => handleInputChange('personalInfo.email', 'email', e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={cvData.personalInfo.phone}
          onChange={(e) => handleInputChange('personalInfo.phone', 'phone', e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={cvData.personalInfo.address}
          onChange={(e) => handleInputChange('personalInfo.address', 'address', e.target.value)}
        />
        <input
          type="text"
          placeholder="LinkedIn URL"
          value={cvData.personalInfo.linkedin}
          onChange={(e) => handleInputChange('personalInfo.linkedin', 'linkedin', e.target.value)}
        />
        <input
          type="text"
          placeholder="Profession/Title"
          value={cvData.personalInfo.profession}
          onChange={(e) => handleInputChange('personalInfo.profession', 'profession', e.target.value)}
        />
      </div>

      <div className="form-group">
        <h3>Professional Summary</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Write 2–3 lines like an elevator pitch. Start with a strong phrase (e.g., “Results-driven software developer…”). Tailor it to the role you want and highlight your strongest skills or achievements.
        </div>
        <textarea
          placeholder="Write a compelling summary of your professional background"
          value={cvData.professionalSummary}
          onChange={(e) => handleInputChange('professionalSummary', '', e.target.value)}
        />
      </div>

      <div className="form-group">
        <h3>Work Experience</h3>
        <div className="tip-block">
          <strong>Tips:</strong> List your most recent roles first. Under each job, use short sentences or bullet-style descriptions starting with action verbs (e.g., “Led”, “Managed”, “Improved”) and, where possible, include results or numbers (e.g., “increased sales by 20%”). Keep it concise and relevant to the jobs you’re applying for.
        </div>
        {cvData.workExperience.map((exp, index) => (
          <div key={exp.id} className="experience-item">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.jobTitle}
              onChange={(e) => handleInputChange('workExperience', 'jobTitle', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleInputChange('workExperience', 'company', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => handleInputChange('workExperience', 'location', e.target.value, index)}
            />
            <div className="date-group">
              <input
                type="text"
                placeholder="Start Date (MM/YYYY)"
                value={exp.startDate}
                onChange={(e) => handleInputChange('workExperience', 'startDate', e.target.value, index)}
              />
              <input
                type="text"
                placeholder="End Date (MM/YYYY) or Present"
                value={exp.endDate}
                onChange={(e) => handleInputChange('workExperience', 'endDate', e.target.value, index)}
              />
            </div>
            <textarea
              placeholder="Description of responsibilities and achievements"
              value={exp.description}
              onChange={(e) => handleInputChange('workExperience', 'description', e.target.value, index)}
            />
            {cvData.workExperience.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeExperience(exp.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addExperience}>
          + Add Experience
        </button>
      </div>

      <div className="form-group">
        <h3>Education</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Start with your most recent or highest qualification. Include the institution, degree, field of study, and year. If you’re still studying, indicate that. You can add relevant modules, projects, or achievements if they help show why you’re a good fit.
        </div>
        {cvData.education.map((edu, index) => (
          <div key={edu.id} className="education-item">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => handleInputChange('education', 'field', e.target.value, index)}
            />
            <div className="date-group">
              <input
                type="text"
                placeholder="Graduation Year"
                value={edu.graduationYear}
                onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value, index)}
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa}
                onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
              />
            </div>
            {cvData.education.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeEducation(edu.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addEducation}>
          + Add Education
        </button>
      </div>

      <div className="form-group">
        <h3>Skills</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Match your skills to the job description. Be specific (e.g., “React & TypeScript”, “Advanced Excel: PivotTables, Macros”). Keep each skill short and clear. Mix technical skills and important soft skills (e.g., communication, problem-solving).
        </div>
        <div className="skills-input">
          <input
            type="text"
            placeholder="Add a skill"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <button type="button" className="add-btn" onClick={addSkill}>
            Add
          </button>
        </div>
        <div className="skills-list">
          {cvData.skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button onClick={() => removeSkill(index)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-group">
        <h3>Certifications</h3>
        <div className="tip-block">
          <strong>Tips:</strong> List certifications, short courses, or awards that are relevant and up-to-date. Include the issuing organization and year. Focus on items that actually support the kind of roles you are applying for.
        </div>
        <div className="certification-input">
          <input
            type="text"
            placeholder="Certification Name"
            value={currentCertification.name}
            onChange={(e) => setCurrentCertification({...currentCertification, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Issuing Organization"
            value={currentCertification.issuer}
            onChange={(e) => setCurrentCertification({...currentCertification, issuer: e.target.value})}
          />
          <input
            type="text"
            placeholder="Year"
            value={currentCertification.year}
            onChange={(e) => setCurrentCertification({...currentCertification, year: e.target.value})}
          />
          <button type="button" className="add-btn" onClick={addCertification}>
            Add
          </button>
        </div>
        <div className="certifications-list">
          {cvData.certifications.map((cert, index) => (
            <div key={index} className="certification-tag">
              <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
              <button onClick={() => removeCertification(index)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <h3>Languages</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Only include languages where you can actually communicate at the level you choose. Be honest about your proficiency (Basic, Intermediate, Advanced, Native).
        </div>
        <div className="language-input">
          <input
            type="text"
            placeholder="Language"
            value={currentLanguage.name}
            onChange={(e) => setCurrentLanguage({...currentLanguage, name: e.target.value})}
          />
          <select
            value={currentLanguage.proficiency}
            onChange={(e) => setCurrentLanguage({...currentLanguage, proficiency: e.target.value})}
          >
            <option value="">Select Proficiency</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Native">Native</option>
          </select>
          <button type="button" className="add-btn" onClick={addLanguage}>
            Add
          </button>
        </div>
        <div className="languages-list">
          {cvData.languages.map((lang, index) => (
            <div key={index} className="language-tag">
              {lang.name} ({lang.proficiency})
              <button onClick={() => removeLanguage(index)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <h3>Interests</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Keep this short (2–4 real interests). Choose things that say something positive about you, like discipline, creativity, teamwork, or curiosity (for example, “Marathon running”, “Book club”, “Open-source contributions”). Avoid long or generic lists.
        </div>
        <div className="interest-input">
          <input
            type="text"
            placeholder="Add an interest"
            value={currentInterest}
            onChange={(e) => setCurrentInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInterest()}
          />
          <button type="button" className="add-btn" onClick={addInterest}>
            Add
          </button>
        </div>
        <div className="interests-list">
          {cvData.interests.map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
              <button onClick={() => removeInterest(index)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* REFERENCES SECTION */}
      <div className="form-group">
        <h3>References</h3>
        <div className="tip-block">
          <strong>Tips:</strong> Only add people who have agreed to act as your reference, and make sure their contact details are up to date. Choose people who can speak positively about your work or character (e.g., previous managers, supervisors, lecturers). If you prefer, you can also use “References available on request”.
        </div>
        {cvData.references.map((ref, index) => (
          <div key={ref.id} className="reference-item">
            <h4>Reference {index + 1}</h4>
            <input
              type="text"
              placeholder="Reference Name"
              value={ref.name}
              onChange={(e) => handleInputChange('references', 'name', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Position"
              value={ref.position}
              onChange={(e) => handleInputChange('references', 'position', e.target.value, index)}
            />
            <input
              type="text"
              placeholder="Company"
              value={ref.company}
              onChange={(e) => handleInputChange('references', 'company', e.target.value, index)}
            />
            <input
              type="email"
              placeholder="Email"
              value={ref.email}
              onChange={(e) => handleInputChange('references', 'email', e.target.value, index)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={ref.phone}
              onChange={(e) => handleInputChange('references', 'phone', e.target.value, index)}
            />
            {cvData.references.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeReference(ref.id)}
              >
                Remove Reference
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addReference}>
          + Add Reference
        </button>
      </div>

      <div className="form-group">
        <div className="tip-block">
          <strong>Final Tip:</strong> After filling in every section, take a moment to read your CV as if you were the employer. Check spelling, dates, job titles, and links. Small mistakes can distract from a strong CV.
        </div>
        <button type="button" className="reset-cv-btn" onClick={resetCV}>
          Reset CV
        </button>
      </div>
    </div>
  );
});


 
const ClassicProfessionalTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template classic-professional" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        {profileImage && (
          <div className="cv-profile-image">
            <img src={profileImage} alt="Profile" />
          </div>
        )}
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Professional Title'}</p>
          </div>
        </div>
      </div>
 
      <div className="cv-body">
        <div className="cv-sidebar">
          <div className="contact-info section">
            <h2>Contact</h2>
            {cvData.personalInfo.email && <p><span>Email:</span> {cvData.personalInfo.email}</p>}
            {cvData.personalInfo.phone && <p><span>Phone:</span> {cvData.personalInfo.phone}</p>}
            {cvData.personalInfo.address && <p><span>Address:</span> {cvData.personalInfo.address}</p>}
            {cvData.personalInfo.linkedin && <p><span>LinkedIn:</span> {cvData.personalInfo.linkedin}</p>}
          </div>
 
          {cvData.skills.length > 0 && (
            <div className="skills section">
              <h2>Skills</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.languages.length > 0 && (
            <div className="languages section">
              <h2>Languages</h2>
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        <div className="cv-main">
          {cvData.professionalSummary && (
            <div className="section">
              <h2>Professional Summary</h2>
              <p>{cvData.professionalSummary}</p>
            </div>
          )}
 
          {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
            <div className="section">
              <h2>Work Experience</h2>
              {cvData.workExperience.map((exp, index) => (
                (exp.jobTitle || exp.company) && (
                  <div key={index} className="experience-item">
                    <h3>{exp.jobTitle}</h3>
                    <div className="company-details">
                      <span className="company">{exp.company}</span>
                      {exp.location && <span className="location"> - {exp.location}</span>}
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                    <p className="description">{exp.description}</p>
                  </div>
                )
              ))}
            </div>
          )}
 
          {cvData.education.some(edu => edu.institution || edu.degree) && (
            <div className="section">
              <h2>Education</h2>
              {cvData.education.map((edu, index) => (
                (edu.institution || edu.degree) && (
                  <div key={index} className="education-item">
                    <h3>{edu.degree}</h3>
                    <p className="institution">{edu.institution}</p>
                    <div className="education-details">
                      {edu.graduationYear && <span>{edu.graduationYear}</span>}
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                    {edu.field && <p className="field">{edu.field}</p>}
                  </div>
                )
              ))}
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>Certifications</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
                </div>
              ))}
            </div>
          )}
 
          {/* ADD REFERENCES SECTION TO TEMPLATE */}
          {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
            <div className="section">
              <h2>References</h2>
              <div className="references-list">
                {cvData.references.map((ref, index) => (
                  ref.name && (
                    <div key={index} className="reference-item">
                      <h3>{ref.name}</h3>
                      <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                      {ref.email && <p>Email: {ref.email}</p>}
                      {ref.phone && <p>Phone: {ref.phone}</p>}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
 
          {cvData.interests.length > 0 && (
            <div className="section">
              <h2>Interests</h2>
              <div className="interests-list">
                {cvData.interests.map((interest, index) => (
                  <span key={index} className="interest-item">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 

const TechInnovatorTemplate = ({ cvData, selectedColor }) => {
  return (
    <div className="cv-template tech-innovator" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Tech Professional'}</p>
            <div className="contact-info">
              {cvData.personalInfo.email && <span>✉️ {cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span>📱 {cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.linkedin && <span>💼 {cvData.personalInfo.linkedin}</span>}
            </div>
          </div>
          {/* Profile image removed from this template */}
        </div>
      </div>
 
      <div className="cv-body">
        {/* ... rest of the template remains the same ... */}
        {cvData.professionalSummary && (
          <div className="section">
            <h2><i className="icon"></i> Professional Summary</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2><i className="icon"></i> Experience</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2><i className="icon"></i> Education</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <div>
                      <h3>{edu.degree}</h3>
                      <div className="institution">{edu.institution}</div>
                    </div>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  {edu.field && <p className="field">{edu.field}</p>}
                  {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2><i className="icon"></i> Technical Skills</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2><i className="icon"></i> Certifications</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO TECH INNOVATOR TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2><i className="icon"></i> References</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.languages.length > 0 && (
            <div className="section">
              <h2><i className="icon"></i> Languages</h2>
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          )}
 
          {cvData.interests.length > 0 && (
            <div className="section">
              <h2><i className="icon"></i> Interests</h2>
              <div className="interests-list">
                {cvData.interests.map((interest, index) => (
                  <span key={index} className="interest-item">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
 
// New Template: Creative Arts
const CreativeArtsTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template creative-arts" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Creative Professional'}</p>
            <div className="contact-info">
              {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span> • {cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.linkedin && <span> • {cvData.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>ARTISTIC PROFILE</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>CREATIVE EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h3>{exp.jobTitle}</h3>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="company-details">
                    <span className="company">{exp.company}</span>
                    {exp.location && <span className="location">, {exp.location}</span>}
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION & TRAINING</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  <p className="institution">{edu.institution}</p>
                  {edu.field && <p className="field">{edu.field}</p>}
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>SKILLS & TECHNIQUES</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>EXHIBITIONS & SHOWS</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO CREATIVE ARTS TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        {cvData.interests.length > 0 && (
          <div className="section">
            <h2>ARTISTIC INFLUENCES</h2>
            <div className="interests-list">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="interest-item">{interest}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// New Template: Academic Scholar
const AcademicScholarTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template academic-scholar" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Academic Professional'}</p>
            <div className="contact-info">
              {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span> | {cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.linkedin && <span> | {cvData.personalInfo.linkedin}</span>}
            </div>
          </div>
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
        </div>
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>RESEARCH PROFILE</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>ACADEMIC APPOINTMENTS</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  <p className="institution">{edu.institution}</p>
                  {edu.field && <p className="field">{edu.field}</p>}
                  {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.publications && cvData.publications.length > 0 && (
            <div className="section">
              <h2>PUBLICATIONS</h2>
              {cvData.publications.map((pub, index) => (
                <div key={index} className="publication-item">
                  <div className="publication-title">{pub.title}</div>
                  <div className="publication-details">{pub.journal}, {pub.year}</div>
                </div>
              ))}
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>FELLOWSHIPS & AWARDS</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO ACADEMIC SCHOLAR TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>RESEARCH METHODS</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.languages.length > 0 && (
            <div className="section">
              <h2>LANGUAGES</h2>
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
// New Template: Executive Leadership
// Executive Leadership Template - IMPROVED DESIGN
const ExecutiveLeadershipTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template executive-leadership" style={{ '--primary-color': selectedColor }}>
      {/* IMPROVED HEADER SECTION */}
      <div className="cv-header">
        <div className="header-content">
          <div className="header-main">
            <div className="name-title-section">
              <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
              <div className="profession-divider"></div>
              <p className="profession">{cvData.personalInfo.profession || 'Executive Leader'}</p>
            </div>
            <div className="contact-info-executive">
              {cvData.personalInfo.email && (
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>{cvData.personalInfo.email}</span>
                </div>
              )}
              {cvData.personalInfo.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <span>{cvData.personalInfo.phone}</span>
                </div>
              )}
              {cvData.personalInfo.address && (
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>{cvData.personalInfo.address}</span>
                </div>
              )}
              {cvData.personalInfo.linkedin && (
                <div className="contact-item">
                  <span className="contact-icon">💼</span>
                  <span>{cvData.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>
          {profileImage && (
            <div className="cv-profile-image-executive">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
        </div>
      </div>
 
      <div className="divider"></div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>EXECUTIVE SUMMARY</h2>
            <p className="executive-summary">{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>LEADERSHIP EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}{exp.location && ` | ${exp.location}`}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  <p className="institution">{edu.institution}</p>
                  {edu.field && <p className="field">{edu.field}</p>}
                </div>
              )
            ))}
          </div>
        )}
 
        {/* ADD REFERENCES SECTION TO EXECUTIVE LEADERSHIP TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        <div className="skills-interests-section">
          <div className="section-row">
            {cvData.skills.length > 0 && (
              <div className="section">
                <h2>CORE COMPETENCIES</h2>
                <div className="skills-list">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="skill-item">{skill}</div>
                  ))}
                </div>
              </div>
            )}
 
            {cvData.certifications.length > 0 && (
              <div className="section">
                <h2>BOARD POSITIONS</h2>
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <strong>{cert.name}</strong>
                    <div>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          <div className="section-row">
            {cvData.languages.length > 0 && (
              <div className="section">
                <h2>LANGUAGES</h2>
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-proficiency">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            )}
 
            {cvData.interests.length > 0 && (
              <div className="section">
                <h2>INTERESTS</h2>
                <div className="interests-list">
                  {cvData.interests.map((interest, index) => (
                    <span key={index} className="interest-item">{interest}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
// New Template: Startup Entrepreneur
const StartupEntrepreneurTemplate = ({ cvData, selectedColor }) => {
  return (
    <div className="cv-template startup-entrepreneur" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          {/* Profile image removed from this template */}
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Entrepreneur'}</p>
            <div className="achievement-stats">
              {cvData.workExperience.length > 0 && (
                <span className="stat">{cvData.workExperience.length}+ Ventures</span>
              )}
              {cvData.certifications.length > 0 && (
                <span className="stat">{cvData.certifications.length}+ Achievements</span>
              )}
            </div>
            <div className="contact-info">
              {cvData.personalInfo.email && <span style={{color: '#ffffff', fontWeight: '600'}}>{cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span style={{color: '#ffffff', fontWeight: '600'}}>{cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.linkedin && <span style={{color: '#ffffff', fontWeight: '600'}}>{cvData.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
 
      <div className="cv-body">
        {/* ... rest of the template remains the same ... */}
        {cvData.professionalSummary && (
          <div className="section">
            <h2>ENTREPRENEURIAL PROFILE</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>VENTURES & EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h3>{exp.jobTitle}</h3>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="company-details">
                    <span className="company">{exp.company}</span>
                    {exp.location && <span className="location">, {exp.location}</span>}
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <h3>{edu.degree}</h3>
                  <p className="institution">{edu.institution}</p>
                  <div className="education-details">
                    {edu.graduationYear && <span>{edu.graduationYear}</span>}
                    {edu.field && <span> • {edu.field}</span>}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>KEY SKILLS</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>ACHIEVEMENTS</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO STARTUP ENTREPRENEUR TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        {cvData.interests.length > 0 && (
          <div className="section">
            <h2>INDUSTRY FOCUS</h2>
            <div className="interests-list">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="interest-item">{interest}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
 
// New Template: Minimal Tech
const MinimalTechTemplate = ({ cvData, selectedColor }) => {
  return (
    <div className="cv-template minimal-tech" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Tech Professional'}</p>
          </div>
          {/* Profile image removed from this template */}
        </div>
      </div>
 
      <div className="contact-bar">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>|</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.linkedin && <span>|</span>}
        {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
      </div>
 
      <div className="cv-body">
        {/* ... rest of the template remains the same ... */}
        {cvData.professionalSummary && (
          <div className="section">
            <p className="summary">{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  <p className="institution">{edu.institution}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>SKILLS</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.languages.length > 0 && (
            <div className="section">
              <h2>LANGUAGES</h2>
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO MINIMAL TECH TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
const ModernMinimalistTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template modern-minimalist" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Professional Title'}</p>
          </div>
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
        </div>
      </div>
 
      <div className="contact-bar">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.linkedin && <span>• {cvData.personalInfo.linkedin}</span>}
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>SUMMARY</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h3>{exp.jobTitle}</h3>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <h3>{edu.degree}</h3>
                  <div className="institution">{edu.institution}</div>
                  <div className="education-details">
                    {edu.graduationYear && <span>{edu.graduationYear}</span>}
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>SKILLS</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.languages.length > 0 && (
            <div className="section">
              <h2>LANGUAGES</h2>
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO MODERN MINIMALIST TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// Corporate Clean Template
const CorporateCleanTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template corporate-clean" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-main">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Professional Title'}</p>
          </div>
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
        </div>
        <div className="contact-info">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span> | {cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.linkedin && <span> | {cvData.personalInfo.linkedin}</span>}
        </div>
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>PROFESSIONAL EXPERIENCE</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>EDUCATION</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <h3>{edu.degree}</h3>
                  <p className="institution">{edu.institution}</p>
                  <div className="education-details">
                    {edu.graduationYear && <span>{edu.graduationYear}</span>}
                    {edu.field && <span> - {edu.field}</span>}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>CORE COMPETENCIES</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>CERTIFICATIONS</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO CORPORATE CLEAN TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// Creative Timeline Template
const CreativeTimelineTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template creative-timeline" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Creative Professional'}</p>
            <div className="contact-info">
              {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
              {cvData.personalInfo.phone && <span> • {cvData.personalInfo.phone}</span>}
              {cvData.personalInfo.linkedin && <span> • {cvData.personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>ABOUT ME</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        <div className="timeline-section">
          {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
            <div className="section">
              <h2>EXPERIENCE TIMELINE</h2>
              <div className="timeline">
                {cvData.workExperience.map((exp, index) => (
                  (exp.jobTitle || exp.company) && (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                        <h3>{exp.jobTitle}</h3>
                        <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                        <p className="description">{exp.description}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
 
          {cvData.education.some(edu => edu.institution || edu.degree) && (
            <div className="section">
              <h2>EDUCATION TIMELINE</h2>
              <div className="timeline">
                {cvData.education.map((edu, index) => (
                  (edu.institution || edu.degree) && (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="date-range">{edu.graduationYear}</div>
                        <h3>{edu.degree}</h3>
                        <div className="institution">{edu.institution}</div>
                        {edu.field && <p className="field">{edu.field}</p>}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO CREATIVE TIMELINE TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>REFERENCES</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        <div className="skills-interests-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>SKILLS</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.interests.length > 0 && (
            <div className="section">
              <h2>INTERESTS</h2>
              <div className="interests-list">
                {cvData.interests.map((interest, index) => (
                  <span key={index} className="interest-item">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
// Bold Modern Template
const BoldModernTemplate = ({ cvData, selectedColor }) => {
  return (
    <div className="cv-template bold-modern" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Professional Title'}</p>
          </div>
          {/* Profile image removed from this template */}
        </div>
      </div>
 
      <div className="contact-bar">
        <div className="contact-details">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
        </div>
      </div>
 
      <div className="cv-body">
        {/* ... rest of the template remains the same ... */}
        {cvData.professionalSummary && (
          <div className="section">
            <h2>PROFILE</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        <div className="two-column-layout">
          <div className="main-column">
            {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
              <div className="section">
                <h2>EXPERIENCE</h2>
                {cvData.workExperience.map((exp, index) => (
                  (exp.jobTitle || exp.company) && (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <h3>{exp.jobTitle}</h3>
                        <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                      </div>
                      <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                      <p className="description">{exp.description}</p>
                    </div>
                  )
                ))}
              </div>
            )}
 
            {cvData.education.some(edu => edu.institution || edu.degree) && (
              <div className="section">
                <h2>EDUCATION</h2>
                {cvData.education.map((edu, index) => (
                  (edu.institution || edu.degree) && (
                    <div key={index} className="education-item">
                      <h3>{edu.degree}</h3>
                      <div className="institution">{edu.institution}</div>
                      <div className="education-details">
                        {edu.graduationYear && <span>{edu.graduationYear}</span>}
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
 
          <div className="sidebar-column">
            {cvData.skills.length > 0 && (
              <div className="section">
                <h2>SKILLS</h2>
                <div className="skills-list">
                  {cvData.skills.map((skill, index) => (
                    <div key={index} className="skill-item">{skill}</div>
                  ))}
                </div>
              </div>
            )}
 
            {cvData.languages.length > 0 && (
              <div className="section">
                <h2>LANGUAGES</h2>
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-proficiency">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            )}
 
            {cvData.certifications.length > 0 && (
              <div className="section">
                <h2>CERTIFICATIONS</h2>
                {cvData.certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <strong>{cert.name}</strong>
                    <div>{cert.issuer} ({cert.year})</div>
                  </div>
                ))}
              </div>
            )}
 
            {/* ADD REFERENCES SECTION TO BOLD MODERN TEMPLATE */}
            {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
              <div className="section">
                <h2>REFERENCES</h2>
                <div className="references-list">
                  {cvData.references.map((ref, index) => (
                    ref.name && (
                      <div key={index} className="reference-item">
                        <h3>{ref.name}</h3>
                        <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                        {ref.email && <p>Email: {ref.email}</p>}
                        {ref.phone && <p>Phone: {ref.phone}</p>}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
// Elegant Traditional Template
const ElegantTraditionalTemplate = ({ cvData, profileImage, selectedColor }) => {
  return (
    <div className="cv-template elegant-traditional" style={{ '--primary-color': selectedColor }}>
      <div className="cv-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{cvData.personalInfo.fullName || 'Your Name'}</h1>
            <p className="profession">{cvData.personalInfo.profession || 'Professional Title'}</p>
          </div>
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
          )}
        </div>
      </div>
 
      <div className="contact-info-bar">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span> | {cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.address && <span> | {cvData.personalInfo.address}</span>}
        {cvData.personalInfo.linkedin && <span> | {cvData.personalInfo.linkedin}</span>}
      </div>
 
      <div className="cv-body">
        {cvData.professionalSummary && (
          <div className="section">
            <h2>Career Objective</h2>
            <p>{cvData.professionalSummary}</p>
          </div>
        )}
 
        {cvData.workExperience.some(exp => exp.jobTitle || exp.company) && (
          <div className="section">
            <h2>Employment History</h2>
            {cvData.workExperience.map((exp, index) => (
              (exp.jobTitle || exp.company) && (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div>
                      <h3>{exp.jobTitle}</h3>
                      <div className="company">{exp.company}{exp.location && `, ${exp.location}`}</div>
                    </div>
                    <div className="date-range">{exp.startDate} - {exp.endDate || 'Present'}</div>
                  </div>
                  <p className="description">{exp.description}</p>
                </div>
              )
            ))}
          </div>
        )}
 
        {cvData.education.some(edu => edu.institution || edu.degree) && (
          <div className="section">
            <h2>Academic Qualifications</h2>
            {cvData.education.map((edu, index) => (
              (edu.institution || edu.degree) && (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="graduation-year">{edu.graduationYear}</div>
                  </div>
                  <p className="institution">{edu.institution}</p>
                  {edu.field && <p className="field">{edu.field}</p>}
                  {edu.gpa && <p className="gpa">Grade: {edu.gpa}</p>}
                </div>
              )
            ))}
          </div>
        )}
 
        <div className="two-column-section">
          {cvData.skills.length > 0 && (
            <div className="section">
              <h2>Professional Skills</h2>
              <div className="skills-list">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">{skill}</div>
                ))}
              </div>
            </div>
          )}
 
          {cvData.certifications.length > 0 && (
            <div className="section">
              <h2>Certifications</h2>
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <strong>{cert.name}</strong>
                  <div>{cert.issuer} ({cert.year})</div>
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* ADD REFERENCES SECTION TO ELEGANT TRADITIONAL TEMPLATE */}
        {cvData.references.length > 0 && cvData.references.some(ref => ref.name) && (
          <div className="section">
            <h2>References</h2>
            <div className="references-list">
              {cvData.references.map((ref, index) => (
                ref.name && (
                  <div key={index} className="reference-item">
                    <h3>{ref.name}</h3>
                    <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>
                    {ref.email && <p>Email: {ref.email}</p>}
                    {ref.phone && <p>Phone: {ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
 
        {cvData.languages.length > 0 && (
          <div className="section">
            <h2>Languages</h2>
            <div className="languages-list">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="language-item">
                  <span className="language-name">{lang.name}</span>
                  <span className="language-proficiency">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// ... include all your other templates exactly as they were
 
const LandingPage = ({ onGetStarted }) => {
  const featuredTemplates = ['Classic Professional', 'Tech Innovator', 'Creative Arts', 'Executive Leadership', 'Modern Minimalist', 'Startup Entrepreneur'];

  const handleTemplateSelect = (template) => {
    localStorage.setItem('selectedTemplate', template);
    localStorage.setItem('scrollToForm', 'true');
    onGetStarted();
  };

  return (
    <div className="landing-page-enhanced">
      {/* Simplified Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

{/* MATURE, TRUTHFUL HERO SECTION */}
<section className="hero-vibrant">
  <div className="hero-container">
    {/* Logo */}
    <div className="hero-logo-section">
      <img src="/images/logo.png" alt="CVGrid Logo" className="hero-logo" />
    </div>

    {/* Main Content */}
    <div className="hero-content-centered">
      <h1 className="hero-title">
        Professional CVs<br />
        <span className="gradient-text">Made Simple</span>
      </h1>
      
      <p className="hero-description">
        Create stunning, professional CVs in minutes. No design skills needed.<br />
        Choose from carefully crafted templates and download instantly as PDF.
      </p>

      {/* Real Features - No Exaggeration */}
      <div className="hero-features">
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Professional Templates</h3>
          <p>Carefully designed templates that follow industry standards and best practices</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant PDF Export</h3>
          <p>Download your CV as a print-ready PDF file with perfect formatting</p>
        </div>
        
        {/* <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Mobile Friendly</h3>
          <p>Create and edit your CV from any device, anywhere</p>
        </div> */}
      </div>

      {/* CTA Buttons */}
      <div className="hero-actions">
        <button className="cta-primary" onClick={onGetStarted}>
          <span>✨</span>
          Create Your CV Now
          <span className="price-tag">R20.00</span>
        </button>
        <button className="cta-secondary" onClick={onGetStarted}>
          Browse Templates
        </button>
      </div>

      {/* Trust Indicators - Honest & Real */}
      <div className="trust-indicators">
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          No Registration Required
        </div>
        <div className="trust-item">
          <span className="trust-icon">💳</span>
          Secure Payment
        </div>
        <div className="trust-item">
          <span className="trust-icon">📄</span>
          Instant Download
        </div>
      </div>
    </div>
  </div>
  
  {/* Subtle Background Elements */}
  <div className="floating-shapes">
    <div className="shape shape-1"></div>
    <div className="shape shape-2"></div>
    <div className="shape shape-3"></div>
  </div>
</section>


      {/* Templates Showcase Section */}
      <section className="templates-showcase">
        <div className="container">
          <div className="section-header">
            <h2>Beautiful Templates for Every Professional</h2>
            <p>From corporate executive to creative freelancer - find your perfect match</p>
          </div>

          <div className="templates-grid-enhanced">
            {featuredTemplates.map((template, index) => (
              <div 
                key={template} 
                className="template-card-enhanced"
                onClick={() => handleTemplateSelect(template)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="template-image-wrapper">
                  <img 
                    src={templatePreviews[template]} 
                    alt={template}
                    className="template-image-enhanced"
                  />
                  <div className="template-overlay-enhanced">
                    <button className="use-template-btn-enhanced">
                      Use This Template
                    </button>
                  </div>
                  <div className="template-badge">
                    {['Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'].includes(template)}
                    {['Executive Leadership', 'Corporate Clean'].includes(template)}
                    {['Creative Arts', 'Creative Timeline'].includes(template)}
                  </div>
                </div>
                <div className="template-info-enhanced">
                  <h3>{template}</h3>
                  <div className="template-features">
                    <span className="template-feature">PDF Export</span>
                    <span className="template-feature">Color Custom</span>
                    <span className="template-feature">ATS Friendly</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <button className="view-all-btn" onClick={onGetStarted}>
              View All 12+ Templates
            </button>
          </div>
        </div>
      </section>

      {/* Features Gallery */}
      <section className="features-gallery">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for Job Search Success</h2>
            <p>Professional tools that make your job application stand out</p>
          </div>

          <div className="features-grid-vibrant">
            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎨</div>
              </div>
              <h3>Professional Designs</h3>
              <p>Carefully crafted templates that highlight your experience and catch recruiters' attention</p>
            </div>

            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚡</div>
              </div>
              <h3>Quick & Easy</h3>
              <p>Fill your details once and switch between templates instantly. No design skills needed</p>
            </div>

            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📄</div>
              </div>
              <h3>Instant PDF Download</h3>
              <p>Download high-quality, print-ready PDFs optimized for both online and physical applications</p>
            </div>

            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🤖</div>
              </div>
              <h3>AI Cover Letters</h3>
              <p>Generate tailored cover letters that match your CV and the specific job you're applying for</p>
            </div>

            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3>ATS Optimized</h3>
              <p>All templates are designed to pass through Applicant Tracking Systems successfully</p>
            </div>

            <div className="feature-card-vibrant">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">💫</div>
              </div>
              <h3>Color Customization</h3>
              <p>Match your CV to your personal brand with professionally curated color schemes</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Steps */}
      <section className="process-steps">
        <div className="container">
          <div className="section-header">
            <h2>Create Your Perfect CV in 3 Simple Steps</h2>
            <p>Quick, easy, and professional - start to finish in minutes</p>
          </div>

          <div className="steps-visual">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Choose Your Template</h3>
                <p>Browse our collection and pick the design that best represents your professional story</p>
              </div>
              <div className="step-visual">🎯</div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Fill in Your Details</h3>
                <p>Use our intuitive form to add your experience, education, skills, and achievements</p>
              </div>
              <div className="step-visual">✍️</div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Download & Apply</h3>
                <p>Get your professionally formatted PDF and start applying to your dream jobs</p>
              </div>
              <div className="step-visual">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Transform Your Job Search?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who landed interviews with our CV builder. 
              <strong> No subscriptions, no hidden fees</strong> - just one simple payment.
            </p>
            
            {/* <div className="pricing-highlight">
              <div className="price-main">R19.99</div>
              <div className="price-description">One-time payment • Lifetime access</div>
            </div> */}

            <div className="cta-features">
              <div className="cta-feature">✓ All 12+ Templates Included</div>
              <div className="cta-feature">✓ Unlimited CV Downloads</div>
              <div className="cta-feature">✓ AI Cover Letter Generator</div>
              <div className="cta-feature">✓ No Watermarks Ever</div>
            </div>

            <button className="cta-final-button" onClick={onGetStarted}>
              <span className="button-text">Get Started Now</span>
              <span className="button-guarantee">7-Day Money Back Guarantee</span>
            </button>

            <div className="security-badge">
              🔒 Secure payment • No registration required • Instant access
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="vibrant-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/images/logo.png" alt="CVGrid" className="footer-logo" />
              <p>Professional CV Builder</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Support</h4>
                <a href="mailto:support@cvgrid.co.za">Email Support</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="https://wa.me/27788849286?text=Hello%2C%20I%20found%20you%20through%20your%20website" target="_blank" rel="noopener noreferrer">Contact</a>              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CVGrid. All rights reserved. • support@cvgrid.co.za</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
 

// CVBuilder Component
const CVBuilder = () => {
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      profession: ''
    },
    professionalSummary: '',
    workExperience: [
      {
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        institution: '',
        degree: '',
        field: '',
        graduationYear: '',
        gpa: ''
      }
    ],
    skills: [],
    certifications: [],
    languages: [],
    interests: [],
    references: []
  });
 
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState({ name: '', issuer: '', year: '' });
  const [currentLanguage, setCurrentLanguage] = useState({ name: '', proficiency: '' });
  const [currentInterest, setCurrentInterest] = useState('');

  const [profileImage, setProfileImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('Classic Professional');
  const [selectedColor, setSelectedColor] = useState('#2c3e50');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);


 
  // ADD COVER LETTER STATE VARIABLES
  const [coverLetter, setCoverLetter] = useState('');
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [coverLetterPosition, setCoverLetterPosition] = useState('');
 
  const fileInputRef = useRef(null);
  const formContainerRef = useRef(null);


const generateBasicCoverLetter = useCallback(() => {
  if (!coverLetterCompany || !coverLetterPosition) {
    alert('Please enter both company name and position');
    return;
  }
 
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
 
  const basicCoverLetter = `
${currentDate}
 
Hiring Manager
${coverLetterCompany}
 
Dear Hiring Team,
 
I am writing to express my genuine interest in the ${coverLetterPosition} position at ${coverLetterCompany}. After learning about your company's work and values, I was particularly impressed and believe my background aligns well with your needs.
 
${cvData.professionalSummary ? `Throughout my career, I've developed expertise in ${cvData.personalInfo.profession || 'my field'}. Specifically, ${cvData.professionalSummary.toLowerCase()}` : `With my experience in ${cvData.personalInfo.profession || 'this field'}, I've developed skills that I believe would benefit your team.`}
 
${cvData.workExperience.length > 0 ? `In my previous role${cvData.workExperience.length > 1 ? 's' : ''} as ${cvData.workExperience.slice(0, 2).map(exp => `${exp.jobTitle} at ${exp.company}`).join(' and ')}, I gained valuable experience that has prepared me for this opportunity.` : ''}
 
${cvData.skills.length > 0 ? `I'm particularly skilled in ${cvData.skills.slice(0, 4).join(', ')}, which I understand are important for success in this role.` : ''}
 
What particularly excites me about ${coverLetterCompany} is [your company's reputation/innovation in the industry]. I'm eager to bring my background to your team and contribute to your ongoing success.
 
I would welcome the opportunity to discuss how my experience and skills could benefit ${coverLetterCompany}. Thank you for considering my application.
 
Best regards,
 
${cvData.personalInfo.fullName || 'Your Name'}
${cvData.personalInfo.phone || ''} | ${cvData.personalInfo.email || ''}
${cvData.personalInfo.linkedin ? `LinkedIn: ${cvData.personalInfo.linkedin}` : ''}
`;
 
  setCoverLetter(basicCoverLetter.trim());
  setIsCoverLetterModalOpen(true);
}, [coverLetterCompany, coverLetterPosition, cvData]);
 
const generateCoverLetter = useCallback(async () => {
  if (!coverLetterCompany || !coverLetterPosition) {
    alert('Please enter both company name and position');
    return;
  }

  setIsGeneratingCoverLetter(true);
  setIsCoverLetterModalOpen(true);

  try {
    console.log('🔄 Starting cover letter generation...');

    const response = await fetch(`${BACKEND_URL}/api/generate-cover-letter`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // send the same structure your server supports
        cvData: {
          personalInfo: cvData.personalInfo,
          professionalSummary: cvData.professionalSummary,
          workExperience: cvData.workExperience,
          education: cvData.education,
          skills: cvData.skills,
        },
        company: coverLetterCompany,
        position: coverLetterPosition,
      }),
    });

    const data = await response.json();
    console.log('🔎 /api/generate-cover-letter response:', data);

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    // Be generous: if the server gives us AI text, use it,
    // regardless of a "success" flag.
    const aiText =
      (typeof data.coverLetter === 'string' && data.coverLetter.trim()) ||
      (typeof data.aiCoverLetter === 'string' && data.aiCoverLetter.trim()) ||
      null;

    if (!aiText) {
      // Only treat as error if there is truly no text at all
      if (data.success === false) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }
      throw new Error('No cover letter text returned from server');
    }

    console.log('✅ Cover letter generated successfully');
    setCoverLetter(aiText.trim());
  } catch (error) {
    console.error('❌ Error generating cover letter:', error);

    const errorMsg = error.message.includes('OpenAI API key')
      ? 'Server configuration error. Using basic template instead.'
      : `AI generation failed: ${error.message}. Using basic template instead.`;

    alert(errorMsg);
    generateBasicCoverLetter();
  } finally {
    setIsGeneratingCoverLetter(false);
  }
}, [coverLetterCompany, coverLetterPosition, cvData, generateBasicCoverLetter]);



  const handleDownloadCoverLetter = useCallback(() => {
    if (!coverLetter.trim()) {
      alert('No cover letter to download');
      return;
    }
 
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
 
    // Add title
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('COVER LETTER', pageWidth / 2, 20, { align: 'center' });
 
    // Add candidate info
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${cvData.personalInfo.fullName || 'Your Name'}`, margin, 40);
    pdf.text(`${cvData.personalInfo.email || ''} | ${cvData.personalInfo.phone || ''}`, margin, 48);
 
    // Add company info
    pdf.text(`To: ${coverLetterCompany}`, margin, 60);
    pdf.text(`Position: ${coverLetterPosition}`, margin, 68);
 
    // Add cover letter content
    const lines = pdf.splitTextToSize(coverLetter, maxWidth);
    pdf.text(lines, margin, 85);
 
    // Download the PDF
    pdf.save(`${cvData.personalInfo.fullName || 'cover-letter'}-cover-letter.pdf`);
    setIsCoverLetterModalOpen(false);
  }, [coverLetter, cvData, coverLetterCompany, coverLetterPosition]);
 
  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
 
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
 
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);
 
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
    localStorage.setItem('selectedTemplate', selectedTemplate);
    localStorage.setItem('selectedColor', selectedColor);
  }, [cvData, profileImage, selectedTemplate, selectedColor]);

  // Add this to your CVBuilder component or in a useEffect
 
const handleInputChange = useCallback((section, field, value, index = null) => {
  setCvData(prevCvData => {
    if (index !== null) {
      const updatedArray = [...prevCvData[section]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return { ...prevCvData, [section]: updatedArray };
    } else if (section.includes('.')) {
      const [mainSection, subSection] = section.split('.');
      return {
        ...prevCvData,
        [mainSection]: {
          ...prevCvData[mainSection],
          [subSection]: value
        }
      };
    } else {
      return { ...prevCvData, [section]: value };
    }

  });
}, []);
 
  const addExperience = useCallback(() => {
    setCvData({
      ...cvData,
      workExperience: [
        ...cvData.workExperience,
        {
          id: Date.now(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    });
  }, [cvData]);
 
  const removeExperience = useCallback((id) => {
    setCvData({
      ...cvData,
      workExperience: cvData.workExperience.filter(exp => exp.id !== id)
    });
  }, [cvData]);
 
  const addEducation = useCallback(() => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          graduationYear: '',
          gpa: ''
        }
      ]
    });
  }, [cvData]);
 
  const removeEducation = useCallback((id) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter(edu => edu.id !== id)
    });
  }, [cvData]);
 
  const addSkill = useCallback(() => {
    if (currentSkill.trim() !== '') {
      setCvData({
        ...cvData,
        skills: [...cvData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  }, [cvData, currentSkill]);
 
  const removeSkill = useCallback((index) => {
    const updatedSkills = [...cvData.skills];
    updatedSkills.splice(index, 1);
    setCvData({ ...cvData, skills: updatedSkills });
  }, [cvData]);
 
  const addCertification = useCallback(() => {
    if (currentCertification.name.trim() !== '' && currentCertification.issuer.trim() !== '') {
      setCvData({
        ...cvData,
        certifications: [...cvData.certifications, { ...currentCertification }]
      });
      setCurrentCertification({ name: '', issuer: '', year: '' });
    }
  }, [cvData, currentCertification]);
 
  const removeCertification = useCallback((index) => {
    const updatedCertifications = [...cvData.certifications];
    updatedCertifications.splice(index, 1);
    setCvData({ ...cvData, certifications: updatedCertifications });
  }, [cvData]);
 
  const addLanguage = useCallback(() => {
    if (currentLanguage.name.trim() !== '' && currentLanguage.proficiency.trim() !== '') {
      setCvData({
        ...cvData,
        languages: [...cvData.languages, { ...currentLanguage }]
      });
      setCurrentLanguage({ name: '', proficiency: '' });
    }
  }, [cvData, currentLanguage]);
 
  const removeLanguage = useCallback((index) => {
    const updatedLanguages = [...cvData.languages];
    updatedLanguages.splice(index, 1);
    setCvData({ ...cvData, languages: updatedLanguages });
  }, [cvData]);
 
  const addInterest = useCallback(() => {
    if (currentInterest.trim() !== '') {
      setCvData({
        ...cvData,
        interests: [...cvData.interests, currentInterest.trim()]
      });
      setCurrentInterest('');
    }
  }, [cvData, currentInterest]);
 
  const removeInterest = useCallback((index) => {
    const updatedInterests = [...cvData.interests];
    updatedInterests.splice(index, 1);
    setCvData({ ...cvData, interests: updatedInterests });
  }, [cvData]);
 
  // ADD REFERENCE FUNCTIONS
const addReference = useCallback(() => {
  setCvData(prevCvData => ({
    ...prevCvData,
    references: [
      ...prevCvData.references, 
      { 
        id: Date.now(),
        name: '',
        position: '',
        company: '',
        email: '',
        phone: ''
      }
    ]
  }));
}, []);
 
const removeReference = useCallback((id) => {
  setCvData(prevCvData => ({
    ...prevCvData,
    references: prevCvData.references.filter(ref => ref.id !== id)
  }));
}, []);
 
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setProfileImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, []);
 
  const removeProfileImage = useCallback(() => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
 
  const resetCV = useCallback(() => {
    if (window.confirm('Are you sure you want to reset your CV? All data will be lost.')) {
      setCvData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          linkedin: '',
          profession: ''
        },
        professionalSummary: '',
        workExperience: [
          {
            id: 1,
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ],
        education: [
          {
            id: 1,
            institution: '',
            degree: '',
            field: '',
            graduationYear: '',
            gpa: ''
          }
        ],
        skills: [],
        certifications: [],
        languages: [],
        interests: [],
        references: [
          {
            id: 1,
            name: '',
            position: '',
            company: '',
            email: '',
            phone: ''
          }
        ]
      });
      setProfileImage(null);
      setSelectedColor('#2c3e50');
      // ADD COVER LETTER RESET
      setCoverLetter('');
      setCoverLetterCompany('');
      setCoverLetterPosition('');
      localStorage.removeItem('cvData');
      localStorage.removeItem('selectedColor');
    }
  }, []);
 
const handleTemplateChange = (template) => {
  setSelectedTemplate(template);

  // Auto-scroll to form on smaller screens
  if (window.innerWidth < 992 && formContainerRef.current) {
    setTimeout(() => {
      formContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  }
};
 
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };
 
  const handlePreviewCV = () => {
    setIsPreviewOpen(true);
  };

  const handleDownloadWithBasicCoverLetter = () => {
  if (!coverLetterCompany || !coverLetterPosition) {
    alert('Please enter both company name and position');
    return;
  }
  setSelectedPackage('basic');
  setIsPaymentOpen(true);
};

const handleDownloadWithAICoverLetter = () => {
  if (!coverLetterCompany || !coverLetterPosition) {
    alert('Please enter both company name and position');
    return;
  }
  setSelectedPackage('ai');
  setIsPaymentOpen(true);
};


 
const renderTemplate = (customData = null) => {
  const noImageTemplates = ['Bold Modern', 'Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'];
  
  const dataToUse = customData || cvData;
  const profileImageToUse = customData ? null : profileImage; 

  const templateProps = noImageTemplates.includes(selectedTemplate) 
    ? { cvData: dataToUse, selectedColor } 
    : { cvData: dataToUse, profileImage: profileImageToUse, selectedColor };

  switch (selectedTemplate) {
    case 'Classic Professional':
      return <ClassicProfessionalTemplate {...templateProps} />;
    case 'Modern Minimalist':
      return <ModernMinimalistTemplate {...templateProps} />;
    case 'Corporate Clean':
      return <CorporateCleanTemplate {...templateProps} />;
    case 'Creative Timeline':
      return <CreativeTimelineTemplate {...templateProps} />;
    case 'Bold Modern':
      return <BoldModernTemplate {...templateProps} />;
    case 'Elegant Traditional':
      return <ElegantTraditionalTemplate {...templateProps} />;
    case 'Tech Innovator':
      return <TechInnovatorTemplate {...templateProps} />;
    case 'Creative Arts':
      return <CreativeArtsTemplate {...templateProps} />;
    case 'Academic Scholar':
      return <AcademicScholarTemplate {...templateProps} />;
    case 'Executive Leadership':
      return <ExecutiveLeadershipTemplate {...templateProps} />;
    case 'Startup Entrepreneur':
      return <StartupEntrepreneurTemplate {...templateProps} />;
    case 'Minimal Tech':
      return <MinimalTechTemplate {...templateProps} />;
    default:
      return <ClassicProfessionalTemplate {...templateProps} />;
  }
};

 
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/images/logo.png" alt="CVGrid" className="app-logo" />
            {/* <span className="app-name">CVGrid</span> */}
          </div>
        </div>
      </header>
 
      <div className="app-container">
        <div className="form-container" ref={formContainerRef}>
          <CVForm
            cvData={cvData}
            currentSkill={currentSkill}
            currentCertification={currentCertification}
            currentLanguage={currentLanguage}
            currentInterest={currentInterest}
            // ... keep all your existing props exactly as they were
            handleInputChange={handleInputChange}
            addExperience={addExperience}
            removeExperience={removeExperience}
            addEducation={addEducation}
            removeEducation={removeEducation}
            addSkill={addSkill}
            removeSkill={removeSkill}
            addCertification={addCertification}
            removeCertification={removeCertification}
            addLanguage={addLanguage}
            removeLanguage={removeLanguage}
            addInterest={addInterest}
            removeInterest={removeInterest}
            setCurrentSkill={setCurrentSkill}
            setCurrentCertification={setCurrentCertification}
            setCurrentLanguage={setCurrentLanguage}
            setCurrentInterest={setCurrentInterest}
            profileImage={profileImage}
            handleImageUpload={handleImageUpload}
            removeProfileImage={removeProfileImage}
            fileInputRef={fileInputRef}
            resetCV={resetCV}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            selectedTemplate={selectedTemplate}
            addReference={addReference}
            removeReference={removeReference}
            coverLetterCompany={coverLetterCompany}
            setCoverLetterCompany={setCoverLetterCompany}
            coverLetterPosition={coverLetterPosition}
            setCoverLetterPosition={setCoverLetterPosition}
            generateCoverLetter={generateCoverLetter}
            generateBasicCoverLetter={generateBasicCoverLetter}
          />

          <div className="cover-letter-section mobile-only">
            <div className="form-group">
              <h3>Cover Letter Options</h3>
              <div className="cover-letter-inputs">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={coverLetterCompany}
                  onChange={(e) => setCoverLetterCompany(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position Applying For"
                  value={coverLetterPosition}
                  onChange={(e) => setCoverLetterPosition(e.target.value)}
                />
              </div>
            </div>
          </div>

            <div className="preview-actions-bottom mobile-only">
              <button className="preview-btn" onClick={handlePreviewCV}>
                Preview CV
              </button>
              <button 
                className="package-btn basic-package" 
                onClick={handleDownloadWithBasicCoverLetter}
                disabled={!coverLetterCompany || !coverLetterPosition}
              >
                Get CV + Basic Cover Letter - R20.00
              </button>
              <button 
                className="package-btn ai-package" 
                onClick={handleDownloadWithAICoverLetter}
                disabled={!coverLetterCompany || !coverLetterPosition}
              >
                Get CV + AI Cover Letter - R26.00
              </button>
            </div>
        </div>
 
        <div className="preview-container">
          <TemplateSelector 
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
 
          <div className="preview-content">
            <h2 className="preview-title">Live Preview</h2>
            <div className="preview-info" style={{ 
              textAlign: 'center', 
              marginBottom: '15px', 
              color: '#666',
              fontSize: '0.9rem'
            }}>
              <strong>Note:</strong> Preview matches final PDF layout. Minor styling differences may occur due to PDF conversion.
            </div>
            <div className="cv-preview" id="cv-template">
              {renderTemplate()}
            </div>
 
            <div className="preview-actions-bottom">
              {/* NEW - REPLACE WITH THESE */}
                  <button className="preview-btn" onClick={handlePreviewCV}>
      Preview CV
    </button>
              <button className="package-btn basic-package" onClick={handleDownloadWithBasicCoverLetter}>
                Get CV + Basic Cover Letter - R20.00
              </button>
              <button className="package-btn ai-package" onClick={handleDownloadWithAICoverLetter}>
                Get CV + AI Cover Letter - R26.00
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        {renderTemplate()}
      </PreviewModal>
 
      <DirectPaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)}
        selectedPackage={selectedPackage}
        cvData={cvData}
        coverLetterCompany={coverLetterCompany}
        coverLetterPosition={coverLetterPosition}
        coverLetter={coverLetter} 
      />

 
      {/* ADD COVER LETTER MODAL */}
      <CoverLetterModal 
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        coverLetter={coverLetter}
        onCoverLetterChange={setCoverLetter}
        onDownloadCoverLetter={handleDownloadCoverLetter}
        isGenerating={isGeneratingCoverLetter}
      />
    </div>
  );
};

const App = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [pendingDownloadPackage, setPendingDownloadPackage] = useState(null);


useEffect(() => {
  const checkUrlAndState = () => {
    const hash = window.location.hash || '';

    const isBuilderHash =
      hash === '#builder' ||
      hash.startsWith('#builder?') ||
      hash.startsWith('#payment_');

    setShowBuilder(isBuilderHash);

    if (hash.includes('payment=success')) {
      console.log('✅ Payment success detected from URL');

      const pendingPackageRaw = localStorage.getItem('pendingPackage');

    if (pendingPackageRaw) {
      try {
        const packageData = JSON.parse(pendingPackageRaw);

        // Make sure latest CV data is stored
        localStorage.setItem('cvData', JSON.stringify(packageData.cvData));

        // Save it into React state so we can show the banner + buttons
        setPendingDownloadPackage(packageData);

        alert(
          'Payment successful! You can now download your CV and cover letter using the buttons at the top of the page.'
        );
      } catch (e) {
        console.error('❌ Could not parse pendingPackage:', e);
        localStorage.removeItem('pendingPackage');
      }
    } else {
      alert('Payment successful, but no files were queued. Please rebuild your CV.');
    }


      window.location.hash = '#builder';
    }
  };

  checkUrlAndState();

  window.addEventListener('hashchange', checkUrlAndState);
  window.addEventListener('load', checkUrlAndState);

  return () => {
    window.removeEventListener('hashchange', checkUrlAndState);
    window.removeEventListener('load', checkUrlAndState);
  };
}, []);

const handleManualCVDownload = async () => {
  if (!pendingDownloadPackage) {
    console.error('❌ No pending package for CV download');
    return;
  }

  try {
    await downloadCVAfterPayment(pendingDownloadPackage);
  } catch (err) {
    console.error('❌ Error in manual CV download:', err);
  }
};

const handleManualCoverLetterDownload = async () => {
  if (!pendingDownloadPackage) {
    console.error('❌ No pending package for cover letter download');
    return;
  }

  try {
    await downloadCoverLetterAfterPayment(pendingDownloadPackage);
  } catch (err) {
    console.error('❌ Error in manual cover letter download:', err);
  }
};


if (showBuilder) {
  return (
    <>
{pendingDownloadPackage && (
  <div
    className="download-notice"
    style={{
      padding: '10px 16px',
      background: '#fff3cd',
      borderBottom: '1px solid #ffeeba',
    }}
  >
    <p style={{ marginBottom: '8px' }}>
      Payment successful. If your files did not download automatically, tap the buttons below to download them.
    </p>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button
        onClick={handleManualCVDownload}
        style={{
          padding: '8px 16px',
          background: '#fff',
          border: '1px solid #856404',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Download CV
      </button>
      <button
        onClick={handleManualCoverLetterDownload}
        style={{
          padding: '8px 16px',
          background: '#fff',
          border: '1px solid #856404',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Download Cover Letter
      </button>
    </div>
  </div>
)}


      <CVBuilder />
    </>
  );
}

  return <LandingPage onGetStarted={() => setShowBuilder(true)} />;

};

export default App;