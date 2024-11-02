import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../store/api";
import CloseIcon from "@mui/icons-material/Close";
const CreateProjectModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [description, setDescription] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [projectMembers, setProjectMembers] = useState("");
  const [duration, setDuration] = useState({ startDate: "", endDate: "" });
  const [status, setStatus] = useState("active");
  const [createProject] = api.useCreateProjectMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title,
      uniqueId,
      description,
      projectLead,
      projectMembers: projectMembers.split(",").map((id) => id.trim()),
      duration,
      status,
    };

    try {
      await createProject(projectData).unwrap();
      alert("Project created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Error creating project. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <Box>
        <DialogTitle>Create Project</DialogTitle>
        <Button
          onClick={closeModal}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "auto",
          mt: 4,
          p: 4,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unique ID"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Project Lead ID"
                value={projectLead}
                onChange={(e) => setProjectLead(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Project Members (comma separated IDs)"
                value={projectMembers}
                onChange={(e) => setProjectMembers(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={duration.startDate}
                onChange={(e) =>
                  setDuration({ ...duration, startDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={duration.endDate}
                onChange={(e) =>
                  setDuration({ ...duration, endDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button type="submit" variant="contained" size="large">
              Create Project
            </Button>
          </Box>
        </form>
      </Paper>
    </Dialog>
  );
};

export default CreateProjectModal;
