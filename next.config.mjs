import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // ---------------------------------------------------------------------------
  // `output: 'export'` is what `npm run build` needs: a static export into out/,
  // which upload.js then ships. It conflicts with `next dev`, though — without a
  // server-side route table the client router cannot resolve a target, so a
  // <Link> fails silently after preventDefault and every button on the site looks
  // dead, with no error to explain why.
  //
  // So it is only turned on for the build: `next build` sets NODE_ENV to
  // production, `next dev` leaves it as development. Production behaviour is
  // exactly what it was.
  // ---------------------------------------------------------------------------
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  trailingSlash: true,
};

const withMDX = createMDX();

export default withMDX(config);
