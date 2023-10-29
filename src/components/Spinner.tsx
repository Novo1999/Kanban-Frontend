const Spinner = ({ type }: { type?: string }) => {
 if (type === 'header')
  return (
   <div
    className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
    role='status'
   ></div>
  )
 else
  return (
   <div
    className='inline-block h-8 w-8 animate-spin rounded-full border-4  text-white border-solid border-current border-r-transparent align-[-0.125em] m-auto motion-reduce:animate-[spin_1.5s_linear_infinite]'
    role='status'
   ></div>
  )

}
export default Spinner