import path from "path";

const pathName = __dirname;

const config = {
    pathName,
    publicPath: path.join(pathName, 'public'),
};

export default config;


