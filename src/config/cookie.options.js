const cookieOptions = {
  httpOnly: true,
  signed: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  //secure: false,
  //sameSite: strict
};

export default cookieOptions;