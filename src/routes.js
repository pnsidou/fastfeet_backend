import { Router, Request, Response } from 'express';
import Multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';
import ProblemController from './app/controllers/ProblemController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = new Multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/delivery/:delivery_id/start', StartDeliveryController.store);
routes.post('/delivery/:delivery_id/finish', FinishDeliveryController.store);

routes.post('/delivery/:delivery_id/problem', ProblemController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
