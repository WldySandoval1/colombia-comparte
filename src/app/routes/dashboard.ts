import { Router } from 'express';
import { DashboardController } from '../services/controller/dashboard';
import { verifyToken } from '../../middleware/auth';


const router = Router();
const dashboardController = new DashboardController();

// verifyToken valida el JWT antes de llegar al controlador (RNF-02)
// No se restringe por rol aquí porque el controlador maneja los dos casos internamente
router.get('/', verifyToken, (req, res) => dashboardController.getMetrics(req, res));

export default router;