import ContactModel from "../../models/contactModel.js";

export const getContactsOperation = async (req) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner: userId };
  if (favorite !== undefined) filter.favorite = favorite === "true";

  const result = await ContactModel.find(filter, "-createAt -updateAt", {
    skip,
    limit,
  }).select("-owner");
  return result;
};

export const getContactByIdOperation = async (userId, contactId) => {
  await ContactModel.findOne({ _id: contactId, owner: userId }).select(
    "-owner -createdAt -updatedAt"
  );
};

export const addContactOperation = async (body) => {
  const newContact = await ContactModel.create(body);
  return ContactModel.findById(newContact._id).select(
    "-owner -createdAt -updatedAt"
  );
};

export const updateContactOperation = async (contactId, userId, body) => {
  await ContactModel.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { $set: body },
    { new: true }
  ).select("-owner -createdAt -updatedAt");
};

export const deleteContactOperation = async (contactId, userId) => {
  await ContactModel.findOneAndDelete({ _id: contactId, owner: userId });
};
