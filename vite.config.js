import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import css from "vite-plugin-css";
import dotenv from "dotenv";
/* import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePluginNode } from "vite-plugin-node"; */

// https://vitejs.dev/config/
/* export default defineConfig({
  plugins: [react(), /* nodePolyfills(), css]
}) */

// Load environment variables based on the build mode
const loadEnv = (mode) => {
  // Determine which .env file to load based on the build mode ('production' or 'staging')
  const envFile = mode === 'production' ? '.env.prod' : '.env.stag';

  // Load and parse the environment variables from the specified .env file
  const env = dotenv.config({ path: envFile }).parsed;

  // Return the parsed environment variables
  return env;
};

// Get the build mode from process.env.NODE_ENV or default to 'development'
const mode = process.env.NODE_ENV || 'stag';

// Main configuration for Vite
export default defineConfig({
  plugins: [
    react(), // Enable React support
    css  // Enable CSS modules support
  ],
  optimizeDeps: {
    exclude: ['swiper'],
  },
  build: {
    // Other build options can be configured here
  },
  // Define process.env variables to be used in the frontend based on the loaded environment
  define: {
    'process.env': loadEnv(mode) // Load environment variables using loadEnv function
  }
});
