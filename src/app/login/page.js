import LoginForm from "@/components/dashboard/login-form";

export default async function Login(props) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
