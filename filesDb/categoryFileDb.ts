import { promises as fs } from 'fs';
import path from 'path';
import {Category} from "../types";

const categoriesFilePath = path.join(__dirname, '../data/categories.json');

const categoriesFileDb = {
    async init() {
        try {
            await fs.mkdir(path.dirname(categoriesFilePath), { recursive: true });
            try {
                await fs.access(categoriesFilePath);
            } catch {
                await fs.writeFile(categoriesFilePath, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error(error);
        }
    },

    async readCategories(): Promise<Category[]> {
        await this.init();
        try {
            const data = await fs.readFile(categoriesFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async writeCategories(categories: Category[]): Promise<void> {
        try {
            await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2), 'utf-8');
        } catch (error) {
            console.error(error);
        }
    },

    async addCategory(category: Category): Promise<Category> {
        const categories = await this.readCategories();

        const newId = categories.length > 0 ? Math.max(...categories.map((cat: Category) => cat.id)) + 1 : 1;

        const newCategory = { ...category, id: newId };

        categories.push(newCategory);
        await this.writeCategories(categories);
        return newCategory;
    },

    async deleteCategory(id: number): Promise<void> {
        let categories = await this.readCategories();
        categories = categories.filter((category) => category.id !== id);
        await this.writeCategories(categories);
    },

    async updateCategory(id: number, updatedCategory: Category): Promise<void> {
        let categories = await this.readCategories();
        categories = categories.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
        );
        await this.writeCategories(categories);
    }
};


export default categoriesFileDb;