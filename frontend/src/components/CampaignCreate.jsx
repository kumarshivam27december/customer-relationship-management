import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import axios from '../utils/axios';
import RuleBuilder from './RuleBuilder';

function CampaignCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    segmentRules: {
      operator: 'AND',
      conditions: [
        { field: 'totalSpent', operator: '>', value: 0 }
      ]
    }
  });

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRulesChange = (newRules) => {
    setFormData(prev => ({
      ...prev,
      segmentRules: newRules
    }));
  };

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/campaigns/preview', {
        segmentRules: formData.segmentRules
      });
      setPreviewData(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error previewing audience. Please check your rules.';
      setError(errorMessage);
      console.error('Error previewing audience:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    setSuggestionsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/suggest-messages', {
        campaignObjective: formData.name,
        audienceSegment: previewData ? `${previewData.audienceSize} customers` : 'General audience'
      });
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error getting message suggestions.';
      setError(errorMessage);
      console.error('Error getting suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleUseSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      message: suggestion
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/campaigns', formData);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating campaign. Please try again.';
      setError(errorMessage);
      console.error('Error creating campaign:', err);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Create Campaign
        </Typography>

        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campaign Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="e.g., Win back inactive customers"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  disabled={loading}
                />
                <IconButton
                  onClick={handleGetSuggestions}
                  disabled={loading || suggestionsLoading}
                  color="primary"
                  title="Get AI suggestions"
                >
                  {suggestionsLoading ? <CircularProgress size={24} /> : <LightbulbIcon />}
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <RuleBuilder
                rules={formData.segmentRules}
                onChange={handleRulesChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="outlined"
                  onClick={handlePreview}
                  disabled={loading}
                >
                  Preview Audience
                </Button>

                {previewData && (
                  <Alert severity="info">
                    This campaign will reach {previewData.audienceSize} customers
                  </Alert>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Create Campaign'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog
        open={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI Message Suggestions</DialogTitle>
        <DialogContent>
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleUseSuggestion(suggestion)}
                    title="Use this suggestion"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuggestions(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CampaignCreate; 