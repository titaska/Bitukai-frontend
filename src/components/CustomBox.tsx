import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface CustomBoxProps {
  title: string;
  children: ReactNode;
};

export const CustomBox = ({title, children}: CustomBoxProps) => {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body1">
        {children}
      </Typography>
    </Box>
  );
};
