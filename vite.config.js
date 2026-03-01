import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        origin: 'http://localhost:5173',
        cors: {
            origin: /^https?:\/\/localhost(:\d+)?$/,
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/@tanstack/react-virtual')) {
                        return 'vendor-virtual';
                    }

                    if (id.includes('node_modules/lucide-react')) {
                        return 'vendor-icons';
                    }

                    if (id.includes('node_modules/@headlessui/react')) {
                        return 'vendor-headlessui';
                    }

                    return undefined;
                },
            },
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
});
