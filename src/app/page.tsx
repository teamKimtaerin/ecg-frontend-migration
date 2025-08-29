import Image from 'next/image'

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface border-2 border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-small flex items-center justify-center">
                <span className="text-white font-bold text-body">DS</span>
              </div>
              <h1 className="text-h3 text-text-primary">Design System</h1>
            </div>
            <nav className="flex space-x-6">
              <a href="#colors" className="text-body text-text-secondary hover:text-text-accent transition-colors">Colors</a>
              <a href="#typography" className="text-body text-text-secondary hover:text-text-accent transition-colors">Typography</a>
              <a href="#components" className="text-body text-text-secondary hover:text-text-accent transition-colors">Components</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-h1 mb-6 text-text-primary">
            Modern Design System
          </h1>
          <p className="text-h3 text-text-secondary mb-8 max-w-2xl mx-auto">
            TailwindCSS 기반의 일관성 있는 디자인 컴포넌트와 타이포그래피 시스템
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-primary text-white px-8 py-4 hover:bg-primary-dark transition-colors rounded-small font-medium">
              Get Started
            </button>
            <button className="border-2 border-border text-text-primary px-8 py-4 hover:bg-surface-secondary transition-colors rounded-small font-medium">
              View Docs
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Quick Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-surface p-8 rounded-small border-2 border-border text-center">
            <div className="w-16 h-16 bg-primary-very-light rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-primary rounded-small"></div>
            </div>
            <h3 className="text-h3 text-text-primary mb-3">Color System</h3>
            <p className="text-body text-text-secondary">Primary, Support, Variation 컬러로 구성된 체계적인 색상 시스템</p>
          </div>
          
          <div className="bg-surface p-8 rounded-small border-2 border-border text-center">
            <div className="w-16 h-16 bg-primary-very-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-h3 text-primary font-bold">Aa</span>
            </div>
            <h3 className="text-h3 text-text-primary mb-3">Typography</h3>
            <p className="text-body text-text-secondary">Inter 폰트 기반의 반응형 타이포그래피와 웨이트 시스템</p>
          </div>
          
          <div className="bg-surface p-8 rounded-small border-2 border-border text-center">
            <div className="w-16 h-16 bg-primary-very-light rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-3 h-3 bg-primary rounded-default"></div>
                <div className="w-3 h-3 bg-primary-light rounded-default"></div>
                <div className="w-3 h-3 bg-primary-light rounded-default"></div>
                <div className="w-3 h-3 bg-primary rounded-default"></div>
              </div>
            </div>
            <h3 className="text-h3 text-text-primary mb-3">Components</h3>
            <p className="text-body text-text-secondary">일관된 스타일의 재사용 가능한 UI 컴포넌트 라이브러리</p>
          </div>
        </section>

        {/* Design System Showcase */}
        <section className="mb-16" id="colors">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-text-primary mb-4">Color Palette</h2>
            <p className="text-body text-text-secondary">브랜드 아이덴티티를 반영한 컬러 시스템</p>
          </div>
          
          {/* Color Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="text-center">
              <div className="w-full h-20 bg-primary rounded-small mb-3"></div>
              <h4 className="font-semibold text-text-primary">Primary Blue</h4>
              <p className="text-caption text-text-secondary">#146EF5</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-primary-dark rounded-small mb-3"></div>
              <h4 className="font-semibold text-text-primary">Dark Blue</h4>
              <p className="text-caption text-text-secondary">#0A57D4</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-primary-light rounded-small mb-3"></div>
              <h4 className="font-semibold text-text-primary">Light Blue</h4>
              <p className="text-caption text-text-secondary">#3BB2F6</p>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-black rounded-small mb-3"></div>
              <h4 className="font-semibold text-text-primary">Black</h4>
              <p className="text-caption text-text-secondary">#080808</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16" id="typography">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-text-primary mb-4">Typography</h2>
            <p className="text-body text-text-secondary">Inter 폰트 기반의 확장 가능한 타이포그래피 시스템</p>
          </div>
          
          <div className="bg-surface p-8 rounded-small border-2 border-border">
            <div className="space-y-6">
              <div>
                <h1 className="text-h1 text-text-primary mb-2">Heading 1</h1>
                <p className="text-caption text-text-secondary">56px / Bold (700) - 메인 헤드라인용</p>
              </div>
              <div>
                <h2 className="text-h2 text-text-primary mb-2">Heading 2</h2>
                <p className="text-caption text-text-secondary">36px / Semibold (600) - 섹션 제목용</p>
              </div>
              <div>
                <h3 className="text-h3 text-text-primary mb-2">Heading 3</h3>
                <p className="text-caption text-text-secondary">24px / Medium (500) - 서브 제목용</p>
              </div>
              <div>
                <p className="text-body text-text-primary mb-2">Body Text</p>
                <p className="text-caption text-text-secondary">18px / Regular (400) - 본문 텍스트용</p>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="mb-16" id="components">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-text-primary mb-4">Components</h2>
            <p className="text-body text-text-secondary">재사용 가능한 UI 컴포넌트들</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buttons */}
            <div className="bg-surface p-8 rounded-small border-2 border-border">
              <h3 className="text-h3 text-text-primary mb-6">Buttons</h3>
              <div className="space-y-4">
                <button className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors rounded-small font-medium w-full">
                  Primary Button
                </button>
                <button className="border-2 border-border text-text-primary px-6 py-3 hover:bg-surface-secondary transition-colors rounded-small font-medium w-full">
                  Secondary Button
                </button>
                <button className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors rounded-full font-medium w-full">
                  Rounded Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="bg-surface p-8 rounded-small border-2 border-border">
              <h3 className="text-h3 text-text-primary mb-6">Cards</h3>
              <div className="space-y-4">
                <div className="bg-gray-light p-4 rounded-small border-1 border-border">
                  <h4 className="font-semibold text-text-primary mb-2">Card Title</h4>
                  <p className="text-body text-text-secondary">카드 컴포넌트의 예시입니다. 다양한 라운딩과 테두리 스타일을 적용할 수 있습니다.</p>
                </div>
                <div className="bg-white p-4 rounded-default border-2 border-border">
                  <h4 className="font-semibold text-text-primary mb-2">White Card</h4>
                  <p className="text-body text-text-secondary">흰색 배경의 카드 컴포넌트입니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-2 border-border mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-small flex items-center justify-center">
                <span className="text-white font-bold text-caption">DS</span>
              </div>
              <h3 className="text-h3 text-text-primary">Design System</h3>
            </div>
            <p className="text-body text-text-secondary mb-6">
              TailwindCSS 기반의 Modern Design System
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-body text-text-secondary hover:text-text-accent transition-colors">GitHub</a>
              <a href="#" className="text-body text-text-secondary hover:text-text-accent transition-colors">Documentation</a>
              <a href="#" className="text-body text-text-secondary hover:text-text-accent transition-colors">Examples</a>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );
}