import { useState, useMemo } from 'react';
import {
  Box, Grid, Stack, Typography, Card, CardActionArea, CardMedia, CardContent,
  Chip, Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { blogPosts, blogCategories } from '@/data/editorial';
import { formatDate } from '@/utils/format';

/** Compact horizontal/vertical article card used in the grid. */
function ArticleCard({ post }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={RouterLink} to={`/blog/${post.slug}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <CardMedia component="img" image={post.cover} alt={post.title} sx={{ height: 180 }} />
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Chip label={post.category} size="small" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start', mb: 1.5 }} />
          <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.3 }}>{post.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>{post.excerpt}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar src={post.authorAvatar} sx={{ width: 28, height: 28 }} />
            <Typography variant="caption" color="text.secondary">{post.author}</Typography>
            <Box sx={{ flex: 1 }} />
            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{post.readMinutes} min</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function BlogPage() {
  const [category, setCategory] = useState('All');

  const [featured, ...rest] = blogPosts;
  const filtered = useMemo(
    () => (category === 'All' ? rest : rest.filter((p) => p.category === category)),
    [category, rest],
  );

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">The ShopNest journal</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 620 }}>
          Buying guides, honest explainers and the occasional opinion from the people who pick our products.
        </Typography>
      </Box>

      {/* Featured post */}
      {featured && category === 'All' && (
        <Card sx={{ mb: 5 }}>
          <CardActionArea component={RouterLink} to={`/blog/${featured.slug}`}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia component="img" image={featured.cover} alt={featured.title} sx={{ height: { xs: 220, md: '100%' }, minHeight: { md: 320 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Chip label="Latest" size="small" color="secondary" sx={{ mb: 2 }} />
                  <Typography variant="h4" sx={{ mb: 1.5 }}>{featured.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{featured.excerpt}</Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={featured.authorAvatar} />
                    <Box>
                      <Typography variant="subtitle2">{featured.author}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(featured.publishedAt)} · {featured.readMinutes} min read
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
      )}

      {/* Category filter */}
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
        {['All', ...blogCategories].map((cat) => (
          <Chip
            key={cat}
            label={cat}
            color={category === cat ? 'primary' : 'default'}
            variant={category === cat ? 'filled' : 'outlined'}
            onClick={() => setCategory(cat)}
          />
        ))}
      </Stack>

      {/* Grid */}
      <Grid container spacing={3}>
        {filtered.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <ArticleCard post={post} />
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
