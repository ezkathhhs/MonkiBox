const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { pool, testConnection } = require('./db');
const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
const corsOptions = {
  origin: 'https://monkibox.onrender.com'
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());

// --- 1. ENDPOINT DE REGISTRO (CREATE) ---
app.post('/api/register', async (req, res) => {
  try {
    // 1. Obtener datos del 'body' de la petición
    const { name, email, password } = req.body;

    // 2. Validar si el email ya existe
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      // Usamos 400 (Bad Request) porque el email ya existe
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // 3. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Genera "sal" para el hash
    const passwordHash = await bcrypt.hash(password, salt); // Hashea la contraseña

    // 4. Insertar el nuevo usuario en la BD (fíjate que guardamos passwordHash)
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, passwordHash]
    );

    // 5. Devolver una respuesta exitosa
    const userResponse = newUser.rows[0];
    delete userResponse.password_hash;

    res.status(201).json(userResponse); // 201 = Creado

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 2. ENDPOINT DE LOGIN (READ/VERIFY) ---
app.post('/api/login', async (req, res) => {
  try {
    // 1. Obtener email y password del body
    const { email, password } = req.body;

    // 2. Buscar al usuario por email en la BD
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    // 3. Si el usuario NO existe, devolver error
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' }); // 401 = No autorizado
    }

    // 4. Si existe, comparar la contraseña enviada con el hash guardado
    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    // 5. Si la contraseña NO coincide, devolver error
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // El token contendrá el ID y el ROL del usuario
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'miclavesecreta123', // ¡Crea esta variable en tu .env!
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    // 6. ¡Login exitoso!
    // Borramos el hash antes de devolver la info al frontend
    delete user.password_hash;

    // Enviamos los datos del usuario (incluyendo el 'role')
    res.status(200).json({ user, token }); // 200 = OK

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 3. OBTENER TODOS LOS USUARIOS (READ) ---
app.get('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    // Obtenemos todos los usuarios pero excluimos el hash de la contraseña
    const allUsers = await pool.query(
      "SELECT user_id, name, email, role, created_at FROM users ORDER BY user_id ASC"
    );
    res.status(200).json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 4. CREAR NUEVO USUARIO (por Admin) (CREATE) ---
app.post('/api/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validar si el email ya existe
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insertar el nuevo usuario (incluyendo el rol)
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, passwordHash, role]
    );

    const userResponse = newUser.rows[0];
    delete userResponse.password_hash;
    res.status(201).json(userResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 5. ACTUALIZAR UN USUARIO ---
app.put('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Ahora recibimos también profile_picture
    const { name, email, password, role, profile_picture } = req.body; 

    let query;
    let values;

    // Lógica: Si envían password, lo hasheamos. Si no, no lo tocamos.
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      query = "UPDATE users SET name = $1, email = $2, role = $3, password_hash = $4, profile_picture = $5 WHERE user_id = $6 RETURNING *";
      values = [name, email, role, passwordHash, profile_picture, id];
    } else {
      query = "UPDATE users SET name = $1, email = $2, role = $3, profile_picture = $4 WHERE user_id = $5 RETURNING *";
      values = [name, email, role, profile_picture, id];
    }

    const updatedUser = await pool.query(query, values);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const userResponse = updatedUser.rows[0];
    delete userResponse.password_hash;
    res.status(200).json(userResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 6. ELIMINAR UN USUARIO (DELETE) ---
app.delete('/api/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 7. OBTENER TODOS LOS PRODUCTOS (READ) ---
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await pool.query("SELECT * FROM products ORDER BY product_id ASC");
    res.status(200).json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 8. CREAR NUEVO PRODUCTO ---
app.post('/api/products', verifyToken, isAdmin, async (req, res) => {
  try {
    // Recibimos 'price' como el valor base que ingresa el usuario
    let { name, description, price, stock, category, status, image_url, discount_percentage } = req.body;
    
    // Aseguramos que discount sea un número
    const discount = parseInt(discount_percentage) || 0;
    let finalPrice = price;
    let oldPrice = null;

    // Lógica de Descuento
    if (discount > 0) {
      oldPrice = price; // El precio ingresado pasa a ser el "antiguo"
      // Calculamos el nuevo precio de venta
      finalPrice = price - (price * discount / 100);
    }

    const newProduct = await pool.query(
      "INSERT INTO products (name, description, price, stock, category, status, image_url, discount_percentage, old_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [name, description, finalPrice, stock, category, status, image_url, discount, oldPrice]
    );
    
    res.status(201).json(newProduct.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 9. ACTUALIZAR UN PRODUCTO ---
app.put('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Nota: Esperamos que el frontend nos envíe el precio "base" nuevamente
    let { name, description, price, stock, category, status, image_url, discount_percentage } = req.body;

    const discount = parseInt(discount_percentage) || 0;
    let finalPrice = price;
    let oldPrice = null;

    if (discount > 0) {
      oldPrice = price;
      finalPrice = price - (price * discount / 100);
    }

    const updatedProduct = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, status = $6, image_url = $7, discount_percentage = $8, old_price = $9 WHERE product_id = $10 RETURNING *",
      [name, description, finalPrice, stock, category, status, image_url, discount, oldPrice, id]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.status(200).json(updatedProduct.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 10. ELIMINAR UN PRODUCTO (DELETE) ---
app.delete('/api/products/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query("DELETE FROM products WHERE product_id = $1 RETURNING *", [id]);

    if (deleteOp.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 11. OBTENER UN PRODUCTO ESPECÍFICO (por ID) ---
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [id]);

    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    
    res.status(200).json(product.rows[0]); // Devuelve solo el primer (y único) producto

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 12. OBTENER PRODUCTOS RELACIONADOS (por ID de producto) ---
app.get('/api/related-products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Encontrar la categoría del producto actual
    const categoryResult = await pool.query("SELECT category FROM products WHERE product_id = $1", [id]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    const category = categoryResult.rows[0].category;

    // 2. Encontrar 5 productos de esa categoría, que no sean el producto actual y estén activos
    const relatedProducts = await pool.query(
      "SELECT * FROM products WHERE category = $1 AND product_id != $2 AND status = 'activo' LIMIT 5",
      [category, id]
    );

    res.status(200).json(relatedProducts.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 13. CREAR NUEVA ORDEN (CHECKOUT) ---
app.post('/api/orders', async (req, res) => {

  console.log('INTENTO DE PAGO RECIBIDO. Verificando datos...');
  // Nota: En un proyecto real, usaríamos una "transacción" de base de datos aquí.
  try {
    const {
      userInfo,
      shippingDetails,
      cartItems,
      totals
    } = req.body;

    // 1. Crear la Orden principal
    const newOrder = await pool.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, subtotal, shipping_cost, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userInfo.id,
        userInfo.name,
        userInfo.email,
        JSON.stringify(shippingDetails),
        totals.subtotal,
        totals.shipping,
        totals.total
      ]
    );

    const newOrderId = newOrder.rows[0].order_id;
    const createdOrder = newOrder.rows[0];

    // 2. Insertar cada item del carrito en la tabla order_items
    const orderItemsData = [];
    for (const item of cartItems) {
      const newItem = await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_name, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          newOrderId,
          item.product.product_id,
          item.quantity,
          item.product.price, // Precio (ya descontado, si aplica)
          item.product.name,
          item.product.image_url
        ]
      );
      orderItemsData.push(newItem.rows[0]);
    }
    
    // 3. Devolver la boleta completa
    res.status(201).json({
      order: createdOrder,
      items: orderItemsData
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 14. OBTENER ESTADÍSTICAS DEL DASHBOARD ---
app.get('/api/stats/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    // 1. Contar Productos
    const productsQuery = pool.query("SELECT COUNT(*) FROM products");
    
    // 2. Contar Usuarios
    const usersQuery = pool.query("SELECT COUNT(*) FROM users");
    
    // 3. Contar Compras (Órdenes)
    const ordersQuery = pool.query("SELECT COUNT(*) FROM orders");

    // Ejecutamos las 3 consultas al mismo tiempo
    const [productsResult, usersResult, ordersResult] = await Promise.all([
      productsQuery,
      usersQuery,
      ordersQuery
    ]);

    // Extraemos los números
    const productsCount = parseInt(productsResult.rows[0].count, 10);
    const usersCount = parseInt(usersResult.rows[0].count, 10);
    const ordersCount = parseInt(ordersResult.rows[0].count, 10);

    // 4. Devolvemos el objeto
    res.status(200).json({
      products: productsCount,
      users: usersCount,
      orders: ordersCount
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 15. OBTENER TODAS LAS ÓRDENES (Para Admin) ---
app.get('/api/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    // Obtenemos las órdenes, de la más nueva a la más antigua
    const allOrders = await pool.query(
      "SELECT order_id, customer_name, total_amount, order_status, created_at FROM orders ORDER BY created_at DESC"
    );
    res.status(200).json(allOrders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 16. OBTENER DETALLES DE UNA ORDEN (Para Modal) ---
// Este endpoint devuelve los datos TAL CUAL los necesita el OrderSuccessModal
app.get('/api/order-details/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener la orden principal
    const orderResult = await pool.query("SELECT * FROM orders WHERE order_id = $1", [id]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // 2. Obtener los items de esa orden
    const itemsResult = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [id]);

    // 3. Devolverlo en el formato { order, items }
    res.status(200).json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 17. ACTUALIZAR ESTADO DE UNA ORDEN ---
app.put('/api/order-status/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Recibe "En espera", "Preparando", "Finalizado"

    const updatedOrder = await pool.query(
      "UPDATE orders SET order_status = $1 WHERE order_id = $2 RETURNING *",
      [status, id]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.status(200).json(updatedOrder.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 18. OBTENER ÓRDENES DE UN USUARIO ESPECÍFICO ---
app.get('/api/user-orders/:userId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscamos las órdenes simplificadas para ese user_id
    const userOrders = await pool.query(
      "SELECT order_id, total_amount, order_status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    
    // Es normal que un usuario no tenga órdenes, así que devolvemos lo que encontremos
    res.status(200).json(userOrders.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 19. OBTENER REPORTES DE RESUMEN (KPIs + Métricas) ---
app.get('/api/reports/summary', verifyToken, isAdmin, async (req, res) => {
  try {
    // Definimos las consultas
    const kpiQuery = pool.query(`
      SELECT
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS totalRevenue,
        (SELECT COUNT(*) FROM orders) AS totalOrders,
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COALESCE(SUM(quantity), 0) FROM order_items) AS totalProductsSold,
        (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') AS newUsersThisWeek,
        (SELECT COALESCE(AVG(total_amount), 0) FROM orders) AS avgTicket,
        (SELECT COALESCE(AVG(items_per_order), 0) 
         FROM (SELECT order_id, SUM(quantity) as items_per_order FROM order_items GROUP BY order_id) AS subquery
        ) AS avgProductsPerOrder,
        (SELECT COUNT(DISTINCT user_id) 
         FROM orders 
         WHERE user_id IS NOT NULL 
           AND user_id IN (SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 1)
        ) AS recurringCustomers
    `);
    
    const [kpiRes] = await Promise.all([kpiQuery]);

    // Calcular Tasa de Clientes Recurrentes
    const totalCustomers = parseInt(kpiRes.rows[0].totalusers);
    const recurringCustomers = parseInt(kpiRes.rows[0].recurringcustomers);
    const recurringRate = (totalCustomers > 0) ? (recurringCustomers / totalCustomers) * 100 : 0;

    res.status(200).json({
      totalRevenue: parseFloat(kpiRes.rows[0].totalrevenue),
      totalOrders: parseInt(kpiRes.rows[0].totalorders),
      totalUsers: parseInt(kpiRes.rows[0].totalusers),
      totalProductsSold: parseInt(kpiRes.rows[0].totalproductssold),
      newUsersThisWeek: parseInt(kpiRes.rows[0].newusersthisweek),
      avgTicket: parseFloat(kpiRes.rows[0].avgticket),
      avgProductsPerOrder: parseFloat(kpiRes.rows[0].avgproductsperorder).toFixed(1),
      recurringCustomerRate: recurringRate.toFixed(1)
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 20. OBTENER PRODUCTOS POPULARES (Más Vendidos + Stock) ---
app.get('/api/reports/top-selling', async (req, res) => {
  try {
    // Ahora hacemos un JOIN para obtener el stock del producto
    const topProducts = await pool.query(
      `SELECT 
         p.name AS product_name, 
         SUM(oi.quantity) AS total_sold,
         p.stock
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       GROUP BY p.name, p.stock
       ORDER BY total_sold DESC
       LIMIT 5`
    );
    res.status(200).json(topProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 21. OBTENER ÓRDENES RECIENTES (Igual que antes) ---
app.get('/api/reports/recent-orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const recentOrders = await pool.query(
      "SELECT order_id, customer_name, total_amount, order_status FROM orders ORDER BY created_at DESC LIMIT 5"
    );
    res.status(200).json(recentOrders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 22. NUEVO: VENTAS POR DÍA (Para Gráfico de Línea) ---
app.get('/api/reports/sales-by-day', verifyToken, isAdmin, async (req, res) => {
  try {
    // Agrupa las ventas por día de la última semana
    const salesByDay = await pool.query(`
      SELECT 
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS day,
        SUM(total_amount) AS total_sales
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC;
    `);
    res.status(200).json(salesByDay.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 23. NUEVO: DISTRIBUCIÓN DE CATEGORÍAS ---
app.get('/api/reports/category-distribution', verifyToken, isAdmin, async (req, res) => {
  try {
    const categoryDist = await pool.query(`
      SELECT 
        p.category, 
        SUM(oi.quantity) AS total_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.category
      ORDER BY total_sold DESC
    `);
    res.status(200).json(categoryDist.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// --- 24. NUEVO: REPORTE POR PRODUCTO ID ---
app.get('/api/reports/product/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener métricas de ventas (unidades e ingresos)
    const salesQuery = pool.query(
      `SELECT 
         COALESCE(SUM(quantity), 0) AS totalUnitsSold,
         COALESCE(SUM(quantity * price_at_purchase), 0) AS totalRevenue
       FROM order_items 
       WHERE product_id = $1`,
      [id]
    );

    // 2. Obtener stock actual
    const stockQuery = pool.query(
      "SELECT stock, name FROM products WHERE product_id = $1",
      [id]
    );

    // 3. Obtener últimos 5 pedidos que incluyen este producto
    const ordersQuery = pool.query(
      `SELECT o.order_id, o.customer_name, oi.quantity, o.created_at
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE oi.product_id = $1
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [id]
    );

    // Ejecutar todo en paralelo
    const [salesRes, stockRes, ordersRes] = await Promise.all([
      salesQuery, stockQuery, ordersQuery
    ]);

    if (stockRes.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({
      productName: stockRes.rows[0].name,
      currentStock: stockRes.rows[0].stock,
      totalUnitsSold: parseInt(salesRes.rows[0].totalunitssold),
      totalRevenue: parseFloat(salesRes.rows[0].totalrevenue),
      recentOrders: ordersRes.rows
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API de MonkiBox funcionando!');
});

// Escuchamos en '0.0.0.0' para ser accesibles desde Docker/Render
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  testConnection();
});