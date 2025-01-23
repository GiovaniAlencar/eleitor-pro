import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Aqui você pode adicionar as opções de build
    rollupOptions: {
      output: {
        // Manualmente dividir os chunks
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react'; // Cria um chunk separado para o React
          }
          if (id.includes('node_modules/lodash')) {
            return 'lodash'; // Cria um chunk separado para o Lodash
          }
        }
      }
    },
    // Aumentar o limite de chunk (em kilobytes)
    chunkSizeWarningLimit: 100000 // Por exemplo, 1000KB (1MB)
  }
});
