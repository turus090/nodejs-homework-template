const express = require("express");

const {
  getList,
  getById,
  createNewContact,
  deleteContact,
  updateContact,
  changeFavorites,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getList);

router.get("/:contactId", getById);

router.post("/", createNewContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", changeFavorites);

module.exports = router;
