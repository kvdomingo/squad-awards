import { Box, Container, Grid, Typography } from "@mui/material";
import Survey from "../survey";

interface LandingProps {
  user: Record<string, any>;
}

function Landing({ user }: LandingProps) {
  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="flex-end" alignItems="center">
        <Box
          component="img"
          src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.webp`}
          alt={user.username}
          width={50}
          sx={{ borderRadius: "50%", my: 2, mr: 1 }}
        />
        <Typography variant="body2">
          {user.username}#{user.discriminator}
        </Typography>
      </Grid>
      <Grid container>
        <Survey />
      </Grid>
    </Container>
  );
}

export default Landing;
