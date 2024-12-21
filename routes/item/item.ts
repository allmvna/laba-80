import express from 'express';
import itemFileDb from "../../filesDb/itemFileDb";
import {Item} from "../../types";
import {imagesUpload} from "../../multer";

const itemRoutes = express.Router();

itemRoutes.get('/', async (req,  res) => {
    try {
        const items: Item[]  = await itemFileDb.readItems();

        const itemsResponse = items.map(item => {
            const idFields = Object.entries(item)
                .filter(([key, value]) => key.toLowerCase().includes('id') && value !== undefined)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

            return {
                ...idFields,
                name: item.name,
            };
        });
        res.status(200).json(itemsResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items' });
    }
});


itemRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const items: Item[]  = await itemFileDb.readItems();
        const item = items.find((item) => item.id === parseInt(id));
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving item' });
    }
});


itemRoutes.post('/',imagesUpload.single('photo'), async (req, res) => {
    const { categoryId, placeId, name, description, photo } = req.body;

    if (!categoryId || !placeId || !name ) {
        res.status(400).json({ message: 'Error adding item: Missing required fields' });
    }

    try {
        const newItem: Item = await itemFileDb.addItem({
            categoryId,
            placeId,
            name,
            description,
            photo,
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create item', error });
    }
});


itemRoutes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { categoryId, placeId, name, description, photo } = req.body;

    if (!categoryId || !placeId || !name ) {
        res.status(400).json({ message: 'Error updating item: Missing required fields' });
    }

    try {
        const updatedItem: Item | null  = await itemFileDb.updateItem(parseInt(id), {
            categoryId,
            placeId,
            name,
            description,
            photo,
        });

        if (!updatedItem) {
            res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
});


itemRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {

        const items = await itemFileDb.readItems();
        const item = items.find((item) => item.id === parseInt(id));

        if (item) {
            if (item.categoryId || item.placeId) {
                res.status(400).json({
                    message: 'Cannot delete item: This item is associated with a category or place',
                });
            } else {
                await itemFileDb.deleteItem(parseInt(id));
                res.status(200).json({ message: 'Item deleted' });
            }
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item' });
    }
});



export default itemRoutes;
