import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
<<<<<<< HEAD
        'process.env.API_KEY': JSON.stringify(env.SAMBA_NOVA_API_KEY),
        'process.env.SAMBA_NOVA_API_KEY': JSON.stringify(env.SAMBA_NOVA_API_KEY)
=======
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
>>>>>>> 7a769c05113dd62edce7b1ebd15670c2609e382f
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
<<<<<<< HEAD
});
=======
});
>>>>>>> 7a769c05113dd62edce7b1ebd15670c2609e382f
