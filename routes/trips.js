var express = require('express');
var router = express.Router();
const dataTrips = require('../trips');
const moment = require('moment');
const trip = require('../models/trips');
require('../models/connection');

/* GET trips listing. */
router.get('/', function (req, res, next) {
    try {
      //Récupération des paramètres de recherches
      const { depart, arrivee, jour } = req.query;

      //Vérification des paramètres de recherches
      if (!depart || !arrivee || !jour) {
        return res.status(400).json({
          result: false,
          error: "Veuillez renseigner depart, arrivee et jour"
        });
      }

      //Vérification du tableau des trajets
      if (!Array.isArray(dataTrips)) {
        throw new Error("dataTrips invalide");
      }
      
      //Formatage des données de recherches
      const cityDepart = depart.toLowerCase();
      const cityArrivee = arrivee.toLowerCase();
      const date = moment(jour).format("YYYY-MM-DD");

      //Recherche dans le tableau des trajets
      const Trips = dataTrips.filter(x =>
        x.departure.toLowerCase() === cityDepart &&
        x.arrival.toLowerCase() === cityArrivee &&
        moment(x.date.$date).format("YYYY-MM-DD") === date
      );
      //retour de la réponse
      res.status(200).json({
        result: true,
        trips: Trips
      });
      
    } catch (error) {
        console.error("Erreur /trips :", err);

        return res.status(500).json({
          result: false,
          error: "Erreur serveur interne"
        });
      }
});

// Ajout d'un trajet dans le panier /
router.post("/selectrip", async (req, res) => {
  try {
      // Vérification des champs obligatoires
      const { depart, arrivee, jour, prix } = req.body;
      if (!depart || !arrivee || !jour|| !prix) {
      //if (!depart || !arrivee || !prix) {
        return res.json({ result: false, error: "Le trajet n'est pas complet!" });
      }
       console.log(depart +" "+ arrivee +" "+ prix +" "+ jour);
      // Vérifie si le trajet existe déjà
      const TripExist = await trip.findOne({departure: { $regex: `^${depart}$`, $options: 'i' }, arrival: { $regex: `^${arrivee}$`, $options: 'i' },
        price: Number(prix), date: jour});
      console.log(TripExist);
      //date: {jour}, price: {prix}})
      if (TripExist) {return res.json({ result: false, error: "Ce trajet existe déjà" });
        }
      
        console.log(depart +" "+ arrivee +" "+ prix);
      // Création du trajet
      const newTrip = new trip({
                departure: depart,
                arrival: arrivee,
                date: jour,
                price: prix,
      });
      console.log(newTrip);
              
      const savedTrip= await newTrip.save();
      res.json({ result: true });
      }
  catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: "CREAT Database error", });        
  }
}); 

router.get('/panier', async function (req, res, next) {
    try { const TripPanier = await trip.find({etat: 0});
          return res.status(200).json({ result: true, trips: TripPanier });
        }
    catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: "RECUP PANIER Database error", });     
        }
});

router.get('/book', async function (req, res, next) {
    try { const TripPanier = await trip.find({etat: 1});
          return res.status(200).json({ result: true, trips: TripPanier });
        }
    catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: "RECUP BOOK Database error", });     
        }
});



module.exports = router;
