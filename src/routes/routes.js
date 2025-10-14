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
        logger.debug('Fetching all cellars');
        const caves = await db.getAllElementsFromCollection('caves');
        logger.info(`Successfully retrieved ${caves.length} cellars`);
        res.json(caves);
    } catch (error) {
        logger.error('Error retrieving cellars:', error);
        res.status(500).json({ message: 'Error retrieving cellars' });
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
        const caveId = parseInt(req.params.id);
        logger.debug(`Fetching cellar with ID: ${caveId}`);
        const cave = await db.getElementById('caves', caveId);
        if (!cave) {
            logger.warn(`Cellar not found with ID: ${caveId}`);
            return res.status(404).json({ message: 'Cellar not found' });
        }
        logger.info(`Successfully retrieved cellar: ${cave.name}`);
        res.json(cave);
    } catch (error) {
        logger.error(`Error retrieving cellar ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error retrieving cellar' });
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
        logger.debug('Creating new cellar:', req.body);
        const nouvelleCave = await db.createElement('caves', req.body);
        logger.info(`Successfully created cellar: ${nouvelleCave.name} (ID: ${nouvelleCave.id})`);
        res.status(201).json(nouvelleCave);
    } catch (error) {
        logger.error('Error creating cellar:', error);
        res.status(500).json({ message: 'Error creating cellar' });
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
        const caveId = parseInt(req.params.id);
        logger.debug(`Updating cellar ID: ${caveId}`, req.body);
        const caveModifiee = await db.updateElement('caves', caveId, req.body);
        if (!caveModifiee) {
            logger.warn(`Cellar not found for update with ID: ${caveId}`);
            return res.status(404).json({ message: 'Cellar not found' });
        }
        logger.info(`Successfully updated cellar: ${caveModifiee.name} (ID: ${caveId})`);
        res.json(caveModifiee);
    } catch (error) {
        logger.error(`Error updating cellar ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error updating cellar' });
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
        const caveId = parseInt(req.params.id);
        logger.debug(`Deleting cellar with ID: ${caveId}`);
        const suppression = await db.removeElement('caves', caveId);
        if (!suppression) {
            logger.warn(`Cellar not found for deletion with ID: ${caveId}`);
            return res.status(404).json({ message: 'Cellar not found' });
        }
        logger.info(`Successfully deleted cellar with ID: ${caveId}`);
        res.json({ message: 'Cellar deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting cellar ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting cellar' });
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
            const caveId = parseInt(req.query.caveId);
            logger.debug(`Fetching bottles for cellar ID: ${caveId}`);
            const allBouteilles = await db.getAllElementsFromCollection('bottles');
            bouteilles = allBouteilles.filter(bouteille => bouteille.caveId === caveId);
            logger.info(`Successfully retrieved ${bouteilles.length} bottles for cellar ID: ${caveId}`);
        } else {
            logger.debug('Fetching all bottles');
            bouteilles = await db.getAllElementsFromCollection('bottles');
            logger.info(`Successfully retrieved ${bouteilles.length} bottles`);
        }
        res.json(bouteilles);
    } catch (error) {
        logger.error('Error retrieving bottles:', error);
        res.status(500).json({ message: 'Error retrieving bottles' });
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
        const bottleId = parseInt(req.params.id);
        logger.debug(`Fetching bottle with ID: ${bottleId}`);
        const bouteille = await db.getElementById('bottles', bottleId);
        if (!bouteille) {
            logger.warn(`Bottle not found with ID: ${bottleId}`);
            return res.status(404).json({ message: 'Bottle not found' });
        }
        logger.info(`Successfully retrieved bottle: ${bouteille.name}`);
        res.json(bouteille);
    } catch (error) {
        logger.error(`Error retrieving bottle ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error retrieving bottle' });
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
        logger.debug('Creating new bottle:', req.body);
        const nouvelleBouteille = await db.createElement('bottles', req.body);
        logger.info(`Successfully created bottle: ${nouvelleBouteille.name} (ID: ${nouvelleBouteille.id})`);
        res.status(201).json(nouvelleBouteille);
    } catch (error) {
        logger.error('Error creating bottle:', error);
        res.status(500).json({ message: 'Error creating bottle' });
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
        const bottleId = parseInt(req.params.id);
        logger.debug(`Updating bottle ID: ${bottleId}`, req.body);
        const bouteilleModifiee = await db.updateElement('bottles', bottleId, req.body);
        if (!bouteilleModifiee) {
            logger.warn(`Bottle not found for update with ID: ${bottleId}`);
            return res.status(404).json({ message: 'Bottle not found' });
        }
        logger.info(`Successfully updated bottle: ${bouteilleModifiee.name} (ID: ${bottleId})`);
        res.json(bouteilleModifiee);
    } catch (error) {
        logger.error(`Error updating bottle ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error updating bottle' });
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
        const bottleId = parseInt(req.params.id);
        logger.debug(`Deleting bottle with ID: ${bottleId}`);
        const suppression = await db.removeElement('bottles', bottleId);
        if (!suppression) {
            logger.warn(`Bottle not found for deletion with ID: ${bottleId}`);
            return res.status(404).json({ message: 'Bottle not found' });
        }
        logger.info(`Successfully deleted bottle with ID: ${bottleId}`);
        res.json({ message: 'Bottle deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting bottle ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting bottle' });
    }
});

module.exports = router;