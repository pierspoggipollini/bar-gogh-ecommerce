
import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'
import { onRequest } from "firebase-functions/v2/https";

//Routers
import { usersRouter } from "./routes/users/index.js";
import { productsRouter } from "./routes/products/index.js";
import { dashboardRouter } from "./routes/dashboard/index.js";
import { newsletterRouter } from "./routes/newsletter/index.js";
import { checkoutRouter } from "./routes/checkout/index.js";
import { csrfRouter } from "./routes/middleware/index.js";
import { stripeRouter } from "./routes/stripe/index.js";
import {  contactRouter } from "./routes/contact-us/index.js";
import * as dotenv from 'dotenv'

const app = express();

const ENV = process.env.NODE_ENV || 'stag';
dotenv.config({ path: `.env.${ENV}` });


// CORS options to allow requests from specific origin and credentials
const corsOptions = {
    origin: true, //process.env.PUBLIC_URL,// Replace this with your frontend URL
    credentials: true, // Allow sending credentials (cookies)
};

// Enable CORS middleware with specified options
app.use(cors(corsOptions));

// Parse cookies in incoming requests
app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Cookies ricevuti:', req.cookies);
    res.on('finish', () => {
        console.log('Cookies inviati:', res.getHeaders()['set-cookie']);
    });
    next();
});


// Middleware to set response headers for CORS and content type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8');
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

//creating a function to return the html based on the route
function createHtmlData(title, desp, url, img) {
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta charset="UTF-8" />
     <link rel="icon" type="image" href="src//components//images/logo//logo.png" />
    <meta name="theme-color" content="#000" />
    <meta name="description" content="${desp}" />
    <title>${title}</title>
    <meta name="description" content="${desp}" />
     <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description"
    content="${desp}" />
  <meta property="og:image" content="${img}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"></script>
    <script defer="defer" src="/static/js/main.js"></script>
    <link href="/static/css/main.css" rel="stylesheet" />
  </head>
  <body>
     <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGFNXMB5" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <div id="root"></div>
  <div id="cart-notification-root"></div>
  <script type="module" src="/src/main.jsx"></script>
    <div id="root"></div>
  </body>
</html>
`;
}

// Gestisci la richiesta GET per la home page rendendo server-side
/* app.get('/', (req, res) => {
    const htmlData = createHtmlData(
        "Bar Gogh - Herbal Teas and Herbs",
        "Explore herbal teas and herbs at Bar Gogh: organic teas, infusions, and natural remedies for daily wellness. Discover the flavors and benefits of the botanical world.",
        process.env.PUBLIC_URL,
        "https://tse1.mm.bing.net/th?id=OIG2.SziC5ae_i_qXQiVXiOre&pid=ImgGn"
    );

    // Leggi il file index.html dal build di React
    const indexPath = path.join(__dirname, 'build', 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Sostituisci il div con id="root" nell'HTML di React con il nuovo HTML generato server-side
        const modifiedHtml = data.replace(
            '<div id="root"></div>',
            `<div id="root">${htmlData}</div>`
        );

        // Invia il file HTML modificato con i metatag dinamici
        res.send(modifiedHtml);
    });
}); */

// Routes requiring authentication
app.use('', usersRouter);

// Use the products router with path /products
app.use('/products', productsRouter);

// Use the dashboard router with path /dashboard
app.use('/dashboard', dashboardRouter);

// Use the newsletter router with path /newsletter
app.use('/newsletter', newsletterRouter);

// Use the contact router with path /contact
app.use('', contactRouter);

// Use the checkout router with path /checkout
app.use('/checkout', checkoutRouter);

// Use the csrf router with path /csrf-token
app.use('/csrf-token', csrfRouter);

// Use the stripe router with path /stripe
app.use('', stripeRouter);

// Export the Express app wrapped with Firebase onRequest handler
export const api = onRequest(app);
