import { LoadingButton } from "@mui/lab";

interface LoadingProps {
  loading: boolean;
}

function Login({ loading }: LoadingProps) {
  function handleLogin() {
    window.location.assign("/api/auth/token");
  }

  return (
    <LoadingButton loading={loading} variant="contained" onClick={handleLogin}>
      Login with Discord
    </LoadingButton>
  );
}

export default Login;
