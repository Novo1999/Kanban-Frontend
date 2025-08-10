import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { MdCloudUpload } from 'react-icons/md'
import { editUserAvatar } from '../utils/editUser'
import { UploadButton } from '../utils/uploadThing'

// Enhanced Image Uploader Component with better UI
const EnhancedImageUploader = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [isUploadBegin, setIsUploadBegin] = useState(false)
  const queryClient = useQueryClient()

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4">
        <UploadButton
          endpoint={'profilePicture'}
          onUploadError={(error: Error) => {
            setIsUploadBegin(false)
            alert(`Upload failed: ${error.message}`)
          }}
          onUploadProgress={(progress) => {
            setProgress(progress)
          }}
          onUploadBegin={() => {
            setIsUploadBegin(true)
            setProgress(0)
          }}
          onClientUploadComplete={async (res) => {
            try {
              await editUserAvatar(res?.[0]?.appUrl)
              queryClient.invalidateQueries({ queryKey: ['current-user'] })
              setIsUploadBegin(false)
              setProgress(0)
              onUploadComplete()
            } catch (error) {
              console.error('Error updating avatar:', error)
              setIsUploadBegin(false)
            }
          }}
          appearance={{
            button: `
              btn btn-primary w-full
              ${isUploadBegin ? 'btn-disabled' : ''}
            `,
            allowedContent: 'text-sm text-base-content/60 mt-2',
          }}
          content={{
            button: isUploadBegin ? (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MdCloudUpload className="text-lg" />
                Choose & Upload Photo
              </div>
            ),
            allowedContent: 'Images up to 1MB (JPG, PNG, GIF)',
          }}
        />

        {isUploadBegin && (
          <div className="w-full">
            <div className="flex items-center justify-between text-sm text-base-content/70 mb-2">
              <span>Uploading your photo...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedImageUploader
