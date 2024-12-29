import express from 'express';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {getUserAddresses , addAddress, deleteAddress, search} from '../controllers/address.controller.js';

const router = express.Router();

// Route to get all addresses for a user
router.get('/u/:userId', verifyJWT, getUserAddresses);

// Route to add a new address
router.post('/', verifyJWT, addAddress);

// Route to delete an address
router.delete('/:addressId', verifyJWT, deleteAddress);


router.get('/search', verifyJWT , search)

export default router;
