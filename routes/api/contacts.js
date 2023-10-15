import express from "express";

import { verifyContactExist } from "../../helpers/verifyContactExist.js";
import { validate } from "../../helpers/index.js";
import {
  addContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../../models/contactModel.js";
import { authenticate } from "../../middlewares/index.js";
import contactController from "../../controllers/contact-controller.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", contactController.listContacts);

contactsRouter.get(
  "/:contactId",
  authenticate,
  verifyContactExist,
  contactController.getContactById
);

contactsRouter.post(
  "/",
  authenticate,
  verifyContactExist,
  validate(addContactSchema),
  contactController.addContact
);

contactsRouter.put(
  "/:contactId",
  verifyContactExist,
  validate(updateContactSchema),
  contactController.updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  verifyContactExist,
  validate(updateFavoriteSchema),
  contactController.updateFavoriteStatus
);

contactsRouter.delete(
  "/:contactId",
  authenticate,
  verifyContactExist,
  contactController.removeContact
);

export default contactsRouter;
