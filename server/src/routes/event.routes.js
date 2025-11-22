import { Router } from 'express';
import {
  handleAddEvent,
  handleGetEvent,
  handleGetEvents,
  handleRSVP,
  handleUnRSVP,
  handleGetUserRSVPs,
  handleCheckRSVP,
  handleDeleteEvent
} from '../controllers/event.controller.js';

const router = Router();

router.post('/', handleAddEvent);
router.get('/', handleGetEvents);
router.get('/:event_id', handleGetEvent);
router.delete('/:event_id', handleDeleteEvent);
router.post('/:event_id/rsvp', handleRSVP);
router.delete('/:event_id/rsvp', handleUnRSVP);
router.get('/users/:user_id/rsvps', handleGetUserRSVPs);
router.get('/:event_id/rsvp/:user_id', handleCheckRSVP);

export default router;
