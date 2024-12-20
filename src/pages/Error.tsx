import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  let errorMessage
  if (isRouteErrorResponse(error)) {
    errorMessage = error.data.message || error.statusText
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    console.error(error)
    errorMessage = 'Unknown error'
  }

  return (
    <div id="error-page" className="flex flex-col gap-8 justify-center items-center h-screen bg-secondary text-black">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-red-700 text-2xl drop-shadow-md">
        <i>{errorMessage}</i>
      </p>
      <Link className='btn btn-neutral' to={'/kanban'}>Go Back</Link>
    </div>
  )
}
