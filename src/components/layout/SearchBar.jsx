import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, InputBase, Paper, Popper, ClickAwayListener, List, ListItemButton,
  ListItemAvatar, ListItemText, Avatar, Typography, Divider, Chip, Stack,
  IconButton, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services';
import { useDebounce, useLocalStorage } from '@/hooks';
import { STORAGE_KEYS } from '@/utils/constants';
import { formatPrice } from '@/utils/format';
import { splitHighlight as highlight } from '@/utils/helpers';

/** Queries surfaced when the field is focused but empty. */
const TRENDING = ['wireless earbuds', 'linen dress', 'cast iron skillet', 'running shoes', 'coffee beans', 'gaming keyboard'];

/** Renders text with the matched substring emphasised. */
function Highlighted({ text, query }) {
  return highlight(text, query).map((part, i) => (
    <Box
      key={`${part.text}-${i}`}
      component="span"
      sx={part.match ? { fontWeight: 800, color: 'primary.main' } : undefined}
    >
      {part.text}
    </Box>
  ));
}

/**
 * Global search with autocomplete.
 *
 * @param {{fullWidth?:boolean, autoFocus?:boolean, onSubmitted?:Function}} props
 */
export default function SearchBar({ fullWidth = false, autoFocus = false, onSubmitted, placeholder }) {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const inputRef = useRef(null);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useLocalStorage(STORAGE_KEYS.recentSearches, []);

  const debounced = useDebounce(value, 250);

  useEffect(() => {
    let cancelled = false;

    if (!debounced.trim()) {
      setSuggestions([]);
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);
    productService.getSuggestions(debounced)
      .then((results) => { if (!cancelled) setSuggestions(results); })
      .catch(() => { if (!cancelled) setSuggestions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debounced]);

  /** Stores a query in the recent list, most recent first, capped at six. */
  const remember = useCallback((query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecent((prev) => [trimmed, ...prev.filter((r) => r !== trimmed)].slice(0, 6));
  }, [setRecent]);

  const submit = (query = value) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    remember(trimmed);
    setOpen(false);
    inputRef.current?.blur();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    onSubmitted?.(trimmed);
  };

  const pick = (suggestion) => {
    setOpen(false);
    if (suggestion.type === 'product') {
      remember(suggestion.label);
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      navigate(`/category/${suggestion.slug}`);
    } else {
      submit(suggestion.label);
    }
    onSubmitted?.(suggestion.label);
  };

  const showEmptyPanel = !value.trim();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: fullWidth ? '100%' : { xs: '100%', md: 460 } }}>
        <Paper
          ref={anchorRef}
          variant="outlined"
          component="form"
          role="search"
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            height: 42,
            borderRadius: 2,
            bgcolor: 'background.paper',
            transition: 'border-color 160ms ease',
            '&:focus-within': { borderColor: 'primary.main' },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
          <InputBase
            inputRef={inputRef}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => { setValue(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder ?? 'Search for products, brands and categories'}
            inputProps={{ 'aria-label': 'Search products' }}
            sx={{ flex: 1, fontSize: '0.9rem' }}
          />
          {loading && <CircularProgress size={15} sx={{ mr: 1 }} />}
          {value && (
            <IconButton size="small" onClick={() => { setValue(''); inputRef.current?.focus(); }} aria-label="Clear search">
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Paper>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
        >
          <Paper
            elevation={8}
            sx={{ mt: 0.75, borderRadius: 2, border: 1, borderColor: 'divider', overflow: 'hidden', maxHeight: 460, overflowY: 'auto' }}
          >
            {showEmptyPanel ? (
              <Box sx={{ p: 2 }}>
                {recent.length > 0 && (
                  <>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">Recent searches</Typography>
                      <IconButton size="small" onClick={() => setRecent([])} aria-label="Clear recent searches">
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
                      {recent.map((r) => (
                        <Chip
                          key={r}
                          size="small"
                          icon={<HistoryIcon sx={{ fontSize: 14 }} />}
                          label={r}
                          onClick={() => submit(r)}
                          sx={{ borderRadius: 999 }}
                        />
                      ))}
                    </Stack>
                  </>
                )}

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Trending right now
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {TRENDING.map((t) => (
                    <Chip
                      key={t}
                      size="small"
                      color="primary"
                      variant="outlined"
                      icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                      label={t}
                      onClick={() => submit(t)}
                      sx={{ borderRadius: 999 }}
                    />
                  ))}
                </Stack>
              </Box>
            ) : suggestions.length === 0 && !loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Nothing matches "{value}". Try a shorter word or check the spelling.
                </Typography>
              </Box>
            ) : (
              <List dense disablePadding>
                {suggestions.map((s, i) => (
                  <Box key={`${s.type}-${s.label}-${i}`}>
                    {i > 0 && s.type === 'product' && suggestions[i - 1].type !== 'product' && <Divider />}
                    <ListItemButton onClick={() => pick(s)}>
                      <ListItemAvatar sx={{ minWidth: 48 }}>
                        {s.type === 'product' ? (
                          <Avatar variant="rounded" src={s.thumbnail} alt="" sx={{ width: 38, height: 38 }} />
                        ) : (
                          <Avatar variant="rounded" sx={{ width: 38, height: 38, bgcolor: 'action.hover', color: 'text.secondary' }}>
                            {s.type === 'category' ? <CategoryIcon fontSize="small" /> : <StorefrontIcon fontSize="small" />}
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" noWrap>
                            <Highlighted text={s.label} query={value} />
                          </Typography>
                        }
                        secondary={
                          s.type === 'product'
                            ? formatPrice(s.price)
                            : s.type === 'category' ? 'Category' : 'Brand'
                        }
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItemButton>
                  </Box>
                ))}

                <Divider />
                <ListItemButton onClick={() => submit()}>
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar variant="rounded" sx={{ width: 38, height: 38, bgcolor: 'primary.main' }}>
                      <SearchIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body2">See all results for "{value}"</Typography>}
                  />
                </ListItemButton>
              </List>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
