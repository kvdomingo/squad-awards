import { LoadingButton } from "@mui/lab";
import { Container, Grid } from "@mui/material";

interface LoadingProps {
  loading: boolean;
}

function Login({ loading }: LoadingProps) {
  function handleLogin() {
    window.location.assign("/api/auth/token");
  }

  return (
    <Container sx={{ display: "flex", placeItems: "center", height: "100vh" }}>
      <Grid container alignItems="center" justifyContent="center">
        <LoadingButton loading={loading} variant="contained" onClick={handleLogin}>
          Login with Discord
        </LoadingButton>
      </Grid>
    </Container>
  );
}

export default Login;
