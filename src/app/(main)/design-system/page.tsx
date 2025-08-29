export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background text-foreground p-8">
      <main className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-h1">디자인 시스템</h1>
          <p className="text-sm text-text-secondary">TailwindCSS 기반 컬러 팔레트 및 타이포그래피 시스템</p>
        </div>

        {/* Typography Section */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Typography</h2>
          
          {/* Font Sizes */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Font Sizes</h3>
            <div className="bg-surface p-6 rounded-small border border-border space-y-4">
              <div>
                <h1 className="text-h1 text-text-primary">H1 (XL) - 56px</h1>
                <p className="text-sm text-text-secondary">메인 헤드라인 - Bold (700)</p>
              </div>
              <div>
                <h2 className="text-h2 text-text-primary">H2 (L) - 36px</h2>
                <p className="text-sm text-text-secondary">제목, 강조 - Semibold (600)</p>
              </div>
              <div>
                <h3 className="text-h3 text-text-primary">H3 (M) - 24px</h3>
                <p className="text-sm text-text-secondary">소제목, 중요 텍스트 - Medium (500)</p>
              </div>
              <div>
                <p className="text-body text-text-primary">Body (S) - 18px</p>
                <p className="text-sm text-text-secondary">본문 텍스트 - Regular (400)</p>
              </div>
              <div>
                <p className="text-caption text-text-primary">Caption (XS) - 14px</p>
                <p className="text-sm text-text-secondary">보조 text, 캡션 - Light (300)</p>
              </div>
            </div>
          </div>

          {/* Font Weights */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Font Weights</h3>
            <div className="bg-surface p-6 rounded-small border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-light text-body text-text-primary">Light (300)</span>
                <span className="text-sm text-text-secondary">보조 text, 캡션</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-regular text-body text-text-primary">Regular (400)</span>
                <span className="text-sm text-text-secondary">본문 텍스트</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-body text-text-primary">Medium (500)</span>
                <span className="text-sm text-text-secondary">UI 요소, 버튼</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-body text-text-primary">Semibold (600)</span>
                <span className="text-sm text-text-secondary">소제목, 중요 텍스트</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-body text-text-primary">Bold (700)</span>
                <span className="text-sm text-text-secondary">제목, 강조</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-black text-body text-text-primary">Black (900)</span>
                <span className="text-sm text-text-secondary">메인 헤드라인</span>
              </div>
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Line Height & Letter Spacing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface p-4 rounded-small border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Tight</h4>
                <p className="text-body text-text-primary" style={{ lineHeight: 'var(--line-height-tight)', letterSpacing: 'var(--letter-spacing-tight)' }}>
                  제목과 짧은 텍스트용<br/>Line Height: 1.4<br/>Letter Spacing: -0.02em
                </p>
              </div>
              <div className="bg-surface p-4 rounded-small border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Normal</h4>
                <p className="text-body text-text-primary" style={{ lineHeight: 'var(--line-height-normal)', letterSpacing: 'var(--letter-spacing-normal)' }}>
                  일반적인 읽기용<br/>Line Height: 1.6<br/>Letter Spacing: 0em
                </p>
              </div>
              <div className="bg-surface p-4 rounded-small border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Long</h4>
                <p className="text-body text-text-primary" style={{ lineHeight: 'var(--line-height-long)', letterSpacing: 'var(--letter-spacing-long)' }}>
                  긴 글과 본문 텍스트용<br/>Line Height: 1.8<br/>Letter Spacing: 0.01em
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Colors */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Primary Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-primary rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Blue (#146EF5)</h3>
              <p className="text-sm text-text-secondary">버튼과 강조 색상</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-black rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Black (#080808)</h3>
              <p className="text-sm text-text-secondary">메인 배경색, 본문 텍스트</p>
            </div>
          </div>
        </section>

        {/* Support Colors */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Support Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Pure White</h3>
              <p className="text-sm text-text-secondary">컴포넌트 배경색</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-gray-medium rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Medium Gray</h3>
              <p className="text-sm text-text-secondary">기본 텍스트, 보조 정보</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-gray-light rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Light Gray</h3>
              <p className="text-sm text-text-secondary">보조 정보용</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-gray-slate rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Slate Gray</h3>
              <p className="text-sm text-text-secondary">카드 배경, 구분선</p>
            </div>
          </div>
        </section>

        {/* Variation Colors */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Variation Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-primary-dark rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Dark Blue</h3>
              <p className="text-sm text-text-secondary">버튼 hover 상태</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-primary-light rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Light Blue</h3>
              <p className="text-sm text-text-secondary">텍스트 강조, hover</p>
            </div>
            <div className="bg-surface p-6 rounded-small border border-border">
              <div className="w-16 h-16 bg-primary-very-light rounded-small mb-3"></div>
              <h3 className="font-semibold text-text-primary">Very Light Blue</h3>
              <p className="text-sm text-text-secondary">그라데이션용</p>
            </div>
          </div>
        </section>

        {/* Object Styles */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Object Styles</h2>
          
          {/* Rounding Examples */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Rounding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface p-6 border border-border rounded-default">
                <div className="w-16 h-16 bg-primary mb-3 rounded-default"></div>
                <h4 className="font-semibold text-text-primary">Default (5px)</h4>
                <p className="text-sm text-text-secondary">기본 라운딩</p>
              </div>
              <div className="bg-surface p-6 border border-border rounded-small">
                <div className="w-16 h-16 bg-primary mb-3 rounded-small"></div>
                <h4 className="font-semibold text-text-primary">Small (12px)</h4>
                <p className="text-sm text-text-secondary">작은 라운딩</p>
              </div>
              <div className="bg-surface p-6 border border-border rounded-full">
                <div className="w-16 h-16 bg-primary mb-3 rounded-full"></div>
                <h4 className="font-semibold text-text-primary">Full (30px)</h4>
                <p className="text-sm text-text-secondary">완전 라운딩</p>
              </div>
            </div>
          </div>

          {/* Border Width Examples */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Border Width</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface p-6 border-1 border-border rounded-default">
                <h4 className="font-semibold text-text-primary">1px Border</h4>
                <p className="text-sm text-text-secondary">얇은 테두리</p>
              </div>
              <div className="bg-surface p-6 border-2 border-border rounded-default">
                <h4 className="font-semibold text-text-primary">2px Border</h4>
                <p className="text-sm text-text-secondary">보통 테두리</p>
              </div>
              <div className="bg-surface p-6 border-4 border-border rounded-default">
                <h4 className="font-semibold text-text-primary">4px Border</h4>
                <p className="text-sm text-text-secondary">두꺼운 테두리</p>
              </div>
            </div>
          </div>
        </section>

        {/* Icon System */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Icon System</h2>
          <p className="text-body text-text-secondary mb-8">6px 그리드 기반의 일관성 있는 아이콘 시스템</p>
          
          {/* Icon Sizes Grid */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Icon Sizes</h3>
            <div className="bg-surface p-8 rounded-small border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* UI Icons Small */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="icon-container p-4 icon-grid">
                      <svg className="icon-ui-small" viewBox="0 0 16 16" fill="#080808">
                        <path d="M3 3h10v10H3V3zm2 2v6h6V5H5z"/>
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-1">UI Small</h4>
                  <p className="text-caption text-text-secondary mb-2">16x16px</p>
                  <p className="text-caption text-text-secondary">버튼 내부, 폼 요소</p>
                </div>

                {/* UI Icons Medium */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="icon-container p-4 icon-grid">
                      <svg className="icon-ui-medium" viewBox="0 0 24 24" fill="#080808">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-1">UI Medium</h4>
                  <p className="text-caption text-text-secondary mb-2">24x24px</p>
                  <p className="text-caption text-text-secondary">네비게이션, 메뉴</p>
                </div>

                {/* UI Icons Large */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="icon-container p-4 icon-grid">
                      <svg className="icon-ui-large" viewBox="0 0 32 32" fill="#080808">
                        <path d="M16 4l4 8h8l-6.5 6L24 26l-8-4-8 4 2.5-8L4 12h8l4-8z"/>
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-1">UI Large</h4>
                  <p className="text-caption text-text-secondary mb-2">32x32px</p>
                  <p className="text-caption text-text-secondary">CTA 버튼, 주요 액션</p>
                </div>

                {/* Social Icons */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="icon-container p-4 icon-grid">
                      <svg className="icon-social" viewBox="0 0 40 40" fill="#080808">
                        <circle cx="20" cy="20" r="16"/>
                        <path d="M20 12c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3 9h-2v6h-2v-6h-2v-2h2v-1c0-1.1.9-2 2-2h2v2h-2z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-1">Social</h4>
                  <p className="text-caption text-text-secondary mb-2">40x40px</p>
                  <p className="text-caption text-text-secondary">소셜 링크, 공유 버튼</p>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Usage Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Usage Examples</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Buttons with Icons */}
              <div className="bg-surface p-6 rounded-small border border-border">
                <h4 className="font-semibold text-text-primary mb-4">Buttons with Icons</h4>
                <div className="space-y-3">
                  <button className="bg-primary text-white px-4 py-2 hover:bg-primary-dark transition-colors rounded-small font-medium flex items-center gap-2">
                    <svg className="icon-ui-small" viewBox="0 0 16 16" fill="white">
                      <path d="M8 2v12l4-4H8V2z"/>
                    </svg>
                    Primary Action
                  </button>
                  <button className="border-2 border-border text-text-primary px-4 py-2 hover:bg-surface-secondary transition-colors rounded-small font-medium flex items-center gap-2">
                    <svg className="icon-ui-small" viewBox="0 0 16 16" fill="#080808">
                      <path d="M3 3h10v10H3V3zm2 2v6h6V5H5z"/>
                    </svg>
                    Secondary Action
                  </button>
                </div>
              </div>

              {/* Navigation with Icons */}
              <div className="bg-surface p-6 rounded-small border border-border">
                <h4 className="font-semibold text-text-primary mb-4">Navigation</h4>
                <nav className="space-y-2">
                  <a href="#" className="flex items-center gap-3 p-2 text-text-primary hover:bg-surface-secondary rounded-default transition-colors">
                    <svg className="icon-ui-medium" viewBox="0 0 24 24" fill="#080808">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Dashboard
                  </a>
                  <a href="#" className="flex items-center gap-3 p-2 text-text-primary hover:bg-surface-secondary rounded-default transition-colors">
                    <svg className="icon-ui-medium" viewBox="0 0 24 24" fill="#080808">
                      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
                    </svg>
                    Components
                  </a>
                  <a href="#" className="flex items-center gap-3 p-2 text-text-primary hover:bg-surface-secondary rounded-default transition-colors">
                    <svg className="icon-ui-medium" viewBox="0 0 24 24" fill="#080808">
                      <circle cx="12" cy="12" r="8"/>
                    </svg>
                    Settings
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* 6px Grid System */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">6px Grid System</h3>
            <div className="bg-surface p-6 rounded-small border border-border">
              <p className="text-body text-text-secondary mb-6">
                모든 아이콘은 6px 기본 그리드를 기반으로 설계되어 일관성과 픽셀 퍼펙트를 보장합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 icon-grid border-2 border-primary rounded-small mx-auto mb-3 flex items-center justify-center">
                    <svg className="icon-ui-medium text-primary" viewBox="0 0 24 24" fill="#146EF5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-caption text-text-secondary">6px 그리드 가이드</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-border rounded-small mx-auto mb-3 flex items-center justify-center bg-gray-light">
                    <svg className="icon-ui-medium text-text-primary" viewBox="0 0 24 24" fill="#080808">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-caption text-text-secondary">픽셀 퍼펙트 정렬</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-border rounded-small mx-auto mb-3 flex items-center justify-center">
                    <svg className="icon-ui-medium text-text-accent" viewBox="0 0 24 24" fill="#3BB2F6">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-caption text-text-secondary">일관된 스타일</p>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Specifications */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Icon Specifications</h3>
            <div className="bg-surface rounded-small border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-light">
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-text-primary">용도</th>
                      <th className="text-left p-4 font-semibold text-text-primary">크기</th>
                      <th className="text-left p-4 font-semibold text-text-primary">사용 예시</th>
                      <th className="text-center p-4 font-semibold text-text-primary w-24">미리보기</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">Favicon</td>
                      <td className="p-4 text-text-secondary">32x32px</td>
                      <td className="p-4 text-text-secondary">브라우저 탭 아이콘</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div className="icon-container p-2 inline-flex">
                            <svg className="icon-favicon" viewBox="0 0 32 32" fill="#080808">
                              <path d="M16 4l4 8h8l-6.5 6L24 26l-8-4-8 4 2.5-8L4 12h8l4-8z"/>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">Touch Icon</td>
                      <td className="p-4 text-text-secondary">256x256px</td>
                      <td className="p-4 text-text-secondary">홈스크린 바로가기</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-primary rounded-small flex items-center justify-center">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="white">
                              <path d="M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z"/>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">UI 아이콘 (소형)</td>
                      <td className="p-4 text-text-secondary">16x16px</td>
                      <td className="p-4 text-text-secondary">버튼 내부, 폼 요소</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <svg className="icon-ui-small" viewBox="0 0 16 16" fill="#080808">
                            <path d="M3 3h10v10H3V3zm2 2v6h6V5H5z"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">UI 아이콘 (중형)</td>
                      <td className="p-4 text-text-secondary">24x24px</td>
                      <td className="p-4 text-text-secondary">네비게이션, 메뉴</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <svg className="icon-ui-medium" viewBox="0 0 24 24" fill="#080808">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">UI 아이콘 (대형)</td>
                      <td className="p-4 text-text-secondary">32x32px</td>
                      <td className="p-4 text-text-secondary">CTA 버튼, 주요 액션</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <svg className="icon-ui-large" viewBox="0 0 32 32" fill="#080808">
                            <path d="M16 4l4 8h8l-6.5 6L24 26l-8-4-8 4 2.5-8L4 12h8l4-8z"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 text-text-primary">소셜 미디어</td>
                      <td className="p-4 text-text-secondary">40x40px</td>
                      <td className="p-4 text-text-secondary">소셜 링크, 공유 버튼</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <svg className="icon-social" viewBox="0 0 40 40" fill="#080808">
                            <circle cx="20" cy="20" r="16"/>
                            <path d="M20 12c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="white"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 text-text-primary">장식용/일러스트</td>
                      <td className="p-4 text-text-secondary">64x64px+</td>
                      <td className="p-4 text-text-secondary">히어로 섹션, 피처</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <svg className="icon-decorative" viewBox="0 0 64 64" fill="#080808">
                            <path d="M32 8l8 16h16l-13 12 5 17-16-8-16 8 5-17-13-12h16l8-16z"/>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Interactive Examples</h2>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <button className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors rounded-default">
                Primary Button
              </button>
              <button className="text-text-primary px-6 py-3 hover:bg-surface-secondary transition-colors border-1 border-border rounded-small">
                Secondary Button
              </button>
              <button className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors rounded-full">
                Rounded Button
              </button>
            </div>
            <div className="bg-surface p-4 border-2 border-border rounded-small">
              <p className="text-text-primary mb-2">This is primary text</p>
              <p className="text-text-secondary mb-2">This is secondary text</p>
              <p className="text-text-accent hover:text-primary-light transition-colors cursor-pointer">
                This is accent text (hover me)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
