import userRoutes from "./users.js";
import placeRoutes from "./places.js";
import postRoutes from "./posts.js"


const constructorMethod = (app) => {
    app.use('/users', userRoutes);
    app.use('/places', placeRoutes);
    app.use('/posts', postRoutes);

  
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;