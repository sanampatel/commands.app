import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Commands that were removed or renamed keep their old URLs working.
  async redirects() {
    return [
      // `sanctum:install` never existed; Sanctum is installed with `install:api`.
      { source: "/laravel/laravel-sanctum-install", destination: "/laravel/artisan-install-api", permanent: true },
      // Filament has no make:filament-page-action / make:filament-table-action commands.
      { source: "/filament/filament-make-page-action", destination: "/filament/filament-page", permanent: true },
      { source: "/filament/filament-make-table-action", destination: "/filament/filament-resource", permanent: true },
    ];
  },
};

export default nextConfig;
