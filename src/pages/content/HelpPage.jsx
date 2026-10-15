import { useState, useMemo } from 'react';
import {
  Box, Grid, Stack, Typography, Card, TextField, InputAdornment, Accordion,
  AccordionSummary, AccordionDetails, Chip, Button, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PaymentsIcon from '@mui/icons-material/Payments';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Link as RouterLink } from 'react-router-dom';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import { helpTopics, popularQuestions } from '@/data/editorial';

const TOPIC_ICONS = {
  LocalShipping: <LocalShippingIcon />,
  AssignmentReturn: <AssignmentReturnIcon />,
  Payments: <PaymentsIcon />,
  ManageAccounts: <ManageAccountsIcon />,
};

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');

  // Flatten and filter FAQs against the search box and the topic filter.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return helpTopics
      .filter((topic) => activeTopic === 'all' || topic.id === activeTopic)
      .map((topic) => ({
        ...topic,
        faqs: topic.faqs.filter(
          (faq) => !q || faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q),
        ),
      }))
      .filter((topic) => topic.faqs.length > 0);
  }, [query, activeTopic]);

  const totalMatches = results.reduce((sum, t) => sum + t.faqs.length, 0);

  return (
    <Box>
      {/* Search hero */}
      <Box sx={{ background: 'linear-gradient(130deg, #3D48D6, #0E9F97)', color: '#fff' }}>
        <PageContainer py={{ xs: 5, md: 7 }}>
          <Typography variant="h2" sx={{ color: '#fff', textAlign: 'center', fontSize: { xs: '1.9rem', md: '2.6rem' } }}>
            How can we help?
          </Typography>
          <Box sx={{ maxWidth: 620, mx: 'auto', mt: 3 }}>
            <TextField
              fullWidth
              placeholder="Search for answers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                sx: { bgcolor: 'background.paper', borderRadius: 2 },
              }}
            />
          </Box>
        </PageContainer>
      </Box>

      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help centre' }]} />

        {/* Popular questions */}
        {!query && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Popular questions</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {popularQuestions.map((q) => (
                <Chip key={q} label={q} variant="outlined" onClick={() => setQuery(q)} />
              ))}
            </Stack>
          </Box>
        )}

        {/* Topic filter */}
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
          <Chip
            label="All topics"
            color={activeTopic === 'all' ? 'primary' : 'default'}
            variant={activeTopic === 'all' ? 'filled' : 'outlined'}
            onClick={() => setActiveTopic('all')}
          />
          {helpTopics.map((topic) => (
            <Chip
              key={topic.id}
              icon={TOPIC_ICONS[topic.icon]}
              label={topic.label}
              color={activeTopic === topic.id ? 'primary' : 'default'}
              variant={activeTopic === topic.id ? 'filled' : 'outlined'}
              onClick={() => setActiveTopic(topic.id)}
            />
          ))}
        </Stack>

        {query && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {totalMatches} {totalMatches === 1 ? 'result' : 'results'} for “{query}”
          </Typography>
        )}

        {/* FAQ accordions */}
        {results.length === 0 ? (
          <EmptyState
            title="No answers matched your search"
            description="Try a different wording, or reach out and we will help directly."
            primaryLabel="Contact support"
            primaryTo="/contact"
          />
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {results.map((topic) => (
                <Box key={topic.id} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>{topic.label}</Typography>
                  {topic.faqs.map((faq) => (
                    <Accordion key={faq.q} disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 1, '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ))}
            </Grid>

            {/* Still need help card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, position: { md: 'sticky' }, top: 96 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Still need help?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Our support team is available {`Mon–Sat, 9 to 9`}. We usually reply within a few hours.
                </Typography>
                <Button component={RouterLink} to="/contact" variant="contained" fullWidth sx={{ mb: 1 }}>
                  Contact us
                </Button>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Button component={RouterLink} to="/orders" size="small" color="inherit" sx={{ justifyContent: 'flex-start' }}>Track an order</Button>
                  <Button component={RouterLink} to="/returns" size="small" color="inherit" sx={{ justifyContent: 'flex-start' }}>Start a return</Button>
                  <Button component={RouterLink} to="/refunds" size="small" color="inherit" sx={{ justifyContent: 'flex-start' }}>Check a refund</Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}
      </PageContainer>
    </Box>
  );
}
