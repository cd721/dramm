import userRoutes from "./users.js";
import placeRoutes from "./places.js";



const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/places', placeRoutes);
  
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;