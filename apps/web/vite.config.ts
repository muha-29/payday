import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',

            includeAssets: [
                'favicon.ico',
                'icons/icon-192.png',
                'icons/icon-512.png'
            ],

            manifest: {
                name: 'PayDay',
                short_name: 'PayDay',
                description: 'AI-powered personal finance assistant',
                theme_color: '#f97316',
                background_color: '#fff7ed',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },

            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) =>
                            request.destination === 'script' ||
                            request.destination === 'style' ||
                            request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'static-assets',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /\/api\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            networkTimeoutSeconds: 5,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            }
                        }
                    }
                ]
            }
        })
    ]
});