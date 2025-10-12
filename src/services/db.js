const fs = require('fs').promises;
const path = require('path');
const logger = require('loglevel');

const DB_PATH = path.join(__dirname, '../../data/db.json');

/**
 * Reads the database
 * @returns {Promise<Object>} The database data
 */
async function readDB() {
    try {
        logger.debug(`Reading database from: ${DB_PATH}`);
        const data = await fs.readFile(DB_PATH, 'utf8');
        const parsedData = JSON.parse(data);
        logger.debug(`Database successfully read with ${Object.keys(parsedData).length} collections`);
        return parsedData;
    } catch (error) {
        logger.error('Error reading the database:', error.message);
        throw error;
    }
}

/**
 * Writes to the database
 * @param {Object} databaseData - The data to write
 * @returns {Promise<void>}
 */
async function writeDB(databaseData) {
    try {
        logger.debug('Writing to database...');
        await fs.writeFile(DB_PATH, JSON.stringify(databaseData, null, 2), 'utf8');
        logger.info('Database successfully written');
    } catch (error) {
        logger.error('Error writing to the database:', error.message);
        throw error;
    }
}

/**
 * Gets all elements from a collection
 * @param {string} collectionName - Name of the collection (caves, bottles)
 * @returns {Promise<Array>} The collection elements
 */
async function getAllElementsFromCollection(collectionName) {
    logger.debug(`Getting all elements from collection: ${collectionName}`);
    const database = await readDB();
    const elements = database[collectionName] || [];
    logger.info(`Found ${elements.length} elements in collection: ${collectionName}`);
    return elements;
}

/**
 * Gets an element by its ID
 * @param {string} collectionName - Name of the collection
 * @param {number} elementId - ID of the element to find
 * @returns {Promise<Object|null>} The found element or null
 */
async function getElementById(collectionName, elementId) {
    logger.debug(`Getting element with ID ${elementId} from collection: ${collectionName}`);
    const database = await readDB();
    const collectionItems = database[collectionName] || [];
    const element = collectionItems.find(item => item.id === elementId) || null;

    if (element) {
        logger.info(`Element with ID ${elementId} found in collection: ${collectionName}`);
    } else {
        logger.warn(`Element with ID ${elementId} not found in collection: ${collectionName}`);
    }

    return element;
}

/**
 * Creates a new element
 * @param {string} collectionName - Name of the collection
 * @param {Object} newElementData - New element to add
 * @returns {Promise<Object>} The created element with its ID
 */
async function createElement(collectionName, newElementData) {
    logger.debug(`Creating new element in collection: ${collectionName}`);
    logger.debug('Element data:', newElementData);

    const database = await readDB();

    if (!database[collectionName]) {
        logger.warn(`Collection ${collectionName} does not exist, creating it...`);
        database[collectionName] = [];
    }

    const maxId = database[collectionName].length > 0
        ? Math.max(...database[collectionName].map(item => item.id || 0))
        : 0;

    const newId = maxId + 1;
    logger.debug(`Generated new ID: ${newId} for collection: ${collectionName}`);

    const elementWithId = {
        id: newId,
        ...newElementData,
        createdAt: new Date().toISOString()
    };

    database[collectionName].push(elementWithId);
    await writeDB(database);

    logger.info(`✅ Successfully created element with ID ${newId} in collection: ${collectionName}`);

    return elementWithId;
}

/**
 * Updates an existing element
 * @param {string} collectionName - Name of the collection
 * @param {string|number} elementId - ID of the element to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} The updated element or null if not found
 */
async function updateElement(collectionName, elementId, updateData) {
    logger.debug(`Updating element with ID ${elementId} in collection: ${collectionName}`);
    logger.debug('Update data:', updateData);

    const database = await readDB();
    const collectionItems = database[collectionName] || [];
    const elementIndex = collectionItems.findIndex(item => item.id === elementId);

    if (elementIndex === -1) {
        logger.warn(`Element with ID ${elementId} not found in collection: ${collectionName}`);
        return null;
    }

    collectionItems[elementIndex] = {
        ...collectionItems[elementIndex],
        ...updateData,
        id: collectionItems[elementIndex].id,
        updatedAt: new Date().toISOString()
    };

    database[collectionName] = collectionItems;
    await writeDB(database);

    logger.info(`✅ Successfully updated element with ID ${elementId} in collection: ${collectionName}`);

    return collectionItems[elementIndex];
}

/**
 * Removes an element
 * @param {string} collectionName - Name of the collection
 * @param {string|number} elementId - ID of the element to remove
 * @returns {Promise<boolean>} True if removed, false if not found
 */
async function removeElement(collectionName, elementId) {
    logger.debug(`Removing element with ID ${elementId} from collection: ${collectionName}`);

    const database = await readDB();
    const collectionItems = database[collectionName] || [];
    const initialLength = collectionItems.length;

    database[collectionName] = collectionItems.filter(item => item.id !== elementId);

    if (database[collectionName].length === initialLength) {
        logger.warn(`Element with ID ${elementId} not found in collection: ${collectionName}`);
        return false;
    }

    await writeDB(database);
    logger.info(`✅ Successfully removed element with ID ${elementId} from collection: ${collectionName}`);

    return true;
}

/**
 * Finds elements according to criteria
 * @param {string} collectionName - Name of the collection
 * @param {Function} predicateFunction - Filter function
 * @returns {Promise<Array>} The matching elements
 */
async function findElement(collectionName, predicateFunction) {
    logger.debug(`Finding elements in collection: ${collectionName} with custom predicate`);

    const database = await readDB();
    const collectionItems = database[collectionName] || [];
    const matchingElements = collectionItems.filter(predicateFunction);

    logger.info(`Found ${matchingElements.length} matching elements in collection: ${collectionName}`);

    return matchingElements;
}

/**
 * Récupère toutes les caves depuis la base de données
 * @returns {Promise<Array>} Liste des caves
 */
async function getCaves() {
    try {
        const data = await readDB()
        return data.caves || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des caves:', error);
        return [];
    }
}
/**
 * Crée une nouvelle collection dans la base de données
 * @param {string} collectionName - Nom de la collection à créer
 * @param {Array} [initialData=[]] - Données initiales optionnelles pour la collection
 * @returns {Promise<Object>} Objet représentant la base de données mise à jour avec la nouvelle collection
 */
async function createCollection(collectionName) {
    try {
        const data = await readDB();

        if (data[collectionName]) {
            throw new Error(`La collection ${collectionName} existe déjà`);
        }

        data[collectionName] = [];

        await writeDB(data);

        logger.info(`Collection ${collectionName} créée avec succès`);
        return data;
    } catch (error) {
        logger.error(`Erreur lors de la création de la collection ${collectionName}:`, error);
        throw error;
    }
}

async function getCollectionById(id) {
    try {
        const data = await readDB();

        if (!data.caves) {
            logger.warn("Collection 'caves' non trouvée dans la base de données");
            return null;
        }

        const cave = data.caves.find(cave => cave.id === id);

        if (!cave) {
            logger.warn(`Cave avec ID ${id} non trouvée`);
            return null;
        }

        return cave;
    } catch (error) {
        logger.error(`Erreur lors de la récupération de la cave avec ID ${id}:`, error);
        throw error;
    }
}



module.exports = {
    readDB,
    writeDB,
    createCollection,
    getAllElementsFromCollection,
    getElementById,
    createElement,
    updateElement,
    removeElement,
    getCollectionById,
    findElement,
    getCaves
};
