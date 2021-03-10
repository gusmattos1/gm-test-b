import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Box from "@material-ui/core/Box";

export default function Copyright() {
  return (
    <Box mt={8} style={{ position: "fixed", bottom: 30 }}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://www.linkedin.com/in/gustavomattosdev/"
        >
          Gustavo Mattos
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}
