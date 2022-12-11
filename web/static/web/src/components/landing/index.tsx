import { Box, Grid, Typography } from "@mui/material";

interface LandingProps {
  user: Record<string, any>;
}

function Landing({ user }: LandingProps) {
  return (
    <Grid container alignItems="center">
      <Box
        component="img"
        src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.webp`}
        alt={user.username}
        width={50}
        sx={{ borderRadius: "50%", mx: 1 }}
      />
      <Typography variant="body1">
        {user.username}#{user.discriminator}
      </Typography>
    </Grid>
  );
}

export default Landing;
