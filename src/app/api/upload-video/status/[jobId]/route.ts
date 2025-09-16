/**
 * API Route: /api/upload-video/status/[jobId]
 * ML 처리 상태 조회 엔드포인트 프록시 (Dynamic Route)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

    console.log(`[API Route] Proxying status request to ${backendUrl}/api/upload-video/status/${jobId}`)

    // Extract Authorization header from incoming request
    const authHeader = request.headers.get('Authorization')
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }

    // Forward Authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader
      console.log(`[API Route] Forwarding Authorization header`)
    } else {
      console.log(`[API Route] No Authorization header found`)
    }

    const response = await fetch(`${backendUrl}/api/upload-video/status/${jobId}`, {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    console.log(`[API Route] Backend response status: ${response.status}`)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[API Route] Error in status proxy:', error)
    return NextResponse.json(
      { error: 'PROXY_ERROR', message: 'Failed to proxy status request' },
      { status: 500 }
    )
  }
}