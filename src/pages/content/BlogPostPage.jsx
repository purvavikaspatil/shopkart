import { useEffect } from 'react';
import { useParams, Navigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Stack, Typography, Chip, Avatar, Divider, Button, Grid, Card,
  CardActionArea, CardMedia, CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { getPostBySlug, blogPosts } from '@/data/editorial';
import { formatDate } from '@/utils/format';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!post) return <Navigate to="/404" replace />;

  // Two more posts from the same category (falling back to any) for the footer.
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .concat(blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3);

  return (
    <PageContainer maxWidth={880}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]} />

      <Button component={RouterLink} to="/blog" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} color="inherit">
        All articles
      </Button>

      {/* Header */}
      <Chip label={post.category} color="primary" variant="outlined" size="small" sx={{ mb: 2 }} />
      <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mb: 2 }}>{post.title}</Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Avatar src={post.authorAvatar} />
        <Box>
          <Typography variant="subtitle2">{post.author}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">{formatDate(post.publishedAt)}</Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{post.readMinutes} min read</Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Cover */}
      <Box component="img" src={post.cover} alt={post.title} sx={{ width: '100%', borderRadius: 3, mb: 4, aspectRatio: '16/8', objectFit: 'cover' }} />

      {/* Body */}
      <Box sx={{ '& p': { mb: 2.5 } }}>
        {post.body.map((paragraph, i) => (
          <Typography key={i} component="p" variant="body1" sx={{ fontSize: '1.08rem', lineHeight: 1.75, color: 'text.primary' }}>
            {paragraph}
          </Typography>
        ))}
      </Box>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 3 }} flexWrap="wrap" useFlexGap>
          {post.tags.map((tag) => (
            <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 5 }} />

      {/* Related */}
      <Typography variant="h5" sx={{ mb: 2 }}>Keep reading</Typography>
      <Grid container spacing={2}>
        {related.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea component={RouterLink} to={`/blog/${item.slug}`} sx={{ height: '100%' }}>
                <CardMedia component="img" image={item.cover} alt={item.title} sx={{ height: 130 }} />
                <CardContent>
                  <Typography variant="caption" color="primary.main">{item.category}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 0.5, lineHeight: 1.3 }}>{item.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
