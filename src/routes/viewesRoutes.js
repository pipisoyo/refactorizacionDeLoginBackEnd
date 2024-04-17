import { Router } from 'express';
import { auth , authUser} from '../middeleweres/auth.js';
import productsModel from '../dao/models/products.js';
import cartsModel from '../dao/models/carts.js';
import userModel from '../dao/models/users.js';


const viewesRoutes = Router();

viewesRoutes.get('/chat', (req, res) => {
  res.render('chat');
});

viewesRoutes.get('/products', auth, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
  
    try {
      const carts = await cartsModel.find({}).lean().exec();  
      const users = await userModel.find({}).lean().exec();  
      const totalCount = await productsModel.countDocuments({});
      const totalPages = Math.ceil(totalCount / limit);
      const user = req.session.user;
      const role = req.session.user.role
      const cartId = req.session.user.cartId
      
          const results = await productsModel.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
  
      const prevLink = page > 1 ? `?limit=${limit}&page=${page - 1}` : null;
      const nextLink = page < totalPages ? `?limit=${limit}&page=${page + 1}` : null;

      let result = false
      if (role === "admin"){
         result = true
      }
      res.render('products', {
        users,
        user,
        carts,
        products: results,
        prevLink,
        nextLink,
        result,
        cartId
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  });

  viewesRoutes.get('/cart/:cid', auth,authUser, async(req, res) => {

    const cid = req.params.cid;
    
  try {
    const cart = await cartsModel.findById(cid).populate('products.product').lean().exec();
    const products = [];
    const user = req.session.user;

    cart.products.forEach(element => { 
      let quantity = element.quantity;
      let product = element.product;
      product.quantity = quantity;
      products.push(product);
    });
    res.render('cart',{
      cart,
      cid, 
      products,
      user
    });
  }catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Error en la base de datos", details: err.message });
  }
})

viewesRoutes.get('/register', (req, res) => {
  res.render('register');
  
})

viewesRoutes.get('/login',  (req, res) => {
  res.render('login');
})

viewesRoutes.get('/', auth ,(req, res) => {
  res.render('profile', {
      user: req.session.user
  });
})

viewesRoutes.get("/restore", (req, res) => {
  res.render("restore");
});

export default viewesRoutes;