const rooms = {};

const addUser = (id, name, roomId, estimate) => {
  const newUser = { id, name, estimate };
  const oldUsers = rooms[roomId] ? [...rooms[roomId]] : [];
  rooms[roomId] = [...oldUsers, newUser];
};

const getUsers = (roomId) => rooms[roomId] || [];

const estimateUpdate = (username, number, roomId) => {
  const index = rooms[roomId].findIndex(user => user.name === username);
  rooms[roomId][index].estimate = number;
  //console.log(users);
};

const deleteEstimates = (roomId) => {
  rooms[roomId].forEach(user => {
    user.estimate = '-';
  });
};

module.exports = { addUser, estimateUpdate, getUsers, deleteEstimates };
