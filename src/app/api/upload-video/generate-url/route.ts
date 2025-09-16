/**
 * API Route: /api/upload-video/generate-url
 * S3 Presigned URL 생성 엔드포인트 프록시
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

    console.log(`[API Route] Proxying generate-url request to ${backendUrl}/api/upload-video/generate-url`)
    console.log(`[API Route] Request body:`, body)

    // Extract Authorization header from incoming request
    const authHeader = request.headers.get('Authorization')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Forward Authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader
      console.log(`[API Route] Forwarding Authorization header`)
    } else {
      console.log(`[API Route] No Authorization header found`)
    }

    const response = await fetch(`${backendUrl}/api/upload-video/generate-url`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log(`[API Route] Backend response status: ${response.status}`)
    console.log(`[API Route] Backend response data:`, data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[API Route] Error in generate-url proxy:', error)
    return NextResponse.json(
      { error: 'PROXY_ERROR', message: 'Failed to proxy generate-url request' },
      { status: 500 }
    )
  }
}