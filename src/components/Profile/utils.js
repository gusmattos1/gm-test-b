export const getAddress = (profile) => {
  const {
    location: {
      city,
      country,
      state,
      postcode,
      street: { number, name },
    },
  } = profile;

  return `${number} ${name} - ${city} ${state}/${country} (${postcode})`;
};
