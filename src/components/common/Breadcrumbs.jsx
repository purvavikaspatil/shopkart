import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Breadcrumb trail. Always starts at Home.
 * @param {{ items: Array<{label:string, to?:string}> }} props last item renders as plain text
 */
export default function Breadcrumbs({ items = [], sx = {} }) {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="Breadcrumb"
      sx={{ mb: 2, '& .MuiBreadcrumbs-ol': { rowGap: 0.5 }, ...sx }}
    >
      <Link
        component={RouterLink}
        to="/"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}
      >
        <HomeIcon sx={{ fontSize: 16 }} />
        Home
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Typography
              key={item.label}
              color="text.primary"
              sx={{ fontSize: '0.85rem', fontWeight: 600 }}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            color="text.secondary"
            sx={{ fontSize: '0.85rem' }}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
