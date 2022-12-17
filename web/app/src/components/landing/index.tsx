import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { Box, Button, Container, Grid, Menu, MenuItem, Typography } from "@mui/material";
import api from "../../api";
import { GlobalNotificationState, User } from "../../types";
import Survey from "../survey";

interface LandingProps {
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
  setGlobalNotification: Dispatch<SetStateAction<GlobalNotificationState>>;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

function Landing({ user, setUser, setGlobalNotification, setLoggedIn }: LandingProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleLogout() {
    api.auth.logout().finally(() => {
      setLoggedIn(false);
      setUser(null);
    });
  }

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="flex-end" alignItems="center">
        <Button onClick={handleClick} sx={{ my: 2, textTransform: "none" }} color="inherit">
          <Box
            component="img"
            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.webp`}
            alt={user.username}
            width={50}
            sx={{ borderRadius: "50%", py: 1, mr: 1 }}
          />
          <Typography variant="body1">
            {user.username}#{user.discriminator}
          </Typography>
        </Button>
        <Menu
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Grid>
      <Grid container>
        <Survey setGlobalNotification={setGlobalNotification} user={user} setUser={setUser} />
      </Grid>
    </Container>
  );
}

export default Landing;
