import { Alert, Snackbar } from "@mui/material";
import { GlobalNotificationState } from "../../../types";

interface GlobalNotificationProps extends GlobalNotificationState {
  onClose: () => void;
}

function GlobalNotification({ message, visible, severity, onClose }: GlobalNotificationProps) {
  return (
    <Snackbar
      open={visible}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default GlobalNotification;
