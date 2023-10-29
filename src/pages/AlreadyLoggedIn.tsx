// import { Link, useNavigate } from 'react-router-dom'
// import { logOut } from '../utils/logOut'
// import { useEffect } from 'react'
// import customFetch from '../utils/customFetch'

// const AlreadyLoggedIn = () => {
//  const navigate = useNavigate()
//  const handleLogOut = async () => {
//   const isLoggedOut = await logOut()
//   if (isLoggedOut?.data?.msg === 'user logged out') navigate('/')
//  }

//  useEffect(() => {
//   const checkUserExistence = async () => {
//    try {
//     await customFetch.get('/users/current-user')
//    } catch (error) {
//     navigate('/')
//    }
//   }
//   checkUserExistence()
//  }, [navigate])

//  return (
//   <div className='flex h-screen bg-cyan-600 justify-center items-center'>
//    <div className='flex flex-col items-center gap-10'>
//     <p className='bg-cyan-200 p-10 rounded-3xl text-5xl'>
//      You are already logged in
//     </p>
//     <Link
//      className='bg-sky-500 p-6 rounded-3xl text-2xl text-white hover:text-black hover:bg-sky-300 transition-all duration-300'
//      to='/kanban'
//     >
//      Click here to check your boards
//     </Link>
//     <button
//      onClick={handleLogOut}
//      className='bg-sky-500 p-6 rounded-3xl text-2xl text-white hover:text-black hover:bg-sky-300 transition-all duration-300'
//     >
//      Log out
//     </button>
//    </div>
//   </div>
//  )
// }
// export default AlreadyLoggedIn
