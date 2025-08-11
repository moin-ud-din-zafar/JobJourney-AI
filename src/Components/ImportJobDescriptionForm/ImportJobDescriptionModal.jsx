import React, { useState, useEffect } from 'react'
import { X as CloseIcon, Link2, Eye, Check } from 'lucide-react'

import LinkInput from './LinkInput'
import ParsedPreview from './ParsedPreview'
import ConfirmDetails from './ConfirmDetails'
import {
  MODAL_MAX_WIDTH,
  MODAL_MAX_HEIGHT,
  CONTENT_FIXED_HEIGHT,
  HEADER_RIGHT_PADDING,
} from './utils'

export default function ImportJobDescriptionModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState([])
  const [fullDesc, setFullDesc] = useState('')
  const [company, setCompany] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    if (step === 2) {
      setSummary(
        'Senior Frontend Developer role focusing on React and TypeScript development with modern tools and practices.'
      )
      setKeywords(['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'])
      setFullDesc(
        `We’re looking for a Senior Frontend Developer well-versed in React,
TypeScript, and modern CSS frameworks. You’ll collaborate with
designers and backend engineers to deliver pixel-perfect UI,
optimize performance, and build reusable components.`
      )
    }
    if (step === 3) {
      setCompany('TechCorp')
      setTitle('Senior Frontend Developer')
      setDesc(fullDesc)
    }
  }, [step, fullDesc])

  const next = () => setStep(s => Math.min(3, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))
  const save = () => { /* your save logic... */ onClose() }

  const Pill = ({ idx, icon, label }) => {
    const done   = idx < step
    const active = idx === step
    return (
      <div
        onClick={() => done && setStep(idx)}
        className={`flex items-center space-x-1 rounded-full px-4 py-2 text-sm cursor-pointer ${
          done   ? 'bg-green-500 text-white'
          : active? 'bg-teal-700 text-white'
                   : 'bg-gray-100 text-gray-400'
        }`}
      >
        {icon}<span>{label}</span>
      </div>
    )
  }

  const progressClass = step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg w-full ${MODAL_MAX_WIDTH} ${MODAL_MAX_HEIGHT} flex flex-col overflow-hidden`}>
        {/* Close-X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon size={20} />
        </button>

        {/* Header pills */}
        <div className={`flex items-center px-6 ${HEADER_RIGHT_PADDING} py-4 space-x-3`}>
          <Pill idx={1} icon={<Link2 size={14} />} label="Link Input" />
          <div className="flex-1 h-px bg-gray-300" />
          <Pill idx={2} icon={<Eye size={14} />} label="Parsed Preview" />
          <div className="flex-1 h-px bg-gray-300" />
          <Pill idx={3} icon={<Check size={14} />} label="Confirm" />
        </div>

        {/* Fixed-height content area */}
        <div className={`${CONTENT_FIXED_HEIGHT} overflow-auto`}>
          {step === 1 && <LinkInput url={url} setUrl={setUrl} />}
          {step === 2 && (
            <ParsedPreview
              summary={summary}
              keywords={keywords}
              fullDesc={fullDesc}
            />
          )}
          {step === 3 && (
            <ConfirmDetails
              company={company} setCompany={setCompany}
              title={title} setTitle={setTitle}
              desc={desc} setDesc={setDesc}
            />
          )}
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
              <div className={`${progressClass} h-full bg-teal-700`} />
            </div>
          </div>

          <button
            onClick={step < 3 ? next : save}
            disabled={step === 1 && !url}
            className={`flex items-center space-x-1 rounded-lg px-4 py-2 text-sm ${
              step === 1 && !url
                ? 'bg-teal-200 text-white cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <span>{step < 3 ? 'Next' : 'Save Job'}</span>
            <span className="inline-block transform rotate-180">←</span>
          </button>
        </div>
      </div>
    </div>
  )
}
