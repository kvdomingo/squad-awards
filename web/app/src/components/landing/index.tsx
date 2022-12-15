import { Dispatch, SetStateAction } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { GlobalNotificationState, User } from "../../types";
import Survey from "../survey";

interface LandingProps {
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
  setGlobalNotification: Dispatch<SetStateAction<GlobalNotificationState>>;
}

function Landing({ user, setUser, setGlobalNotification }: LandingProps) {
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
        <Survey setGlobalNotification={setGlobalNotification} user={user} setUser={setUser} />
      </Grid>
    </Container>
  );
}

export default Landing;
