export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: `ch_fake_charge` }),
  },
};
