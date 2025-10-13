import React, { useState, type FormEvent } from 'react'
import Navbar from '~/components/Navbar'
import FileUploader from './FileUploader';
import { Building2, Briefcase, FileText, Sparkles } from 'lucide-react';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import path from 'path';
import { prepareInstructions } from "../../constants";
import type { Route } from '../+types/root';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeCrack | Upload" },
    { name: "description", content: "Smart feedback for your job!" },
  ];
}

const upload = () => {
  const {auth, ai, isLoading, fs, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsprocessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState <File | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const handleFileSelect = (file: File | null) =>{
    setFile (file)
  }
  
const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
    setIsprocessing(true);

    try {
      setStatusText('Uploading the file...');
      const uploadedFile = await fs.upload([file]);
      if(!uploadedFile) {
        setStatusText('Error: Failed to upload file');
        setIsprocessing(false);
        return;
      }

      setStatusText('Converting to image...');
      const imageFile = await convertPdfToImage(file);
      if(!imageFile.file) {
        setStatusText('Error: Failed to convert PDF to image');
        setIsprocessing(false);
        return;
      }

      setStatusText('Uploading the image...');
      const uploadedImage = await fs.upload([imageFile.file]);
      if(!uploadedImage) {
        setStatusText('Error: Failed to upload image');
        setIsprocessing(false);
        return;
      }

      setStatusText('Analyzing your resume...');

      const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({ jobTitle, jobDescription })
      )
      if (!feedback) {
        setStatusText('Error: Failed to analyze resume');
        setIsprocessing(false);
        return;
      }

      const feedbackText = typeof feedback.message.content === 'string'
          ? feedback.message.content
          : feedback.message.content[0].text;

      setStatusText('Saving your results...');
      
      // Generate UUID and save ONCE with all data
      const uuid = generateUUID();
      const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName, 
          jobTitle, 
          jobDescription,
          feedback: JSON.parse(feedbackText),
          createdAt: new Date().toISOString(),
      }
      
      // Save only once with complete data
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      
      setStatusText('Analysis complete, redirecting...');
      console.log(data);
      
      // Small delay so user can see the success message
      setTimeout(() => {
        navigate(`/resume/${uuid}`)
      }, 500);
      
    } catch (error) {
      console.error('Error during analysis:', error);
      setStatusText('Error: Something went wrong. Please try again.');
      setIsprocessing(false);
    }
  }
  
  const handleSubmit = (e : FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const form  = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string
    const jobTitle = formData.get('job-title') as string
    const jobDescription = formData.get('job-description') as string
   
    if(!file) return;
    handleAnalyze({companyName, jobTitle, jobDescription, file});
  }
  
  return (
    <main className="bg-gradient min-h-screen">
      <Navbar />
      <section className="main-section">
        <div className='page-heading py-12'>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-[#6b8cff] animate-pulse" />
            <h1 className="animate-fadeIn">Smart feedback for your job</h1>
            <Sparkles className="w-10 h-10 text-[#8b5cf6] animate-pulse" />
          </div>
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-6 animate-fadeIn">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] blur-2xl opacity-30 animate-pulse"></div>
                <h2 className="relative z-10 text-2xl font-semibold">{statusText}</h2>
              </div>
              <img src="/images/resume-scan.gif" alt="scanning" className='w-full max-w-md rounded-2xl shadow-2xl' />
            </div>
          ): (
            <h2 className="animate-fadeIn">Drop your Resume for an ATS score and improvement tips.</h2>
          )}
          
          
          {!isProcessing && (
            <div className="w-full max-w-3xl mt-12 animate-fadeIn">
              <div className="relative">
                {/* Decorative glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-3xl blur-xl opacity-20"></div>
                
                <form
  id="upload-form"
  onSubmit={handleSubmit}
  className="flex flex-col gap-8 mt-8 w-full max-w-3xl mx-auto bg-[#0f0f1a]/60 p-8 rounded-3xl border border-[#252566]"
>
                  {/* Company Name */}
                  <div className='form-div group w-full space-y-3'>
                    <label 
                      htmlFor="company-name" 
                      className="flex items-center gap-2 text-base font-semibold mb-3 transition-colors duration-300 w-full"
                      style={{ color: focusedField === 'company-name' ? '#6b8cff' : '#a0b4ec' }}
                    >
                      <Building2 className="w-5 h-5" />
                      Company Name
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name='company-name' 
                        placeholder='e.g., Google, Microsoft, Apple' 
                        id='company-name'
                        required
                        onFocus={() => setFocusedField('company-name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-5 py-4 bg-[#14141f]/80 backdrop-blur-sm border-2 rounded-xl text-white text-base placeholder:text-gray-500 transition-all duration-300 focus:outline-none"
                        style={{
                          borderColor: focusedField === 'company-name' ? '#6b8cff' : '#2a2a3d',
                          boxShadow: focusedField === 'company-name' 
                            ? 'inset 0 2px 12px 0 rgba(107, 140, 255, 0.2), 0 0 0 3px rgba(107, 140, 255, 0.1), 0 4px 20px 0 rgba(107, 140, 255, 0.15)' 
                            : 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.4)'
                        }}
                      />
                      {focusedField === 'company-name' && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-xl blur-sm opacity-20 -z-10 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Job Title */}
                  <div className='form-div group'>
                    <label 
                      htmlFor="job-title" 
                      className="flex items-center gap-2 text-base font-semibold mb-3 transition-colors duration-300"
                      style={{ color: focusedField === 'job-title' ? '#6b8cff' : '#a0b4ec' }}
                    >
                      <Briefcase className="w-5 h-5" />
                      Job Title
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name='job-title' 
                        placeholder='e.g., Senior Software Engineer, Product Manager' 
                        id='job-title'
                        required
                        onFocus={() => setFocusedField('job-title')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-5 py-4 bg-[#14141f]/80 backdrop-blur-sm border-2 rounded-xl text-white text-base placeholder:text-gray-500 transition-all duration-300 focus:outline-none"
                        style={{
                          borderColor: focusedField === 'job-title' ? '#6b8cff' : '#2a2a3d',
                          boxShadow: focusedField === 'job-title' 
                            ? 'inset 0 2px 12px 0 rgba(107, 140, 255, 0.2), 0 0 0 3px rgba(107, 140, 255, 0.1), 0 4px 20px 0 rgba(107, 140, 255, 0.15)' 
                            : 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.4)'
                        }}
                      />
                      {focusedField === 'job-title' && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-xl blur-sm opacity-20 -z-10 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className='form-div group'>
                    <label 
                      htmlFor="job-description" 
                      className="flex items-center gap-2 text-base font-semibold mb-3 transition-colors duration-300"
                      style={{ color: focusedField === 'job-description' ? '#6b8cff' : '#a0b4ec' }}
                    >
                      <FileText className="w-5 h-5" />
                      Job Description
                    </label>
                    <div className="relative">
                      <textarea 
                        rows={6} 
                        name='job-description' 
                        placeholder='Paste the full job description here...' 
                        id='job-description'
                        required
                        onFocus={() => setFocusedField('job-description')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-5 py-4 bg-[#14141f]/80 backdrop-blur-sm border-2 rounded-xl text-white text-base placeholder:text-gray-500 transition-all duration-300 focus:outline-none resize-none"
                        style={{
                          borderColor: focusedField === 'job-description' ? '#6b8cff' : '#2a2a3d',
                          boxShadow: focusedField === 'job-description' 
                            ? 'inset 0 2px 12px 0 rgba(107, 140, 255, 0.2), 0 0 0 3px rgba(107, 140, 255, 0.1), 0 4px 20px 0 rgba(107, 140, 255, 0.15)' 
                            : 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.4)'
                        }}
                      />
                      {focusedField === 'job-description' && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-xl blur-sm opacity-20 -z-10 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* File Uploader */}
                  <div className='form-div'>
                    <label htmlFor="uploader" className="flex items-center gap-2 text-sm font-medium mb-3 text-[#a0b4ec]">
                      <FileText className="w-4 h-4" />
                      Upload Resume
                    </label>
                    <FileUploader onFileSelect={handleFileSelect}/>
                  </div>

                  {/* Submit Button */}
                  <button 
                    className='primary-button relative overflow-hidden group/btn text-lg font-semibold py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(107,140,255,0.5)] active:scale-[0.98]' 
                    type='submit'
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Analyze Resume
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7d9bff] to-[#9d6ff7] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default upload