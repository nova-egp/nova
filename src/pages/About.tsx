import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section className="bg-navy-800 text-cream-200">
        <div className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28">
          <p className="eyebrow text-gold mb-4">About NOVA</p>
          <h1 className="font-display text-4xl md:text-5xl max-w-xl leading-tight">
            A small studio, working in one material.
          </h1>
        </div>
        <div className="rail rail-light" />
      </section>

      <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-16">
        <div className="space-y-6 text-navy-600 leading-relaxed">
          <p>
            NOVA works in one material — resin — and one form, the T-Head, pushed
            in as many directions as the material allows: optically clear, folded
            with gold leaf, dense with glitter, or built entirely to a single
            person's brief.
          </p>
          <p>
            Every piece is cast, cured and finished by hand in small batches. We
            keep processing times honest — two to three days, not two to three
            hours — because that's what it actually takes to do this properly.
          </p>
          <p>
            The brand runs on restraint: navy, off-white, a little gold. The
            resin does the rest of the talking.
          </p>
        </div>
        <div className="aspect-[4/3] bg-cream-300 overflow-hidden">
          <img
            src="/assets/products/glitter-black-angle.png"
            alt="NOVA T-Head detail"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="bg-cream-300">
        <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-navy-800 mb-6">
            Ready to see one in the light?
          </h2>
          <Link to="/shop" className="btn-primary inline-flex">Shop T-Head</Link>
        </div>
      </section>
    </div>
  );
}
