
# Project Documentation

- video link : https://youtu.be/BBIsbWQahpE

## Connect with Me

- LinkedIn: [Utsav Gangani](https://www.linkedin.com/in/utsav-gangani-86461325a)
- Email: utsavgangani3110@gmail.com

## Dependencies

### Frontend
- `axios` - HTTP requests
- `leaflet` - Interactive maps
- `leaflet-geosearch` - Geolocation search
- `lucide-react` - React icons
- `react` - UI building
- `react-dom` - React DOM rendering
- `react-leaflet` - Leaflet React wrapper
- `react-router-dom` - React routing
- `react-toastify` - Toast notifications

### Backend
- `bcrypt` - Password hashing
- `cookie-parser` - Cookie parsing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `mongoose` - MongoDB ODM
- `mongoose-aggregate-paginate-v2` - MongoDB pagination

### Development
- `nodemon` - Development server

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd client
```

2. Create `.env` file:
```bash
VITE_BACKEND_URI=<your_backend_url>
```

3. Install dependencies:
```bash
npm install
```

4. Start development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd server
```

2. Create `.env` file:
```bash
MONGODB_URI=<MongoDbUrl>
DB_NAME=<database_name>
PORT=8000
ACCESS_TOKEN_SECRET=<token_secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<token_secret>
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5173
```

3. Install and start the server:
```bash
npm install
npm run dev
```

The backend will be available at [http://localhost:8000](http://localhost:8000)

## API Documentation

### User Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/v1/users/register` | Register new user | No |
| POST | `/api/v1/users/login` | User login | No |
| POST | `/api/v1/users/logout` | User logout | Yes |
| GET | `/api/v1/users/current-user` | Get current user | Yes |
| GET | `/api/v1/users/profile` | Get user profile | Yes |

### Address Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/v1/add/u/:userId` | Get user addresses | Yes |
| POST | `/api/v1/add` | Create address | Yes |
| DELETE | `/api/v1/add/:addressId` | Delete address | Yes |
| GET | `/api/v1/add/search` | Search addresses | Yes |

