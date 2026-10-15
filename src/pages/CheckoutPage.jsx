import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, Typography, Button, Stack, Stepper, Step, StepLabel,
  Radio, RadioGroup, FormControlLabel, Divider, Alert,
  CircularProgress, Chip,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';

import PageContainer from '@/components/common/PageContainer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import EmptyState from '@/components/common/EmptyState';
import OrderSummary from '@/components/order/OrderSummary';
import AddressCard from '@/components/order/AddressCard';
import AddressDialog from '@/components/order/AddressDialog';
import { useCart, useAuth, useToast } from '@/hooks';
import { userService, orderService, paymentService } from '@/services';
import { calculateTotals } from '@/utils/helpers';
import { formatPrice } from '@/utils/format';
import { DELIVERY_OPTIONS, PAYMENT_METHODS } from '@/utils/constants';

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { items, coupon, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryId, setDeliveryId] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);

  // Load the saved address book once.
  useEffect(() => {
    let active = true;
    userService.getAddresses()
      .then((list) => {
        if (!active) return;
        setAddresses(list);
        setSelectedAddress(list.find((a) => a.isDefault) ?? list[0] ?? null);
      })
      .finally(() => active && setLoadingAddresses(false));
    return () => { active = false; };
  }, []);

  // Totals recompute whenever the delivery or payment choice changes.
  const totals = calculateTotals(items, { coupon, deliveryId, paymentMethod });

  if (items.length === 0 && !placing) {
    return (
      <PageContainer>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        <EmptyState
          icon={<LocalShippingOutlinedIcon />}
          title="Nothing to check out"
          description="Your cart is empty. Add a few things and come back."
          primaryLabel="Go to shop"
          primaryTo="/shop"
        />
      </PageContainer>
    );
  }

  const saveAddress = async (form) => {
    const next = await userService.addAddress(form);
    setAddresses(next);
    setSelectedAddress(next.find((a) => a.isDefault) ?? next[next.length - 1]);
    toast.success('Address saved');
  };

  const next = () => {
    if (step === 0 && !selectedAddress) { toast.error('Choose a delivery address to continue.'); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = async () => {
    setPlacing(true);
    try {
      let paymentDetails;
      if (paymentMethod !== 'cod') {
        // Opens the Razorpay popup; resolves only after the shopper has actually paid.
        paymentDetails = await paymentService.payWithRazorpay({
          items, deliveryId, paymentMethod, coupon, user, address: selectedAddress,
        });
      }
      // The backend re-verifies the signature and amount before it creates the order.
      const order = await orderService.createOrder({
        items,
        address: selectedAddress,
        deliveryId,
        paymentMethod,
        coupon,
        paymentDetails,
      });
      clearCart();
      toast.success(paymentDetails ? 'Payment successful - order placed' : 'Order placed');
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      toast.error(err.message ?? 'Something went wrong placing your order.');
      setPlacing(false);
    }
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />

      <Stepper activeStep={step} alternativeLabel sx={{ mb: 4, mt: 1 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Step 1: Address */}
          {step === 0 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5">Delivery address</Typography>
                <Button startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>Add new</Button>
              </Stack>

              {loadingAddresses ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}><CircularProgress /></Box>
              ) : addresses.length === 0 ? (
                <EmptyState
                  dense
                  title="No saved addresses"
                  description="Add an address to deliver this order to."
                  primaryLabel="Add address"
                  onPrimary={() => setDialogOpen(true)}
                  sx={{ border: 0 }}
                />
              ) : (
                <Grid container spacing={2}>
                  {addresses.map((address) => (
                    <Grid item xs={12} sm={6} key={address.id}>
                      <AddressCard
                        address={address}
                        selectable
                        selected={selectedAddress?.id === address.id}
                        onSelect={setSelectedAddress}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Card>
          )}

          {/* Step 2: Delivery */}
          {step === 1 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Delivery speed</Typography>
              <RadioGroup value={deliveryId} onChange={(e) => setDeliveryId(e.target.value)}>
                <Stack spacing={1.5}>
                  {DELIVERY_OPTIONS.map((option) => {
                    const free = option.id === 'standard' && totals.subtotal >= 999;
                    return (
                      <Card
                        key={option.id}
                        variant="outlined"
                        onClick={() => setDeliveryId(option.id)}
                        sx={{ p: 2, cursor: 'pointer', borderColor: deliveryId === option.id ? 'primary.main' : 'divider' }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <FormControlLabel
                            value={option.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle2">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">{option.days} · {option.note}</Typography>
                              </Box>
                            }
                          />
                          {free ? <Chip size="small" color="success" label="FREE" /> : <Typography variant="subtitle2">{formatPrice(option.fee)}</Typography>}
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              </RadioGroup>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 2 && (
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <LockIcon fontSize="small" color="success" />
                <Typography variant="h5">Payment</Typography>
              </Stack>
              <Alert severity="info" sx={{ mb: 2 }}>
                Online payments are processed securely by Razorpay. You will enter your card, UPI or bank details
                in the Razorpay window when you place the order - we never see or store them.
              </Alert>

              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Stack spacing={1.5}>
                  {PAYMENT_METHODS.map((method) => (
                    <Card key={method.id} variant="outlined" sx={{ p: 2, borderColor: paymentMethod === method.id ? 'primary.main' : 'divider' }}>
                      <FormControlLabel
                        value={method.id}
                        control={<Radio />}
                        label={<Box><Typography variant="subtitle2">{method.label}</Typography><Typography variant="caption" color="text.secondary">{method.hint}</Typography></Box>}
                      />

                      {paymentMethod === method.id && method.id !== 'cod' && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, pl: { sm: 4 } }}>
                          You will complete this payment in the secure Razorpay window.
                        </Typography>
                      )}

                      {paymentMethod === method.id && method.id === 'cod' && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, pl: { sm: 4 } }}>
                          Pay in cash when your order arrives. A small handling fee applies.
                        </Typography>
                      )}
                    </Card>
                  ))}
                </Stack>
              </RadioGroup>
            </Card>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <Stack spacing={2}>
              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6">Deliver to</Typography>
                  <Button size="small" onClick={() => setStep(0)}>Change</Button>
                </Stack>
                {selectedAddress && (
                  <Box>
                    <Typography variant="subtitle2">{selectedAddress.fullName} · {selectedAddress.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAddress.line1}, {selectedAddress.line2}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Phone: {selectedAddress.phone}</Typography>
                  </Box>
                )}
              </Card>

              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6">Delivery & payment</Typography>
                  <Button size="small" onClick={() => setStep(1)}>Change</Button>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {DELIVERY_OPTIONS.find((d) => d.id === deliveryId)?.label} · {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                </Typography>
              </Card>

              <Card sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>Items ({totals.itemCount})</Typography>
                <Stack divider={<Divider />} spacing={1.5}>
                  {items.map((item) => (
                    <Stack key={item.key} direction="row" spacing={2} alignItems="center">
                      <Box component="img" src={item.thumbnail} alt={item.title} sx={{ width: 56, height: 56, borderRadius: 1.5, objectFit: 'cover' }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">Qty {item.quantity}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}</Typography>
                      </Box>
                      <Typography variant="subtitle2">{formatPrice(item.price * item.quantity)}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Stack>
          )}

          {/* Navigation */}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button onClick={back} disabled={step === 0} color="inherit">Back</Button>
            {step < STEPS.length - 1 ? (
              <Button variant="contained" onClick={next}>Continue</Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={placeOrder}
                disabled={placing}
                startIcon={placing ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
              >
                {placing ? (paymentMethod === 'cod' ? 'Placing order…' : 'Processing payment…') : (paymentMethod === 'cod' ? `Place order · ${formatPrice(totals.total)}` : `Pay ${formatPrice(totals.total)}`)}
              </Button>
            )}
          </Stack>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
            <OrderSummary totals={totals} coupon={coupon} />
          </Box>
        </Grid>
      </Grid>

      <AddressDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={saveAddress} />
    </PageContainer>
  );
}
