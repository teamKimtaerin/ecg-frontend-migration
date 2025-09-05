export const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
  // 기존 토스트가 있다면 제거
  const existingToast = document.getElementById('custom-toast')
  if (existingToast) {
    existingToast.remove()
  }

  // 토스트 엘리먼트 생성
  const toast = document.createElement('div')
  toast.id = 'custom-toast'
  
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
  
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300 ease-in-out transform translate-x-0 opacity-100`
  toast.textContent = message
  
  // body에 추가
  document.body.appendChild(toast)
  
  // 3초 후 제거
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.style.transform = 'translateX(100%)'
      toast.style.opacity = '0'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }, 3000)
}