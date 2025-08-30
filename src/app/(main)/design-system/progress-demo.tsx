'use client';

import React, { useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import ProgressCircle from '@/components/ProgressCircle';

const ProgressDemo: React.FC = () => {
  const [progressValues, setProgressValues] = useState({
    basic: 65,
    download: 45,
    upload: 80,
    processing: 25,
    loading: 90,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-h2 mb-6 text-text-primary">Progress Components</h2>
        <p className="text-body text-text-secondary mb-8">
          진행 상태를 시각적으로 표시하는 프로그레스 컴포넌트들입니다.
        </p>
      </div>

      {/* Progress Bars */}
      <div className="space-y-6">
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Progress Bars</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Basic Progress Bar</h4>
              <ProgressBar
                value={progressValues.basic}
                label="Overall Progress"
              />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Download Progress</h4>
              <ProgressBar
                value={progressValues.download}
                label="Download"
              />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Upload Progress</h4>
              <ProgressBar
                value={progressValues.upload}
                label="Upload"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar Sizes */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Progress Bar Sizes</h3>
          <div className="space-y-4">
            <ProgressBar
              value={75}
              label="Small Size"
              size="small"
            />
            <ProgressBar
              value={75}
              label="Medium Size (Default)"
              size="medium"
            />
            <ProgressBar
              value={75}
              label="Large Size"
              size="large"
            />
            <ProgressBar
              value={75}
              label="Extra Large Size"
              size="extra-large"
            />
          </div>
        </div>

        {/* Progress Circles */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Progress Circles</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <ProgressCircle value={25} size="small" />
              <p className="mt-2 text-sm text-text-secondary">Small (25%)</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={50} size="medium" />
              <p className="mt-2 text-sm text-text-secondary">Medium (50%)</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={75} size="large" />
              <p className="mt-2 text-sm text-text-secondary">Large (75%)</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={90} size="extra-large" />
              <p className="mt-2 text-sm text-text-secondary">Extra Large (90%)</p>
            </div>
          </div>
        </div>

        {/* Progress Circle Variants */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Progress Circle Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <ProgressCircle value={60} />
              <p className="mt-2 text-sm text-text-secondary">Primary</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={60} />
              <p className="mt-2 text-sm text-text-secondary">Secondary</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={60} />
              <p className="mt-2 text-sm text-text-secondary">Accent</p>
            </div>
            <div className="text-center">
              <ProgressCircle value={60} />
              <p className="mt-2 text-sm text-text-secondary">Negative</p>
            </div>
          </div>
        </div>

        {/* Interactive Progress */}
        <div className="p-6 bg-surface-secondary rounded-small">
          <h3 className="text-h3 text-text-primary mb-4">Interactive Progress</h3>
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <button 
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                onClick={() => setProgressValues(prev => ({
                  ...prev,
                  processing: Math.min(100, prev.processing + 10)
                }))}
              >
                +10%
              </button>
              <button 
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                onClick={() => setProgressValues(prev => ({
                  ...prev,
                  processing: Math.max(0, prev.processing - 10)
                }))}
              >
                -10%
              </button>
              <button 
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                onClick={() => setProgressValues(prev => ({
                  ...prev,
                  processing: 0
                }))}
              >
                Reset
              </button>
            </div>
            <ProgressBar
              value={progressValues.processing}
              label="Processing Task"
            />
            <div className="flex justify-center">
              <ProgressCircle 
                value={progressValues.processing} 
                size="large" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDemo;