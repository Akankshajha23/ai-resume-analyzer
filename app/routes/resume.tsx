import { div } from 'framer-motion/client';
import { image } from 'framer-motion/m';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import Summary from '~/components/Summary';
import { usePuterStore } from '~/lib/puter';
import { ArrowLeft, Download, ExternalLink, Sparkles, FileText, TrendingUp } from 'lucide-react';

export const meta =()=>([
  { title: "ResumeCrack | Review" },
  { name: "description", content: "Detailed overview of your resume" }
])
const resume = () => {
  const{auth, kv, isLoading, fs} = usePuterStore();
  const {id} = useParams();
  const [imageUrl, setimageUrl] = useState('')
  const [resumeUrl, setresumeUrl] = useState('')
  const [feedback, setfeedback] = useState <Feedback | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();


    useEffect(() => {
    if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`)
  }, [isLoading]);


  useEffect(()=>{
    const loadResume = async() =>{
      const resume = await kv.get(`resume:${id}`);

      if(!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if(!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'})

      const resumeUrl = URL.createObjectURL(pdfBlob);
      setresumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if(!imageBlob) return;

      const imageUrl = URL.createObjectURL(imageBlob);
      setimageUrl(imageUrl);

      setfeedback(data.feedback);
      console.log({resumeUrl, imageUrl, feedback: data.feedback})
    }
    loadResume()
  },[id])

  const handleDownload = () => {
    if (resumeUrl) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = 'resume.pdf';
      a.click();
    }
  };

  return (
    <main className='!pt-0 bg-gradient min-h-screen'>
      {/* Enhanced Navigation */}
      <nav className='sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f1a]/80 border-b border-[#2a2a3d]'>
        <div className='max-w-[1800px] mx-auto px-6 py-4 flex flex-row justify-between items-center'>
          <Link 
            to="/" 
            className='group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#6b8cff]/10 to-[#8b5cf6]/10 hover:from-[#6b8cff]/20 hover:to-[#8b5cf6]/20 border border-[#6b8cff]/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(107,140,255,0.3)]'
          >
            <ArrowLeft className='w-4 h-4 text-[#6b8cff] group-hover:-translate-x-1 transition-transform' />
            <span className='text-white text-sm font-semibold'>Back to Home</span>
          </Link>

          {resumeUrl && (
            <button
              onClick={handleDownload}
              className='flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] hover:from-[#7d9bff] hover:to-[#9d6ff7] rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(107,140,255,0.4)] text-white font-semibold'
            >
              <Download className='w-4 h-4' />
              Download Resume
            </button>
          )}
        </div>
      </nav>

      <div className='flex flex-row w-full max-lg:flex-col-reverse gap-8 px-6 py-8 max-w-[1800px] mx-auto'>
        {/* Resume Preview Section */}
        <section className='w-full lg:w-1/2 lg:sticky lg:top-24 self-start'>
  <div className='flex flex-col gap-4'>
    {/* Section Header */}
    <div className='flex items-center gap-3 mb-2'>
      <div className='p-2 bg-gradient-to-br from-[#6b8cff]/20 to-[#8b5cf6]/20 rounded-lg border border-[#6b8cff]/30'>
        <FileText className='w-5 h-5 text-[#6b8cff]' />
      </div>
      <h3 className='text-xl font-semibold text-white'>Your Resume</h3>
    </div>

    {imageUrl && resumeUrl ? (
      <div className='group relative animate-in fade-in duration-700'>
        {/* Subtle glow (removed heavy blur) */}
        <div className='absolute -inset-px bg-gradient-to-r from-[#6b8cff]/20 to-[#8b5cf6]/20 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
        
        {/* Resume container */}
        <div className='relative bg-[#0f0f1a] rounded-2xl p-4 border border-[#2a2a3d] overflow-hidden shadow-[0_0_20px_rgba(107,140,255,0.1)]'>
          <a 
            href={resumeUrl} 
            target='_blank' 
            rel='noopener noreferrer'
            className='block relative'
          >
            {/* Scrollable container to isolate repaint */}
            <div className='relative overflow-auto max-h-[80vh] rounded-xl bg-white'>
              <img 
                src={imageUrl} 
                loading="lazy"
                decoding="async"
                style={{ willChange: 'transform, opacity' }}
                className={`w-full h-auto object-contain transition-all duration-500 ${
                  isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                title='resume'
                onLoad={() => setIsImageLoaded(true)}
              />

              {/* Hover overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-[#6b8cff]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8'>
                <div className='flex items-center gap-2 text-white font-semibold'>
                  <ExternalLink className='w-5 h-5' />
                  <span>Open Full Screen</span>
                </div>
              </div>
            </div>
          </a>

          {/* Subtle corner accents */}
          <div className='absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#6b8cff]/30 rounded-tl-xl'></div>
          <div className='absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#8b5cf6]/30 rounded-br-xl'></div>
        </div>
      </div>
    ) : (
      <div className='flex items-center justify-center h-[600px] bg-[#0f0f1a] rounded-2xl border border-[#2a2a3d]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-[#6b8cff] blur-2xl opacity-30 animate-pulse'></div>
            <FileText className='relative w-16 h-16 text-[#6b8cff]' />
          </div>
          <p className='text-[#a0b4ec] animate-pulse'>Loading resume...</p>
        </div>
      </div>
    )}
  </div>
</section>


        {/* Feedback Section */}
        <section className='w-full lg:w-1/2'>
          <div className='flex flex-col gap-6'>
            {/* Header with sparkles */}
            <div className='flex items-center gap-3 mb-4'>
              <Sparkles className='w-8 h-8 text-[#6b8cff] animate-pulse' />
              <h2 className='text-4xl !text-white font-bold bg-gradient-to-r from-[#6b8cff] via-[#c77dff] to-[#8b5cf6] bg-clip-text text-transparent'>
                Resume Review
              </h2>
              
            </div>

            {feedback ? (
              <div className='flex flex-col gap-6 animate-in fade-in duration-1000'>
                {/* Cards with enhanced styling */}
                <div className='relative group'>
                  <div className='absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity'></div>
                  <div className='relative'>
                    <Summary feedback={feedback}/>
                  </div>
                </div>

                <div className='relative group'>
                  <div className='absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity'></div>
                  <div className='relative'>
                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || {}}/>
                  </div>
                </div>

                <div className='relative group'>
                  <div className='absolute -inset-0.5 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity'></div>
                  <div className='relative'>
                    <Details feedback = {feedback}/>
                  </div>
                </div>
              </div>
            ): (
              <div className='flex flex-col items-center justify-center gap-6 p-12 bg-[#0f0f1a] rounded-2xl border border-[#2a2a3d]'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] blur-2xl opacity-30'></div>
                  <img src="/images/resume-scan-2.gif" className='relative w-full max-w-md rounded-xl' />
                </div>
                <div className='flex flex-col items-center gap-2'>
                  <TrendingUp className='w-8 h-8 text-[#6b8cff] animate-pulse' />
                  <p className='text-[#a0b4ec] text-lg font-semibold animate-pulse'>Analyzing your resume...</p>
                  <p className='text-[#a0b4ec]/60 text-sm'>This may take a few moments</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default resume