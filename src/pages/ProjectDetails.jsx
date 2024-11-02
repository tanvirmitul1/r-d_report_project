import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import ReportList from "../components/ReportList";
import TeamList from "../components/TeamList";
import ResearchPaperList from "../components/ResearchPaperList";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const { data: project, isLoading } = api.useGetProjectQuery(id);

  if (isLoading) {
    return <CircularProgress />;
  }

  const isProjectLead = user._id === project.projectLead._id;
  const isMember = project?.projectMembers.some(
    (member) => member._id === user._id
  );
  const canEdit = user.userType === "admin" || isProjectLead;

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{project.title}</Typography>
        {canEdit && (
          <Button
            variant="contained"
            onClick={() => navigate(`/projects/${id}/edit`)}
          >
            Edit Project
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Overview" />
          <Tab label="Reports" />
          <Tab label="Research Papers" />
          <Tab label="Team" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography>{project.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>
                  <strong>Status:</strong> {project.status}
                </Typography>
                <Typography>
                  <strong>Duration:</strong>{" "}
                  {new Date(project.duration.startDate).toLocaleDateString()} -{" "}
                  {new Date(project.duration.endDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Project Lead:</strong> {project.projectLead.name}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <ReportList projectId={id} canAdd={canEdit || isMember} />
      )}

      {activeTab === 2 && (
        <ResearchPaperList projectId={id} canAdd={canEdit || isMember} />
      )}

      {activeTab === 3 && (
        <TeamList
          projectId={id}
          canManageTeam={canEdit}
          members={project.projectMembers}
          lead={project.projectLead}
        />
      )}
    </Box>
  );
}
