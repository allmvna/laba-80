import { promises as fs } from 'fs';
import path from 'path';
import { Item } from "../types";

const itemsFilePath = path.join(__dirname, '../data/items.json');

const itemFileDb = {
    async init() {
        try {
            await fs.mkdir(path.dirname(itemsFilePath), { recursive: true });
            try {
                await fs.access(itemsFilePath);
            } catch {
                await fs.writeFile(itemsFilePath, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error(error);
        }
    },

    async readItems(): Promise<Item[]> {
        await this.init();
        try {
            const data = await fs.readFile(itemsFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async writeItems(items: Item[]): Promise<void> {
        try {
            await fs.writeFile(itemsFilePath, JSON.stringify(items, null, 2), 'utf-8');
        } catch (error) {
            console.error(error);
        }
    },

    async addItem(item: Omit<Item, 'id' | 'dateAdded'>): Promise<Item> {
        const items = await this.readItems();

        const newId = items.length > 0 ? Math.max(...items.map((i: Item) => i.id)) + 1 : 1;

        const newItem: Item = {
            ...item,
            id: newId,
            dateAdded: new Date().toISOString(),
        };

        items.push(newItem);
        await this.writeItems(items);
        return newItem;
    },

    async deleteItem(id: number): Promise<void> {
        let items = await this.readItems();
        items = items.filter((item) => item.id !== id);
        await this.writeItems(items);
    },

    async updateItem(id: number, updatedItem: Partial<Omit<Item, 'id'>>): Promise<Item | null> {
        let items = await this.readItems();
        const itemIndex = items.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            return null;
        }
        const updated = { ...items[itemIndex], ...updatedItem };
        items[itemIndex] = updated;
        await this.writeItems(items);
        return updated;
    }
};

export default itemFileDb;
