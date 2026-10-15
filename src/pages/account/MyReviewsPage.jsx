import { useState, useEffect } from 'react';
import {
  Card, Box, Typography, Button, Stack, Rating, IconButton, Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { userService } from '@/services';
import { useToast } from '@/hooks';
import { formatDate } from '@/utils/format';

/** Reviews the shopper has written, stored locally. */
export default function MyReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    userService.getMyReviews().then(setReviews).finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    setRemoving(true);
    try {
      const next = await userService.deleteReview(deleting.id);
      setReviews(next);
      toast.success('Review deleted');
      setDeleting(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your account', to: '/profile' }, { label: 'Your reviews' }]} />
      <Typography variant="h3" sx={{ mb: 3 }}>Your reviews</Typography>

      {loading ? (
        <LoadingSkeleton variant="orderList" count={2} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<RateReviewOutlinedIcon />}
          title="You haven't written any reviews"
          description="Share your experience with products you've bought — it helps other shoppers decide."
          primaryLabel="Browse your orders"
          primaryTo="/orders"
        />
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Card key={review.id} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2}>
                <Box component={RouterLink} to={`/product/${review.productId}`} sx={{ flexShrink: 0 }}>
                  <Box component="img" src={review.thumbnail} alt={review.productTitle} sx={{ width: 64, height: 64, borderRadius: 1.5, objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography
                      component={RouterLink}
                      to={`/product/${review.productId}`}
                      variant="subtitle2"
                      sx={{ color: 'text.primary', textDecoration: 'none' }}
                    >
                      {review.productTitle}
                    </Typography>
                    <IconButton size="small" onClick={() => setDeleting(review)} aria-label="Delete review">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ my: 0.5 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">{formatDate(review.createdAt)}</Typography>
                  </Stack>
                  {review.title && <Typography variant="body2" sx={{ fontWeight: 600 }}>{review.title}</Typography>}
                  <Typography variant="body2" color="text.secondary">{review.body}</Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <ConfirmationDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={removing}
        title="Delete this review?"
        message="This removes it permanently."
        confirmLabel="Delete"
      />
    </PageContainer>
  );
}
