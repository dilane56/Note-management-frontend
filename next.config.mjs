/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les erreurs TypeScript font échouer le build (elles étaient auparavant ignorées).
  typescript: {
    ignoreBuildErrors: false,
  },
  // Aucun ESLint n'est configuré dans le projet : la vérification passe par `npm run typecheck`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
}

export default nextConfig
