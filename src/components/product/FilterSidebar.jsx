import { useState, useEffect } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, FormGroup,
  FormControlLabel, Checkbox, Slider, Rating, Stack, Button, Chip, TextField,
  Divider, Switch, InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatPrice } from '@/utils/format';
import { categories } from '@/data/categories';
import { brands, allColors, allSizes, allMaterials, priceBounds } from '@/data/products';

/** Discount thresholds offered as radio-style checkboxes. */
const DISCOUNT_STEPS = [10, 20, 30, 40, 50];

/**
 * Every filter facet for the shop, search and category pages.
 *
 * The component is presentational: it reads `filters` and calls back. That
 * lets the same instance render in a desktop sidebar and inside a mobile
 * drawer without duplicating logic.
 *
 * @param {{filters:object, onToggle:(field:string,value:any)=>void,
 *          onUpdate:(patch:object)=>void, onReset:Function,
 *          hideCategory?:boolean, subcategoryOptions?:string[]}} props
 */
export default function FilterSidebar({
  filters, onToggle, onUpdate, onReset,
  hideCategory = false, subcategoryOptions = null, activeCount = 0,
}) {
  // Local price state so dragging the slider does not refetch on every pixel.
  const [priceRange, setPriceRange] = useState([
    filters.minPrice ?? priceBounds.min,
    filters.maxPrice ?? priceBounds.max,
  ]);

  useEffect(() => {
    setPriceRange([filters.minPrice ?? priceBounds.min, filters.maxPrice ?? priceBounds.max]);
  }, [filters.minPrice, filters.maxPrice]);

  const commitPrice = (range) => {
    onUpdate({
      minPrice: range[0] === priceBounds.min ? null : range[0],
      maxPrice: range[1] === priceBounds.max ? null : range[1],
    });
  };

  // Subcategories shown depend on which categories are selected.
  const subcategories = subcategoryOptions ?? (
    filters.categories.length
      ? categories
        .filter((c) => filters.categories.includes(c.name))
        .flatMap((c) => c.subcategories.map((s) => s.name))
      : []
  );

  const section = (title, key, children, defaultExpanded = false) => (
    <Accordion defaultExpanded={defaultExpanded} key={key}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6">
          Filters
          {activeCount > 0 && (
            <Chip size="small" color="primary" label={activeCount} sx={{ ml: 1 }} />
          )}
        </Typography>
        {activeCount > 0 && (
          <Button size="small" onClick={onReset}>Clear all</Button>
        )}
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/* Availability first: it is the filter people reach for most. */}
      <FormControlLabel
        control={
          <Switch
            checked={filters.inStockOnly}
            onChange={(e) => onUpdate({ inStockOnly: e.target.checked })}
          />
        }
        label={<Typography variant="body2">In stock only</Typography>}
        sx={{ mb: 1 }}
      />

      {!hideCategory && section('Category', 'category', (
        <FormGroup>
          {categories.map((c) => (
            <FormControlLabel
              key={c.slug}
              control={
                <Checkbox
                  size="small"
                  checked={filters.categories.includes(c.name)}
                  onChange={() => onToggle('categories', c.name)}
                />
              }
              label={<Typography variant="body2">{c.name}</Typography>}
            />
          ))}
        </FormGroup>
      ), true)}

      {subcategories.length > 0 && section('Subcategory', 'subcategory', (
        <FormGroup>
          {subcategories.map((s) => (
            <FormControlLabel
              key={s}
              control={
                <Checkbox
                  size="small"
                  checked={filters.subcategories.includes(s)}
                  onChange={() => onToggle('subcategories', s)}
                />
              }
              label={<Typography variant="body2">{s}</Typography>}
            />
          ))}
        </FormGroup>
      ), true)}

      {section('Price', 'price', (
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={priceRange}
            min={priceBounds.min}
            max={priceBounds.max}
            step={500}
            onChange={(_, value) => setPriceRange(value)}
            onChangeCommitted={(_, value) => commitPrice(value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => formatPrice(v)}
            getAriaLabel={() => 'Price range'}
            sx={{ mt: 1 }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              size="small"
              label="Min"
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              onBlur={() => commitPrice(priceRange)}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
            <TextField
              size="small"
              label="Max"
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              onBlur={() => commitPrice(priceRange)}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Stack>
        </Box>
      ), true)}

      {section('Brand', 'brand', (
        <FormGroup sx={{ maxHeight: 260, overflowY: 'auto' }}>
          {brands.map((b) => (
            <FormControlLabel
              key={b}
              control={
                <Checkbox
                  size="small"
                  checked={filters.brands.includes(b)}
                  onChange={() => onToggle('brands', b)}
                />
              }
              label={<Typography variant="body2">{b}</Typography>}
            />
          ))}
        </FormGroup>
      ))}

      {section('Customer rating', 'rating', (
        <Stack spacing={0.5}>
          {[4, 3, 2].map((stars) => (
            <FormControlLabel
              key={stars}
              control={
                <Checkbox
                  size="small"
                  checked={filters.minRating === stars}
                  onChange={() => onUpdate({ minRating: filters.minRating === stars ? 0 : stars })}
                />
              }
              label={
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Rating value={stars} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">and above</Typography>
                </Stack>
              }
            />
          ))}
        </Stack>
      ))}

      {section('Discount', 'discount', (
        <FormGroup>
          {DISCOUNT_STEPS.map((d) => (
            <FormControlLabel
              key={d}
              control={
                <Checkbox
                  size="small"
                  checked={filters.minDiscount === d}
                  onChange={() => onUpdate({ minDiscount: filters.minDiscount === d ? 0 : d })}
                />
              }
              label={<Typography variant="body2">{d}% or more</Typography>}
            />
          ))}
        </FormGroup>
      ))}

      {section('Colour', 'colour', (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {allColors.map((c) => (
            <Chip
              key={c}
              label={c}
              size="small"
              variant={filters.colors.includes(c) ? 'filled' : 'outlined'}
              color={filters.colors.includes(c) ? 'primary' : 'default'}
              onClick={() => onToggle('colors', c)}
              sx={{ borderRadius: 999 }}
            />
          ))}
        </Box>
      ))}

      {section('Size', 'size', (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {allSizes.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              variant={filters.sizes.includes(s) ? 'filled' : 'outlined'}
              color={filters.sizes.includes(s) ? 'primary' : 'default'}
              onClick={() => onToggle('sizes', s)}
              sx={{ borderRadius: 999 }}
            />
          ))}
        </Box>
      ))}

      {section('Material', 'material', (
        <FormGroup>
          {allMaterials.map((m) => (
            <FormControlLabel
              key={m}
              control={
                <Checkbox
                  size="small"
                  checked={filters.materials.includes(m)}
                  onChange={() => onToggle('materials', m)}
                />
              }
              label={<Typography variant="body2">{m}</Typography>}
            />
          ))}
        </FormGroup>
      ))}
    </Box>
  );
}
