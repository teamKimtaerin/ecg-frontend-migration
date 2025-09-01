import { NextRequest, NextResponse } from 'next/server'

// 파일 업로드 크기 제한 설정
export const maxDuration = 60 // 60초 타임아웃
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // FormData에서 파일들과 설정 추출
    const files: File[] = []
    const config: Record<string, string> = {}

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value)
      } else if (typeof value === 'string') {
        config[key] = value
      }
    }

    console.log(
      'Received files:',
      files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    )
    console.log('Received config:', config)

    // TODO: 실제 파일 처리 로직 구현
    // 예: 파일을 스토리지에 업로드, 트랜스크립션 서비스 호출 등

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      files: files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
      config,
    })
  } catch (error) {
    console.error('Error processing file upload:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process file upload',
      },
      { status: 500 }
    )
  }
}
