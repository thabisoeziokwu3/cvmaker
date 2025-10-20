// App.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Template preview images
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

// Professional color options
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
            <img 
              src={templatePreviews[template]} 
              alt={`${template} template preview`}
              className="template-preview-image"
            />
            <div className="template-name">{template}</div>
            {noImageTemplates.includes(template) && (
              <div className="template-note">No Profile Image</div>
            )}
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

 
// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
 
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="payment-modal">
        <h2>Download CV</h2>
        <p>To download your CV, please complete the payment of R19.99.</p>
        <div className="payment-details">
          <p><strong>Amount:</strong> R19.99 ZAR</p>
          <p><strong>Payment Method:</strong> Credit/Debit Card</p>
        </div>
 
        <div className="payment-form">
          <input type="text" placeholder="Card Number" />
          <div className="card-details">
            <input type="text" placeholder="MM/YY" />
            <input type="text" placeholder="CVV" />
          </div>
        </div>
 
        <div className="payment-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay R19.99'}
          </button>
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
  currentReference,
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
  setCurrentReference,
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
  generateBasicCoverLetter
}) => {
  return (
    <div className="form-section">
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
    <div className="no-image-notice">
      <p>The <strong>{selectedTemplate}</strong> template does not support profile images.</p>
    </div>
  </div>
)}
 
      <div className="form-group">
        <h3>Personal Information</h3>
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
        <textarea
          placeholder="Write a compelling summary of your professional background"
          value={cvData.professionalSummary}
          onChange={(e) => handleInputChange('professionalSummary', '', e.target.value)}
        />
      </div>
 
      <div className="form-group">
        <h3>Work Experience</h3>
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
 
{/* ADD REFERENCES SECTION HERE */}
<div className="form-group">
  <h3>References</h3>
 
  {/* Current Reference Input Form */}
  <div className="reference-input-form">
    <input
      type="text"
      placeholder="Reference Name"
      value={currentReference.name}
      onChange={(e) => setCurrentReference({...currentReference, name: e.target.value})}
    />
    <input
      type="text"
      placeholder="Position"
      value={currentReference.position}
      onChange={(e) => setCurrentReference({...currentReference, position: e.target.value})}
    />
    <input
      type="text"
      placeholder="Company"
      value={currentReference.company}
      onChange={(e) => setCurrentReference({...currentReference, company: e.target.value})}
    />
    <input
      type="email"
      placeholder="Email"
      value={currentReference.email}
      onChange={(e) => setCurrentReference({...currentReference, email: e.target.value})}
    />
    <input
      type="tel"
      placeholder="Phone"
      value={currentReference.phone}
      onChange={(e) => setCurrentReference({...currentReference, phone: e.target.value})}
    />
    <button type="button" className="add-btn" onClick={addReference}>
      Add Reference
    </button>
  </div>
 
  {/* Display Added References */}
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
      <button 
        type="button" 
        className="remove-btn"
        onClick={() => removeReference(ref.id)}
      >
        Remove Reference
      </button>
    </div>
  ))}
</div>
 
      {/* ADD COVER LETTER GENERATION SECTION HERE */}
      <div className="form-group">
        <h3>Cover Letter Generator</h3>
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
          <div className="cover-letter-buttons">
            <button 
              type="button" 
              className="generate-cover-letter-btn"
              onClick={generateCoverLetter}
              disabled={!coverLetterCompany || !coverLetterPosition}
            >
              Generate with AI
            </button>
            <button 
              type="button" 
              className="generate-basic-btn"
              onClick={generateBasicCoverLetter}
              disabled={!coverLetterCompany || !coverLetterPosition}
            >
              Generate Basic
            </button>
          </div>
        </div>
        <div className="cover-letter-info">
          <p><strong>Note:</strong> AI generation uses secure server-side processing and works best with your CV information. Your data is safe and never stored.</p>
        </div>
      </div>
 
      <div className="form-group">
        <button type="button" className="reset-cv-btn" onClick={resetCV}>
          Reset CV
        </button>
      </div>
    </div>
  );
});
 
// ... (Keep all your template components exactly as they were)
// ClassicProfessionalTemplate, TechInnovatorTemplate, CreativeArtsTemplate, etc.
// These remain unchanged from your original code
 
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
 
// ... (Keep all existing templates as they are, just add selectedColor prop and style attribute)
 
// New Template: Tech Innovator
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
  const [currentReference, setCurrentReference] = useState({ 
    name: '', 
    position: '', 
    company: '', 
    email: '', 
    phone: '' 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('Classic Professional');
  const [selectedColor, setSelectedColor] = useState('#2c3e50');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
 
  // ADD COVER LETTER STATE VARIABLES
  const [coverLetter, setCoverLetter] = useState('');
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterCompany, setCoverLetterCompany] = useState('');
  const [coverLetterPosition, setCoverLetterPosition] = useState('');
 
  const fileInputRef = useRef(null);
  const formContainerRef = useRef(null);
 
  // ADD FALLBACK COVER LETTER GENERATION
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
 
  // ADD COVER LETTER GENERATION FUNCTION
const generateCoverLetter = useCallback(async () => {
  if (!coverLetterCompany || !coverLetterPosition) {
    alert('Please enter both company name and position');
    return;
  }
 
  setIsGeneratingCoverLetter(true);
  setIsCoverLetterModalOpen(true);
 
  try {
    console.log('Sending request to generate cover letter...');
 
    const response = await fetch('/.netlify/functions/generate-cover-letter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalInfo: cvData.personalInfo,
        professionalSummary: cvData.professionalSummary,
        workExperience: cvData.workExperience,
        education: cvData.education,
        skills: cvData.skills,
        company: coverLetterCompany,
        position: coverLetterPosition
      })
    });
 
    console.log('Response status:', response.status);
 
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
 
    const data = await response.json();
    console.log('Cover letter generated successfully');
 
    setCoverLetter(data.coverLetter);
 
  } catch (error) {
    console.error('Error generating cover letter:', error);
 
    // Fallback to basic cover letter if AI generation fails
    alert(`AI generation temporarily unavailable. Using basic template instead.`);
    generateBasicCoverLetter();
  } finally {
    setIsGeneratingCoverLetter(false);
  }
}, [coverLetterCompany, coverLetterPosition, cvData, generateBasicCoverLetter]);
 
  // ADD COVER LETTER DOWNLOAD FUNCTION
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
 
  const handleInputChange = useCallback((section, field, value, index = null) => {
    if (index !== null) {
      const updatedArray = [...cvData[section]];
      updatedArray[index][field] = value;
      setCvData({ ...cvData, [section]: updatedArray });
    } else if (section.includes('.')) {
      const [mainSection, subSection] = section.split('.');
      setCvData({
        ...cvData,
        [mainSection]: {
          ...cvData[mainSection],
          [subSection]: value
        }
      });
    } else {
      setCvData({ ...cvData, [section]: value });
    }
  }, [cvData]);
 
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
    if (currentReference.name.trim() !== '' && currentReference.position.trim() !== '') {
      setCvData({
        ...cvData,
        references: [...cvData.references, { ...currentReference, id: Date.now() }]
      });
      setCurrentReference({ name: '', position: '', company: '', email: '', phone: '' });
    }
  }, [cvData, currentReference]);
 
  const removeReference = useCallback((id) => {
    setCvData({
      ...cvData,
      references: cvData.references.filter(ref => ref.id !== id)
    });
  }, [cvData]);
 
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
 
  const handleDownloadCV = () => {
    setIsPaymentOpen(true);
  };
 
const handlePaymentSuccess = () => {
  const cvElement = document.getElementById('cv-template');
 
  // Add PDF-specific styling
  cvElement.classList.add('pdf-export');
 
  // Set A4 dimensions for capture
  const a4Width = 210; // mm
  const a4Height = 297; // mm
  // const pxToMm = 3.78; // Conversion factor
 
  html2canvas(cvElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: cvElement.scrollWidth,
    height: cvElement.scrollHeight,
    windowWidth: cvElement.scrollWidth,
    windowHeight: cvElement.scrollHeight,
    onclone: function(clonedDoc) {
      const clonedElement = clonedDoc.getElementById('cv-template');
      if (clonedElement) {
        // Force A4 dimensions during capture
        clonedElement.style.width = a4Width + 'mm';
        clonedElement.style.minHeight = 'auto';
        clonedElement.style.maxHeight = a4Height + 'mm';
        clonedElement.style.overflow = 'visible';
      }
    }
  }).then(canvas => {
    cvElement.classList.remove('pdf-export');
 
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
 
    // Calculate dimensions to fit A4
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
 
    // Center the image on the page
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
 
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${cvData.personalInfo.fullName || 'cv'}.pdf`);
  }).catch(error => {
    console.error('Error generating PDF:', error);
    cvElement.classList.remove('pdf-export');
    alert('Error generating PDF. Please try again.');
  });
};
 
const renderTemplate = () => {
  const noImageTemplates = ['Bold Modern', 'Tech Innovator', 'Startup Entrepreneur', 'Minimal Tech'];
  
  const templateProps = noImageTemplates.includes(selectedTemplate) 
    ? { cvData, selectedColor } 
    : { cvData, profileImage, selectedColor };

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
          <h1>ProCV Builder</h1>
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
            currentReference={currentReference}
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
            setCurrentReference={setCurrentReference}
            profileImage={profileImage}
            handleImageUpload={handleImageUpload}
            removeProfileImage={removeProfileImage}
            fileInputRef={fileInputRef}
            resetCV={resetCV}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            selectedTemplate={selectedTemplate}
            // Add these new props for references
            addReference={addReference}
            removeReference={removeReference}
            // ADD COVER LETTER PROPS
            coverLetterCompany={coverLetterCompany}
            setCoverLetterCompany={setCoverLetterCompany}
            coverLetterPosition={coverLetterPosition}
            setCoverLetterPosition={setCoverLetterPosition}
            generateCoverLetter={generateCoverLetter}
            generateBasicCoverLetter={generateBasicCoverLetter}
          />
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
              <button className="preview-btn" onClick={handlePreviewCV}>
                Preview CV
              </button>
              <button className="download-btn" onClick={handleDownloadCV}>
                Download CV (R19.99)
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        {renderTemplate()}
      </PreviewModal>
 
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
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
 
// ADD THE MISSING APP COMPONENT
const App = () => {
  return <CVBuilder />;
};
 
export default App;
