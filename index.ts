import express from 'express';
import categoriesFileDb from "./filesDb/categoryFileDb";
import categoryRoutes from "./routes/category/category";
import placesFileDb from "./filesDb/placeFileDb";
import placeRoutes from "./routes/place/place";
import itemFileDb from "./filesDb/itemFileDb";
import itemRoutes from "./routes/item/item";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/categories', categoryRoutes);
app.use('/places', placeRoutes);
app.use('/items', itemRoutes);


const run = async () => {
    await categoriesFileDb.init();
    await placesFileDb.init();
    await itemFileDb.init();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

run().catch(e => console.error(e));


