import express from "express";
import {
    addAddressController,
    updateAddressController,
    deleteAddressController,
    getAddressesController,
    getAddressByIdController,
} from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

// Semua rute ini membutuhkan autentikasi
router.get("/", getAddressesController);
router.get("/:id", getAddressByIdController);
router.post("/", addAddressController);
router.put("/:id", updateAddressController);
router.delete("/:id", deleteAddressController);

export default router;
