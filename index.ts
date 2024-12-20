import express from 'express';
import categoriesFileDb from "./filesDb/categoryFileDb";
import categoryRoutes from "./routes/category/category";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/categories', categoryRoutes);

const run = async () => {
    await categoriesFileDb.init();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

run().catch(e => console.error(e));


