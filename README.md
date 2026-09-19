MkulimaHub/
├── backend/
│   ├── config/          # PostgreSQL + Redis connections
│   ├── controllers/     # request handlers
│   ├── models/          # SQL queries
│   ├── routes/          # Express routers, nested by resource
│   ├── middleware/      # auth, role checks, error handler
│   ├── validators/      # Joi schemas
│   ├── utils/           # pagination, caching, email
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # one file per resource
        ├── context/      # auth + selected-farm state
        ├── components/   # route guards
        └── pages/        # Login, Register, Dashboard, Team, Fields, Inputs, Stock, Livestock, etc.
