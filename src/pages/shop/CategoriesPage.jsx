import { Grid, Typography, Box } from '@mui/material';
import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CategoryCard from '@/components/product/CategoryCard';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

/** Landing page listing every top-level category as a large tile. */
export default function CategoriesPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3">Browse categories</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 620 }}>
          Seven departments spanning everyday essentials and premium picks. Pick a lane to get started.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category.name).length;
          return (
            <Grid item xs={12} sm={6} md={4} key={category.slug}>
              <CategoryCard
                label={category.name}
                description={category.tagline}
                image={category.image}
                to={`/category/${category.slug}`}
                count={count}
              />
            </Grid>
          );
        })}
      </Grid>
    </PageContainer>
  );
}
