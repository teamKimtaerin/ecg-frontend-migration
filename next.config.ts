import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // S3 정적 호스팅을 위한 설정
  output: 'export', // 정적 파일로 빌드
  trailingSlash: true, // S3용 URL 형식
  
  // 이미지 최적화 비활성화 (정적 호스팅용)
  images: {
    unoptimized: true, // S3에서는 이미지 최적화 불가
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // CloudFront 도메인 추가
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },

  // 환경변수 설정
  env: {
    STATIC_EXPORT: 'true',
  },

  // CloudFront에서 /api/* 라우팅을 처리하므로 rewrites 제거

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
