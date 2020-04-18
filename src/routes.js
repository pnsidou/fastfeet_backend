import { Router, Request, Response } from 'express';
import Multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliverymanSessionController from './app/controllers/DeliverymanSessionController';
import DeliverymanDeliveriesController from './app/controllers/DeliverymanDeliveriesController';
import DeliverymanDeliveredController from './app/controllers/DeliverymanDeliveredController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';
import ProblemController from './app/controllers/ProblemController';
import CancelController from './app/controllers/CancelController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = new Multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id', DeliverymanSessionController.index);
routes.get(
  '/deliveryman/:id/deliveries',
  DeliverymanDeliveriesController.index
);
routes.get('/deliveryman/:id/delivered', DeliverymanDeliveredController.index);

routes.post('/delivery/:delivery_id/start', StartDeliveryController.store);
routes.post(
  '/delivery/:delivery_id/finish',
  upload.single('signature'),
  FinishDeliveryController.store
);

routes.post('/delivery/:delivery_id/problems', ProblemController.store);
routes.get('/delivery/:delivery_id/problems', ProblemController.index);

routes.delete('/problem/:problem_id/cancel-delivery', CancelController.delete);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.get('/problems', ProblemController.index);
routes.get('/problems/:delivery_id', ProblemController.index);
routes.post('/problems', ProblemController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
