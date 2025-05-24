export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = typeof type === 'string' ? type : undefined;

  let parsedIsFavourite;
  if (isFavourite === 'true') parsedIsFavourite = true;
  if (isFavourite === 'false') parsedIsFavourite = false;

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
