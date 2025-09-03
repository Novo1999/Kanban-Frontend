import { useEffect, useState } from 'react'
import { Form, Link, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { Button, Header } from '../components'
import customFetch from '../utils/customFetch'
import errorToaster from '../utils/errorToaster'

export const loader = async () => {
  try {
    const data = await customFetch.get('/users/current-user')
    return data
  } catch (error) {
    return null
  }
}

type Data = {
  data: {
    email: string
  }
}

export type ActionData = {
  response: { data: { message: string; split: (param: string) => string[] } }
}

type ErrorObj = { email: string; password: string }

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<ErrorObj>({ email: '', password: '' })

  const actionData = useActionData()
  const navigation = useNavigation()
  const data = useLoaderData() as Data
  const navigate = useNavigate()

  // takes to the kanban page if user is already logged in
  useEffect(() => {
    if (data?.data?.email) navigate('/kanban')
  }, [data, navigate])

  // this shows errors if there is any from the login action
  useEffect(() => {
    errorToaster(actionData as ActionData)
  }, [actionData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = { email: '', password: '' }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleSubmit = (e) => {
    if (!validateForm()) {
      e.preventDefault()
    }
  }

  const isSubmitting = navigation.state === 'submitting'
  const isFormValid = Object.values(errors).every((error) => error === '') && formData.email && formData.password

  return (
    !data?.data?.email && (
      <>
        <Header page="login" />
        <div className="bg-blue-200 overflow-hidden min-h-screen flex justify-center items-center py-8">
          <Form method="post" onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl w-full max-w-md mx-4 border border-gray-200 bg-white shadow-xl p-8">
            <h4 className="text-center text-3xl font-bold text-gray-800 mb-2">Welcome Back</h4>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 
                  ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} 
                  focus:outline-none bg-white`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors duration-200 
                    ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} 
                    focus:outline-none bg-white`}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.121 14.121L15.536 15.536"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" disabled={!isFormValid || isSubmitting} buttonText={isSubmitting ? 'Signing In...' : 'Sign In'} />

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors duration-200" to="/register">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Test Credentials Section */}
            <div className="border-t pt-6 mt-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3 text-center">Test Account</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-gray-500">Email:</span>
                      <p className="text-sm font-mono text-gray-700">test@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-gray-500">Password:</span>
                      <p className="text-sm font-mono text-gray-700">Password1!</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: 'test@gmail.com',
                      password: 'Password1!',
                    })
                    setErrors({ email: '', password: '' })
                  }}
                  className="w-full py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200 mt-2"
                >
                  Fill Both Fields
                </button>
              </div>
            </div>
          </Form>
        </div>
      </>
    )
  )
}

export default Login
