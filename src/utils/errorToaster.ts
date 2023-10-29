import toast from 'react-hot-toast'

const errorToaster = (data: {
  response: { data: { message: string; split: (param: string) => string[] } }
}) => {
  const errors = data?.response?.data?.message?.split(',')
  if (errors && errors.length > 0)
    return errors.map((err) =>
      toast.error(err, {
        style: { textTransform: 'capitalize' },
        duration: 3000,
      })
    )
}

export default errorToaster
