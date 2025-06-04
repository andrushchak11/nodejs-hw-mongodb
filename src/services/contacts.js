import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ACS,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOneAndUpdate({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, updateData, userId) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
