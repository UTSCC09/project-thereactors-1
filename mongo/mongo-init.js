const dbsToCreate = ['ytwatchparty'];

db.createUser(
  {
    user: 'ytwatchparty',
    pwd: 'ytwatchparty',
    roles: dbsToCreate.map(dbName => {
      return {
        role: 'readWrite',
        db: dbName
      }
    })
  }
);
