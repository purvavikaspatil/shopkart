import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Rating, Stack, Avatar, Chip, Button, Divider,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { formatDate, initials } from '@/utils/format';

/**
 * Single customer review.
 * The helpful count is optimistic local state - with a backend this would
 * POST to /api/reviews/:id/helpful.
 */
export default function ReviewCard({ review, variant = 'card' }) {
  const [helpful, setHelpful] = useState(false);
  const count = review.helpfulCount + (helpful ? 1 : 0);

  const content = (
    <>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
          {initials(review.author)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="subtitle2">{review.author}</Typography>
            {review.verified && (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                icon={<VerifiedIcon sx={{ fontSize: 13 }} />}
                label="Verified purchase"
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(review.createdAt)}
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {review.title && (
        <Typography variant="subtitle1" sx={{ mt: 1.5 }}>{review.title}</Typography>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {review.body}
      </Typography>

      {review.photos?.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          {review.photos.map((src) => (
            <Box
              key={src}
              component="img"
              src={src}
              alt="Photo submitted with this review"
              loading="lazy"
              sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
        <Button
          size="small"
          color={helpful ? 'primary' : 'inherit'}
          startIcon={helpful ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
          onClick={() => setHelpful((v) => !v)}
          aria-pressed={helpful}
        >
          Helpful ({count})
        </Button>
      </Stack>
    </>
  );

  if (variant === 'plain') {
    return (
      <Box sx={{ py: 2.5 }}>
        {content}
        <Divider sx={{ mt: 2.5, mb: -2.5 }} />
      </Box>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
