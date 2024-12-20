import express from 'express';
import { Place } from "../../types";
import placeFileDb from "../../filesDb/placeFileDb";

const placeRoutes = express.Router();

placeRoutes.get('/', async (req, res) => {
    try {
        const places = await placeFileDb.readPlaces();
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving places' });
    }
});

placeRoutes.get('/:id', async (req, res) => {
    try {
        const places = await placeFileDb.readPlaces();
        const place = places.find((pl: Place) => pl.id === parseInt(req.params.id));
        if (place) {
            res.json(place);
        } else {
            res.status(404).json({ message: 'Place not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving place' });
    }
});

placeRoutes.post('/', async (req, res) => {
    try {
        const newPlace: Place = req.body;
        if (!newPlace.name) {
            res.status(400).json({ message: 'Missing required field: name' });
        } else {
            const addedPlace = await placeFileDb.addPlace(newPlace);
            res.status(201).json(addedPlace);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding place' });
    }
});

placeRoutes.put('/:id', async (req, res) => {
    try {
        const updatedPlace: Place = req.body;
        if (!updatedPlace.name) {
            res.status(400).json({ message: 'Missing required field: name' });
        } else {
            await placeFileDb.updatePlace(parseInt(req.params.id), updatedPlace);
            const places = await placeFileDb.readPlaces();
            const updated = places.find((pl: Place) => pl.id === parseInt(req.params.id));
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ message: 'Place not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating place' });
    }
});

placeRoutes.delete('/:id', async (req, res) => {
    try {
        await placeFileDb.deletePlace(parseInt(req.params.id));
        res.status(200).json({ message: 'Place deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting place' });
    }
});

export default placeRoutes;
