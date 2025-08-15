import { useEffect, useState } from 'react'
import { Form, Link, useActionData, useNavigation } from 'react-router-dom'
import { Button, FormRow, Header } from '../components'

import errorToaster from '../utils/errorToaster'
import { ActionData } from './Login'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const actionData = useActionData()

  const navigation = useNavigation()

  useEffect(() => {
    errorToaster(actionData as ActionData)
  }, [actionData])

  const isSubmitting = navigation.state === 'submitting'
  return (
    <>
      <Header page='register' />
      <div className='bg-neutral overflow-hidden h-screen flex justify-center items-center'>
        <Form
          method='post'
          className='flex flex-col gap-2 rounded-lg w-screen transition-all duration-300 sm:w-fit mx-4 border border-black bg-primary p-14 sm:p-20 sm:mt-20'
        >
          <h4 className='text-center text-3xl font-bold text-black'>
            Register
          </h4>
          <FormRow page='register' labelText='Name' type='text' name='name' />
          <FormRow labelText='Email' type='text' name='email' />
          <FormRow setShowPassword={setShowPassword} labelText='Password' type={showPassword ? 'text' : 'password'} name='password' />
          <Button
            type='submit'
            buttonText={isSubmitting ? 'Submitting' : 'Register'}
          />
          <div className='text-black text-sm items-center sm:text-lg flex mt-4 justify-around w-full'>
            <p >
              Already have an account?
            </p>
            <Link
              className='underline underline-offset-4 sm:text-lg text-black text-xs w-fit'
              to="/"
            >
              Login now
            </Link>
          </div>
        </Form>
      </div>
    </>
  )
}

export default Register
