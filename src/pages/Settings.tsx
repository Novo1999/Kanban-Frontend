import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { ImageUploader } from '../components/ImageUploader'
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
  const navigate = useNavigate()
  const { isLoading, isError, data } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await customFetch.get('/users/current-user'),
  })
  const name = data?.data?.name
  const email = data?.data?.email

  useEffect(() => {
    let timeoutId: number
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

  if (isError) return <p>Error</p>

  return (
    email && (
      <SettingsContext.Provider value={{ isEditing, setIsEditing, name, email }}>
        <section className="bg-base-200 min-h-screen flex justify-center items-center">
          <div className="card bg-base-100 shadow-xl w-full sm:w-3/4 lg:w-1/2 p-8">
            <h2 className="card-title text-3xl mb-6">Profile Settings</h2>

            {/* NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name:</span>
              </label>
              <div className="flex items-center gap-4">
                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <span className="text-lg">{name}</span>}
                <EditButton editing="name" />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Email:</span>
              </label>
              <div className="flex items-center gap-4">
                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <span className="text-lg">{email}</span>}
                <EditButton editing="email" />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password:</span>
              </label>
              <div className="flex items-center gap-4">
                <span className="text-lg">**************</span>
                <EditButton editing="password" />
              </div>
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              {data?.data?.avatarUrl && <img className="h-24 w-24 object-contain p-1" src={data?.data?.avatarUrl} />}
              <div className="flex items-center gap-4 border w-fit px-4 rounded-lg">
                <ImageUploader />
              </div>
            </div>

            <EditInput />
          </div>
        </section>
      </SettingsContext.Provider>
    )
  )
}
export default Settings

// Edit button component
const EditButton = ({ editing }: { editing: string }) => {
  const { setIsEditing } = useContext(SettingsContext)
  return (
    <button onClick={() => setIsEditing({ editing, status: true })} className="btn btn-sm btn-outline btn-accent">
      <MdEdit />
    </button>
  )
}

// Edit input component
const EditInput = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, resetField } = useForm()
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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.name) {
      await editUserName(data)
      resetField('name')
      setIsEditing({ editing: '', status: false })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
    if (data.email) {
      await editUserEmail(data)
      resetField('email')
      setIsEditing({ editing: '', status: false })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
    if (data.password) {
      await editUserPassword(data)
      resetField('password')
      setIsEditing({ editing: '', status: false })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
  }

  return (
    status && (
      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">{editing === 'password' ? 'Change Password' : `Edit ${editing}`}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register(editing)}
            key={editing}
            defaultValue={setDefaultValue()}
            name={editing}
            className="input input-bordered w-full max-w-xs"
            type={editing === 'password' ? 'password' : 'text'}
          />
          <button className="btn btn-primary ml-4 btn-info">Save</button>
        </form>
      </div>
    )
  )
}
