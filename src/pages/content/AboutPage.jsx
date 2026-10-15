import { Box, Grid, Stack, Typography, Card, Avatar, Divider } from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import HandshakeIcon from '@mui/icons-material/Handshake';
import RecyclingIcon from '@mui/icons-material/Recycling';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import SectionHeader from '@/components/common/SectionHeader';
import { companyStats, companyValues, companyTimeline, teamMembers } from '@/data/editorial';

/** Maps the icon name stored in data to an actual MUI icon. */
const VALUE_ICONS = {
  FactCheck: <FactCheckIcon />,
  AssignmentReturn: <AssignmentReturnIcon />,
  Handshake: <HandshakeIcon />,
  Recycling: <RecyclingIcon />,
};

export default function AboutPage() {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'linear-gradient(130deg, #3D48D6, #0E9F97)' }}>
        <PageContainer py={{ xs: 6, md: 9 }} sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>Our story</Typography>
          <Typography variant="h1" sx={{ color: '#fff', maxWidth: 720, mt: 1, fontSize: { xs: '2.2rem', md: '3rem' } }}>
            A store that prints the real number
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', mt: 2, maxWidth: 620, fontSize: '1.1rem' }}>
            ShopNest started in 2019 with a simple, slightly stubborn idea: tell shoppers the truth about stock, delivery
            and quality, and let that honesty do the selling.
          </Typography>
        </PageContainer>
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', top: -120, right: -80 }} />
      </Box>

      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {companyStats.map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h3" color="primary.main">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{stat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Values */}
        <SectionHeader title="What we stand for" subtitle="Four commitments we hold ourselves to, and publish results against." />
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {companyValues.map((value) => (
            <Grid item xs={12} sm={6} key={value.title}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ color: 'primary.main', '& svg': { fontSize: 30 } }}>{VALUE_ICONS[value.icon]}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{value.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{value.body}</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Timeline */}
        <SectionHeader title="How we got here" />
        <Box sx={{ mb: 6, position: 'relative' }}>
          {companyTimeline.map((entry, i) => (
            <Stack key={entry.year} direction="row" spacing={3} sx={{ pb: i === companyTimeline.length - 1 ? 0 : 4 }}>
              {/* Rail */}
              <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                {i < companyTimeline.length - 1 && (
                  <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', mt: 0.5 }} />
                )}
              </Box>
              <Box sx={{ pb: 1 }}>
                <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>{entry.year}</Typography>
                <Typography variant="h6">{entry.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 620 }}>{entry.body}</Typography>
              </Box>
            </Stack>
          ))}
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Team */}
        <SectionHeader title="The people behind it" subtitle="A small team that still reads the reviews." />
        <Grid container spacing={2}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                  <Avatar src={member.avatar} sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography variant="subtitle1">{member.name}</Typography>
                    <Typography variant="body2" color="primary.main">{member.role}</Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">{member.bio}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    </Box>
  );
}
