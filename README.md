# 🌐 Proyecto APT Grupo 8  
👤 **Nestor Valenzuela**  
👤 **Yeison Rivera**  
👤 **Roberto Fuentalba**

---

# 🛠️ Salfa Capacitaciones  

## 📄 Descripción  
Plataforma web empresarial para **Salfamantenciones** enfocada en la gestión de cursos/capacitaciones y encuestas para usuarios.  

---

## 🔧 Requisitos del Sistema  

### Software  
- ⚙️ **Node.js** (v18 o superior)  
- 🐘 **PostgreSQL** (v14 o superior)  
- 📦 **npm** (incluido con Node.js)  
- 🔥 **Cuenta de Firebase**  

### Hardware Recomendado (Servidor)  
- 🖥️ **CPU**: 4 cores  
- 💾 **RAM**: 8GB mínimo  
- 📀 **Almacenamiento**: 50GB SSD  
- 🌐 **Ancho de banda**: 100Mbps  

---

## 🚀 Tecnologías Principales  

- 🎨 **Frontend**: React + Vite + TypeScript  
- 💻 **Backend**: Node.js + Express  
- 🗂️ **ORM**: Prisma  
- 🐘 **Base de datos**: PostgreSQL  
- 🔥 **Almacenamiento**: Firebase Storage  

---

## 📂 Estructura del Proyecto  

```plaintext
Producto-fusion-Salfa/  
├── backend/ # Servidor Express (Patrón MVC + DAO)  
│   ├── src/  
│   │   ├── controllers/  
│   │   └── routes/  
│   └── prisma/  
└── frontend/ # Cliente React  
    ├── app/  
    │   ├── src/  
    │   ├── components/  
    │   └── pages/  
    │   └── utils/  
    │   └── App.tsx  
    │   └── main.tsx  
```
## ⚙️ Configuración Inicial  

### 1️⃣ Clonar el Repositorio  

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```


### 2️⃣ Variables de Entorno  

#### 📂 Backend (.env)  

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"
JWT_SECRET="tu_clave_secreta"
PORT=5000
FIREBASE_PROJECT_ID="tu_proyecto_id"
FIREBASE_PRIVATE_KEY="tu_clave_privada"
FIREBASE_CLIENT_EMAIL="tu_email"
```

#### 📂 Frontend (.env)
```env
VITE_API_URL="http://localhost:5000"
```

### 3️⃣ Instalación
# 🛠️ Instalación del backend  
```bash
cd backend  
npm install  
npx prisma generate  
npx prisma migrate dev  
```
# 🛠️ Instalación del frontend
```bash
cd ../frontend/app  
npm install
```
# 🛠️ Proyecto Salfa Capacitaciones  

Plataforma web empresarial para Salfamantenciones enfocada en la gestión de cursos/capacitaciones y encuestas para usuarios.  

---

## ⚙️ Configuración Inicial  

### 4️⃣ Configuración de Firebase  

- 🔧 Crear proyecto en **Firebase Console**.  
- 🔒 Configurar **Storage Bucket** con permisos públicos.  
- 📥 Descargar credenciales y configurar en las variables de entorno del backend.  

---

### 5️⃣ Ejecución del Proyecto  

```bash
# ▶️ Backend (desde /backend)  
npm run dev  

# ▶️ Frontend (desde /frontend/app)  
npm run dev  
```

# 🌐 Puertos y URLs  

- 🎨 **Frontend**: [http://localhost:5173](http://localhost:5173)  
- 💻 **Backend**: [http://localhost:4000](http://localhost:4000)  

---

## 🧩 Componentes Principales  

- 📊 **Dashboard de Cursos**  
- 📈 **Dashboard de Encuestas**  
- 🛠️ **Sistema CRUD** para cursos y encuestas  
- 👥 **Gestión de usuarios**  
- 🔒 **Sistema de autenticación**  

---

## 📦 Dependencias Principales  

### 🛠️ Backend  

- 🚀 **Express**: ^4.21.1  
- 📘 **Prisma**: ^5.22.0  
- 🔑 **JWT**: ^9.0.2  
- 🔥 **Firebase Admin**: ^13.0.1  
- 🔗 **CORS**: ^2.8.5  

### 🎨 Frontend  

- ⚛️ **React**: ^18.3.1  
- ⚡ **Vite**: ^5.4.10  
- 🎨 **Material UI**: ^6.1.6  
- 🌐 **Axios**: ^1.7.7  
- 📜 **TypeScript**: ^5.2.2  
- 💨 **Tailwind CSS**: ^3.4.15  

---

## 📝 Notas Importantes  

- 🔄 Ejecutar `npx prisma migrate dev` antes de iniciar la aplicación.  
- 🔐 Configurar correctamente los permisos del bucket de Firebase.  
- 🐘 Asegurar que **PostgreSQL** esté en ejecución antes de iniciar el backend.
