import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { CUSTOM_DEPOSIT_AMOUNT } from '@/types';
import { formatEGP } from '@/lib/format';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';

const CUSTOM_PRODUCT = getProductById('prod_custom')!;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Custom() {
  const navigate = useNavigate();
  const { addLine } = useCart();

  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const dataUrl = await readFileAsDataUrl(file);
    setImagePreview(dataUrl);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (description.trim().length < 10) next.description = 'Tell us a little more — at least 10 characters.';
    if (!customerName.trim()) next.customerName = 'Required.';
    if (!/^01[0-2,5]\d{8}$/.test(phone.trim())) next.phone = 'Enter a valid Egyptian phone number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    addLine({
      id: `custom_${Date.now()}`,
      productId: CUSTOM_PRODUCT.id,
      productName: CUSTOM_PRODUCT.name,
      productSlug: CUSTOM_PRODUCT.slug,
      image: imagePreview ?? CUSTOM_PRODUCT.images[0],
      unitPrice: CUSTOM_PRODUCT.price,
      quantity: 1,
      custom: {
        description: description.trim(),
        referenceImageDataUrl: imagePreview ?? undefined,
        referenceImageName: imageFile?.name,
      },
    });
    setSubmitted(true);
    setTimeout(() => navigate('/cart'), 900);
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <p className="eyebrow mb-3">Custom</p>
          <h1 className="font-display text-3xl md:text-4xl text-navy-800 mb-4">
            Design your own T-Head
          </h1>
          <p className="text-navy-600 leading-relaxed mb-6 max-w-md">
            Describe the piece you're picturing, and attach a reference image if
            you have one. We'll follow up on WhatsApp or phone if we need any
            details before casting.
          </p>
          <div className="aspect-[4/3] bg-cream-300 overflow-hidden mb-6">
            <img src={CUSTOM_PRODUCT.images[0]} alt="Custom NOVA T-Head" className="w-full h-full object-cover" />
          </div>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <dt className="text-navy-500">Price</dt>
            <dd className="font-mono text-navy-800">{formatEGP(CUSTOM_PRODUCT.price)}</dd>
            <dt className="text-navy-500">Deposit required</dt>
            <dd className="font-mono text-navy-800">{formatEGP(CUSTOM_DEPOSIT_AMOUNT)}</dd>
            <dt className="text-navy-500">Remaining balance</dt>
            <dd className="font-mono text-navy-800">{formatEGP(CUSTOM_PRODUCT.price - CUSTOM_DEPOSIT_AMOUNT)}</dd>
            <dt className="text-navy-500">Processing time</dt>
            <dd className="font-mono text-navy-800">2–3 days</dd>
            <dt className="text-navy-500">Shipping</dt>
            <dd className="text-navy-800">According to location</dd>
          </dl>
          <p className="text-xs text-navy-500 mt-4 max-w-md">
            A {formatEGP(CUSTOM_DEPOSIT_AMOUNT)} deposit — part of the {formatEGP(CUSTOM_PRODUCT.price)} price, not
            an extra fee — is required before production starts. We'll confirm the deposit with you separately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            label="Describe what you want"
            placeholder="Colour, inclusions, mood — the more detail, the better."
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />

          <div>
            <label className="label" htmlFor="reference-image">Reference image (optional)</label>
            <input
              id="reference-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-navy-600 file:mr-4 file:py-3 file:px-5 file:border-0 file:text-sm file:font-medium file:bg-navy-800 file:text-cream-200 hover:file:bg-navy-700"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Reference preview" className="mt-3 w-32 h-32 object-cover border border-navy-800/10" />
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              error={errors.customerName}
            />
            <Input
              label="Phone number"
              placeholder="01xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {submitted ? 'Added to cart ✓' : 'Add Custom Order'}
          </Button>
        </form>
      </div>
    </div>
  );
}
