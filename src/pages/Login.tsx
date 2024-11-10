import { useEffect, useState } from 'react';
import { Form, Link, useActionData, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { Button, FormRow, Header } from '../components';
import customFetch from '../utils/customFetch';
import errorToaster from '../utils/errorToaster';

export const loader = async () => {
  try {
    const data = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return null;
  }
};

type Data = {
  data: {
    email: string;
  };
};

export type ActionData = {
  response: { data: { message: string; split: (param: string) => string[] } };
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData();
  const navigation = useNavigation();
  const data = useLoaderData() as Data;
  const navigate = useNavigate();

  // takes to the kanban page if user is already logged in
  useEffect(() => {
    if (data?.data?.email) navigate('/kanban');
  }, [data, navigate]);

  // this shows errors if there is any from the login action
  useEffect(() => {
    errorToaster(actionData as ActionData);
  }, [actionData]);

  const isSubmitting = navigation.state === 'submitting';

  return (
    !data?.data?.email && (
      <>
        <Header page="login" />
        <div className="bg-neutral overflow-hidden h-screen flex justify-center items-center">
          <Form method="post" className="flex flex-col gap-2 rounded-lg w-screen transition-all duration-300 sm:w-fit mx-4 bg-primary p-14 sm:p-20 sm:mt-14">
            <h4 className="text-center text-3xl text-white font-bold">Log in</h4>
            <FormRow page="login" labelText="Email" type="text" name="email" />
            <FormRow setShowPassword={setShowPassword} labelText="Password" type={showPassword ? 'text' : 'password'} name="password" />
            <Button type="submit" buttonText={isSubmitting ? 'Submitting' : 'Login'} />
            <div className="text-white flex gap-4 m-auto mt-4 justify-center w-max">
              <p>No account?</p>
              <Link className="underline underline-offset-4 text-green-300" to="/register">
                Register now
              </Link>
            </div>
            <div className="text-white font-thin">
              <h2>Test User</h2>
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  value="test@gmail.com"
                  readOnly
                  className="bg-transparent text-white border-none focus:outline-none"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="text"
                  value="Password1!"
                  readOnly
                  className="bg-transparent text-white border-none focus:outline-none"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            </div>
          </Form>
        </div>
      </>
    )
  );
};
export default Login;
