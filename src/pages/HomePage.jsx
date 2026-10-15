import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Grid, Typography, Button, Stack, Card, IconButton, Chip, Avatar,
  Rating,
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

import PageContainer from '@/components/common/PageContainer';
import SectionHeader from '@/components/common/SectionHeader';
import ProductCarousel from '@/components/product/ProductCarousel';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryCard from '@/components/product/CategoryCard';
import PromoBanner from '@/components/product/PromoBanner';
import CountdownTimer from '@/components/common/CountdownTimer';
import { productService } from '@/services';
import { useAsync, useRecentlyViewed } from '@/hooks';
import { featuredCategoryCards, categories } from '@/data/categories';
import { testimonials } from '@/data/mockContent';
import { brandShowcase, productById } from '@/data/products';
import { initials } from '@/utils/format';

/** Hero slides. Images are deterministic picsum seeds so they never shift. */
const HERO_SLIDES = [
  {
    eyebrow: 'New season',
    title: 'Premium picks, everyday prices',
    body: 'Thousands of products across electronics, fashion, home and more — with free shipping over ₹999.',
    cta: 'Shop the latest', to: '/new-arrivals',
    image: 'https://picsum.photos/seed/shopnest-hero-1/1600/800',
    tone: 'linear-gradient(120deg, rgba(61,72,214,0.92), rgba(14,159,151,0.6))',
  },
  {
    eyebrow: 'Flash sale live',
    title: 'Up to 60% off top tech',
    body: 'Headphones, laptops, wearables and more at their lowest of the season. While stocks last.',
    cta: 'See the deals', to: '/deals',
    image: 'https://picsum.photos/seed/shopnest-hero-2/1600/800',
    tone: 'linear-gradient(120deg, rgba(20,20,40,0.9), rgba(61,72,214,0.55))',
  },
  {
    eyebrow: 'Home refresh',
    title: 'Make room for better',
    body: 'Cookware, decor and storage to reset your space, hand-picked by our editors.',
    cta: 'Explore home', to: '/category/home-living',
    image: 'https://picsum.photos/seed/shopnest-hero-3/1600/800',
    tone: 'linear-gradient(120deg, rgba(14,159,151,0.9), rgba(61,72,214,0.5))',
  },
];

const TRUST_BADGES = [
  { icon: <LocalShippingOutlinedIcon />, title: 'Free shipping', caption: 'On orders over ₹999' },
  { icon: <ReplayOutlinedIcon />, title: '7-day returns', caption: 'On almost everything' },
  { icon: <VerifiedUserOutlinedIcon />, title: 'Secure checkout', caption: 'Encrypted end to end' },
  { icon: <HeadsetMicOutlinedIcon />, title: 'Real support', caption: 'Mon–Sat, 9 to 9' },
];

/** Auto-advancing hero carousel. */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const count = HERO_SLIDES.length;

  const go = useCallback((next) => setActive((prev) => (next + count) % count), [count]);

  // Auto-advance every six seconds; pause is handled by clearing on hover.
  useEffect(() => {
    timer.current = setInterval(() => go(active + 1), 6000);
    return () => clearInterval(timer.current);
  }, [active, go]);

  const pause = () => clearInterval(timer.current);

  return (
    <Box
      onMouseEnter={pause}
      sx={{ position: 'relative', borderRadius: { xs: 3, md: 4 }, overflow: 'hidden' }}
    >
      <Box sx={{ position: 'relative', height: { xs: 380, sm: 420, md: 480 } }}>
        {HERO_SLIDES.map((slide, i) => (
          <Box
            key={slide.title}
            sx={{
              position: 'absolute', inset: 0,
              opacity: i === active ? 1 : 0,
              transition: 'opacity 700ms ease',
              pointerEvents: i === active ? 'auto' : 'none',
            }}
          >
            <Box component="img" src={slide.image} alt="" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: slide.tone }} />
            <Box
              sx={{
                position: 'relative', zIndex: 1, height: '100%',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                px: { xs: 3, sm: 6, md: 8 }, maxWidth: 640, color: '#fff',
              }}
            >
              <Chip label={slide.eyebrow} size="small" sx={{ alignSelf: 'flex-start', mb: 2, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
              <Typography variant="h1" sx={{ color: '#fff', fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' }, mb: 1.5 }}>
                {slide.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.92)', mb: 3, maxWidth: 500 }}>
                {slide.body}
              </Typography>
              <Box>
                <Button component={RouterLink} to={slide.to} variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: '#fff', color: 'text.primary', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                  {slide.cta}
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <IconButton onClick={() => go(active - 1)} aria-label="Previous slide" sx={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', display: { xs: 'none', sm: 'grid' }, '&:hover': { bgcolor: '#fff' } }}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={() => go(active + 1)} aria-label="Next slide" sx={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.85)', display: { xs: 'none', sm: 'grid' }, '&:hover': { bgcolor: '#fff' } }}>
        <KeyboardArrowRight />
      </IconButton>

      <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
        {HERO_SLIDES.map((slide, i) => (
          <Box
            key={slide.title}
            component="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            sx={{
              width: i === active ? 26 : 9, height: 9, p: 0, border: 0, cursor: 'pointer',
              borderRadius: 999, bgcolor: i === active ? '#fff' : 'rgba(255,255,255,0.55)',
              transition: 'all 250ms ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default function HomePage() {
  const { ids: recentIds } = useRecentlyViewed();

  const featured = useAsync(() => productService.getFeatured(8), []);
  const trending = useAsync(() => productService.getTrending(10), []);
  const bestSellers = useAsync(() => productService.getBestSellers(8), []);
  const newArrivals = useAsync(() => productService.getNewArrivals(10), []);
  const deals = useAsync(() => productService.getDeals(8), []);

  // Flash sale ends tonight — a rolling target keeps the countdown alive.
  const flashSaleEnd = useRef(new Date(Date.now() + 6 * 3600 * 1000).toISOString());

  const recentProducts = recentIds.map((id) => productById.get(id)).filter(Boolean).slice(0, 10);

  return (
    <Box>
      {/* Hero */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <HeroCarousel />
      </PageContainer>

      {/* Trust badges */}
      <PageContainer py={0}>
        <Grid container spacing={2} sx={{ mb: { xs: 2, md: 4 } }}>
          {TRUST_BADGES.map((badge) => (
            <Grid item xs={6} md={3} key={badge.title}>
              <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center', '& svg': { fontSize: 28 } }}>
                  {badge.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2">{badge.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{badge.caption}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageContainer>

      {/* Category rail */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="Shop by category" subtitle="Seven departments, thousands of products." actionLabel="All categories" actionTo="/categories" />
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ overflowX: 'auto', pb: 1 }} className="no-scrollbar">
          {featuredCategoryCards.map((cat) => (
            <CategoryCard key={cat.slug + cat.label} variant="circle" label={cat.label} image={cat.image} to={cat.to} />
          ))}
        </Stack>
      </PageContainer>

      {/* Flash sale */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <Card sx={{ p: { xs: 2, md: 3 }, background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}12, ${t.palette.secondary.main}12)` }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <BoltIcon />
              </Box>
              <Box>
                <Typography variant="h5">Flash sale</Typography>
                <Typography variant="body2" color="text.secondary">Lowest prices of the season</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <CountdownTimer target={flashSaleEnd.current} label="Ends in" />
              <Button component={RouterLink} to="/deals" variant="contained" endIcon={<ArrowForwardIcon />} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                View all
              </Button>
            </Stack>
          </Stack>
          <ProductCarousel products={deals.data ?? []} loading={deals.loading} />
        </Card>
      </PageContainer>

      {/* Trending */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="Trending now" subtitle="What everyone is adding to cart this week." actionLabel="See more" actionTo="/best-sellers" />
        <ProductCarousel products={trending.data ?? []} loading={trending.loading} />
      </PageContainer>

      {/* Promo split */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <PromoBanner eyebrow="Members save more" title="Coupons up to ₹1,000 off" body="Stack a welcome code on your first order and watch the total drop at checkout." ctaLabel="Browse coupons" ctaTo="/coupons" image="https://picsum.photos/seed/shopnest-promo-a/900/500" tone="primary" />
          </Grid>
          <Grid item xs={12} md={6}>
            <PromoBanner eyebrow="Fresh drops" title="New arrivals, every week" body="The latest across every department, before it sells out." ctaLabel="Shop new in" ctaTo="/new-arrivals" image="https://picsum.photos/seed/shopnest-promo-b/900/500" tone="secondary" />
          </Grid>
        </Grid>
      </PageContainer>

      {/* Best sellers grid */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="Best sellers" subtitle="Tried, tested and loved by thousands." actionLabel="View all" actionTo="/best-sellers" />
        <ProductGrid products={bestSellers.data ?? []} loading={bestSellers.loading} skeletonCount={8} />
      </PageContainer>

      {/* New arrivals */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="New arrivals" subtitle="Just landed and ready to ship." actionLabel="See more" actionTo="/new-arrivals" />
        <ProductCarousel products={newArrivals.data ?? []} loading={newArrivals.loading} />
      </PageContainer>

      {/* Featured collection */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="Editor's picks" subtitle="A hand-picked edit from our team." actionLabel="Shop the edit" actionTo="/shop" />
        <ProductGrid products={featured.data ?? []} loading={featured.loading} skeletonCount={8} />
      </PageContainer>

      {/* Recently viewed */}
      {recentProducts.length > 0 && (
        <PageContainer py={{ xs: 2, md: 3 }}>
          <SectionHeader title="Pick up where you left off" actionLabel="View all" actionTo="/recently-viewed" />
          <ProductCarousel products={recentProducts} />
        </PageContainer>
      )}

      {/* Brand showcase */}
      <PageContainer py={{ xs: 2, md: 3 }}>
        <SectionHeader title="Brands we carry" align="center" />
        <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={{ xs: 1.5, md: 3 }}>
          {brandShowcase.slice(0, 12).map((brand) => (
            <Chip key={brand.name} label={brand.name} variant="outlined" sx={{ px: 1.5, py: 2.5, fontSize: '0.95rem', fontWeight: 600 }} />
          ))}
        </Stack>
      </PageContainer>

      {/* Testimonials */}
      <PageContainer py={{ xs: 2, md: 4 }}>
        <SectionHeader title="What shoppers say" align="center" />
        <Grid container spacing={2}>
          {testimonials.slice(0, 3).map((t) => (
            <Grid item xs={12} md={4} key={t.id}>
              <Card sx={{ p: 3, height: '100%' }}>
                <FormatQuoteIcon sx={{ fontSize: 32, color: 'primary.main', opacity: 0.4, transform: 'scaleX(-1)' }} />
                <Rating value={t.rating} readOnly size="small" sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t.quote}</Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={`https://picsum.photos/seed/shopnest-avatar-${t.avatarSeed}/80/80`}>{initials(t.name)}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageContainer>

      {/* Closing CTA */}
      <PageContainer py={{ xs: 2, md: 4 }}>
        <PromoBanner align="center" title="Ready to find your next favourite thing?" body="Create a free account to save your wishlist, track orders and unlock member coupons." ctaLabel="Create your account" ctaTo="/signup" tone="dark" height={{ xs: 240, md: 280 }} />
      </PageContainer>
    </Box>
  );
}
