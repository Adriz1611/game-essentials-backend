import LoginForm from "@/components/dashboard/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function Login(props) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {searchParams.error && (
          <Alert variant="destructive" className="my-5">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{searchParams.error}</AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
