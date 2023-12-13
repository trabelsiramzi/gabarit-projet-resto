// Aller chercher les configurations de l'application
import 'dotenv/config';

// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js';
import { getProduit } from './model/produit.js';
import { getPanier, addToPanier, removeFromPanier, emptyPanier } from './model/panier.js';
import { getCommande, soumettreCommande, modifyEtatCommande, getEtatCommande } from './model/commande.js';
import { validateId, validatePanier } from './validation.js';
import loginRoute from './routes/login.js';
import signupRoute from './routes/signup.js';
import { isAuthenticated } from './middleware/authMiddleware.js';
import { isAdmin } from './middleware/authorizationMiddleware.js';
// Création du serveur
const app = express();

// Configuration de l'engin de rendu
app.engine('handlebars', engine({
    helpers: {
        equals: (valeur1, valeur2) => valeur1 === valeur2
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));

// Add login and signup routes
app.use(loginRoute);
app.use(signupRoute);

// Route de la page du menu
app.get('/', async (request, response) => {
    response.render('menu', {
        title: 'Menu',
        produit: await getProduit()
    });
});

// Route de la page du panier
app.get('/panier', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    let panier = await getPanier();
    response.render('panier', {
        title: 'Panier',
        produit: panier,
        estVide: panier.length <= 0
    });
});

// Route pour ajouter un élément au panier
app.post('/panier', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    if (validateId(request.body.idProduit)) {
        addToPanier(request.body.idProduit, 1);
        response.sendStatus(201);
    } else {
        response.sendStatus(400);
    }
});

// Route pour supprimer un élément du panier
app.patch('/panier', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    if (validateId(request.body.idProduit)) {
        removeFromPanier(request.body.idProduit);
        response.sendStatus(200);
    } else {
        response.sendStatus(400);
    }
});

// Route pour vider le panier
app.delete('/panier', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    emptyPanier();
    response.sendStatus(200);
});

// Route de la page des commandes
app.get('/commande', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    response.render('commande', {
        title: 'Commandes',
        commande: await getCommande(),
        etatCommande: await getEtatCommande()
    });
});

// Route pour soumettre le panier
app.post('/commande', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    if (await validatePanier()) {
        soumettreCommande();
        response.sendStatus(201);
    } else {
        response.sendStatus(400);
    }
});

// Route pour modifier l'état d'une commande
app.patch('/commande', isAuthenticated, async (request, response) => {
    // Only authenticated users can access this route
    if (validateId(request.body.idCommande) && validateId(request.body.idEtatCommande)) {
        modifyEtatCommande(
            request.body.idCommande,
            request.body.idEtatCommande
        );
        response.sendStatus(200);
    } else {
        response.sendStatus(400);
    }
});

// Route pour voir toutes les commandes soumises dans le système (accessible seulement par un administrateur)
app.get('/admin/commandes', isAuthenticated, isAdmin, async (request, response) => {
    // Only authenticated users with admin role can access this route
    // Your existing code for displaying the admin commandes page
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(request.originalUrl + ' not found.');
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.info(`Serveurs démarré:`);
console.info(`http://localhost:${ process.env.PORT }`);
