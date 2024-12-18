import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { editUserAvatar } from '../utils/editUser'
import { UploadButton } from '../utils/uploadThing'

export const ImageUploader = () => {
  const [progress, setProgress] = useState(0)
  const [isUploadBegin, setIsUploadBegin] = useState(false)
  const queryClient = useQueryClient()

  return (
    <div>
      <UploadButton
        endpoint={'profilePicture'}
        onUploadError={(error: Error) => {
          setIsUploadBegin(false)
          alert(`ERROR! ${error.message}`)
        }}
        onUploadProgress={(progress) => {
          setProgress(progress)
        }}
        onUploadBegin={() => {
          setIsUploadBegin(true)
        }}
        onClientUploadComplete={async (res) => {
          await editUserAvatar(res?.[0]?.appUrl)
          queryClient.invalidateQueries({ queryKey: ['current-user'] })
          setIsUploadBegin(false)
        }}
      />
      {isUploadBegin && (
        <div>
          <p>Progress: {progress}%</p>
          <div style={{ width: `${progress}px` }} className="bg-red-500 h-2 rounded-full"></div>
        </div>
      )}
    </div>
  )
}
