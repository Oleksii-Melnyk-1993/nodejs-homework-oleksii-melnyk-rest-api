import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import {
  addContactOperation,
  deleteContactOperation,
  getContactByIdOperation,
  getContactsOperation,
  updateContactOperation,
} from "./operations/contactOperations.js";

const listContacts = async (req, res, next) => {
  const contacts = await getContactsOperation(req);
  res.json(contacts);
};

const getContactById = async (req, res, next) => {
  const contact = await getContactByIdOperation(
    req.user._id,
    req.params.contactId
  );
  if (!contact) {
    throw HttpError(404, "Contact not found!");
  }
  res.json(contact);
};

const removeContact = async (req, res, next) => {
  const deletedContact = await deleteContactOperation(
    req.user._id,
    req.params.contactId
  );

  if (!deletedContact) {
    throw HttpError(404);
  }
  res.status(200).json({ message: "contact deleted" });
};

const addContact = async (req, res, next) => {
  const newContact = await addContactOperation({
    ...req.body,
    owner: req.user._id,
  });
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const updatedContact = await updateContactOperation(
    req.user._id,
    req.params.contactId,
    req.body
  );

  if (!updateContact) {
    throw HttpError(404);
  }

  res.json(updatedContact);
};

const updateFavoriteStatus = async (req, res, next) => {
  const updatedContact = await updateContactOperation(
    req.user._id,
    req.params.contactId,
    req.body
  );

  if (!updateContact) {
    throw HttpError(404);
  }

  res.json(updatedContact);
};

export default {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus),
};
