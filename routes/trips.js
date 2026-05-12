var express = require('express');
var router = express.Router();
const dataTrips = require('../trips');
const moment = require('moment');

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
    console.error("Erreur /trips :", error);

    return res.status(500).json({
      result: false,
      error: "Erreur serveur interne"
    });
  }
});
module.exports = router;
