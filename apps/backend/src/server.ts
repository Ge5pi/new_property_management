import express from 'express';
import userRoutes from './api/routes/user.routes';
import roleRoutes from './api/routes/role.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
import propertyRoutes from './api/routes/property.routes';
app.use('/api', propertyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
