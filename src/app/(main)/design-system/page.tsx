'use client';

import React, { useState } from 'react';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup';
import Tab from '@/components/Tab';
import TabItem from '@/components/TabItem';
import Slider from '@/components/Slider';
import Tag from '@/components/Tag';
import Switch from '@/components/Switch';
import Dropdown from '@/components/Dropdown';
import HelpText from '@/components/HelpText';
import { StarIcon, HeartIcon, PlusIcon, HomeIcon, UserIcon, SettingsIcon } from '@/components/icons';

export default function Home() {
  // Switch states
  const [switches, setSwitches] = useState({
    wifi: false,
    bluetooth: true,
    location: false,
    enhanced: false,
    premium: true,
    advanced: false,
    normal: false,
    selected: true,
    small: false,
    medium: false,
    large: false,
    extraLarge: false,
    smallNoLabel: true,
    mediumNoLabel: true,
    largeNoLabel: true,
    xlNoLabel: true,
  });

  const handleSwitchChange = (key: string) => (selected: boolean) => {
    setSwitches(prev => ({ ...prev, [key]: selected }));
  };

  // Dropdown states
  const [dropdowns, setDropdowns] = useState({
    basic: '',
    quiet: '',
    withIcon: '',
    error: '',
    required: '',
    sideLabel: '',
    small: '',
    medium: '',
    large: '',
    extraLarge: '',
    disabled: 'option1',
    readonly: 'option2',
  });

  const handleDropdownChange = (key: string) => (value: string) => {
    setDropdowns(prev => ({ ...prev, [key]: value }));
  };

  // Sample dropdown options
  const basicOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4', disabled: true },
  ];

  const iconOptions = [
    { 
      value: 'home', 
      label: 'Home', 
      icon: <HomeIcon className="w-full h-full" />
    },
    { 
      value: 'user', 
      label: 'User Profile', 
      icon: <UserIcon className="w-full h-full" />
    },
    { 
      value: 'settings', 
      label: 'Settings', 
      icon: <SettingsIcon className="w-full h-full" />
    },
  ];

  const UserAvatar = () => (
    <div className="w-full h-full bg-primary text-white flex items-center justify-center text-xs font-bold">
      U
    </div>
  );

  return (
    <div className="font-sans min-h-screen bg-background text-foreground p-8">
      <main className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-h1">디자인 시스템</h1>
          <p className="text-sm text-text-secondary">TailwindCSS 기반 컬러 팔레트, 타이포그래피 및 컴포넌트 시스템</p>
        </div>

        {/* Typography Section */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Typography</h2>
          
          {/* Font Sizes */}
          <div className="mb-6">
            <h3 className="text-h3 mb-3 text-text-primary">Font Sizes</h3>
            <div className="bg-surface p-6 rounded-default border border-border space-y-4">
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
            <div className="bg-surface p-6 rounded-default border border-border space-y-3">
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
              <div className="bg-surface p-4 rounded-default border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Tight</h4>
                <p className="text-body text-text-primary" style={{ lineHeight: 'var(--line-height-tight)', letterSpacing: 'var(--letter-spacing-tight)' }}>
                  제목과 짧은 텍스트용<br/>Line Height: 1.4<br/>Letter Spacing: -0.02em
                </p>
              </div>
              <div className="bg-surface p-4 rounded-default border border-border">
                <h4 className="font-semibold text-text-primary mb-2">Normal</h4>
                <p className="text-body text-text-primary" style={{ lineHeight: 'var(--line-height-normal)', letterSpacing: 'var(--letter-spacing-normal)' }}>
                  일반적인 읽기용<br/>Line Height: 1.6<br/>Letter Spacing: 0em
                </p>
              </div>
              <div className="bg-surface p-4 rounded-default border border-border">
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
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-primary rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Blue (#146EF5)</h3>
              <p className="text-sm text-text-secondary">버튼과 강조 색상</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-black rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Black (#080808)</h3>
              <p className="text-sm text-text-secondary">메인 배경색, 본문 텍스트</p>
            </div>
          </div>
        </section>

        {/* Support Colors */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Support Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Pure White</h3>
              <p className="text-sm text-text-secondary">컴포넌트 배경색</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-gray-medium rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Medium Gray</h3>
              <p className="text-sm text-text-secondary">기본 텍스트, 보조 정보</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-gray-light rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Light Gray</h3>
              <p className="text-sm text-text-secondary">보조 정보용</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-gray-slate rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Slate Gray</h3>
              <p className="text-sm text-text-secondary">카드 배경, 구분선</p>
            </div>
          </div>
        </section>

        {/* Variation Colors */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Variation Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-primary-dark rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Dark Blue</h3>
              <p className="text-sm text-text-secondary">버튼 hover 상태</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-primary-light rounded-default mb-3"></div>
              <h3 className="font-semibold text-text-primary">Light Blue</h3>
              <p className="text-sm text-text-secondary">텍스트 강조, hover</p>
            </div>
            <div className="bg-surface p-6 rounded-default border border-border">
              <div className="w-16 h-16 bg-primary-very-light rounded-default mb-3"></div>
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
                <h4 className="font-semibold text-text-primary">Default (3px)</h4>
                <p className="text-sm text-text-secondary">기본 라운딩</p>
              </div>
              <div className="bg-surface p-6 border border-border rounded-default">
                <div className="w-16 h-16 bg-primary mb-3 rounded-small"></div>
                <h4 className="font-semibold text-text-primary">Small (8px)</h4>
                <p className="text-sm text-text-secondary">작은 라운딩</p>
              </div>
              <div className="bg-surface p-6 border border-border rounded-default">
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
            <div className="bg-surface p-8 rounded-default border border-border">
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
              <div className="bg-surface p-6 rounded-default border border-border">
                <h4 className="font-semibold text-text-primary mb-4">Buttons with Icons</h4>
                <div className="space-y-3">
                  <button className="bg-primary text-white px-4 py-2 hover:bg-primary-dark transition-colors rounded-default font-medium flex items-center gap-2">
                    <svg className="icon-ui-small" viewBox="0 0 16 16" fill="white">
                      <path d="M8 2v12l4-4H8V2z"/>
                    </svg>
                    Primary Action
                  </button>
                  <button className="border-2 border-border text-text-primary px-4 py-2 hover:bg-surface-secondary transition-colors rounded-default font-medium flex items-center gap-2">
                    <svg className="icon-ui-small" viewBox="0 0 16 16" fill="#080808">
                      <path d="M3 3h10v10H3V3zm2 2v6h6V5H5z"/>
                    </svg>
                    Secondary Action
                  </button>
                </div>
              </div>

              {/* Navigation with Icons */}
              <div className="bg-surface p-6 rounded-default border border-border">
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
            <div className="bg-surface p-6 rounded-default border border-border">
              <p className="text-body text-text-secondary mb-6">
                모든 아이콘은 6px 기본 그리드를 기반으로 설계되어 일관성과 픽셀 퍼펙트를 보장합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-24 h-24 icon-grid border-2 border-primary rounded-default mx-auto mb-3 flex items-center justify-center">
                    <svg className="icon-ui-medium text-primary" viewBox="0 0 24 24" fill="#146EF5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-caption text-text-secondary">6px 그리드 가이드</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-border rounded-default mx-auto mb-3 flex items-center justify-center bg-gray-light">
                    <svg className="icon-ui-medium text-text-primary" viewBox="0 0 24 24" fill="#080808">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <p className="text-caption text-text-secondary">픽셀 퍼펙트 정렬</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-border rounded-default mx-auto mb-3 flex items-center justify-center">
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
            <div className="bg-surface rounded-default border border-border overflow-hidden">
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
                          <div className="w-8 h-8 bg-primary rounded-default flex items-center justify-center">
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

        {/* Button Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Button Components</h2>
          <p className="text-body text-text-secondary mb-8">globals.css 디자인 시스템 기반의 재사용 가능한 Button 컴포넌트</p>

          {/* Button Variants */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Variants & Styles</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Accent</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button variant="accent" label="Fill Button" className="w-32" />
                    <Button variant="accent" style="outline" label="Outline Button" className="w-32" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Primary</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button variant="primary" label="Fill Button" className="w-32" />
                    <Button variant="primary" style="outline" label="Outline Button" className="w-32" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Secondary</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button variant="secondary" label="Fill Button" className="w-32" />
                    <Button variant="secondary" style="outline" label="Outline Button" className="w-32" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Negative</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button variant="negative" label="Fill Button" className="w-32" />
                    <Button variant="negative" style="outline" label="Outline Button" className="w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <Button size="small" label="Small" />
                  <p className="text-caption text-text-secondary">Small</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button size="medium" label="Medium" />
                  <p className="text-caption text-text-secondary">Medium</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button size="large" label="Large" />
                  <p className="text-caption text-text-secondary">Large</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button size="extra-large" label="Extra Large" />
                  <p className="text-caption text-text-secondary">Extra Large</p>
                </div>
              </div>
            </div>
          </div>

          {/* Button with Icons */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">With Icons</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Icon + Label</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button icon={<StarIcon />} label="Favorite" className="w-36" />
                    <Button icon={<HeartIcon />} label="Like" variant="secondary" className="w-36" />
                    <Button icon={<PlusIcon />} label="Add New" size="large" className="w-36" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Icon Only</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button icon={<StarIcon />} hideLabel="Favorite" />
                    <Button icon={<HeartIcon />} hideLabel="Like" variant="secondary" />
                    <Button icon={<PlusIcon />} hideLabel="Add" size="large" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Different Sizes</h4>
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <Button icon={<StarIcon />} label="Small" size="small" className="w-28" />
                    <Button icon={<HeartIcon />} label="Medium" size="medium" className="w-28" />
                    <Button icon={<PlusIcon />} label="Large" size="large" className="w-28" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Static Colors */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Static Colors</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">White Static</h4>
                  <div className="bg-black p-6 rounded-default space-y-3 w-full flex flex-col items-center">
                    <Button staticColor="white" label="White Fill" className="w-36" />
                    <Button staticColor="white" style="outline" label="White Outline" className="w-36" />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Black Static</h4>
                  <div className="bg-white p-6 rounded-default space-y-3 w-full flex flex-col items-center">
                    <Button staticColor="black" label="Black Fill" className="w-36" />
                    <Button staticColor="black" style="outline" label="Black Outline" className="w-36" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Button States */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">States</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Normal</h4>
                  <Button label="Button" className="w-36" />
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Pending</h4>
                  <Button label="Loading..." isPending={true} className="w-36" />
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="font-semibold text-text-primary mb-4 h-6 flex items-center">Disabled</h4>
                  <Button label="Disabled" isDisabled={true} className="w-36" />
                </div>
              </div>
            </div>
          </div>

          {/* Justified Buttons */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Justified</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-4 max-w-md mx-auto">
                <Button label="Normal Width" />
                <Button label="Justified Button" justified={true} />
                <Button 
                  icon={<PlusIcon />} 
                  label="Justified with Icon" 
                  justified={true} 
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Button Group Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Button Group Components</h2>
          <p className="text-body text-text-secondary mb-8">연결된 버튼들의 그룹으로 관련 액션들을 묶어서 표시</p>

          {/* Horizontal Button Groups */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Horizontal Groups</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                {/* Basic horizontal group */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Basic Group</h4>
                  <ButtonGroup orientation="horizontal">
                    <Button label="First" />
                    <Button label="Second" />
                    <Button label="Third" />
                  </ButtonGroup>
                </div>

                {/* Mixed variants */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Mixed Variants</h4>
                  <ButtonGroup orientation="horizontal">
                    <Button label="Primary" variant="primary" />
                    <Button label="Secondary" variant="secondary" />
                    <Button label="Accent" variant="accent" />
                  </ButtonGroup>
                </div>

                {/* With icons */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">With Icons</h4>
                  <ButtonGroup orientation="horizontal">
                    <Button icon={<StarIcon />} label="Favorite" />
                    <Button icon={<HeartIcon />} label="Like" />
                    <Button icon={<PlusIcon />} label="Add" />
                  </ButtonGroup>
                </div>

                {/* Icon only */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Icon Only</h4>
                  <ButtonGroup orientation="horizontal">
                    <Button icon={<StarIcon />} hideLabel="Favorite" />
                    <Button icon={<HeartIcon />} hideLabel="Like" />
                    <Button icon={<PlusIcon />} hideLabel="Add" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Button Groups */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Vertical Groups</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Basic vertical group */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Basic Group</h4>
                  <ButtonGroup orientation="vertical">
                    <Button label="Option 1" />
                    <Button label="Option 2" />
                    <Button label="Option 3" />
                  </ButtonGroup>
                </div>

                {/* Navigation style */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Navigation Style</h4>
                  <ButtonGroup orientation="vertical">
                    <Button icon={<StarIcon />} label="Dashboard" variant="secondary" />
                    <Button icon={<HeartIcon />} label="Analytics" variant="secondary" />
                    <Button icon={<PlusIcon />} label="Settings" variant="secondary" />
                  </ButtonGroup>
                </div>

                {/* Menu style */}
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Menu Style</h4>
                  <ButtonGroup orientation="vertical">
                    <Button label="Edit Profile" style="outline" />
                    <Button label="Account Settings" style="outline" />
                    <Button label="Sign Out" style="outline" variant="negative" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Different Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Different Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Small</h4>
                  <ButtonGroup size="small">
                    <Button label="Small" />
                    <Button label="Group" />
                    <Button label="Size" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Medium</h4>
                  <ButtonGroup size="medium">
                    <Button label="Medium" />
                    <Button label="Group" />
                    <Button label="Size" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Large</h4>
                  <ButtonGroup size="large">
                    <Button label="Large" />
                    <Button label="Group" />
                    <Button label="Size" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Button Spacing</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">No Spacing (Connected)</h4>
                  <ButtonGroup spacing="none">
                    <Button label="Connected" />
                    <Button label="Button" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Small Spacing</h4>
                  <ButtonGroup spacing="small">
                    <Button label="Small" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Medium Spacing</h4>
                  <ButtonGroup spacing="medium">
                    <Button label="Medium" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Large Spacing</h4>
                  <ButtonGroup spacing="large">
                    <Button label="Large" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Spacing */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Vertical Spacing</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">No Spacing</h4>
                  <ButtonGroup orientation="vertical" spacing="none">
                    <Button label="Connected" />
                    <Button label="Vertical" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Small Spacing</h4>
                  <ButtonGroup orientation="vertical" spacing="small">
                    <Button label="Small" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Medium Spacing</h4>
                  <ButtonGroup orientation="vertical" spacing="medium">
                    <Button label="Medium" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Large Spacing</h4>
                  <ButtonGroup orientation="vertical" spacing="large">
                    <Button label="Large" />
                    <Button label="Spaced" />
                    <Button label="Group" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>

          {/* States */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Group States</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Normal Group</h4>
                  <ButtonGroup>
                    <Button label="Normal" />
                    <Button label="Group" />
                    <Button label="State" />
                  </ButtonGroup>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Disabled Group</h4>
                  <ButtonGroup isDisabled={true}>
                    <Button label="Disabled" />
                    <Button label="Group" />
                    <Button label="State" />
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Tab Components</h2>
          <p className="text-body text-text-secondary mb-8">네비게이션을 위한 탭 인터페이스 컴포넌트</p>

          {/* Basic Horizontal Tabs */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Basic Horizontal Tabs</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Regular Style</h4>
                  <Tab>
                    <TabItem id="tab1" label="Home" />
                    <TabItem id="tab2" label="About" />
                    <TabItem id="tab3" label="Services" />
                    <TabItem id="tab4" label="Contact" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">With Icons</h4>
                  <Tab>
                    <TabItem id="icon1" icon={<StarIcon />} label="Dashboard" />
                    <TabItem id="icon2" icon={<HeartIcon />} label="Analytics" />
                    <TabItem id="icon3" icon={<PlusIcon />} label="Settings" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Icon Only</h4>
                  <Tab>
                    <TabItem id="icononly1" icon={<StarIcon />} />
                    <TabItem id="icononly2" icon={<HeartIcon />} />
                    <TabItem id="icononly3" icon={<PlusIcon />} />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Styles */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Tab Styles</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-8">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Regular (Default)</h4>
                  <Tab>
                    <TabItem id="reg1" label="Tab One" />
                    <TabItem id="reg2" label="Tab Two" />
                    <TabItem id="reg3" label="Tab Three" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Quiet Style</h4>
                  <Tab isQuiet={true}>
                    <TabItem id="quiet1" label="Tab One" />
                    <TabItem id="quiet2" label="Tab Two" />
                    <TabItem id="quiet3" label="Tab Three" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Emphasized Style</h4>
                  <Tab isEmphasized={true}>
                    <TabItem id="emp1" label="Tab One" />
                    <TabItem id="emp2" label="Tab Two" />
                    <TabItem id="emp3" label="Tab Three" />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Tab Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Small</h4>
                  <Tab size="small">
                    <TabItem id="small1" label="Small Tab" />
                    <TabItem id="small2" label="Small Tab" />
                    <TabItem id="small3" label="Small Tab" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Medium</h4>
                  <Tab size="medium">
                    <TabItem id="med1" label="Medium Tab" />
                    <TabItem id="med2" label="Medium Tab" />
                    <TabItem id="med3" label="Medium Tab" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Large</h4>
                  <Tab size="large">
                    <TabItem id="large1" label="Large Tab" />
                    <TabItem id="large2" label="Large Tab" />
                    <TabItem id="large3" label="Large Tab" />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Density */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Tab Density</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-6">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Regular Density</h4>
                  <Tab density="regular">
                    <TabItem id="regdens1" label="Regular Tab" />
                    <TabItem id="regdens2" label="Regular Tab" />
                    <TabItem id="regdens3" label="Regular Tab" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Compact Density</h4>
                  <Tab density="compact">
                    <TabItem id="compact1" label="Compact Tab" />
                    <TabItem id="compact2" label="Compact Tab" />
                    <TabItem id="compact3" label="Compact Tab" />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Tabs */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Vertical Tabs</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Basic Vertical</h4>
                  <Tab orientation="vertical">
                    <TabItem id="vert1" label="Dashboard" />
                    <TabItem id="vert2" label="Analytics" />
                    <TabItem id="vert3" label="Reports" />
                    <TabItem id="vert4" label="Settings" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">With Icons</h4>
                  <Tab orientation="vertical">
                    <TabItem id="verticon1" icon={<StarIcon />} label="Dashboard" />
                    <TabItem id="verticon2" icon={<HeartIcon />} label="Analytics" />
                    <TabItem id="verticon3" icon={<PlusIcon />} label="Settings" />
                  </Tab>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <h4 className="font-semibold text-text-primary">Quiet Vertical</h4>
                  <Tab orientation="vertical" isQuiet={true}>
                    <TabItem id="vertquiet1" label="Option One" />
                    <TabItem id="vertquiet2" label="Option Two" />
                    <TabItem id="vertquiet3" label="Option Three" />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Fluid and Alignment */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Fluid and Alignment</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="space-y-8">
                
                <div className="flex flex-col gap-4">
                  <h4 className="font-semibold text-text-primary text-center">Fluid Tabs (Full Width)</h4>
                  <Tab isFluid={true} className="w-full">
                    <TabItem id="fluid1" label="Tab One" />
                    <TabItem id="fluid2" label="Tab Two" />
                    <TabItem id="fluid3" label="Tab Three" />
                  </Tab>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="font-semibold text-text-primary text-center">Center Aligned</h4>
                  <Tab alignment="center">
                    <TabItem id="center1" label="Tab One" />
                    <TabItem id="center2" label="Tab Two" />
                    <TabItem id="center3" label="Tab Three" />
                  </Tab>
                </div>
              </div>
            </div>
          </div>

          {/* Tab States */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Tab States</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="flex flex-col items-center gap-4">
                <h4 className="font-semibold text-text-primary">With Disabled Tab</h4>
                <Tab>
                  <TabItem id="state1" label="Active Tab" />
                  <TabItem id="state2" label="Normal Tab" />
                  <TabItem id="state3" label="Disabled Tab" isDisabled={true} />
                  <TabItem id="state4" label="Normal Tab" />
                </Tab>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Interactive Examples</h2>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button 
                label="Alert Button" 
                onClick={() => alert('Button clicked!')}
              />
              <Button 
                icon={<HeartIcon />}
                label="Console Log" 
                variant="secondary"
                onClick={() => console.log('Button clicked in console')}
              />
              <Button 
                icon={<PlusIcon />}
                label="Large Action" 
                size="large"
                onClick={() => alert('Large button clicked!')}
              />
            </div>
            <div className="bg-surface p-4 border-2 border-border rounded-default">
              <p className="text-text-primary mb-2">This is primary text</p>
              <p className="text-text-secondary mb-2">This is secondary text</p>
              <p className="text-text-accent hover:text-primary-light transition-colors cursor-pointer">
                This is accent text (hover me)
              </p>
            </div>
          </div>
        </section>

        {/* Slider Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Slider Components</h2>
          <p className="text-body text-text-secondary mb-8">값 입력을 위한 슬라이더 컴포넌트 - 기본 기능부터 고급 기능까지</p>

          {/* Basic Sliders */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Basic Sliders</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">기본 슬라이더</h4>
                    <Slider 
                      label="Volume"
                      minValue={0}
                      maxValue={100}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Step 조정</h4>
                    <Slider 
                      label="Step by 10"
                      minValue={0}
                      maxValue={100}
                      step={10}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Custom Range</h4>
                    <Slider 
                      label="Temperature (°C)"
                      minValue={-10}
                      maxValue={50}
                      valueFormat={(val) => `${val}°C`}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Left Label</h4>
                    <Slider 
                      label="Brightness"
                      labelPosition="left"
                      minValue={0}
                      maxValue={100}
                      width={200}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Custom Width</h4>
                    <Slider 
                      label="Progress"
                      minValue={0}
                      maxValue={100}
                      width={150}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Disabled State</h4>
                    <Slider 
                      label="Read Only"
                      value={60}
                      minValue={0}
                      maxValue={100}
                      isDisabled={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Advanced Features</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Fill 표시</h4>
                    <Slider 
                      label="Storage Used"
                      minValue={0}
                      maxValue={100}
                      hasFill={true}
                      valueFormat={(val) => `${val}%`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Fill with Start Point</h4>
                    <Slider 
                      label="Temperature Range"
                      minValue={-20}
                      maxValue={40}
                      hasFill={true}
                      fillStart={0}
                      valueFormat={(val) => `${val}°C`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Gradient Fill</h4>
                    <Slider 
                      label="Performance"
                      minValue={0}
                      maxValue={100}
                      hasFill={true}
                      hasGradient={true}
                      valueFormat={(val) => `${val}%`}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Logarithmic Scale</h4>
                    <Slider 
                      label="Frequency (Hz)"
                      minValue={1}
                      maxValue={1000}
                      progressionScale="log"
                      hasFill={true}
                      valueFormat={(val) => `${Math.round(val)} Hz`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Price Range</h4>
                    <Slider 
                      label="Budget"
                      minValue={0}
                      maxValue={2000}
                      step={50}
                      hasFill={true}
                      hasGradient={true}
                      valueFormat={(val) => `$${val.toLocaleString()}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Non-editable</h4>
                    <Slider 
                      label="System Load"
                      value={42}
                      minValue={0}
                      maxValue={100}
                      hasFill={true}
                      isEditable={false}
                      valueFormat={(val) => `${val}%`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Interactive Examples</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Audio Settings</h4>
                    <div className="space-y-4">
                      <Slider 
                        label="Master Volume"
                        minValue={0}
                        maxValue={100}
                        hasFill={true}
                        valueFormat={(val) => `${val}%`}
                      />
                      <Slider 
                        label="Bass"
                        minValue={-20}
                        maxValue={20}
                        fillStart={0}
                        hasFill={true}
                        valueFormat={(val) => val > 0 ? `+${val}dB` : `${val}dB`}
                      />
                      <Slider 
                        label="Treble"
                        minValue={-20}
                        maxValue={20}
                        fillStart={0}
                        hasFill={true}
                        valueFormat={(val) => val > 0 ? `+${val}dB` : `${val}dB`}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">System Monitor</h4>
                    <div className="space-y-4">
                      <Slider 
                        label="CPU Usage"
                        value={68}
                        minValue={0}
                        maxValue={100}
                        hasFill={true}
                        hasGradient={true}
                        isEditable={false}
                        valueFormat={(val) => `${val}%`}
                      />
                      <Slider 
                        label="Memory Usage"
                        value={42}
                        minValue={0}
                        maxValue={100}
                        hasFill={true}
                        isEditable={false}
                        valueFormat={(val) => `${val}%`}
                      />
                      <Slider 
                        label="Disk Usage"
                        value={85}
                        minValue={0}
                        maxValue={100}
                        hasFill={true}
                        isEditable={false}
                        valueFormat={(val) => `${val}%`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tag Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Tag Components</h2>
          <p className="text-body text-text-secondary mb-8">라벨링, 카테고리, 상태 표시를 위한 태그 컴포넌트</p>

          {/* Basic Tags */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Basic Tags</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">기본 태그</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label="React" />
                      <Tag label="TypeScript" />
                      <Tag label="Next.js" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Avatar 포함</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="John Doe" 
                        hasAvatar={true}
                        avatar={<UserAvatar />}
                      />
                      <Tag 
                        label="Designer" 
                        hasAvatar={true}
                        avatar={<div className="w-full h-full bg-green-500 rounded-full"></div>}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">제거 가능한 태그</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="JavaScript" 
                        isRemovable={true}
                        onRemove={() => alert('JavaScript tag removed')}
                      />
                      <Tag 
                        label="CSS" 
                        isRemovable={true}
                        onRemove={() => alert('CSS tag removed')}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">클릭 가능한 태그</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="Frontend" 
                        onClick={() => alert('Frontend tag clicked')}
                      />
                      <Tag 
                        label="Backend" 
                        onClick={() => alert('Backend tag clicked')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Avatar + 제거 가능</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="Alice Smith" 
                        hasAvatar={true}
                        avatar={<UserAvatar />}
                        isRemovable={true}
                        onRemove={() => alert('Alice Smith removed')}
                      />
                      <Tag 
                        label="Bob Johnson" 
                        hasAvatar={true}
                        avatar={<div className="w-full h-full bg-purple-500 rounded-full"></div>}
                        isRemovable={true}
                        onRemove={() => alert('Bob Johnson removed')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">모든 기능 포함</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="Team Lead" 
                        hasAvatar={true}
                        avatar={<UserAvatar />}
                        isRemovable={true}
                        onClick={() => alert('Team Lead clicked')}
                        onRemove={() => alert('Team Lead removed')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tag States */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Tag States</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Normal State</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label="Normal" />
                      <Tag 
                        label="Interactive" 
                        onClick={() => alert('Clicked')}
                      />
                      <Tag 
                        label="Removable" 
                        isRemovable={true}
                        onRemove={() => alert('Removed')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Error State</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label="Error Tag" isError={true} />
                      <Tag 
                        label="Error Interactive" 
                        isError={true}
                        onClick={() => alert('Error clicked')}
                      />
                      <Tag 
                        label="Error Removable" 
                        isError={true}
                        isRemovable={true}
                        onRemove={() => alert('Error removed')}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Disabled State</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label="Disabled" isDisabled={true} />
                      <Tag 
                        label="Disabled Interactive" 
                        isDisabled={true}
                        onClick={() => alert('Should not click')}
                      />
                      <Tag 
                        label="Disabled Removable" 
                        isDisabled={true}
                        isRemovable={true}
                        onRemove={() => alert('Should not remove')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Read-Only State</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag label="Read Only" isReadOnly={true} />
                      <Tag 
                        label="Read Only Interactive" 
                        isReadOnly={true}
                        onClick={() => alert('Should not click')}
                      />
                      <Tag 
                        label="Read Only Removable" 
                        isReadOnly={true}
                        isRemovable={true}
                        onRemove={() => alert('Should not remove')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complex Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Complex Examples</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Skills Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="React.js" 
                        isRemovable={true}
                        onRemove={() => alert('React.js removed')}
                      />
                      <Tag 
                        label="TypeScript" 
                        isRemovable={true}
                        onRemove={() => alert('TypeScript removed')}
                      />
                      <Tag 
                        label="Node.js" 
                        isRemovable={true}
                        onRemove={() => alert('Node.js removed')}
                      />
                      <Tag 
                        label="GraphQL" 
                        isRemovable={true}
                        onRemove={() => alert('GraphQL removed')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Team Members</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="Sarah Wilson" 
                        hasAvatar={true}
                        avatar={<div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">SW</div>}
                        isRemovable={true}
                        onRemove={() => alert('Sarah removed')}
                      />
                      <Tag 
                        label="Mike Chen" 
                        hasAvatar={true}
                        avatar={<div className="w-full h-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">MC</div>}
                        isRemovable={true}
                        onRemove={() => alert('Mike removed')}
                      />
                      <Tag 
                        label="Error User" 
                        hasAvatar={true}
                        avatar={<div className="w-full h-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">EU</div>}
                        isError={true}
                        isRemovable={true}
                        onRemove={() => alert('Error user removed')}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Project Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="In Progress" 
                        onClick={() => alert('In Progress clicked')}
                      />
                      <Tag 
                        label="Completed" 
                        onClick={() => alert('Completed clicked')}
                      />
                      <Tag 
                        label="On Hold" 
                        isError={true}
                        onClick={() => alert('On Hold clicked')}
                      />
                      <Tag 
                        label="Archived" 
                        isDisabled={true}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <Tag 
                        label="Design System" 
                        onClick={() => alert('Design System clicked')}
                      />
                      <Tag 
                        label="Frontend" 
                        onClick={() => alert('Frontend clicked')}
                      />
                      <Tag 
                        label="API" 
                        onClick={() => alert('API clicked')}
                      />
                      <Tag 
                        label="Documentation" 
                        isReadOnly={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Switch Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Switch Components</h2>
          <p className="text-body text-text-secondary mb-8">상태 전환을 위한 스위치 컴포넌트 - 다양한 크기와 스타일 지원</p>

          {/* Basic Switches */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Basic Switches</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">기본 스위치</h4>
                    <div className="space-y-3">
                      <Switch 
                        label="Wi-Fi" 
                        isSelected={switches.wifi}
                        onChange={handleSwitchChange('wifi')}
                      />
                      <Switch 
                        label="Bluetooth" 
                        isSelected={switches.bluetooth}
                        onChange={handleSwitchChange('bluetooth')}
                      />
                      <Switch 
                        label="Location Services" 
                        isSelected={switches.location}
                        onChange={handleSwitchChange('location')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">라벨 없는 스위치</h4>
                    <div className="flex gap-4 items-center">
                      <Switch 
                        isSelected={switches.smallNoLabel}
                        onChange={handleSwitchChange('smallNoLabel')}
                      />
                      <Switch 
                        isSelected={switches.mediumNoLabel}
                        onChange={handleSwitchChange('mediumNoLabel')}
                      />
                      <Switch isDisabled={true} />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">강조 스타일</h4>
                    <div className="space-y-3">
                      <Switch 
                        label="Enhanced Mode" 
                        isEmphasized={true}
                        isSelected={switches.enhanced}
                        onChange={handleSwitchChange('enhanced')}
                      />
                      <Switch 
                        label="Premium Feature" 
                        isSelected={switches.premium}
                        isEmphasized={true}
                        onChange={handleSwitchChange('premium')}
                      />
                      <Switch 
                        label="Advanced Settings" 
                        isEmphasized={true}
                        isSelected={switches.advanced}
                        onChange={handleSwitchChange('advanced')}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">상태별 스위치</h4>
                    <div className="space-y-3">
                      <Switch 
                        label="Normal"
                        isSelected={switches.normal}
                        onChange={handleSwitchChange('normal')}
                      />
                      <Switch 
                        label="Selected" 
                        isSelected={switches.selected}
                        onChange={handleSwitchChange('selected')}
                      />
                      <Switch label="Disabled" isDisabled={true} />
                      <Switch label="Read Only" isSelected={true} isReadOnly={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Switch Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Switch Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">라벨과 함께</h4>
                    <div className="space-y-4">
                      <Switch 
                        size="small" 
                        label="Small Switch"
                        isSelected={switches.small}
                        onChange={handleSwitchChange('small')}
                      />
                      <Switch 
                        size="medium" 
                        label="Medium Switch"
                        isSelected={switches.medium}
                        onChange={handleSwitchChange('medium')}
                      />
                      <Switch 
                        size="large" 
                        label="Large Switch"
                        isSelected={switches.large}
                        onChange={handleSwitchChange('large')}
                      />
                      <Switch 
                        size="extra-large" 
                        label="Extra Large Switch"
                        isSelected={switches.extraLarge}
                        onChange={handleSwitchChange('extraLarge')}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">라벨 없이</h4>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Switch 
                          size="small" 
                          isSelected={switches.smallNoLabel}
                          onChange={handleSwitchChange('smallNoLabel')}
                        />
                        <p className="text-sm text-text-secondary">Small</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Switch 
                          size="medium" 
                          isSelected={switches.mediumNoLabel}
                          onChange={handleSwitchChange('mediumNoLabel')}
                        />
                        <p className="text-sm text-text-secondary">Medium</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Switch 
                          size="large" 
                          isSelected={switches.largeNoLabel}
                          onChange={handleSwitchChange('largeNoLabel')}
                        />
                        <p className="text-sm text-text-secondary">Large</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Switch 
                          size="extra-large" 
                          isSelected={switches.xlNoLabel}
                          onChange={handleSwitchChange('xlNoLabel')}
                        />
                        <p className="text-sm text-text-secondary">XL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dropdown Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Dropdown Components</h2>
          <p className="text-body text-text-secondary mb-8">선택을 위한 드롭다운 컴포넌트 - 다양한 스타일과 옵션 지원</p>

          {/* Basic Dropdowns */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Basic Dropdowns</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">기본 드롭다운</h4>
                    <Dropdown
                      label="Select Country"
                      placeholder="Choose a country..."
                      options={basicOptions}
                      value={dropdowns.basic}
                      onChange={handleDropdownChange('basic')}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">아이콘 포함</h4>
                    <Dropdown
                      label="Navigation"
                      placeholder="Select a page..."
                      options={iconOptions}
                      value={dropdowns.withIcon}
                      onChange={handleDropdownChange('withIcon')}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">필수 입력</h4>
                    <Dropdown
                      label="Required Field"
                      placeholder="Please select an option"
                      options={basicOptions}
                      value={dropdowns.required}
                      onChange={handleDropdownChange('required')}
                      isRequired={true}
                      description="This field is required to continue"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Quiet 스타일</h4>
                    <Dropdown
                      label="Minimal Style"
                      placeholder="Select option..."
                      options={basicOptions}
                      value={dropdowns.quiet}
                      onChange={handleDropdownChange('quiet')}
                      isQuiet={true}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">에러 상태</h4>
                    <Dropdown
                      label="Error Example"
                      placeholder="This has an error..."
                      options={basicOptions}
                      value={dropdowns.error}
                      onChange={handleDropdownChange('error')}
                      isError={true}
                      errorMessage="Please select a valid option"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">사이드 라벨</h4>
                    <Dropdown
                      label="Side Label"
                      labelPosition="side"
                      placeholder="Choose..."
                      options={basicOptions}
                      value={dropdowns.sideLabel}
                      onChange={handleDropdownChange('sideLabel')}
                      width={200}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdown Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Dropdown Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Small</h4>
                    <Dropdown
                      label="Small Dropdown"
                      size="small"
                      placeholder="Small size..."
                      options={basicOptions}
                      value={dropdowns.small}
                      onChange={handleDropdownChange('small')}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Medium</h4>
                    <Dropdown
                      label="Medium Dropdown"
                      size="medium"
                      placeholder="Medium size..."
                      options={basicOptions}
                      value={dropdowns.medium}
                      onChange={handleDropdownChange('medium')}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Large</h4>
                    <Dropdown
                      label="Large Dropdown"
                      size="large"
                      placeholder="Large size..."
                      options={basicOptions}
                      value={dropdowns.large}
                      onChange={handleDropdownChange('large')}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Extra Large</h4>
                    <Dropdown
                      label="Extra Large Dropdown"
                      size="extra-large"
                      placeholder="Extra large size..."
                      options={basicOptions}
                      value={dropdowns.extraLarge}
                      onChange={handleDropdownChange('extraLarge')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdown States */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Dropdown States</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Normal State</h4>
                    <Dropdown
                      label="Normal"
                      placeholder="Select an option..."
                      options={basicOptions}
                      value={dropdowns.basic}
                      onChange={handleDropdownChange('basic')}
                      description="This is a normal dropdown"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Disabled State</h4>
                    <Dropdown
                      label="Disabled"
                      placeholder="Cannot interact..."
                      options={basicOptions}
                      value={dropdowns.disabled}
                      isDisabled={true}
                      description="This dropdown is disabled"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Read-Only State</h4>
                    <Dropdown
                      label="Read-Only"
                      placeholder="View only..."
                      options={basicOptions}
                      value={dropdowns.readonly}
                      isReadOnly={true}
                      description="This dropdown is read-only"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Custom Width</h4>
                    <Dropdown
                      label="Custom Width"
                      placeholder="300px width..."
                      options={basicOptions}
                      value={dropdowns.basic}
                      onChange={handleDropdownChange('basic')}
                      width={300}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Interactive Examples</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">User Preferences</h4>
                    <div className="space-y-4">
                      <Dropdown
                        label="Theme"
                        options={[
                          { value: 'light', label: 'Light Mode' },
                          { value: 'dark', label: 'Dark Mode' },
                          { value: 'auto', label: 'System Default' },
                        ]}
                        value={dropdowns.basic}
                        onChange={handleDropdownChange('basic')}
                        placeholder="Choose theme..."
                      />
                      <Dropdown
                        label="Language"
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'ko', label: '한국어' },
                          { value: 'ja', label: '日本語' },
                          { value: 'zh', label: '中文' },
                        ]}
                        value={dropdowns.quiet}
                        onChange={handleDropdownChange('quiet')}
                        placeholder="Select language..."
                        isQuiet={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Form Fields</h4>
                    <div className="space-y-4">
                      <Dropdown
                        label="Priority"
                        labelPosition="side"
                        options={[
                          { value: 'low', label: 'Low Priority' },
                          { value: 'medium', label: 'Medium Priority' },
                          { value: 'high', label: 'High Priority' },
                          { value: 'urgent', label: 'Urgent' },
                        ]}
                        value={dropdowns.sideLabel}
                        onChange={handleDropdownChange('sideLabel')}
                        placeholder="Select priority..."
                        isRequired={true}
                        size="small"
                        width={180}
                      />
                      <Dropdown
                        label="Status"
                        labelPosition="side"
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'review', label: 'In Review' },
                          { value: 'approved', label: 'Approved' },
                          { value: 'published', label: 'Published' },
                        ]}
                        value={dropdowns.withIcon}
                        onChange={handleDropdownChange('withIcon')}
                        placeholder="Select status..."
                        size="small"
                        width={180}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help Text Components */}
        <section className="mb-8">
          <h2 className="text-h2 mb-4 text-text-primary">Help Text Components</h2>
          <p className="text-body text-text-secondary mb-8">사용자 안내를 위한 도움말 텍스트 컴포넌트 - 정보 제공 및 오류 표시</p>

          {/* Help Text Variants */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Help Text Variants</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Neutral Variant</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="This is a neutral help text that provides general information to users."
                        variant="neutral"
                      />
                      <HelpText 
                        text="You can also have neutral help text without an icon if needed."
                        variant="neutral"
                        hideIcon={true}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Disabled Neutral</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="This neutral help text is disabled and appears faded."
                        variant="neutral"
                        isDisabled={true}
                      />
                      <HelpText 
                        text="Disabled text without icon also appears faded."
                        variant="neutral"
                        hideIcon={true}
                        isDisabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Negative Variant</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="This is a negative help text that indicates an error or warning to the user."
                        variant="negative"
                      />
                      <HelpText 
                        text="You can hide the error icon if you prefer a cleaner look."
                        variant="negative"
                        hideIcon={true}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Form Validation</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="Please enter a valid email address (example@domain.com)"
                        variant="negative"
                      />
                      <HelpText 
                        text="Password must be at least 8 characters long"
                        variant="negative"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text Sizes */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Help Text Sizes</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Neutral Sizes</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Small</p>
                        <HelpText 
                          text="This is small help text for compact interfaces."
                          variant="neutral"
                          size="small"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Medium (Default)</p>
                        <HelpText 
                          text="This is medium help text, which is the default size."
                          variant="neutral"
                          size="medium"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Large</p>
                        <HelpText 
                          text="This is large help text for more prominent display."
                          variant="neutral"
                          size="large"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Extra Large</p>
                        <HelpText 
                          text="This is extra large help text for maximum visibility."
                          variant="neutral"
                          size="extra-large"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Negative Sizes</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Small</p>
                        <HelpText 
                          text="Small error message for inline validation."
                          variant="negative"
                          size="small"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Medium (Default)</p>
                        <HelpText 
                          text="Medium error message for standard forms."
                          variant="negative"
                          size="medium"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Large</p>
                        <HelpText 
                          text="Large error message for important warnings."
                          variant="negative"
                          size="large"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Extra Large</p>
                        <HelpText 
                          text="Extra large error for critical system alerts."
                          variant="negative"
                          size="extra-large"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text with Form Fields */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Help Text with Form Fields</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">With Input Fields</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Email Address *
                        </label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-border rounded-default focus:outline-none focus:ring-2 focus:ring-primary-light"
                          placeholder="Enter your email"
                        />
                        <div className="mt-1">
                          <HelpText 
                            text="We'll use this to send you important updates about your account."
                            variant="neutral"
                            size="small"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Password *
                        </label>
                        <input 
                          type="password" 
                          className="w-full px-3 py-2 border border-red-600 rounded-default focus:outline-none focus:ring-2 focus:ring-red-200"
                          placeholder="Enter your password"
                        />
                        <div className="mt-1">
                          <HelpText 
                            text="Password must contain at least 8 characters, including uppercase, lowercase, and numbers."
                            variant="negative"
                            size="small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">With Dropdowns</h4>
                    <div className="space-y-4">
                      <div>
                        <Dropdown
                          label="Country"
                          placeholder="Select your country..."
                          options={basicOptions}
                          value=""
                          size="small"
                        />
                        <div className="mt-1">
                          <HelpText 
                            text="This helps us provide region-specific features and comply with local regulations."
                            variant="neutral"
                            size="small"
                            hideIcon={true}
                          />
                        </div>
                      </div>
                      <div>
                        <Dropdown
                          label="Subscription Plan"
                          placeholder="Choose a plan..."
                          options={basicOptions}
                          value=""
                          isError={true}
                          size="small"
                        />
                        <div className="mt-1">
                          <HelpText 
                            text="Please select a subscription plan to continue with your registration."
                            variant="negative"
                            size="small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text Usage Examples */}
          <div className="mb-8">
            <h3 className="text-h3 mb-6 text-text-primary">Usage Examples</h3>
            <div className="bg-surface p-8 rounded-default border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Information & Tips</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="💡 Pro tip: You can use keyboard shortcuts Ctrl+S to save your work quickly."
                        variant="neutral"
                        hideIcon={true}
                      />
                      <HelpText 
                        text="Your changes are automatically saved every 30 seconds."
                        variant="neutral"
                      />
                      <HelpText 
                        text="Click the gear icon in the top right to access advanced settings."
                        variant="neutral"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Errors & Warnings</h4>
                    <div className="space-y-3">
                      <HelpText 
                        text="⚠️ Your session will expire in 5 minutes. Please save your work."
                        variant="negative"
                        hideIcon={true}
                      />
                      <HelpText 
                        text="Unable to save changes. Please check your internet connection and try again."
                        variant="negative"
                      />
                      <HelpText 
                        text="Maximum file size exceeded. Please upload a file smaller than 10MB."
                        variant="negative"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
