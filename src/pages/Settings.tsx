import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { MdCameraAlt, MdCheck, MdClose, MdCloudUpload, MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'
import EnhancedImageUploader from '../components/ImageUploader'
import customFetch from '../utils/customFetch'
import { editUserEmail, editUserName, editUserPassword } from '../utils/editUser'

type SettingsContextProp = {
  isEditing: { editing: string; status: boolean }
  setIsEditing: (args: { editing: string; status: boolean }) => void
  name: string
  email: string
}

const SettingsContext = createContext<SettingsContextProp>({
  isEditing: { editing: '', status: false },
  setIsEditing: () => {},
  name: '',
  email: '',
})

const Settings = () => {
  const [isEditing, setIsEditing] = useState({ editing: '', status: false })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showUploader, setShowUploader] = useState(false)
  const navigate = useNavigate()
  const { isLoading, isError, data } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })
  const name = data?.data?.name
  const email = data?.data?.email
  const avatarUrl = data?.data?.avatarUrl

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const checker = (email: string, count: number) => {
      if (!email) {
        if (count === 5) {
          navigate('/')
          return
        }
        timeoutId = setTimeout(() => {
          checker(email, count + 1)
        }, 1000)
      }
    }

    checker(email, 0)

    return () => clearTimeout(timeoutId)
  }, [email, navigate])

  const handleImageRemove = () => {
    setPreviewImage(null)
    setSelectedFile(null)
  }

  const handleSavePreview = async () => {
    if (!selectedFile) return

    // Convert file to base64 or handle upload here
    // For now, we'll just clear the preview since UploadThing handles the actual upload
    setPreviewImage(null)
    setSelectedFile(null)
    setShowUploader(true)
  }

  if (isError) return <p>Error</p>

  return (
    email && (
      <SettingsContext.Provider value={{ isEditing, setIsEditing, name, email }}>
        <section className="bg-secondary from-base-200 to-base-300 min-h-screen flex justify-center items-center p-4">
          <div className="card bg-base-100 shadow-2xl w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 p-8 border border-base-300">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary mb-2">Profile Settings</h2>
              <p className="text-base-content/70">Manage your account information</p>
            </div>

            {/* PROFILE IMAGE */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={previewImage || avatarUrl || '/default-avatar.png'}
                      alt="Profile"
                      className="rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`
                      }}
                    />
                  </div>
                </div>

                {/* Remove Image Button */}
                {previewImage && (
                  <button onClick={handleImageRemove} className="absolute -top-2 -right-2 btn btn-sm btn-circle btn-error text-black">
                    <MdDelete className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Preview Actions */}
            {previewImage && (
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={handleSavePreview} className="btn btn-success">
                  <MdCheck /> Continue with Upload
                </button>
                <button onClick={handleImageRemove} className="btn btn-outline">
                  <MdClose /> Cancel
                </button>
              </div>
            )}

            {/* Upload Section */}
            {(showUploader || (!previewImage && !avatarUrl)) && (
              <div className="flex justify-center mb-8">
                <div className="card bg-base-200/50 p-6 w-full max-w-md">
                  <div className="text-center mb-4">
                    <MdCloudUpload className="text-4xl text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">Upload Profile Photo</h3>
                    <p className="text-sm text-base-content/70">Choose a photo to upload to your profile</p>
                  </div>
                  <EnhancedImageUploader onUploadComplete={() => setShowUploader(false)} />
                </div>
              </div>
            )}

            {/* Show upload button if user has avatar but wants to change */}
            {!showUploader && !previewImage && avatarUrl && (
              <div className="flex justify-center mb-8">
                <button onClick={() => setShowUploader(true)} className="btn btn-primary btn-outline">
                  <MdCameraAlt /> Change Profile Photo
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* NAME */}
              <ProfileField label="Full Name" value={name} fieldKey="name" isLoading={isLoading} icon="👤" />

              {/* EMAIL */}
              <ProfileField label="Email Address" value={email} fieldKey="email" isLoading={isLoading} icon="📧" />

              {/* PASSWORD */}
              <ProfileField label="Password" value="••••••••••••" fieldKey="password" isLoading={false} icon="🔒" isPassword />
            </div>

            <EditInput />
          </div>
        </section>
      </SettingsContext.Provider>
    )
  )
}

// Enhanced Profile Field Component
const ProfileField = ({ label, value, fieldKey, isLoading, icon }: { label: string; value: string; fieldKey: string; isLoading: boolean; icon: string; isPassword?: boolean }) => {
  const { isEditing, setIsEditing } = useContext(SettingsContext)
  const isCurrentlyEditing = isEditing.editing === fieldKey && isEditing.status

  return (
    <div className={`card bg-base-200/50 p-6 transition-all duration-200 ${isCurrentlyEditing ? 'ring-2 ring-primary shadow-lg' : 'hover:bg-base-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <label className="text-sm font-medium text-base-content/70 uppercase tracking-wide">{label}</label>
            <div className="mt-1">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="text-base-content/50">Loading...</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">{value}</span>
              )}
            </div>
          </div>
        </div>

        {!isLoading && (
          <button onClick={() => setIsEditing({ editing: fieldKey, status: true })} className="btn btn-ghost btn-sm hover:btn-primary" disabled={isCurrentlyEditing}>
            <MdEdit className="text-lg" />
          </button>
        )}
      </div>
    </div>
  )
}

// Enhanced Edit Input Component
const EditInput = () => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm()
  const {
    isEditing: { status, editing },
    name,
    email,
    setIsEditing,
  } = useContext(SettingsContext)

  const setDefaultValue = () => {
    if (editing === 'name') return name
    if (editing === 'email') return email
    if (editing === 'password') return ''
    return ''
  }

  const getFieldLabel = () => {
    switch (editing) {
      case 'name':
        return 'Full Name'
      case 'email':
        return 'Email Address'
      case 'password':
        return 'New Password'
      default:
        return ''
    }
  }

  const getFieldIcon = () => {
    switch (editing) {
      case 'name':
        return '👤'
      case 'email':
        return '📧'
      case 'password':
        return '🔒'
      default:
        return ''
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (data.name) {
        await editUserName(data)
        resetField('name')
      }
      if (data.email) {
        await editUserEmail(data)
        resetField('email')
      }
      if (data.password) {
        await editUserPassword(data)
        resetField('password')
      }

      setIsEditing({ editing: '', status: false })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing({ editing: '', status: false })
    resetField(editing)
  }

  return (
    status && (
      <div className="mt-8">
        <div className="card bg-primary/10 border border-primary/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{getFieldIcon()}</span>
            <h3 className="text-xl font-bold text-primary">{editing === 'password' ? 'Change Password' : `Edit ${getFieldLabel()}`}</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{getFieldLabel()}</span>
              </label>
              <input
                autoFocus
                {...register(editing, {
                  required: true,
                  ...(editing === 'email' && {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }),
                  ...(editing === 'password' && {
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }),
                })}
                defaultValue={setDefaultValue()}
                className="input input-bordered input-primary w-full focus:input-primary"
                type={editing === 'password' ? 'password' : 'text'}
                placeholder={`Enter your ${getFieldLabel().toLowerCase()}`}
                autoComplete={editing === 'password' ? 'new-password' : editing}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn btn-primary flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <MdCheck /> Save Changes
                  </>
                )}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-outline" disabled={isSubmitting}>
                <MdClose /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  )
}

export default Settings
