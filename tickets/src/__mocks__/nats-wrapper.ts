export const natsWrapper = {
  getClient: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
