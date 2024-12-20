import express from 'express';
import { Category } from "../../types";
import categoriesFileDb from "../../filesDb/categoryFileDb";

const categoryRoutes = express.Router();

categoryRoutes.get('/', async (req, res) => {
    try {
        const categories = await categoriesFileDb.readCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories' });
    }
});

categoryRoutes.get('/:id', async (req, res) => {
    try {
        const categories = await categoriesFileDb.readCategories();
        const category = categories.find((cat: Category) => cat.id === parseInt(req.params.id));
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving category' });
    }
});


categoryRoutes.post('/', async (req, res) => {
    try {
        const newCategory: Category = req.body;
        const addedCategory = await categoriesFileDb.addCategory(newCategory);
        res.status(201).json(addedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category' });
    }
});


categoryRoutes.put('/:id', async (req, res) => {
    try {
        const updatedCategory: Category = req.body;
        await categoriesFileDb.updateCategory(parseInt(req.params.id), updatedCategory);
        const categories = await categoriesFileDb.readCategories();
        const updated = categories.find((cat: Category) => cat.id === parseInt(req.params.id));
        if (updated) {
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
});


categoryRoutes.delete('/:id', async (req, res) => {
    try {
        await categoriesFileDb.deleteCategory(parseInt(req.params.id));
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

export default categoryRoutes;
