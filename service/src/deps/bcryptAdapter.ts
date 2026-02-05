import * as bcrypt from "@bcrypt";

export const bcryptAdapter = {
  genSalt: bcrypt.genSalt,
  hash: bcrypt.hash,
  compare: bcrypt.compare,
};
