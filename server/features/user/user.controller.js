export const getProfile = async (req, res) => {
  const user = req.user;

  res.json({
    name: user.name,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    loginActivity: user.loginActivity,
  });
};
