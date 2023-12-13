// Aller chercher les configurations de l'application
import 'dotenv/config';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
// Importer les fichiers et librairies
import express, { json, urlencoded } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cspOption from './csp-options.js'
import { getProduit } from './model/produit.js';
import { getPanier, addToPanier, removeFromPanier, emptyPanier } from './model/panier.js';
import { getCommande, soumettreCommande, modifyEtatCommande, getEtatCommande } from './model/commande.js';
import { validateId, validatePanier } from './validation.js';

// Création du serveur
const app = express();

// Configuration de l'engin de rendu
app.engine('handlebars', engine({
    helpers: {
        equals: (valeur1, valeur2) => valeur1 === valeur2
    }
}))
app.set('view engine', 'handlebars');
app.set('views', './views');

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  }));
  
// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy setup
passport.use(new LocalStrategy(async (username, password, done) => {
    // Replace this with your actual user authentication logic
    const user = await getUserByUsername(username);

    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
}));

// Passport serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Passport deserialize user
passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    done(null, user);
});

// Add routes for authentication (signup, login, logout)


// Route to render the login form
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' }); // Adjust the template and data as needed
});

// Route to render the logout form
app.get('/logout', (req, res) => {
    res.render('logout', { title: 'Logout' }); // Adjust the template and data as needed
});

// Route to render the signup form
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup' }); // Adjust the template and data as needed
});

// Route for signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Replace this with your actual user creation logic
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);

    // Log the user in after signup
    req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect('/');
    });
});

// Route for login
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

// Route for logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Routes

// Route de la page du menu
app.get('/', async (request, response) => {
    response.render('menu', {
        title: 'Menu',
        produit: await getProduit()
    });
});

// Route de la page du panier
app.get('/panier', async (request, response) => {
    let panier = await getPanier()
    response.render('panier', {
        title: 'Panier',
        produit: panier,
        estVide: panier.length <= 0
    });
});

// Route pour ajouter un élément au panier
app.post('/panier', async (request, response) => {
    if (validateId(request.body.idProduit)) {
        addToPanier(request.body.idProduit, 1);
        response.sendStatus(201);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour supprimer un élément du panier
app.patch('/panier', async (request, response) => {
    if (validateId(request.body.idProduit)) {
        removeFromPanier(request.body.idProduit);
        response.sendStatus(200);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour vider le panier
app.delete('/panier', async (request, response) => {
    emptyPanier();
    response.sendStatus(200);
});

// Route de la page des commandes
app.get('/commande', async (request, response) => {
    response.render('commande', {
        title: 'Commandes',
        commande: await getCommande(),
        etatCommande: await getEtatCommande()
    });
});

// Route pour soumettre le panier
app.post('/commande', async (request, response) => {
    if (await validatePanier()) {
        soumettreCommande();
        response.sendStatus(201);
    }
    else {
        response.sendStatus(400);
    }
});

// Route pour modifier l'état d'une commande
app.patch('/commande', async (request, response) => {
    if (validateId(request.body.idCommande) &&
        validateId(request.body.idEtatCommande)) {
        modifyEtatCommande(
            request.body.idCommande,
            request.body.idEtatCommande
        );
        response.sendStatus(200);
    }
    else {
        response.sendStatus(400);
    }
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
