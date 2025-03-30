const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const firebaseConfig = {
  apiKey: "AIzaSyDFKMWmASbkk08zgqBDZox06KF7TEEifYo",
  authDomain: "forestechoes-27411.firebaseapp.com",
  projectId: "forestechoes-27411",
  storageBucket: "forestechoes-27411.firebasestorage.app",
  messagingSenderId: "543820271918",
  appId: "1:543820271918:web:b77b817b1f9dbc61686abf",
  measurementId: "G-ZVH1QN2071",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Api = express();
const port = process.env.PORT || 3002;

Api.use(express.json());
Api.use(cors());

const SECRET_KEY = "Rd.wZH}%aB$)uX--i:XQX;qeJcg$F5";

// Importar Stripe
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51R8CTCBGUhEyaGYF5HaoxIX75u1UdIy5ohMLKmzIkIayjq0IlnJDc1v0BdPXONTx9IpmC0XGInWvQr6aEJNiWc0o00ydnkiAAH"); // Clave secreta

const crypto = require("crypto"); // Para generar códigos MFA


Api.get("/", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para registrar un nuevo usuario
Api.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el username o el email ya están registrados
    const querySnapshot = await getDocs(collection(db, "Users"));
    const users = querySnapshot.docs.map((doc) => doc.data());

    const usernameExists = users.some((user) => user.username === username);
    const emailExists = users.some((user) => user.email === email);

    if (usernameExists) {
      return res.status(400).json({ message: "El nombre de usuario ya está registrado" });
    }

    if (emailExists) {
      return res.status(400).json({ message: "El correo electrónico ya está registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Registrar el nuevo usuario
    const docRef = await addDoc(collection(db, "Users"), {
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado con éxito", userId: docRef.id });
  } catch (e) {
    console.error("Error al registrar el usuario: ", e);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

// Ruta para iniciar sesión
Api.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY);
      
      const userDoc = doc(db, "Users", user.id);
      await updateDoc(userDoc, { token: accessToken });

      res.status(200).json({ accessToken, userId: user.id });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (e) {
    console.error("Error al iniciar sesión: ", e);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Ruta para cerrar sesión
Api.post("/logout", authenticateToken ,async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(400).json({ message: "Token no proporcionado" });

  try {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const user = users.find((user) => user.token === token);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el token de la base de datos
    const userDoc = doc(db, "Users", user.id);
    await updateDoc(userDoc, { token: "" });

    res.status(200).json({ message: "Sesión cerrada con éxito" });
  } catch (e) {
    console.error("Error al cerrar sesión: ", e);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
});

//Ruta para actaulizar la contraseña desde el login:
Api.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userDoc = doc(db, "Users", user.id);
    await updateDoc(userDoc, { password: hashedPassword });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
});


// Ruta para enviar un mensaje de contacto
Api.post("/contact", authenticateToken ,async (req, res) => {
  const { name, email, message } = req.body;
  const userId = req.headers["user-id"];

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const docRef = await addDoc(collection(db, "Messages"), {
      userId,
      name,
      email,
      message,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Mensaje enviado con éxito", messageId: docRef.id });
  } catch (e) {
    console.error("Error al enviar el mensaje: ", e);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

// Ruta para obtener los datos del usuario
Api.get("/user/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const userDoc = doc(db, "Users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userData = userSnapshot.data();
    res.status(200).json(userData);
  } catch (e) {
    console.error("Error al obtener los datos del usuario: ", e);
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
});

// Ruta para actualizar la contraseña del usuario
Api.put("/user/:id/password", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "La contraseña es obligatoria" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = doc(db, "Users", userId);
    await updateDoc(userDoc, { password: hashedPassword });

    res.status(200).json({ message: "Contraseña actualizada con éxito" });
  } catch (e) {
    console.error("Error al actualizar la contraseña: ", e);
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
});

//Ruta para obtener los productos de la base de datos
Api.get("/products", authenticateToken , async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(products);
  } catch (e) {
    console.error("Error al obtener los productos: ", e);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Ruta para agregar un producto al carrito
Api.post("/cart", authenticateToken, async (req, res) => {
  const { userId, productId, price, name, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: "El ID del usuario, el ID del producto y la cantidad son obligatorios" });
  }

  try {
    const cartSnapshot = await getDocs(collection(db, "Cart"));
    const cartItems = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const existingCartItem = cartItems.find(
      (item) => item.productId === productId && item.userId === userId
    );

    if (existingCartItem) {
      const cartDoc = doc(db, "Cart", existingCartItem.id);
      await updateDoc(cartDoc, {
        quantity: existingCartItem.quantity + quantity,
      });

      return res.status(200).json({ message: "Cantidad actualizada en el carrito" });
    }

    const docRef = await addDoc(collection(db, "Cart"), {
      userId,
      productId,
      price,
      name,
      quantity,
      addedAt: new Date(),
    });

    res.status(201).json({ message: "Producto agregado al carrito", cartId: docRef.id });
  } catch (e) {
    console.error("Error al agregar el producto al carrito: ", e);
    res.status(500).json({ message: "Error al agregar el producto al carrito" });
  }
});

// Ruta para obtener los productos del carrito de un usuario
Api.post("/cart-user", authenticateToken, async (req, res) => {
  const { userId } = req.body; 

  if (!userId) {
    return res.status(400).json({ message: "El ID del usuario es obligatorio." });
  }

  try {
    const cartSnapshot = await getDocs(collection(db, "Cart"));
    const cartItems = cartSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) => item.userId === userId); 

    res.status(200).json(cartItems);
  } catch (e) {
    console.error("Error al obtener los productos del carrito: ", e);
    res.status(500).json({ message: "Error al obtener los productos del carrito" });
  }
});

Api.post("/cart/increase", authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const productDoc = await getDoc(doc(db, "Products", productId));
    if (!productDoc.exists()) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const productData = productDoc.data();
    const stock = productData.stock;

    const cartSnapshot = await getDocs(collection(db, "Cart"));
    const cartItem = cartSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((item) => item.productId === productId && item.userId === userId);

    if (!cartItem) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    if (cartItem.quantity + 1 > stock) {
      return res.status(400).json({ message: "No hay suficiente stock disponible." });
    }

    const cartDoc = doc(db, "Cart", cartItem.id);
    await updateDoc(cartDoc, { quantity: cartItem.quantity + 1 });

    res.status(200).json({ message: "Cantidad aumentada." });
  } catch (error) {
    console.error("Error al aumentar la cantidad:", error);
    res.status(500).json({ message: "Error al aumentar la cantidad." });
  }
});

Api.post("/cart/decrease", authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cartSnapshot = await getDocs(collection(db, "Cart"));
    const cartItem = cartSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((item) => item.productId === productId && item.userId === userId);

    if (!cartItem) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    if (cartItem.quantity <= 1) {
      return res.status(400).json({ message: "La cantidad no puede ser menor a 1." });
    }

    const cartDoc = doc(db, "Cart", cartItem.id);
    await updateDoc(cartDoc, { quantity: cartItem.quantity - 1 });

    res.status(200).json({ message: "Cantidad disminuida." });
  } catch (error) {
    console.error("Error al disminuir la cantidad:", error);
    res.status(500).json({ message: "Error al disminuir la cantidad." });
  }
});

// Ruta para eliminar un producto del carrito
Api.post("/cart/delete", authenticateToken, async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "El ID del usuario y el ID del producto son obligatorios." });
  }

  try {
    // Buscar el producto en la colección "Cart"
    const cartSnapshot = await getDocs(collection(db, "Cart"));
    const cartItem = cartSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .find((item) => item.productId === productId && item.userId === userId);

    if (!cartItem) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito." });
    }

    // Eliminar el producto del carrito
    const cartDoc = doc(db, "Cart", cartItem.id);
    await deleteDoc(cartDoc);

    res.status(200).json({ message: "Producto eliminado del carrito." });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({ message: "Error al eliminar el producto del carrito." });
  }
});

//Stripe
// Ruta para procesar el pago
Api.post("/create-payment", authenticateToken, async (req, res) => {
  const { userId, cartItems, totalAmount } = req.body;

  if (!userId || !cartItems || !totalAmount) {
    return res.status(400).json({ message: "Datos incompletos para procesar el pago." });
  }

  try {
    // Crear un PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe maneja los montos en centavos
      currency: "usd",
      payment_method_types: ["card"],
    });

    // Guardar los datos de la compra en la colección Payments
    const paymentData = {
      userId,
      cartItems,
      totalAmount,
      paymentIntentId: paymentIntent.id,
      status: "pending",
      createdAt: new Date(),
    };

    await addDoc(collection(db, "Payments"), paymentData);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "PaymentIntent creado con éxito.",
    });
  } catch (error) {
    console.error("Error al crear el PaymentIntent:", error);
    res.status(500).json({ message: "Error al procesar el pago." });
  }
});

// Ruta para confirmar el pago y actualizar el stock
Api.post("/confirm-payment", authenticateToken, async (req, res) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ message: "El ID del PaymentIntent es obligatorio." });
  }

  try {
    // Confirmar el estado del PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Actualizar el estado del pago en la colección Payments
      const paymentSnapshot = await getDocs(collection(db, "Payments"));
      const paymentDoc = paymentSnapshot.docs.find(
        (doc) => doc.data().paymentIntentId === paymentIntentId
      );

      if (paymentDoc) {
        const paymentRef = doc(db, "Payments", paymentDoc.id);
        await updateDoc(paymentRef, { status: "completed" });

        // Actualizar el stock de los productos
        const cartItems = paymentDoc.data().cartItems;
        for (const item of cartItems) {
          const productRef = doc(db, "Products", item.productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
            const newStock = productDoc.data().stock - item.quantity;
            if (newStock < 0) {
              return res.status(400).json({ message: "Stock insuficiente para el producto." });
            }
            await updateDoc(productRef, { stock: newStock });
          }
        }

        // Eliminar los productos del carrito
        for (const item of cartItems) {
          const cartSnapshot = await getDocs(collection(db, "Cart"));
          const cartItem = cartSnapshot.docs.find(
            (doc) => doc.data().productId === item.productId && doc.data().userId === paymentDoc.data().userId
          );

          if (cartItem) {
            const cartDoc = doc(db, "Cart", cartItem.id);
            await deleteDoc(cartDoc);
          }
        }
      }

      // Notificar al cliente que el pago fue confirmado
      res.status(200).json({ message: "Pago confirmado, stock actualizado y carrito limpiado." });
    } else {
      res.status(400).json({ message: "El pago no se completó." });
    }
  } catch (error) {
    console.error("Error al confirmar el pago:", error);
    res.status(500).json({ message: "Error al confirmar el pago." });
  }
});




Api.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = Api;