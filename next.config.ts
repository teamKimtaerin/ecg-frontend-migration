import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Docker 컨테이너에서 실행 시 필수 설정
  output: 'standalone', // 독립 실행 가능한 빌드 생성

  // 서버 액션 및 API 라우트 설정 (Next.js 15 방식)
  experimental: {
    serverActions: {
      bodySizeLimit: '100MB', // 파일 업로드를 위한 크기 제한 증가
    },
  },

  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용 (필요에 따라 추가)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // 추후 프로덕션 도메인 추가
    ],
    // Docker 컨테이너에서 이미지 최적화 설정
    unoptimized:
      process.env.NODE_ENV === 'production' && process.env.DOCKER === 'true',
  },

  // 환경변수 설정
  env: {
    DOCKER: process.env.DOCKER || 'false',
  },

  // CORS 및 API 설정 (백엔드와 통신용)
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8000'}/:path*`,
      },
    ]
  },

  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // 웹팩 설정 최적화
  webpack: (config, { isServer, dev }) => {
    // 프로덕션 빌드 최적화
    if (!dev && isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      })
    }

    return config
  },
}

export default nextConfig
