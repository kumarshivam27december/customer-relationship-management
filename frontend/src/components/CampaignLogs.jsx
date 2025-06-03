import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';

const CampaignLogs = ({ campaignId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`/api/campaigns/${campaignId}/logs`);
        setLogs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch campaign logs');
        setLoading(false);
      }
    };

    fetchLogs();
  }, [campaignId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Campaign Delivery Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vendor Message ID</TableCell>
              <TableCell>Error</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.customer.name}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={log.status === 'sent' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.vendorMessageId}</TableCell>
                <TableCell>{log.error || '-'}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignLogs; 