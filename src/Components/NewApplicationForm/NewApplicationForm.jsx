import React, { useState } from 'react'
import { X as CloseIcon, Link2, Eye, Check } from 'lucide-react'
import PasteImport from './PasteImport'
import PreviewParse from './PreviewParse'
import ConfirmDetails from './ConfirmDetails'
import { MODAL_DIMENSIONS } from './utils'

export default function NewApplicationForm({ onClose }) {
  const [step, setStep] = useState(1)
  const [jd, setJd] = useState('')

  const next = () => setStep(s => Math.min(3, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))

  const Pill = ({ idx, icon, label }) => {
    const done   = idx < step
    const active = idx === step
    return (
      <div
        onClick={() => done && setStep(idx)}
        className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm cursor-pointer ${
          done   ? 'bg-teal-600 text-white'
          : active? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600'
        }`}
      >
        {icon}<span>{label}</span>
      </div>
    )
  }

  const progressClass = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`relative bg-white rounded-lg w-full ${MODAL_DIMENSIONS.width} mx-4 ${MODAL_DIMENSIONS.height} flex flex-col overflow-hidden`}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center pt-4">
          Add New Application
        </h2>

        {/* Header Pills */}
        <div className="flex items-center px-6 pr-12 py-3 space-x-2 text-sm justify-center">
          <Pill idx={1} icon={<Link2 size={14} />} label="Paste JD" />
          <div className={`flex-1 h-px ${step > 1 ? 'bg-gray-300' : 'bg-gray-100'}`} />
          <Pill idx={2} icon={<Eye size={14} />} label="Preview" />
          <div className={`flex-1 h-px ${step > 2 ? 'bg-gray-300' : 'bg-gray-100'}`} />
          <Pill idx={3} icon={<Check size={14} />} label="Confirm" />
        </div>

        {/* Fixed-height content area */}
        <div className={`${MODAL_DIMENSIONS.contentHeight} overflow-auto`}>
          {step === 1 && (
            <PasteImport
              jd={jd}
              setJd={setJd}
              charCount={jd.length}
              next={next}
            />
          )}
          {step === 2 && <PreviewParse jd={jd} back={back} next={next} />}
          {step === 3 && <ConfirmDetails back={back} onClose={onClose} />}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 1}
            className={`flex items-center space-x-1 text-sm ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ← <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-gray-600 text-sm">Step {step} of 3</span>
            <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`${progressClass} h-full bg-teal-600`} />
            </div>
          </div>

          <button
            onClick={step < 3 ? next : onClose}
            disabled={step === 1 && jd.length < 100}
            className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-sm ${
              step === 1 && jd.length < 100
                ? 'bg-teal-200 text-white cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <span>{step < 3 ? 'Next' : 'Confirm & Save'}</span>
            <span className="inline-block transform rotate-180">←</span>
          </button>
        </div>
      </div>
    </div>
  )
}
