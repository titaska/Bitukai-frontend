import { Box, Button, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { login } from "../hooks/login";

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({onLogin}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isButtonDisabled = email.trim() === "" || password.trim() === "";

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  const handleLogin = async () => {
    setIsPending(true);
    setError(null);

    try {
      const staffDto = await login({ email, password });
      onLogin();
    } catch (err) {
      console.log("Error: ", err);
      setError("Login failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "#5f5b8c", mb: 1 }}
        >
          Login
        </Typography>

        <TextField
          fullWidth
          placeholder="Your email"
          value={email}
          onChange={handleEmailChange}
          variant="filled"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{
            backgroundColor: "#f7f7fb",
            borderRadius: 2,
            "& .MuiInputBase-input": {
              paddingTop: 2,
              paddingBottom: 2,
            }
          }}
        />

        <TextField
          fullWidth
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          variant="filled"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{
            backgroundColor: "#f7f7fb",
            borderRadius: 2,
            "& .MuiInputBase-input": {
              paddingTop: 2,
              paddingBottom: 2,
            }
          }}
        />

        <Button
          fullWidth
          size="large"
          onClick={handleLogin}
          disabled={isButtonDisabled || isPending}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 999,
            textTransform: "none",
            fontSize: 16,
            fontWeight: 600,
            backgroundColor: "#5f5b8c",
            ":hover": { backgroundColor: "#4f4b78" },
          }}
          variant="contained"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>

        <Box sx={{ minHeight: 24, mt: 1 }}>
          <Typography
            sx={{
              color: "red",
              fontSize: 14,
              visibility: error ? "visible" : "hidden",
            }}
          >
            {error || "placeholder"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
