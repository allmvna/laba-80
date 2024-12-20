import { promises as fs } from 'fs';
import path from 'path';
import { Place } from "../types";

const placesFilePath = path.join(__dirname, '../data/places.json');

const placeFileDb = {
    async init() {
        try {
            await fs.mkdir(path.dirname(placesFilePath), { recursive: true });
            try {
                await fs.access(placesFilePath);
            } catch {
                await fs.writeFile(placesFilePath, JSON.stringify([], null, 2));
            }
        } catch (error) {
            console.error(error);
        }
    },

    async readPlaces(): Promise<Place[]> {
        await this.init();
        try {
            const data = await fs.readFile(placesFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async writePlaces(places: Place[]): Promise<void> {
        try {
            await fs.writeFile(placesFilePath, JSON.stringify(places, null, 2), 'utf-8');
        } catch (error) {
            console.error(error);
        }
    },

    async addPlace(place: Place): Promise<Place> {
        const places = await this.readPlaces();

        const newId = places.length > 0 ? Math.max(...places.map((p: Place) => p.id)) + 1 : 1;

        const newPlace = { ...place, id: newId };

        places.push(newPlace);
        await this.writePlaces(places);
        return newPlace;
    },

    async deletePlace(id: number): Promise<void> {
        let places = await this.readPlaces();
        places = places.filter((place) => place.id !== id);
        await this.writePlaces(places);
    },

    async updatePlace(id: number, updatedPlace: Place): Promise<void> {
        let places = await this.readPlaces();
        places = places.map((place) =>
            place.id === id ? { ...place, ...updatedPlace } : place
        );
        await this.writePlaces(places);
    }
};

export default placeFileDb;
