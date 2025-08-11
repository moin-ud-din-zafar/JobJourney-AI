import React from 'react';
import { ArrowRight } from 'lucide-react';
import { steps } from './utils';

export default function StepTracker({ step, setStep, atLeast100 }) {
  // enable step-click only when allowed
  const withEnabled = steps.map(s => ({
    ...s,
    enabled:
      s.num === 1
        ? true
        : s.num === 2
          ? atLeast100
          : step > 1
  }));

  return (
    <div className="flex items-center justify-center space-x-4">
      {withEnabled.map(({ num, title, desc, enabled }, i) => {
        const completed = step > num;
        const active    = step === num;
        return (
          <React.Fragment key={num}>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => enabled && setStep(num)}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full 
                ${completed || active
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {num}
              </div>
              <div className="mt-1 text-sm font-medium">{title}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>

            {i < withEnabled.length - 1 && (
              <ArrowRight className="text-gray-300" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
