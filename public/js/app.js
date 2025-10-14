document.addEventListener('DOMContentLoaded', function () {
    fetchCaves();
    initBottleForm();
});


/**
 * Initializes the bottle form and modal
 */
function initBottleForm() {
    const modal = document.getElementById('add-bottle-modal');
    const addBottleBtn = document.getElementById('add-bottle-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-add-bottle');
    const addBottleForm = document.getElementById('add-bottle-form');
    populateCaveSelect();


    addBottleBtn.addEventListener('click', function () {
        modal.classList.add('active');
    });


    function closeModal() {
        modal.classList.remove('active');
        addBottleForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);


    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    addBottleForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(addBottleForm);
        const bottleData = {};

        formData.forEach((value, key) => {
            bottleData[key] = value;
        });

        addBottle(bottleData, closeModal);
    });
}

/**
 * Populates the cave select dropdown
 */
function populateCaveSelect() {
    const caveSelect = document.getElementById('cave-select');

    fetch('/api/caves')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des caves');
            }
            return response.json();
        })
        .then(caves => {
            caveSelect.innerHTML = '<option value="">Sélectionner une cave</option>';

            caves.forEach(cave => {
                const option = document.createElement('option');
                option.value = cave.id;
                option.textContent = `${cave.name} (${cave.location})`;
                caveSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            caveSelect.innerHTML = '<option value="">Erreur de chargement des caves</option>';
        });
}

/**
 * Adds a new bottle to a cellar
 * @param {Object} bottleData - The bottle data to add
 * @param {Function} callback - Function to call after successful addition
 * @returns {Promise<Object>} - The newly created bottle
 */
function addBottle(bottleData, callback) {
    if (bottleData.caveId) {
        bottleData.caveId = parseInt(bottleData.caveId);
    }

    if (bottleData.year && bottleData.year !== '') bottleData.year = parseInt(bottleData.year);
    if (bottleData.quantity) bottleData.quantity = parseInt(bottleData.quantity);

    return fetch('/api/bouteilles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bottleData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error adding bottle');
                });
            }
            return response.json();
        })
        .then(data => {
            const newBottle = data;
            displayNotification(`Bottle "${newBottle.name}" added successfully!`, 'success');

            if (currentCaveId) {
                fetchBottlesForCave(currentCaveId);
            }

            if (callback) callback();
            return data;
        })
        .catch(error => {
            console.error('Add error:', error);
            displayNotification(`Error: ${error.message}`, 'error');
            throw error;
        });
}

let currentCaveId = null;

/**
 * Fetches the list of cellars from the API
 */
function fetchCaves() {
    fetch('/api/caves')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des caves');
            }
            return response.json();
        })
        .then(caves => {
            displayCaves(caves);
        })
        .catch(error => {
            console.error('Erreur de récuperation:', error);
            document.getElementById('caves-list').innerHTML =
                `<div class="col-span-3 text-center p-4 text-red-500">
                    Erreur lors du chargement des caves: ${error.message}
                </div>`;
        });
}

/**
 * Displays cellars in the interface
 * @param {Array} caves - List of cellars to display
 */
function displayCaves(caves) {
    const cavesContainer = document.getElementById('caves-list');

    if (!caves || caves.length === 0) {
        cavesContainer.innerHTML = '<div class="col-span-3 text-center p-4">Aucune cave trouvée</div>';
        return;
    }

    cavesContainer.innerHTML = '';

    caves.forEach(cave => {
        const caveCard = document.createElement('div');
        caveCard.className = 'bg-amber-100 p-4 rounded-lg shadow transition-transform hover:shadow-lg hover:scale-105';
        caveCard.innerHTML = `
            <h3 class="text-xl font-bold mb-2 text-amber-800">${cave.name}</h3>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Emplacement:</span> ${cave.location}</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Capacité:</span> ${cave.capacity} bouteilles</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Température:</span> ${cave.temperature}°C</p>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Humidité:</span> ${cave.humidity}%</p>
            <button 
                data-cave-id="${cave.id}" 
                class="mt-3 bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full view-cave-btn">
                Voir les bouteilles
            </button>
        `;
        cavesContainer.appendChild(caveCard);
    });


    document.querySelectorAll('.view-cave-btn').forEach(button => {
        button.addEventListener('click', function () {
            const caveId = parseInt(this.getAttribute('data-cave-id'));
            currentCaveId = caveId;
            fetchBottlesForCave(caveId);
        });
    });
}

/**
 * Fetches bottles for a specific cellar
 * @param {number} caveId - ID of the cellar
 */
function fetchBottlesForCave(caveId) {
    fetch(`/api/bouteilles?caveId=${caveId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des bouteilles');
            }
            return response.json();
        })
        .then(data => {
            displayBottles(data);
        })
        .catch(error => {
            console.error('Erreur de récupération:', error);
            document.getElementById('bouteilles-container').innerHTML =
                `<div class="text-center p-4 text-red-500">
                    Erreur lors du chargement des bouteilles: ${error.message}
                </div>`;
        });
}


/**
 * Displays bottles from a cellar
 * @param {Array} bouteilles - Array of bottles to display
 */
function displayBottles(bouteilles) {
    const bouteillesContainer = document.getElementById('bouteilles-container');

    const selectedCaveElement = document.querySelector(`[data-cave-id="${currentCaveId}"]`);
    const caveName = selectedCaveElement ?
        selectedCaveElement.closest('div').querySelector('h3').textContent :
        'Cave sélectionnée';

    bouteillesContainer.innerHTML = `
        <h3 class="text-xl font-semibold mb-3">Bouteilles dans ${caveName}</h3>
    `;

    if (!bouteilles || bouteilles.length === 0) {
        bouteillesContainer.innerHTML += '<p class="text-center p-4">Aucune bouteille dans cette cave</p>';
        return;
    }

    const table = document.createElement('div');
    table.className = 'overflow-x-auto';
    table.innerHTML = `
        <table class="min-w-full bg-white border border-gray-200">
            <thead>
                <tr class="bg-amber-100">
                    <th class="py-2 px-3 border text-left">Nom</th>
                    <th class="py-2 px-3 border text-left">Catégorie</th>
                    <th class="py-2 px-3 border text-left">Année</th>
                    <th class="py-2 px-3 border text-left">Origine</th>
                    <th class="py-2 px-3 border text-left">Quantité</th>
                    <th class="py-2 px-3 border text-left">Actions</th>
                </tr>
            </thead>
            <tbody id="bouteilles-liste">
            </tbody>
        </table>
    `;

    bouteillesContainer.appendChild(table);
    const tbody = document.getElementById('bouteilles-liste');

    bouteilles.forEach(bouteille => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-amber-50 transition-colors';

        const year = bouteille.year ? bouteille.year : '';

        tr.innerHTML = `
            <td class="py-2 px-3 border">${bouteille.name || ''}</td>
            <td class="py-2 px-3 border">${bouteille.category || ''} ${bouteille.subcategory ? `(${bouteille.subcategory})` : ''}</td>
            <td class="py-2 px-3 border">${year}</td>
            <td class="py-2 px-3 border">${bouteille.origin || ''}</td>
            <td class="py-2 px-3 border">${bouteille.quantity || 0}</td>
            <td class="py-2 px-3 border">
                <button class="edit-bottle-btn bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs mr-1" data-id="${bouteille.id}">
                    Modifier
                </button>
                <button class="delete-bottle-btn bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-xs" data-id="${bouteille.id}">
                    Supprimer
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });


    document.querySelectorAll('.edit-bottle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bottleId = this.getAttribute('data-id');
            editBottle(bottleId);
        });
    });

    document.querySelectorAll('.delete-bottle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bottleId = this.getAttribute('data-id');
            if (confirm('Êtes-vous sûr de vouloir supprimer cette bouteille ?')) {
                deleteBottle(bottleId);
            }
        });
    });
}

/**
 * Opens a modal to edit a bottle
 * @param {number|string} bottleId - ID of the bottle to edit
 */
function editBottle(bottleId) {
    // Fetch bottle details
    fetch(`/api/bouteilles/${bottleId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error retrieving bottle details');
            }
            return response.json();
        })
        .then(bottle => {

            const editModal = document.createElement('div');
            editModal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50';
            editModal.id = 'edit-bottle-modal';

            editModal.innerHTML = `
                <div class="bg-white rounded-lg p-6 w-full max-w-md">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold">Modifier la bouteille</h2>
                        <button id="close-edit-modal" class="text-gray-600 hover:text-gray-800">&times;</button>
                    </div>
                    <form id="edit-bottle-form">
                        <input type="hidden" name="id" value="${bottle.id}">
                        <input type="hidden" name="caveId" value="${bottle.caveId}">
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-name">
                                Nom
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="edit-name" name="name" type="text" value="${bottle.name || ''}">
                        </div>
                        
                        <div class="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-category">
                                    Catégorie
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="edit-category" name="category" type="text" value="${bottle.category || ''}">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-subcategory">
                                    Sous-catégorie
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="edit-subcategory" name="subcategory" type="text" value="${bottle.subcategory || ''}">
                            </div>
                        </div>
                        
                        <div class="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-year">
                                    Année
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="edit-year" name="year" type="number" value="${bottle.year || ''}">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-quantity">
                                    Quantité
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="edit-quantity" name="quantity" type="number" value="${bottle.quantity || 1}" min="1">
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-origin">
                                Origine
                            </label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="edit-origin" name="origin" type="text" value="${bottle.origin || ''}">
                        </div>
                        
                        <div class="flex items-center justify-between mt-6">
                            <button id="cancel-edit-bottle" type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Annuler
                            </button>
                            <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Sauvegarder
                            </button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(editModal);

            document.getElementById('close-edit-modal').addEventListener('click', () => {
                document.body.removeChild(editModal);
            });

            document.getElementById('cancel-edit-bottle').addEventListener('click', () => {
                document.body.removeChild(editModal);
            });

            document.getElementById('edit-bottle-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const bottleData = {};

                formData.forEach((value, key) => {
                    bottleData[key] = value;
                });

                updateBottle(bottleId, bottleData);
                document.body.removeChild(editModal);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification(`Error: ${error.message}`, 'error');
        });
}

/**
 * Updates a bottle with new data
 * @param {number|string} bottleId - ID of the bottle to update
 * @param {Object} bottleData - New bottle data
 * @returns {Promise<Object>} - The updated bottle
 */
function updateBottle(bottleId, bottleData) {
    bottleId = parseInt(bottleId);

    if (isNaN(bottleId)) {
        displayNotification('Invalid bottle ID', 'error');
        return Promise.reject(new Error('Invalid bottle ID'));
    }

    const updatedData = { ...bottleData };

    if (updatedData.id) updatedData.id = parseInt(updatedData.id);
    if (updatedData.caveId) updatedData.caveId = parseInt(updatedData.caveId);
    if (updatedData.year && updatedData.year !== '') updatedData.year = parseInt(updatedData.year);
    if (updatedData.quantity) updatedData.quantity = parseInt(updatedData.quantity);
    if (updatedData.volume) updatedData.volume = parseInt(updatedData.volume);
    if (updatedData.alcoholContent) updatedData.alcoholContent = parseFloat(updatedData.alcoholContent);

    if (!updatedData.name) {
        displayNotification('Bottle name is required', 'error');
        return Promise.reject(new Error('Bottle name required'));
    }

    return fetch(`/api/bouteilles/${bottleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error updating bottle');
                });
            }
            return response.json();
        })
        .then(data => {
            displayNotification('Bottle updated successfully!', 'success');

            if (currentCaveId) {
                fetchBottlesForCave(currentCaveId);
            }

            return data;
        })
        .catch(error => {
            console.error('Update error:', error);
            displayNotification(`Error: ${error.message}`, 'error');
            throw error;
        });
}


/**
 * Deletes a bottle
 * @param {number|string} bottleId - ID of the bottle to delete
 * @returns {Promise<Object>} - Response from the server
 */
function deleteBottle(bottleId) {
    bottleId = parseInt(bottleId);

    if (isNaN(bottleId)) {
        displayNotification('Invalid bottle ID', 'error');
        return Promise.reject(new Error('Invalid bottle ID'));
    }

    return fetch(`/api/bouteilles/${bottleId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error deleting bottle');
                });
            }
            return response.json();
        })
        .then(data => {
            displayNotification('Bottle deleted successfully!', 'success');

            if (currentCaveId) {
                fetchBottlesForCave(currentCaveId);
            }
            return data;
        })
        .catch(error => {
            console.error('Delete error:', error);
            displayNotification(`Error: ${error.message}`, 'error');
            throw error;
        });
}

/**
 * Displays a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - Type of notification ('success', 'error', or 'info')
 */
function displayNotification(message, type = 'success') {
    const bouteillesContainer = document.getElementById('bouteilles-container');
    const notification = document.createElement('div');

    let className = 'p-4 mb-4 border-l-4 ';
    if (type === 'success') {
        className += 'bg-green-100 border-green-500 text-green-700';
    } else if (type === 'error') {
        className += 'bg-red-100 border-red-500 text-red-700';
    } else {
        className += 'bg-blue-100 border-blue-500 text-blue-700';
    }

    notification.className = className;
    notification.innerHTML = `<p>${message}</p>`;

    bouteillesContainer.insertBefore(notification, bouteillesContainer.firstChild);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
