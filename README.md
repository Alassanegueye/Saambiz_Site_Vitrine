# SaamBiz — site public et vitrines des boutiques

Site de présentation de la marketplace et sites des boutiques
(`saambiz.com/b/<slug>`). React 19 + Vite, déployé en fichiers statiques
servis par le Nginx du serveur.

API : `https://api.saambiz.com`

## Démarrer en local

```bash
cp .env.example .env     # puis ajuster si besoin
npm install
npm run dev              # http://localhost:5199
```

Le port 5199 est imposé (`strictPort`). En développement, laisser
`VITE_API_BASE_URL` **vide** : Vite proxifie `/saambiz` vers
`localhost:5000`, le navigateur ne voit qu'une seule origine, et il n'y a donc
aucune origine à ajouter au `CORS_ORIGIN` du backend.

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Vite sur le port 5199, avec proxy vers l'API locale |
| `npm run build` | produit `dist/` — c'est le déploiement |
| `npm run lint` | ESLint |
| `npm run preview` | sert `dist/` localement |

## Variables d'environnement

Les variables `VITE_*` sont compilées dans le bundle livré au navigateur :
aucune n'est secrète, et c'est pourquoi `.env.production` est versionné.

| Fichier | Quand | Versionné |
|---|---|---|
| `.env.example` | modèle à recopier en `.env` | oui |
| `.env` | développement local | non |
| `.env.production` | `npm run build` | oui |

| Variable | Rôle |
|---|---|
| `VITE_API_BASE_URL` | **origine seule** de l'API, sans `/saambiz/v1` |
| `VITE_DASHBOARD_URL` | espace vendeur, lié depuis la navigation |
| `VITE_LIEN_ANDROID` / `VITE_LIEN_IOS` | liens vers les stores ; vides, l'encart affiche « Bientôt sur… » |

⚠️ `VITE_API_BASE_URL` porte l'**origine seule**. `src/boutique/api.js`
construit `${VITE_API_BASE_URL}/saambiz/v1` : ajouter le suffixe ici donnerait
`/saambiz/v1/saambiz/v1` et un 404 sur chaque appel. La convention diffère de
celle de l'administration et de l'espace vendeur, qui passent l'adresse
complète.

## Une seule origine canonique

Le site est servi sur `saambiz.com`, et `www.saambiz.com` y est redirigé en
301. Ce n'est pas une préférence esthétique : le `CORS_ORIGIN` du backend
liste des origines exactes. Servir le site sous les deux noms obligerait à y
déclarer les deux, et un oubli donne une erreur réseau sans message —
l'API refuse, la vitrine reste vide. `VITRINE_BASE_URL` du backend, qui
construit les adresses de boutique partagées sur WhatsApp, vaut lui aussi le
domaine nu.

## Déploiement

Pousser sur `main` suffit : [`deploy.yml`](.github/workflows/deploy.yml) lance
le lint et le build, et ne déploie que si les deux passent. Le déploiement se
connecte en SSH au VPS, met le dépôt à jour, reconstruit, puis vérifie que le
site répond — accueil **et** adresse de vitrine, cette seconde étant le test
du `try_files`.

Secrets à configurer une fois dans ce dépôt (Settings → Secrets and variables
→ Actions) :

| Secret | Valeur |
|---|---|
| `VPS_HOST` | adresse du serveur |
| `VPS_USER` | utilisateur SSH |
| `VPS_SSH_KEY` | clé privée SSH, la publique étant dans `~/.ssh/authorized_keys` du serveur |

### Première installation sur le serveur

Le workflow met à jour, il ne clone jamais : un premier passage à la main est
nécessaire.

```bash
mkdir -p /var/www/saambiz-vitrine
git clone https://github.com/Alassanegueye/Saambiz_Site_Vitrine.git /var/www/saambiz-vitrine
cd /var/www/saambiz-vitrine
docker run --rm -v /var/www/saambiz-vitrine:/app -w /app node:22-slim \
  sh -c "npm ci --no-audit --no-fund && npm run build"
```

Le build tourne dans un conteneur jetable : le serveur n'a pas besoin de Node.

Puis Nginx, en deux temps — `deploy/nginx.conf` référence les certificats
Let's Encrypt, qui n'existent pas encore :

```bash
cp deploy/nginx-http.conf /etc/nginx/sites-available/saambiz-vitrine
sed -i "s/YOUR_DOMAIN/saambiz.com/g" /etc/nginx/sites-available/saambiz-vitrine
ln -sf /etc/nginx/sites-available/saambiz-vitrine /etc/nginx/sites-enabled/saambiz-vitrine
nginx -t && systemctl reload nginx
certbot --nginx -d saambiz.com -d www.saambiz.com
```

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/saambiz-vitrine
sed -i "s/YOUR_DOMAIN/saambiz.com/g" /etc/nginx/sites-available/saambiz-vitrine
nginx -t && systemctl reload nginx
```

`nginx -t` avant chaque `reload`, sans exception : Nginx est partagé, et un
seul fichier invalide empêche de recharger **tous** les sites de la machine.

### Mise à jour manuelle

```bash
cd /var/www/saambiz-vitrine && git pull && docker run --rm -v /var/www/saambiz-vitrine:/app -w /app node:22-slim sh -c "npm ci --no-audit --no-fund && npm run build"
```

Rien à redémarrer : Nginx sert `dist/` directement.

### Si une vitrine répond 404

`/b/<slug>` renvoie 404 : le `try_files` de la configuration Nginx n'est pas
actif. C'est la panne la plus coûteuse de ce projet — tous les liens de
boutique partagés sur WhatsApp cassent d'un coup, alors que la page d'accueil,
elle, répond parfaitement.
