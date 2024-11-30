import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ConformBox = ({ open, content, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
      <DialogContent id="confirm-dialog-description">{content}</DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          sx={{
            textTransform: "capitalize",
            color: "gray",
            "&:hover": { bgcolor: "#F5F5F5" },
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            textTransform: "capitalize",
            bgcolor: "#FF8C00",
            color: "white",
            "&:hover": { bgcolor: "#FF6B6B" },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConformBox;
