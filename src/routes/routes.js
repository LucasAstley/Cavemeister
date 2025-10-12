const express = require('express');
const router = express.Router();
const logger = require('loglevel');
const db = require('../services/db');

/**
 * @api {get} /api/caves Get all cellars
 * @apiName GetCaves
 * @apiGroup Caves
 * @apiDescription Retrieves all cellars from the database
 * @apiSuccess {Array} caves List of all cellars
 * @apiError (500) {Object} error Error message
 */
router.get('/api/caves', async (req, res) => {
    try {
        const caves = await db.getAllElementsFromCollection('caves');
        res.json(caves);
    } catch (error) {
        logger.error('Erreur lors de la récupération des caves:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des caves' });
    }
});

/**
 * @api {get} /api/caves/:id Get cellar by ID
 * @apiName GetCaveById
 * @apiGroup Caves
 * @apiDescription Retrieves a specific cellar by its ID
 * @apiParam {Number} id Cellar ID
 * @apiSuccess {Object} cave Cellar details
 * @apiError (404) {Object} error Cellar not found
 * @apiError (500) {Object} error Error message
 */
router.get('/api/caves/:id', async (req, res) => {
    try {
        const cave = await db.getElementById('caves', parseInt(req.params.id));
        if (!cave) {
            return res.status(404).json({ message: 'Cave non trouvée' });
        }
        res.json(cave);
    } catch (error) {
        logger.error(`Erreur lors de la récupération de la cave ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la cave' });
    }
});

/**
 * @api {post} /api/caves Create new cellar
 * @apiName CreateCave
 * @apiGroup Caves
 * @apiDescription Creates a new cellar
 * @apiBody {String} name Cellar name
 * @apiBody {String} location Cellar location
 * @apiBody {Number} capacity Cellar capacity
 * @apiBody {Number} temperature Cellar temperature
 * @apiBody {Number} humidity Cellar humidity level
 * @apiSuccess (201) {Object} cave Created cellar with ID
 * @apiError (500) {Object} error Error message
 */
router.post('/api/caves', async (req, res) => {
    try {
        const nouvelleCave = await db.createElement('caves', req.body);
        res.status(201).json(nouvelleCave);
    } catch (error) {
        logger.error('Erreur lors de la création de la cave:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la cave' });
    }
});

/**
 * @api {put} /api/caves/:id Update cellar
 * @apiName UpdateCave
 * @apiGroup Caves
 * @apiDescription Updates an existing cellar
 * @apiParam {Number} id Cellar ID
 * @apiBody {String} [name] Cellar name
 * @apiBody {String} [location] Cellar location
 * @apiBody {Number} [capacity] Cellar capacity
 * @apiBody {Number} [temperature] Cellar temperature
 * @apiBody {Number} [humidity] Cellar humidity level
 * @apiSuccess {Object} cave Updated cellar
 * @apiError (404) {Object} error Cellar not found
 * @apiError (500) {Object} error Error message
 */
router.put('/api/caves/:id', async (req, res) => {
    try {
        const caveModifiee = await db.updateElement('caves', parseInt(req.params.id), req.body);
        if (!caveModifiee) {
            return res.status(404).json({ message: 'Cave non trouvée' });
        }
        res.json(caveModifiee);
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour de la cave ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la cave' });
    }
});

/**
 * @api {delete} /api/caves/:id Delete cellar
 * @apiName DeleteCave
 * @apiGroup Caves
 * @apiDescription Deletes a cellar by its ID
 * @apiParam {Number} id Cellar ID
 * @apiSuccess {Object} message Success message
 * @apiError (404) {Object} error Cellar not found
 * @apiError (500) {Object} error Error message
 */
router.delete('/api/caves/:id', async (req, res) => {
    try {
        const suppression = await db.removeElement('caves', parseInt(req.params.id));
        if (!suppression) {
            return res.status(404).json({ message: 'Cave non trouvée' });
        }
        res.json({ message: 'Cave supprimée avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de la cave ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la cave' });
    }
});

/**
 * @api {get} /api/bouteilles Get all bottles
 * @apiName GetBottles
 * @apiGroup Bottles
 * @apiDescription Retrieves all bottles or bottles for a specific cellar
 * @apiQuery {Number} [caveId] Optional cellar ID to filter bottles
 * @apiSuccess {Array} bottles List of bottles
 * @apiError (500) {Object} error Error message
 */
router.get('/api/bouteilles', async (req, res) => {
    try {
        let bouteilles;
        if (req.query.caveId) {
            // Utiliser la collection 'bottles' qui est présente dans la base de données
            const allBouteilles = await db.getAllElementsFromCollection('bottles');
            bouteilles = allBouteilles
                .filter(bouteille =>
                    bouteille.caveId === parseInt(req.query.caveId)
                );
        } else {
            bouteilles = await db.getAllElementsFromCollection('bottles');
        }
        res.json(bouteilles);
    } catch (error) {
        logger.error('Erreur lors de la récupération des bouteilles:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des bouteilles' });
    }
});

/**
 * @api {get} /api/bouteilles/:id Get bottle by ID
 * @apiName GetBottleById
 * @apiGroup Bottles
 * @apiDescription Retrieves a specific bottle by its ID
 * @apiParam {Number} id Bottle ID
 * @apiSuccess {Object} bottle Bottle details
 * @apiError (404) {Object} error Bottle not found
 * @apiError (500) {Object} error Error message
 */
router.get('/api/bouteilles/:id', async (req, res) => {
    try {
        const bouteille = await db.getElementById('bottles', parseInt(req.params.id));
        if (!bouteille) {
            return res.status(404).json({ message: 'Bouteille non trouvée' });
        }
        res.json(bouteille);
    } catch (error) {
        logger.error(`Erreur lors de la récupération de la bouteille ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la bouteille' });
    }
});

/**
 * @api {post} /api/bouteilles Create new bottle
 * @apiName CreateBottle
 * @apiGroup Bottles
 * @apiDescription Creates a new bottle
 * @apiBody {String} name Bottle name
 * @apiBody {Number} caveId Cellar ID where the bottle is stored
 * @apiBody {String} [category] Bottle category
 * @apiBody {String} [subcategory] Bottle subcategory
 * @apiBody {Number} [year] Bottle year
 * @apiBody {String} [origin] Bottle origin
 * @apiBody {Number} [quantity=1] Quantity
 * @apiBody {Number} [volume] Volume in ml
 * @apiBody {Number} [alcoholContent] Alcohol content percentage
 * @apiSuccess (201) {Object} bottle Created bottle with ID
 * @apiError (500) {Object} error Error message
 */
router.post('/api/bouteilles', async (req, res) => {
    try {
        const nouvelleBouteille = await db.createElement('bottles', req.body);
        res.status(201).json(nouvelleBouteille);
    } catch (error) {
        logger.error('Erreur lors de la création de la bouteille:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la bouteille' });
    }
});

/**
 * @api {put} /api/bouteilles/:id Update bottle
 * @apiName UpdateBottle
 * @apiGroup Bottles
 * @apiDescription Updates an existing bottle
 * @apiParam {Number} id Bottle ID
 * @apiBody {String} [name] Bottle name
 * @apiBody {Number} [caveId] Cellar ID where the bottle is stored
 * @apiBody {String} [category] Bottle category
 * @apiBody {String} [subcategory] Bottle subcategory
 * @apiBody {Number} [year] Bottle year
 * @apiBody {String} [origin] Bottle origin
 * @apiBody {Number} [quantity] Quantity
 * @apiBody {Number} [volume] Volume in ml
 * @apiBody {Number} [alcoholContent] Alcohol content percentage
 * @apiSuccess {Object} bottle Updated bottle
 * @apiError (404) {Object} error Bottle not found
 * @apiError (500) {Object} error Error message
 */
router.put('/api/bouteilles/:id', async (req, res) => {
    try {
        const bouteilleModifiee = await db.updateElement('bottles', parseInt(req.params.id), req.body);
        if (!bouteilleModifiee) {
            return res.status(404).json({ message: 'Bouteille non trouvée' });
        }
        res.json(bouteilleModifiee);
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour de la bouteille ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la bouteille' });
    }
});

/**
 * @api {delete} /api/bouteilles/:id Delete bottle
 * @apiName DeleteBottle
 * @apiGroup Bottles
 * @apiDescription Deletes a bottle by its ID
 * @apiParam {Number} id Bottle ID
 * @apiSuccess {Object} message Success message
 * @apiError (404) {Object} error Bottle not found
 * @apiError (500) {Object} error Error message
 */
router.delete('/api/bouteilles/:id', async (req, res) => {
    try {
        const suppression = await db.removeElement('bottles', parseInt(req.params.id));
        if (!suppression) {
            return res.status(404).json({ message: 'Bouteille non trouvée' });
        }
        res.json({ message: 'Bouteille supprimée avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de la bouteille ${req.params.id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la bouteille' });
    }
});

module.exports = router;