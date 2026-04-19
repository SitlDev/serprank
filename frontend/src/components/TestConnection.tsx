import React, { useState } from 'react'
import axios from 'axios'

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
  data?: any
}

export function TestConnection() {
  const [results, setResults] = useState<TestResult>({ status: 'idle', message: 'Click to test connection' })

  const testBackendConnection = async () => {
    setResults({ status: 'loading', message: 'Testing connection...' })
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      console.log('Testing connection to:', apiUrl)

      // Test 1: Health check
      const healthRes = await axios.get(`${apiUrl}/api/health`)
      console.log('✅ Health check:', healthRes.data)

      // Test 2: Database check
      const dbRes = await axios.get(`${apiUrl}/api/health/db`)
      console.log('✅ Database check:', dbRes.data)

      // Test 3: Test endpoint
      const testRes = await axios.get(`${apiUrl}/api/test/test`)
      console.log('✅ Test endpoint:', testRes.data)

      setResults({
        status: 'success',
        message: '🎉 All systems operational!',
        data: {
          health: healthRes.data,
          database: dbRes.data,
          test: testRes.data
        }
      })
    } catch (error) {
      console.error('❌ Connection error:', error)
      setResults({
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : String(error)}`,
        data: error
      })
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Connection Test</h2>
        
        <button
          onClick={testBackendConnection}
          disabled={results.status === 'loading'}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            results.status === 'loading'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
          }`}
        >
          {results.status === 'loading' ? 'Testing...' : 'Test Backend Connection'}
        </button>

        <div className={`mt-4 p-4 rounded-lg ${
          results.status === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
          results.status === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
          'bg-gray-50'
        }`}>
          <p className={`font-semibold ${
            results.status === 'success' ? 'text-green-700' :
            results.status === 'error' ? 'text-red-700' :
            'text-gray-700'
          }`}>
            {results.message}
          </p>

          {results.data && results.status === 'success' && (
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-48">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
