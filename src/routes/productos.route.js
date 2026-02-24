const express = require("express");
const controller = require("../controllers/productos.controller");
const { asyncHandler } = require("../utils/asyncHandler");
const { authMiddleware, requireRole } = require('../auth') 
// const {getAll, getById} = require("../controllers/productos.controller") - Se puede utilizar así también

const router = express.Router()

router.get("/", asyncHandler(controller.getAllActive))     
router.get("/all", asyncHandler(controller.getAll))      // todo esto se almacena en la variable router
router.get("/search", asyncHandler(controller.search))    // /search?nombre=cable&precio=300  
router.get("/:id", asyncHandler(controller.getById))
router.post("/", authMiddleware, requireRole('admin'), asyncHandler(controller.create))
router.put("/:id", asyncHandler(controller.update))
router.delete("/:id", asyncHandler(controller.remove))  

module.exports = {router}; // se manda a llamar en el index