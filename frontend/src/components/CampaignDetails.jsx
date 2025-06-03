import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from '../utils/axios';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/campaigns/${id}`);
      setCampaign(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Failed to fetch campaign details');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'sending':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box p={3}>
        <Alert severity="info">Campaign not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Campaigns
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">{campaign.name}</Typography>
              <Chip
                label={campaign.status}
                color={getStatusColor(campaign.status)}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Message
            </Typography>
            <Typography variant="body1" paragraph>
              {campaign.message}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Campaign Stats
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Audience</TableCell>
                    <TableCell align="right">{campaign.stats.totalAudience}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Messages Sent</TableCell>
                    <TableCell align="right">{campaign.stats.sent}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Failed Deliveries</TableCell>
                    <TableCell align="right">{campaign.stats.failed}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delivery Rate</TableCell>
                    <TableCell align="right">
                      {campaign.stats.totalAudience > 0
                        ? `${Math.round((campaign.stats.sent / campaign.stats.totalAudience) * 100)}%`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Segment Rules
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(campaign.segmentRules, null, 2)}
              </pre>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Created At
            </Typography>
            <Typography>
              {new Date(campaign.createdAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Delivery Logs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaign.logs?.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.customerId}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      color={log.status === 'delivered' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(!campaign.logs || campaign.logs.length === 0) && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No delivery logs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CampaignDetails; 