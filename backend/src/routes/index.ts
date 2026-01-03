// import { Hono } from "hono";
// import authApi from "./auth-routes";
// import restaurantApi from "./restaurant-route";
// import imagesApi from "./image-route";
// import categoryApi from "./category-route";
// import menuApi from "./product-route";
// import adminMenusApi from "./admin-route";

// const allRoutes = new Hono();

// allRoutes.route('/auth', authApi);
// allRoutes.route('/restaurant', restaurantApi);
// allRoutes.route('/file', imagesApi);
// allRoutes.route('/category', categoryApi);
// allRoutes.route('/menu', menuApi);
// allRoutes.route('/admin', adminMenusApi);


// export default allRoutes

// -----------------555555------------

// import { Hono } from "hono";

// import authApi from "./auth-routes";
// import restaurantApi from "./restaurant-route";
// import imagesApi from "./image-route";
// import categoryApi from "./category-route";
// import menuApi from "./product-route";
// import adminMenusApi from "./admin-route";

// const allRoutes = new Hono();

// allRoutes.route("/auth", authApi);
// allRoutes.route("/restaurant", restaurantApi);

// // ⭐ MUST MATCH FRONTEND EXPECTATIONS
// allRoutes.route("/file", imagesApi);   // image upload & fetch
// allRoutes.route("/category", categoryApi);
// allRoutes.route("/menu", menuApi);
// allRoutes.route("/admin", adminMenusApi);

// export default allRoutes;

import { Hono } from "hono";

import authApi from "./auth-routes";
import restaurantApi from "./restaurant-route";
import imagesApi from "./image-route";
import categoryApi from "./category-route";
import menuApi from "./product-route";
import adminMenusApi from "./admin-route";

const allRoutes = new Hono();

allRoutes.route("/auth", authApi);
allRoutes.route("/restaurant", restaurantApi);
allRoutes.route("/file", imagesApi);
allRoutes.route("/category", categoryApi);
allRoutes.route("/menu", menuApi);
allRoutes.route("/admin", adminMenusApi);

export default allRoutes;
