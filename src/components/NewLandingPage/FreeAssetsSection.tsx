'use client'

import React from 'react'

export interface FreeAssetsSectionProps {
  onTryAutoSubtitleClick?: () => void
}

const FreeAssetsSection: React.FC<FreeAssetsSectionProps> = ({
  onTryAutoSubtitleClick,
}) => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto text-center max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-6">
            다양한 무료 리소스
          </h2>
          <p className="text-base text-black max-w-3xl mx-auto leading-relaxed">
            다양한 무료 이펙트로 영상을 더욱 풍성하게 만드세요.
            <br />
            상업적 이용 가능한 고품질 자막 애니메이션을 무제한으로 활용할 수
            있어요
          </p>
        </div>
        <section className="py-8 text-center">
          <button
            onClick={onTryAutoSubtitleClick}
            className="px-8 py-3 text-base font-bold bg-white text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            다양한 자막 체험하기
          </button>
        </section>

        {/* Assets interface - placeholder for future GIF */}
        <div className="bg-white rounded-3xl p-8 mx-auto max-w-5xl mb-12 border border-gray-200 shadow-lg">
          <div className="aspect-[5/3] bg-gray-100 rounded-3xl shadow-sm overflow-hidden border border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-2xl">🎬</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                에셋 스토어 GIF
              </p>
              <p className="text-gray-400 text-sm mt-2">나중에 추가될 예정</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeAssetsSection
