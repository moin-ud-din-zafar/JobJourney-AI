// src/Pages/ResumeGenerator.jsx
import React, { useState } from 'react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

import StepTracker from '../Components/ResumeGenerator/StepTracker'
import PasteJD from '../Components/ResumeGenerator/PasteJD'
import AnalyzeCompare from '../Components/ResumeGenerator/AnalyzeCompare'
import ReviewGenerate from '../Components/ResumeGenerator/ReviewGenerate'

import { useDarkTheme } from '../Components/DarkThemeContext' // use the same context as Header/Sidebar

export default function ResumeGenerator({ onMenuClick }) {
  // ensure page re-renders when theme toggles
  const { isDark } = useDarkTheme()

  // theme mapping — keep same layout/design but pick classes explicitly
  const light = {
    pageBg: 'bg-gray-50',
    heading: 'text-gray-900',
    subText: 'text-gray-600',
    containerBg: 'bg-white',
    containerText: 'text-gray-900',
    panelPad: 'max-w-5xl mx-auto',
  }

  const dark = {
    pageBg: 'bg-black',
    heading: 'text-gray-100',
    subText: 'text-gray-300',
    containerBg: 'bg-slate-800',
    containerText: 'text-gray-100',
    panelPad: 'max-w-5xl mx-auto',
  }

  const s = isDark ? dark : light

  const [step, setStep] = useState(1)
  const [jd, setJd] = useState('')
  const charCount = jd.length
  const atLeast100 = charCount >= 100

  return (
    <div className="flex-1 flex flex-col h-screen overflow-auto">
      <Header onMenuClick={onMenuClick} />

      <main className={`${s.pageBg} flex-1 py-10 px-6 lg:px-16 space-y-8 transition-colors duration-150`}>
        {/* Title */}
        <div className={`${s.panelPad} space-y-2`}>
          <h1 className={`text-3xl font-bold ${s.heading}`}>
            Tailored Resume Generator
          </h1>
          <p className={`${s.subText}`}>
            AI-powered resume tailoring for specific job descriptions
          </p>
        </div>

        {/* Tracker */}
        <div className={`${s.panelPad}`}>
          <StepTracker
            step={step}
            setStep={setStep}
            atLeast100={atLeast100}
          />
        </div>

        {/* Cards */}
        <div className={`${s.panelPad}`}>
          {/* step 1: paste job description */}
          {step === 1 && (
            <div className={`rounded-lg ${s.containerBg} p-6 transition-colors`}>
              <PasteJD
                jd={jd}
                setJd={setJd}
                charCount={charCount}
                onNext={() => atLeast100 && setStep(2)}
              />
            </div>
          )}

          {step === 2 && (
            <div className={`rounded-lg ${s.containerBg} p-6 transition-colors`}>
              <AnalyzeCompare
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            </div>
          )}

          {step === 3 && (
            <div className={`rounded-lg ${s.containerBg} p-6 transition-colors`}>
              <ReviewGenerate
                onBack={() => setStep(2)}
                onRestart={() => {
                  setJd('')
                  setStep(1)
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
