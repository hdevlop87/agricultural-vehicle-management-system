"use client"

import React, { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [deviceType, setDeviceType] = useState('')

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

    // Detect device and check if already installed
    const userAgent = navigator.userAgent.toLowerCase()
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true

    if (isStandalone) return // Don't show if already installed

    let device = 'desktop'
    if (/ipad|iphone|ipod/.test(userAgent)) device = 'ios'
    else if (/android/.test(userAgent)) device = 'android'

    setDeviceType(device)

    // Listen for Chrome's native install prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    // Auto-show prompt after delay if no native prompt available
    const timer = setTimeout(() => {
      if (!installPrompt && (device === 'ios' || device === 'android')) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      clearTimeout(timer)
    }
  }, [installPrompt])

  const handleInstall = async () => {
    if (installPrompt) {
      // Use native Chrome install prompt
      const result = await installPrompt.prompt()
      setInstallPrompt(null)
      setShowPrompt(false)
    } else {
      // Show platform-specific instructions
      alert(getInstallInstructions())
    }
  }

  const getInstallInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return 'To install:\n1. Tap the Share button (⎋)\n2. Select "Add to Home Screen" (➕)'
      case 'android':
        return 'To install:\n1. Open browser menu (⋮)\n2. Select "Install app" or "Add to Home screen"'
      default:
        return 'Look for the install icon in your browser\'s address bar'
    }
  }

  const getButtonText = () => {
    if (installPrompt) return '📱 Install App'
    return deviceType === 'ios' ? '📱 Add to Home Screen' : '📱 Install App'
  }

  if (!showPrompt) return null

  return (
    <div className="fixed top-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🚀</div>
          <div>
            <h3 className="font-semibold text-gray-900">Install Our App</h3>
            <p className="text-sm text-gray-600 mt-1">
              Get quick access and a better experience
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ✕
        </button>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {getButtonText()}
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Later
        </button>
      </div>
    </div>
  )
}