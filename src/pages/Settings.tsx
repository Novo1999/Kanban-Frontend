import { createContext, useContext, useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { useNavigate } from 'react-router'
import customFetch from '../utils/customFetch'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import {
  editUserEmail,
  editUserName,
  editUserPassword,
} from '../utils/editUser'

type SettingsContextProp = {
  isEditing: { editing: string; status: boolean }
  setIsEditing: ({
    editing,
    status,
  }: {
    editing: string
    status: boolean
  }) => { editing: string; status: boolean } | void
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

  // if no email then go to login page
  useEffect(() => {
    if (!email) {
      navigate('/')
    }
  }, [email, navigate])

  if (isError) return <p>Error</p>

  return (
    email && (
      <SettingsContext.Provider
        value={{ isEditing, setIsEditing, name, email }}
      >
        <section className='bg-cyan-600 min-h-screen flex justify-center items-center break-before-page'>
          <div className='bg-sky-500 rounded-lg shadow-lg p-10 w-screen my-8 mx-6 min-h-[45rem] transition-all duration-300'>
            <h2 className='font-bold text-white text-3xl mb-10'>
              Profile Settings
            </h2>
            <div className='text-sm'>
              {/* NAME */}
              <div className='flex gap-4 mb-4 text-md sm:text-2xl'>
                <p>Name :</p>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <p className='break-all text-white'>{name}</p>
                )}

                <EditButton editing='name' />
              </div>
              {/* EMAIL */}
              <div className='flex gap-4 mb-4 text-md sm:text-2xl'>
                <p className='mr-2'>Email :</p>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <p className='break-all text-white'>{email}</p>
                )}
                <EditButton editing='email' />
              </div>
              {/* PASSWORD */}
              <div className='flex gap-4 mb-4 text-md sm:text-2xl'>
                <p>Password :</p>
                <p className='break-all text-white'>*****************</p>
                <EditButton editing='password' />
              </div>
            </div>
            {/* EDIT INPUT */}
            <EditInput />
          </div>
        </section>
      </SettingsContext.Provider>
    )
  )
}
export default Settings

// edit button
const EditButton = ({ editing }: { editing: string }) => {
  const { setIsEditing } = useContext(SettingsContext)
  return (
    <button
      onClick={() => setIsEditing({ editing, status: true })}
      className='bg-cyan-300 p-2 rounded-lg cursor-pointer hover:bg-cyan-200 h-fit transition-all duration-200'
    >
      <MdEdit />
    </button>
  )
}

// edit input
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
      const changedState = { editing: '', status: false }
      setIsEditing(changedState)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
    if (data.email) {
      await editUserEmail(data)
      resetField('email')
      const changedState = { editing: '', status: false }
      setIsEditing(changedState)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
    if (data.password) {
      await editUserPassword(data)
      resetField('password')
      const changedState = { editing: '', status: false }
      setIsEditing(changedState)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    }
  }

  return (
    status && (
      <div className='mt-20 flex justify-center flex-col items-center animate-fade-up'>
        <h2 className='text-md sm:text-3xl capitalize'>
          {editing === 'password' ? 'Change Password' : `Edit ${editing}`}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register(editing)}
            key={editing}
            defaultValue={setDefaultValue()}
            name={editing}
            className='h-10 rounded-lg mt-4 w-full pl-2'
            type='text'
          />
          <button
            className='mt-10 text-2xl bg-cyan-400 p-2 rounded-lg cursor-pointer hover:bg-cyan-300 h-fit transition-all px-4 sm:px-8 sm:py-3 py-1 duration-200'
            type='submit'
          >
            Edit
          </button>
        </form>
      </div>
    )
  )
}
